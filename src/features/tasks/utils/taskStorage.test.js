import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskWriter, loadTasks, TASKS_STORAGE_KEY } from './taskStorage.js';

const firstTask = { id: 'a', title: 'First task', completed: false };
const secondTask = { id: 'b', title: 'Second task', completed: false };

function createStorage(tasks = [firstTask]) {
  let value = tasks === null ? null : JSON.stringify(tasks);
  return {
    getItem: () => value,
    setItem(key, nextValue) {
      assert.equal(key, TASKS_STORAGE_KEY);
      value = nextValue;
    },
  };
}

function createLocks() {
  let queue = Promise.resolve();
  return {
    request(name, options, callback) {
      assert.equal(name, TASKS_STORAGE_KEY);
      assert.equal(options.mode, 'exclusive');
      const result = queue.then(callback);
      queue = result.catch(() => {});
      return result;
    },
  };
}

test('one tab saves successive changes without changing IDs, titles or order', async () => {
  const storage = createStorage(null);
  const save = createTaskWriter(loadTasks(storage), { storage, locks: createLocks() });
  assert.equal(await save([]), 'saved');
  assert.equal(storage.getItem(), null);
  assert.equal(await save([firstTask, secondTask]), 'saved');
  const completed = [firstTask, secondTask].map((task) => ({ ...task, completed: true }));
  assert.equal(await save(completed), 'saved');
  assert.deepEqual(JSON.parse(storage.getItem()), completed);
});

test('a stale tab cannot replace a newer snapshot and remains blocked', async () => {
  const storage = createStorage();
  const locks = createLocks();
  const saveA = createTaskWriter(loadTasks(storage), { storage, locks });
  const saveB = createTaskWriter(loadTasks(storage), { storage, locks });
  assert.equal(await saveA([firstTask, secondTask]), 'saved');
  assert.equal(await saveB([{ ...firstTask, completed: true }]), 'conflict');
  assert.equal(await saveB([]), 'conflict');
  assert.deepEqual(JSON.parse(storage.getItem()), [firstTask, secondTask]);
  const reloaded = createTaskWriter(loadTasks(storage), { storage, locks });
  assert.equal(await reloaded([secondTask]), 'saved');
});

test('overlapping requests from two tabs keep the first winner', async () => {
  const storage = createStorage();
  const locks = createLocks();
  const saveA = createTaskWriter(loadTasks(storage), { storage, locks });
  const saveB = createTaskWriter(loadTasks(storage), { storage, locks });
  const results = await Promise.all([
    saveA([firstTask, secondTask]),
    saveB([{ ...firstTask, title: 'Edited elsewhere' }]),
  ]);
  assert.deepEqual(results, ['saved', 'conflict']);
  assert.deepEqual(JSON.parse(storage.getItem()), [firstTask, secondTask]);
});

test('queued changes in one tab use the snapshot updated inside the lock', async () => {
  const storage = createStorage();
  const save = createTaskWriter(loadTasks(storage), { storage, locks: createLocks() });
  assert.deepEqual(await Promise.all([save([firstTask, secondTask]), save([secondTask])]), [
    'saved',
    'saved',
  ]);
  assert.deepEqual(JSON.parse(storage.getItem()), [secondTask]);
});

test('invalid, partial and unreadable initial data never get overwritten', async () => {
  for (const tasks of [{ invalid: true }, [firstTask, null]]) {
    const storage = createStorage(tasks);
    const original = storage.getItem();
    const initial = loadTasks(storage);
    const save = createTaskWriter(initial, { storage, locks: createLocks() });
    assert.equal(await save([secondTask]), initial.status);
    assert.equal(storage.getItem(), original);
  }
  const storage = {
    getItem() {
      throw new Error('Blocked');
    },
  };
  assert.equal(loadTasks(storage).status, 'read-error');
  assert.equal(await createTaskWriter(loadTasks(storage))([firstTask]), 'read-error');
});

test('external corruption or removal after loading is treated as a conflict', async () => {
  for (const external of ['{invalid', JSON.stringify([firstTask, null]), null]) {
    const storage = createStorage();
    const save = createTaskWriter(loadTasks(storage), { storage, locks: createLocks() });
    storage.setItem(TASKS_STORAGE_KEY, external);
    assert.equal(await save([secondTask]), 'conflict');
    assert.equal(storage.getItem(), external);
  }
});

test('missing or failed coordination never falls back to unprotected writes', async () => {
  const storage = createStorage();
  const initial = loadTasks(storage);
  assert.equal(await createTaskWriter(initial, { storage, locks: null })([]), 'unsupported');
  const locks = {
    request() {
      throw new Error('Unavailable');
    },
  };
  assert.equal(await createTaskWriter(initial, { storage, locks })([]), 'lock-error');
  assert.deepEqual(JSON.parse(storage.getItem()), [firstTask]);
});

test('read and write failures are reported and can retry safely', async () => {
  const backing = createStorage();
  let failRead = false;
  let failWrite = false;
  const storage = {
    getItem() {
      if (failRead) throw new Error('Blocked read');
      return backing.getItem();
    },
    setItem(key, value) {
      if (failWrite) throw new Error('Quota');
      backing.setItem(key, value);
    },
  };
  const save = createTaskWriter(loadTasks(storage), { storage, locks: createLocks() });
  failRead = true;
  assert.equal(await save([secondTask]), 'read-error');
  failRead = false;
  failWrite = true;
  assert.equal(await save([secondTask]), 'write-error');
  failWrite = false;
  assert.equal(await save([secondTask]), 'saved');
});

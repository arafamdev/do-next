import { CodeXml, BriefcaseBusiness } from 'lucide-react';

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__identity">
        <p className="app-footer__author">Arafam Mussa Silla</p>
        <p>Frontend Developer · React & DoNext</p>
      </div>
      <div className="app-footer__links">
        <a href="https://github.com/arafamdev" target="_blank" rel="noopener noreferrer">
          <CodeXml size={16} aria-hidden="true" />
          GitHub<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
        <span className="app-footer__upcoming">
          <BriefcaseBusiness size={16} aria-hidden="true" />
          LinkedIn <span>Coming soon</span>
        </span>
      </div>
      <p className="app-footer__copyright">© {new Date().getFullYear()} Arafam Mussa Silla</p>
    </footer>
  );
}

export default AppFooter;

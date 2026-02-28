import { Link } from "react-router-dom";
import {
  platformLinks,
  supportLinks,
  legalLinks,
  socialLinks,
  contactInfo,
} from "../../../constants/footerData";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* -------- MAIN GRID -------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="WardDesk"
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                WardDesk
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Building better communities together through technology and civic
              engagement.
            </p>
            <p className="text-sm text-gray-500">
              © 2026 WardDesk. All rights reserved.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {contactInfo.map((info) => (
                <li key={info}>{info}</li>
              ))}
            </ul>

            {/* Legal subsection */}
            <div className="mt-6">
              <h4 className="text-sm text-gray-500 font-semibold mb-2">
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* -------- BOTTOM BAR -------- */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Made with care for the people of Nepal
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import { FiTrendingUp, FiGithub, FiTwitter, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-100 border-t border-gray-700/50 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <FiTrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Grow<span className="text-primary-400">More</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A premium simulated trading platform designed to help you practice and perfect your strategies without the risk.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/market" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Live Market</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMail className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="mailto:support@growmore.com" className="hover:text-white transition-colors">
                  support@growmore.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiPhone className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +9476817734
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="w-5 h-5 text-primary-400 shrink-0" />
                <span>
                  Aariyakulam, Jaffna<br />
                  <br></br>
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-5">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-dark-200 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/30 transition-all"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-dark-200 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/30 transition-all"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-dark-200 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/30 transition-all"
              >
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Grow More. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

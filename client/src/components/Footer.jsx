import { Link } from 'react-router-dom';
import { FiTrendingUp, FiGithub, FiTwitter, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <FiTrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-primary-900 tracking-tight">
                Grow<span className="text-primary-600">More</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              A premium simulated trading platform designed to help you practice and perfect your strategies without the risk.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/market" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">Live Market</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">Client Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <FiMail className="w-5 h-5 text-primary-600 shrink-0" />
                <a href="mailto:support@growmore.com" className="hover:text-primary-900 transition-colors">
                  support@growmore.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <FiPhone className="w-5 h-5 text-primary-600 shrink-0" />
                <a href="tel:+1234567890" className="hover:text-primary-900 transition-colors">
                  +9476817734
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <FiMapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Aariyakulam,+Jaffna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-900 hover:underline transition-colors duration-200"
                >
                  Aariyakulam, Jaffna
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-5">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary-900 hover:border-primary-900 transition-all"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary-900 hover:border-primary-900 transition-all"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary-900 hover:border-primary-900 transition-all"
              >
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Grow More. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-900 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

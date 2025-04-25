
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-risada text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold">
              Risada<span className="text-risada-accent">News</span>
            </Link>
            <p className="mt-3 text-gray-300">
              Your trusted source for the latest news and information from around the world.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/technology" className="text-gray-300 hover:text-risada-accent transition-colors">Technology</Link></li>
              <li><Link to="/category/business" className="text-gray-300 hover:text-risada-accent transition-colors">Business</Link></li>
              <li><Link to="/category/politics" className="text-gray-300 hover:text-risada-accent transition-colors">Politics</Link></li>
              <li><Link to="/category/health" className="text-gray-300 hover:text-risada-accent transition-colors">Health</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-risada-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-risada-accent transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-risada-accent transition-colors">Careers</Link></li>
              <li><Link to="/advertise" className="text-gray-300 hover:text-risada-accent transition-colors">Advertise</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-300 hover:text-risada-accent transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-risada-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-300 hover:text-risada-accent transition-colors">Cookie Policy</Link></li>
              <li><Link to="/gdpr" className="text-gray-300 hover:text-risada-accent transition-colors">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Risada News Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

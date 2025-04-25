
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold">
              Risada<span className="text-pink-300">Fun</span>
            </Link>
            <p className="mt-3 text-pink-100">
              Your daily dose of entertainment and fun!
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/category/entertainment" className="text-pink-100 hover:text-white transition-colors">Entertainment</Link>
              <Link to="/category/gaming" className="text-pink-100 hover:text-white transition-colors">Gaming</Link>
              <Link to="/category/movies" className="text-pink-100 hover:text-white transition-colors">Movies</Link>
              <Link to="/category/music" className="text-pink-100 hover:text-white transition-colors">Music</Link>
              <Link to="/category/celebrity" className="text-pink-100 hover:text-white transition-colors">Celebrity</Link>
              <Link to="/category/lifestyle" className="text-pink-100 hover:text-white transition-colors">Lifestyle</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-pink-100 hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="block text-pink-100 hover:text-white transition-colors">Contact</Link>
              <Link to="/privacy" className="block text-pink-100 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-400/30 mt-8 pt-6 text-center text-pink-100">
          <p>© {new Date().getFullYear()} RisadaFun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

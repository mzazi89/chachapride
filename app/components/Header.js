'use client';
import { useState } from 'react';
import { FaUser, FaGlobe, FaBars } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="text-black">Uber</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition">
              Ride
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition">
              Drive
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition">
              Business
            </a>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <FaGlobe className="text-sm" />
              <span className="text-sm font-medium">EN</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition">
              <FaUser />
              <span className="text-sm font-medium">Sign up</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-sm font-medium hover:text-gray-600">Ride</a>
              <a href="#" className="text-sm font-medium hover:text-gray-600">Drive</a>
              <a href="#" className="text-sm font-medium hover:text-gray-600">Business</a>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-black text-white">
                <FaUser />
                <span className="text-sm font-medium">Sign up</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

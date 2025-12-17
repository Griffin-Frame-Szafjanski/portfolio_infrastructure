'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm z-50 transition-colors">
      <nav className="py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo/Name */}
            <div>
              <Link 
                href="/biography" 
                className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                onClick={closeMobileMenu}
              >
                Griffin Frame-Szafjanski
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <ul className="flex list-none gap-8">
                <li>
                  <Link 
                    href="/biography" 
                    className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                      isActive('/biography') 
                        ? 'bg-primary text-white' 
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                    }`}
                  >
                    Biography
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/projects" 
                    className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                      pathname?.startsWith('/projects') 
                        ? 'bg-primary text-white' 
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                    }`}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                      isActive('/contact') 
                        ? 'bg-primary text-white' 
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                    }`}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
              
              {/* Dark Mode Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center gap-3">
              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  // X icon when menu is open
                  <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon when menu is closed
                  <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              mobileMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className="flex flex-col list-none gap-2 pb-4">
              <li>
                <Link 
                  href="/biography" 
                  onClick={closeMobileMenu}
                  className={`block font-medium px-4 py-3 rounded-lg transition-colors ${
                    isActive('/biography') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                  }`}
                >
                  Biography
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  onClick={closeMobileMenu}
                  className={`block font-medium px-4 py-3 rounded-lg transition-colors ${
                    pathname?.startsWith('/projects') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                  }`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={closeMobileMenu}
                  className={`block font-medium px-4 py-3 rounded-lg transition-colors ${
                    isActive('/contact') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

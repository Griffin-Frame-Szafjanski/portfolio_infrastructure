'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm z-50 transition-colors">
      <nav className="py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <Link href="/biography" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              Griffin Frame-Szafjanski
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
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
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

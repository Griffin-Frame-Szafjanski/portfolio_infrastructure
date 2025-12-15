'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              Portfolio
            </Link>
          </div>
          <ul className="flex list-none gap-8">
            <li>
              <Link 
                href="/" 
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-primary text-white' 
                    : 'text-gray-900 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/biography" 
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive('/biography') 
                    ? 'bg-primary text-white' 
                    : 'text-gray-900 hover:bg-gray-100 hover:text-primary'
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
                    : 'text-gray-900 hover:bg-gray-100 hover:text-primary'
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
                    : 'text-gray-900 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

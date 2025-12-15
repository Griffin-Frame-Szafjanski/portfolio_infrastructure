'use client'

export default function Header() {
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Portfolio</h1>
          </div>
          <ul className="flex list-none gap-8">
            <li>
              <a 
                href="#about" 
                className="font-medium text-gray-900 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-primary" 
                onClick={(e) => scrollToSection(e, '#about')}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className="font-medium text-gray-900 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-primary" 
                onClick={(e) => scrollToSection(e, '#projects')}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="font-medium text-gray-900 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-primary" 
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

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
    <header className="header">
      <nav className="nav">
        <div className="container">
          <div className="nav-brand">
            <h1 className="logo">Portfolio</h1>
          </div>
          <ul className="nav-menu">
            <li>
              <a href="#about" className="nav-link" onClick={(e) => scrollToSection(e, '#about')}>
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="nav-link" onClick={(e) => scrollToSection(e, '#projects')}>
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-link" onClick={(e) => scrollToSection(e, '#contact')}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center text-white">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-fade-in">
            Welcome to My Portfolio
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-light mb-12 opacity-90">
            Building innovative solutions with modern technology
          </p>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Biography Card */}
            <Link href="/biography" className="group">
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl border border-white/20">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-2xl font-bold mb-3">Biography & Resume</h3>
                <p className="text-white/80 mb-4">
                  Learn about my background, skills, and download my resume
                </p>
                <span className="inline-flex items-center text-white font-semibold group-hover:gap-3 transition-all">
                  View Biography
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Projects Card */}
            <Link href="/projects" className="group">
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl border border-white/20">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold mb-3">Projects Portfolio</h3>
                <p className="text-white/80 mb-4">
                  Explore my work, projects, and technical achievements
                </p>
                <span className="inline-flex items-center text-white font-semibold group-hover:gap-3 transition-all">
                  View Projects
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Contact Card */}
            <Link href="/contact" className="group">
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl border border-white/20">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="text-2xl font-bold mb-3">Get In Touch</h3>
                <p className="text-white/80 mb-4">
                  Have a question or want to work together? Contact me
                </p>
                <span className="inline-flex items-center text-white font-semibold group-hover:gap-3 transition-all">
                  Contact Me
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Stats or Additional Info */}
          <div className="mt-20 flex justify-center gap-12 text-center">
            <div>
              <div className="text-4xl font-bold">5+</div>
              <div className="text-white/70 mt-2">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold">20+</div>
              <div className="text-white/70 mt-2">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100%</div>
              <div className="text-white/70 mt-2">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

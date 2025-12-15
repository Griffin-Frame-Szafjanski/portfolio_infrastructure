'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProjectCard({ project }) {
  const initial = project.title ? project.title.charAt(0).toUpperCase() : '?';
  const techTags = project.tech_stack ? project.tech_stack.split(',').map(tech => tech.trim()) : [];
  
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="bg-white rounded-2xl p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl border border-gray-200 h-full">
        {/* Project Initial/Icon */}
        <div className="w-full h-40 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4 flex items-center justify-center text-white text-5xl font-bold group-hover:scale-105 transition-transform">
          {initial}
        </div>
        
        {/* Project Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        
        {/* Short Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2">
          {techTags.slice(0, 4).map((tech, index) => (
            <span 
              key={index} 
              className="inline-block px-3 py-1 bg-gray-100 text-primary rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
          {techTags.length > 4 && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              +{techTags.length - 4} more
            </span>
          )}
        </div>
        
        {/* View Details Arrow */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
          View Details
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setProjects(result.data);
        }
      } catch (err) {
        console.error('Error loading projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <>
      <Header />
      <main className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              My Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore my portfolio of projects showcasing various technologies and solutions
            </p>
          </div>

          {/* Projects Grid */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading projects...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
              Error loading projects. Please refresh the page.
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">No projects to display yet.</p>
              <p className="text-gray-500 mt-2">Add projects through the admin panel.</p>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

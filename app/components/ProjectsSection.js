'use client'

import { useEffect, useState } from 'react';

function ProjectCard({ project }) {
  const initial = project.title ? project.title.charAt(0).toUpperCase() : '?';
  const techTags = project.tech_stack ? project.tech_stack.split(',').map(tech => tech.trim()) : [];
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-200">
      <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary rounded-xl mb-6 flex items-center justify-center text-white text-5xl font-bold">
        {initial}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">{project.title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {techTags.map((tech, index) => (
          <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-primary rounded text-sm font-medium">{tech}</span>
        ))}
        {project.demo_type && project.demo_type !== 'none' && (
          <span className="inline-block px-3 py-1 bg-green-500 text-white rounded text-sm font-medium">
            🎬 {project.demo_type.toUpperCase()} Demo
          </span>
        )}
      </div>
      {(project.project_url || project.github_url) && (
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          {project.project_url && (
            <a href={project.project_url} className="flex-1 text-center py-3 bg-primary text-white rounded-lg font-medium transition-all hover:bg-primary/90 hover:scale-105" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} className="flex-1 text-center py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-all hover:bg-gray-200" target="_blank" rel="noopener noreferrer">
              View Code
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectsSection() {
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
    <section id="projects" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Projects</h2>
          <p className="text-lg text-gray-600">A showcase of my recent work and demonstrations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && <div className="loading col-span-full">Loading projects...</div>}
          {error && <div className="loading col-span-full">Error loading projects. Please refresh the page.</div>}
          {!loading && !error && projects.length === 0 && (
            <div className="loading col-span-full">No projects to display yet.</div>
          )}
          {!loading && !error && projects.length > 0 && projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

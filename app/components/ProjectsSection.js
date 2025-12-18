'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

function ProjectCard({ project }) {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const initial = project.title ? project.title.charAt(0).toUpperCase() : '?';
  
  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch(`/api/projects/${project.id}/skills`);
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error('Error fetching project skills:', error);
      } finally {
        setLoadingSkills(false);
      }
    }
    fetchSkills();
  }, [project.id]);
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-200">
      <div className="w-full h-48 rounded-xl mb-6 overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-5xl font-bold">
            {initial}
          </div>
        )}
      </div>
      <Link href={`/projects/${project.id}`}>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 hover:text-primary cursor-pointer transition-colors">{project.title}</h3>
      </Link>
      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {loadingSkills ? (
          <span className="text-sm text-gray-400">Loading skills...</span>
        ) : skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill.id} className="inline-block px-3 py-1 bg-gray-100 text-primary rounded text-sm font-medium">
              {skill.name}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400">No skills tagged</span>
        )}
        {project.demo_type && project.demo_type !== 'none' && (
          <span className="inline-block px-3 py-1 bg-green-500 text-white rounded text-sm font-medium">
            🎬 {project.demo_type.toUpperCase()} Demo
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
        <Link 
          href={`/projects/${project.id}`}
          className="w-full text-center py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
        >
          View Project Details
        </Link>
        {(project.project_url || project.github_url) && (
          <div className="flex gap-3">
            {project.project_url && (
              <a href={project.project_url} className="flex-1 text-center py-2 bg-primary text-white rounded-lg font-medium text-sm transition-all hover:bg-primary/90" target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} className="flex-1 text-center py-2 bg-gray-100 text-gray-900 rounded-lg font-medium text-sm transition-all hover:bg-gray-200" target="_blank" rel="noopener noreferrer">
                Source Code
              </a>
            )}
          </div>
        )}
      </div>
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

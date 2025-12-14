'use client'

import { useEffect, useState } from 'react';

function ProjectCard({ project }) {
  const initial = project.title ? project.title.charAt(0).toUpperCase() : '?';
  const techTags = project.tech_stack ? project.tech_stack.split(',').map(tech => tech.trim()) : [];
  
  return (
    <div className="project-card">
      <div className="project-thumbnail">
        {initial}
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tech">
        {techTags.map((tech, index) => (
          <span key={index} className="tech-tag">{tech}</span>
        ))}
        {project.demo_type && project.demo_type !== 'none' && (
          <span className="tech-tag" style={{ backgroundColor: '#10b981', color: 'white' }}>
            🎬 {project.demo_type.toUpperCase()} Demo
          </span>
        )}
      </div>
      {(project.project_url || project.github_url) && (
        <div className="project-links">
          {project.project_url && (
            <a href={project.project_url} className="project-link" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} className="project-link secondary" target="_blank" rel="noopener noreferrer">
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
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A showcase of my recent work and demonstrations</p>
        </div>

        <div className="projects-grid">
          {loading && <div className="loading">Loading projects...</div>}
          {error && <div className="loading">Error loading projects. Please refresh the page.</div>}
          {!loading && !error && projects.length === 0 && (
            <div className="loading">No projects to display yet.</div>
          )}
          {!loading && !error && projects.length > 0 && projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

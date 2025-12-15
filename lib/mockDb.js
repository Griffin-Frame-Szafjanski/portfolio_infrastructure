// Mock database for local development
// This will persist data during the dev server session

let mockBiography = {
  id: 1,
  full_name: "Your Name",
  title: "Full-Stack Developer",
  bio: "Passionate developer with experience in building scalable web applications.",
  email: "your.email@example.com",
  phone: "+1234567890",
  location: "City, Country",
  linkedin_url: "https://linkedin.com/in/yourprofile",
  github_url: "https://github.com/yourusername",
  resume_url: null,
  profile_photo_url: null,
  photo_file_key: "/assets/placeholder-avatar.svg",
  resume_file_key: null
};

let mockProjects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js and deployed on Cloudflare Pages.",
    long_description: null,
    tech_stack: "Next.js, React, Cloudflare Pages, D1",
    technologies: "Next.js, React, Cloudflare Pages, D1",
    project_url: "https://example.com",
    github_url: "https://github.com/yourusername/portfolio",
    image_url: null,
    video_url: null,
    demo_type: "live",
    display_order: 1,
    featured: false
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration and admin dashboard.",
    long_description: null,
    tech_stack: "Node.js, Express, PostgreSQL, Stripe",
    technologies: "Node.js, Express, PostgreSQL, Stripe",
    project_url: "https://example.com",
    github_url: "https://github.com/yourusername/ecommerce",
    image_url: null,
    video_url: null,
    demo_type: "video",
    display_order: 2,
    featured: false
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Collaborative task management application with real-time updates.",
    long_description: null,
    tech_stack: "React, Firebase, Material-UI",
    technologies: "React, Firebase, Material-UI",
    project_url: null,
    github_url: "https://github.com/yourusername/task-manager",
    image_url: null,
    video_url: null,
    demo_type: "none",
    display_order: 3,
    featured: false
  }
];

// Biography functions
export function getBiography() {
  return mockBiography;
}

export function updateBiography(data) {
  mockBiography = { ...mockBiography, ...data };
  return mockBiography;
}

// Projects functions
export function getProjects() {
  return [...mockProjects].sort((a, b) => a.display_order - b.display_order);
}

export function getProjectById(id) {
  return mockProjects.find(p => p.id === parseInt(id));
}

export function createProject(data) {
  const newProject = {
    id: Math.max(...mockProjects.map(p => p.id), 0) + 1,
    ...data,
    created_at: new Date().toISOString()
  };
  mockProjects.push(newProject);
  return newProject;
}

export function updateProject(id, data) {
  const index = mockProjects.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  
  mockProjects[index] = {
    ...mockProjects[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  return mockProjects[index];
}

export function deleteProject(id) {
  const index = mockProjects.findIndex(p => p.id === parseInt(id));
  if (index === -1) return false;
  
  mockProjects.splice(index, 1);
  return true;
}

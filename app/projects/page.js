'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProjectCard({ project, onSkillClick }) {
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-all hover:shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Project Image/Icon */}
      <Link href={`/projects/${project.id}`} className="block">
        <div className="w-full h-40 rounded-xl mb-4 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
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
      </Link>
      
      {/* Project Title */}
      <Link href={`/projects/${project.id}`}>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 hover:text-primary transition-colors cursor-pointer">
          {project.title}
        </h3>
      </Link>
      
      {/* Short Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-grow">
        {project.description}
      </p>
      
      {/* Skills Tags - Clickable */}
      <div className="flex flex-wrap gap-2 mb-4">
        {loadingSkills ? (
          <span className="text-sm text-gray-400 dark:text-gray-500">Loading...</span>
        ) : skills.length > 0 ? (
          <>
            {skills.slice(0, 5).map((skill) => (
              <button
                key={skill.id}
                onClick={(e) => {
                  e.preventDefault();
                  onSkillClick(skill.id);
                }}
                className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                {skill.name}
              </button>
            ))}
            {skills.length > 5 && (
              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                +{skills.length - 5} more
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">No skills tagged</span>
        )}
      </div>
      
      {/* View Details Button */}
      <Link 
        href={`/projects/${project.id}`}
        className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center text-primary font-semibold hover:gap-2 transition-all"
      >
        View Details
        <svg className="w-5 h-5 ml-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function FilterSidebar({ skills, categories, selectedSkills, onSkillToggle, onClearFilters }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Group skills by category
  const groupedSkills = {};
  
  // Uncategorized skills
  const uncategorized = skills.filter(skill => !skill.category_id && skill.project_count > 0);
  if (uncategorized.length > 0) {
    groupedSkills['Uncategorized'] = uncategorized;
  }
  
  // Categorized skills
  categories.forEach(category => {
    const categorySkills = skills.filter(skill => skill.category_id === category.id && skill.project_count > 0);
    if (categorySkills.length > 0) {
      groupedSkills[category.name] = categorySkills;
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Filter by Skills
        </h3>
        {selectedSkills.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {selectedSkills.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Active Filters: {selectedSkills.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skillId => {
              const skill = skills.find(s => s.id === skillId);
              return skill ? (
                <span
                  key={skillId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white rounded text-xs"
                >
                  {skill.name}
                  <button
                    onClick={() => onSkillToggle(skillId)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    ✕
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {Object.entries(groupedSkills).map(([categoryName, categorySkills]) => {
          const isExpanded = expandedCategories[categoryName];
          return (
            <div key={categoryName} className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <button
                onClick={() => toggleCategory(categoryName)}
                className="w-full flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 transition-colors"
              >
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  {categoryName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    ({categorySkills.length})
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              {isExpanded && (
                <div className="mt-2 space-y-1 pl-4">
                  {categorySkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <label
                        key={skill.id}
                        className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSkillToggle(skill.id)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({skill.project_count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Parse selected skills from URL on mount
  useEffect(() => {
    const skillsParam = searchParams.get('skills');
    if (skillsParam) {
      const skillIds = skillsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      setSelectedSkills(skillIds);
    }
  }, []);

  // Load skills and categories
  useEffect(() => {
    async function loadSkillsAndCategories() {
      try {
        const [skillsRes, categoriesRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/skill-categories')
        ]);
        
        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          // Fetch project counts for each skill
          const response = await fetch('/api/skills');
          if (response.ok) {
            const skills = await response.json();
            // Calculate project count for each skill
            const skillsWithCount = await Promise.all(
              skills.map(async (skill) => {
                try {
                  const projectsRes = await fetch(`/api/projects?skills=${skill.id}`);
                  if (projectsRes.ok) {
                    const data = await projectsRes.json();
                    return { ...skill, project_count: data.data?.length || 0 };
                  }
                } catch {
                  return { ...skill, project_count: 0 };
                }
                return { ...skill, project_count: 0 };
              })
            );
            setAllSkills(skillsWithCount);
          }
        }
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading skills and categories:', error);
      }
    }

    loadSkillsAndCategories();
  }, []);

  // Load projects based on selected skills
  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const url = selectedSkills.length > 0
          ? `/api/projects?skills=${selectedSkills.join(',')}`
          : '/api/projects';
        
        const response = await fetch(url);
        
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
  }, [selectedSkills]);

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev => {
      const newSelection = prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId];
      
      // Update URL
      if (newSelection.length > 0) {
        router.push(`/projects?skills=${newSelection.join(',')}`);
      } else {
        router.push('/projects');
      }
      
      return newSelection;
    });
  };

  const handleClearFilters = () => {
    setSelectedSkills([]);
    router.push('/projects');
  };

  const handleSkillClick = (skillId) => {
    handleSkillToggle(skillId);
  };

  return (
    <>
      <Header />
      <main className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              My Projects
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore my portfolio of projects showcasing various technologies and solutions
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                skills={allSkills}
                categories={categories}
                selectedSkills={selectedSkills}
                onSkillToggle={handleSkillToggle}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Projects Grid */}
            <div className="flex-1">
              {/* Results Header */}
              {!loading && !error && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedSkills.length > 0 ? (
                      <span>
                        Showing <strong>{projects.length}</strong> project{projects.length !== 1 ? 's' : ''} matching your filters
                      </span>
                    ) : (
                      <span>
                        Showing all <strong>{projects.length}</strong> project{projects.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center border border-red-200 dark:border-red-800">
                  Error loading projects. Please refresh the page.
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && projects.length === 0 && (
                <div className="text-center py-20">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  {selectedSkills.length > 0 ? (
                    <>
                      <p className="text-gray-600 text-lg mb-2">No projects match your selected filters.</p>
                      <button
                        onClick={handleClearFilters}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Clear filters to see all projects
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 text-lg">No projects to display yet.</p>
                      <p className="text-gray-500 mt-2">Add projects through the admin panel.</p>
                    </>
                  )}
                </div>
              )}

              {/* Projects Grid */}
              {!loading && !error && projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onSkillClick={handleSkillClick} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

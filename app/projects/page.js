'use client'

import { useEffect, useState, Suspense } from 'react';
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

function FilterBar({ skills, categories, selectedCategory, selectedSkills, onCategorySelect, onSkillToggle, onClearFilters }) {
  // Group skills by category
  const skillsByCategory = {};
  categories.forEach(category => {
    skillsByCategory[category.id] = skills.filter(skill => skill.category_id === category.id && skill.project_count > 0);
  });
  
  const uncategorized = skills.filter(skill => !skill.category_id && skill.project_count > 0);
  
  const displayedSkills = selectedCategory 
    ? (selectedCategory === 'uncategorized' ? uncategorized : skillsByCategory[selectedCategory] || [])
    : skills.filter(s => s.project_count > 0);

  const hasActiveFilters = selectedCategory || selectedSkills.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Filter Projects
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Category:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => {
            const count = skillsByCategory[category.id]?.length || 0;
            if (count === 0) return null;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
          {uncategorized.length > 0 && (
            <button
              onClick={() => onCategorySelect('uncategorized')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'uncategorized'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Other ({uncategorized.length})
            </button>
          )}
        </div>
      </div>

      {/* Skills Pills */}
      {displayedSkills.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Skill:
          </label>
          <div className="flex flex-wrap gap-2">
            {displayedSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  onClick={() => onSkillToggle(skill.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {skill.name} ({skill.project_count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {selectedSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active filters:
            </span>
            {selectedSkills.map(skillId => {
              const skill = skills.find(s => s.id === skillId);
              return skill ? (
                <span
                  key={skillId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {skill.name}
                  <button
                    onClick={() => onSkillToggle(skillId)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Parse selected skills and category from URL on mount
  useEffect(() => {
    const skillsParam = searchParams.get('skills');
    const categoryParam = searchParams.get('category');
    
    if (skillsParam) {
      const skillIds = skillsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      setSelectedSkills(skillIds);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam === 'uncategorized' ? 'uncategorized' : parseInt(categoryParam));
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
          const skills = await skillsRes.json();
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Update URL
    const params = new URLSearchParams();
    if (categoryId) {
      params.set('category', categoryId.toString());
    }
    if (selectedSkills.length > 0) {
      params.set('skills', selectedSkills.join(','));
    }
    router.push(params.toString() ? `/projects?${params.toString()}` : '/projects');
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev => {
      const newSelection = prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId];
      
      // Update URL
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.set('category', selectedCategory.toString());
      }
      if (newSelection.length > 0) {
        params.set('skills', newSelection.join(','));
      }
      router.push(params.toString() ? `/projects?${params.toString()}` : '/projects');
      
      return newSelection;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSkills([]);
    router.push('/projects');
  };

  const handleSkillClick = (skillId) => {
    handleSkillToggle(skillId);
  };

  return (
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

        {/* Filter Bar */}
        <FilterBar
          skills={allSkills}
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSkills={selectedSkills}
          onCategorySelect={handleCategorySelect}
          onSkillToggle={handleSkillToggle}
          onClearFilters={handleClearFilters}
        />

        {/* Results Header */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {selectedSkills.length > 0 || selectedCategory ? (
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
            {selectedSkills.length > 0 || selectedCategory ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onSkillClick={handleSkillClick} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </main>
      }>
        <ProjectsContent />
      </Suspense>
      <Footer />
    </>
  );
}

'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';

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
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-all hover:shadow-xl border-2 h-full flex flex-col ${
      project.featured 
        ? 'border-amber-400 dark:border-amber-500' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
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
      
      {/* Footer with Featured Badge and View Details */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {/* Featured Badge */}
        {project.featured && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-semibold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        )}
        
        {/* View Details Button */}
        <Link 
          href={`/projects/${project.id}`}
          className={`flex items-center text-primary font-semibold hover:gap-2 transition-all ${!project.featured ? 'ml-auto' : ''}`}
        >
          View Details
          <svg className="w-5 h-5 ml-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function FilterBar({ skills, categories, selectedCategories, selectedSkills, onCategoryToggle, onSkillToggle, onClearFilters }) {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setCategoryDropdownOpen(false);
        setSkillsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Group skills by category
  const skillsByCategory = {};
  categories.forEach(category => {
    skillsByCategory[category.id] = skills.filter(skill => skill.category_id === category.id && skill.project_count > 0);
  });
  
  const uncategorized = skills.filter(skill => !skill.category_id && skill.project_count > 0);
  
  // Get skills filtered by selected categories
  const displayedSkills = selectedCategories.length > 0
    ? skills.filter(skill => {
        if (selectedCategories.includes('uncategorized') && !skill.category_id && skill.project_count > 0) {
          return true;
        }
        return skill.category_id && selectedCategories.includes(skill.category_id) && skill.project_count > 0;
      })
    : skills.filter(s => s.project_count > 0);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSkills.length > 0;

  // Calculate selected category names for display
  const getSelectedCategoriesText = () => {
    if (selectedCategories.length === 0) return 'All Categories';
    if (selectedCategories.length === 1) return 'Filtering tags by 1 category';
    return `Filtering tags by ${selectedCategories.length} categories`;
  };
  
  // Calculate selected tags text
  const getSelectedTagsText = () => {
    if (selectedSkills.length === 0) return 'All Tags';
    if (selectedSkills.length === 1) return '1 tag selected';
    return `${selectedSkills.length} tags selected`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex gap-4 items-center">
        {/* Categories Dropdown */}
        <div className="relative dropdown-container flex-1">
          <button
            onClick={() => {
              setCategoryDropdownOpen(!categoryDropdownOpen);
              setSkillsDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium">{getSelectedCategoriesText()}</span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Categories Dropdown Menu */}
          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                {/* Category Options */}
                {categories.map((category) => {
                  const count = skillsByCategory[category.id]?.length || 0;
                  if (count === 0) return null;
                  
                  return (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => onCategoryToggle(category.id)}
                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                      />
                      <span className="text-gray-900 dark:text-gray-100 flex-grow">{category.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{count}</span>
                    </label>
                  );
                })}

                {/* Uncategorized Option */}
                {uncategorized.length > 0 && (
                  <label className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('uncategorized')}
                      onChange={() => onCategoryToggle('uncategorized')}
                      className="w-4 h-4 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-gray-900 dark:text-gray-100 flex-grow">Other</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{uncategorized.length}</span>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Skills Dropdown */}
        <div className="relative dropdown-container flex-1">
          <button
            onClick={() => {
              setSkillsDropdownOpen(!skillsDropdownOpen);
              setCategoryDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{getSelectedTagsText()}</span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${skillsDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Skills Dropdown Menu */}
          {skillsDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                {displayedSkills.length > 0 ? (
                  displayedSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <label
                        key={skill.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSkillToggle(skill.id)}
                          className="w-4 h-4 text-primary focus:ring-primary rounded"
                        />
                        <span className="text-gray-900 dark:text-gray-100 flex-grow">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.project_count}</span>
                      </label>
                    );
                  })
                ) : (
                  <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                    No skills available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 ml-auto transition-colors ${
            hasActiveFilters
              ? 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
          disabled={!hasActiveFilters}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>
      </div>

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Parse selected skills and categories from URL on mount
  useEffect(() => {
    const skillsParam = searchParams.get('skills');
    const categoriesParam = searchParams.get('categories');
    
    if (skillsParam) {
      const skillIds = skillsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      setSelectedSkills(skillIds);
    }
    
    if (categoriesParam) {
      const categoryIds = categoriesParam.split(',').map(id => {
        if (id === 'uncategorized') return 'uncategorized';
        const parsedId = parseInt(id);
        return isNaN(parsedId) ? null : parsedId;
      }).filter(id => id !== null);
      setSelectedCategories(categoryIds);
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

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      // Update URL
      const params = new URLSearchParams();
      if (newSelection.length > 0) {
        params.set('categories', newSelection.join(','));
      }
      if (selectedSkills.length > 0) {
        params.set('skills', selectedSkills.join(','));
      }
      router.push(params.toString() ? `/projects?${params.toString()}` : '/projects');
      
      return newSelection;
    });
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev => {
      const newSelection = prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId];
      
      // Update URL
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.set('categories', selectedCategories.join(','));
      }
      if (newSelection.length > 0) {
        params.set('skills', newSelection.join(','));
      }
      router.push(params.toString() ? `/projects?${params.toString()}` : '/projects');
      
      return newSelection;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
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
        <PageHeader 
          title="My Projects" 
          description="A showcase of my work, highlighting key achievements and solutions across various domains"
        />

        {/* Filter Bar */}
        <FilterBar
          skills={allSkills}
          categories={categories}
          selectedCategories={selectedCategories}
          selectedSkills={selectedSkills}
          onCategoryToggle={handleCategoryToggle}
          onSkillToggle={handleSkillToggle}
          onClearFilters={handleClearFilters}
        />

        {/* Results Header */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {selectedSkills.length > 0 || selectedCategories.length > 0 ? (
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
            {selectedSkills.length > 0 || selectedCategories.length > 0 ? (
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

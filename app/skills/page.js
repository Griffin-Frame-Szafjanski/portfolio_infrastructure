'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PageHeader from '@/app/components/PageHeader';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/skill-categories')
      ]);

      if (skillsRes.ok && categoriesRes.ok) {
        const skillsData = await skillsRes.json();
        const categoriesData = await categoriesRes.json();
        setSkills(skillsData);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillsByCategory = () => {
    const grouped = {};
    
    // Group skills by category
    categories.forEach(category => {
      const categorySkills = skills.filter(skill => skill.category_id === category.id);
      if (categorySkills.length > 0) {
        grouped[category.id] = {
          category,
          skills: categorySkills
        };
      }
    });

    // Add uncategorized skills
    const uncategorized = skills.filter(skill => !skill.category_id);
    if (uncategorized.length > 0) {
      grouped['uncategorized'] = {
        category: { id: null, name: 'Other Skills', description: null },
        skills: uncategorized
      };
    }

    return grouped;
  };

  const groupedSkills = getSkillsByCategory();

  // Initialize all categories as expanded on first load
  useEffect(() => {
    if (Object.keys(groupedSkills).length > 0 && Object.keys(expandedCategories).length === 0) {
      const initialState = {};
      Object.keys(groupedSkills).forEach(categoryId => {
        initialState[categoryId] = true;
      });
      setExpandedCategories(initialState);
    }
  }, [groupedSkills]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <>
      <Header />
      <main className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <PageHeader 
            title="Skills & Expertise" 
            description="An overview of my professional capabilities, technologies, frameworks, and areas of expertise"
          />

          {/* Skills Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading skills...</p>
            </div>
          ) : Object.keys(groupedSkills).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No skills available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([categoryId, { category, skills }]) => (
                <div key={categoryId} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
                  {/* Category Header - Clickable */}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-left">
                      {category.name}
                    </h2>
                    <svg
                      className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                        expandedCategories[categoryId] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Skills Tags - Collapsible */}
                  {expandedCategories[categoryId] && (
                    <div className="px-6 pb-6">
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Link
                            key={skill.id}
                            href={`/projects?skills=${skill.id}`}
                            className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                          >
                            {skill.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {!loading && Object.keys(groupedSkills).length > 0 && (
            <div className="mt-16 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click on any skill to see related projects
              </p>
              <Link
                href="/projects"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View All Projects
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

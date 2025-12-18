'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Skills & Technologies
            </h1>
            <p className="text-xl text-blue-100">
              A comprehensive overview of my technical expertise and tools I work with
            </p>
          </div>
        </section>

        {/* Skills Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
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
              <div className="space-y-12">
                {Object.entries(groupedSkills).map(([categoryId, { category, skills }]) => (
                  <div key={categoryId} className="space-y-6">
                    {/* Category Header */}
                    <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {skills.map((skill) => (
                        <Link
                          key={skill.id}
                          href={`/projects?skill=${skill.id}`}
                          className="group"
                        >
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 h-full flex items-center justify-center">
                            <div className="text-center">
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {skill.name}
                              </h3>
                              {skill.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {skill.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
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
        </section>
      </main>
      <Footer />
    </>
  );
}

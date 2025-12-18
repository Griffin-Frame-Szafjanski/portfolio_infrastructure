'use client';

import { useState, useEffect } from 'react';

export default function SkillSelector({ selectedSkillIds = [], onChange }) {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewSkillForm, setShowNewSkillForm] = useState(false);
  const [newSkillData, setNewSkillData] = useState({
    name: '',
    category_id: ''
  });
  const [creatingSkill, setCreatingSkill] = useState(false);

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

  const handleSkillToggle = (skillId) => {
    const newSelection = selectedSkillIds.includes(skillId)
      ? selectedSkillIds.filter(id => id !== skillId)
      : [...selectedSkillIds, skillId];
    
    onChange(newSelection);
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkillData.name.trim()) return;

    setCreatingSkill(true);
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkillData.name.trim(),
          category_id: newSkillData.category_id || null,
          display_order: 0
        })
      });

      if (response.ok) {
        const newSkill = await response.json();
        setSkills(prev => [...prev, newSkill]);
        onChange([...selectedSkillIds, newSkill.id]);
        setNewSkillData({ name: '', category_id: '' });
        setShowNewSkillForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create skill');
      }
    } catch (error) {
      console.error('Error creating skill:', error);
      alert('Failed to create skill');
    } finally {
      setCreatingSkill(false);
    }
  };

  const getSkillsByCategory = () => {
    const grouped = {};
    
    // Add uncategorized skills
    const uncategorized = skills.filter(skill => !skill.category_id);
    if (uncategorized.length > 0) {
      grouped['Uncategorized'] = uncategorized;
    }
    
    // Group by categories
    categories.forEach(category => {
      const categorySkills = skills.filter(skill => skill.category_id === category.id);
      if (categorySkills.length > 0) {
        grouped[category.name] = categorySkills;
      }
    });
    
    return grouped;
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading skills...</div>;
  }

  const groupedSkills = getSkillsByCategory();
  const selectedCount = selectedSkillIds.length;

  return (
    <div className="skill-selector">
      <div className="selector-header">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Selected: {selectedCount} skill{selectedCount !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setShowNewSkillForm(!showNewSkillForm)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showNewSkillForm ? '✕ Cancel' : '+ New Skill'}
          </button>
        </div>

        {showNewSkillForm && (
          <form onSubmit={handleCreateSkill} className="new-skill-form">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSkillData.name}
                onChange={(e) => setNewSkillData({ ...newSkillData, name: e.target.value })}
                placeholder="Skill name"
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={creatingSkill}
              />
              <select
                value={newSkillData.category_id}
                onChange={(e) => setNewSkillData({ ...newSkillData, category_id: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={creatingSkill}
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={creatingSkill || !newSkillData.name.trim()}
              className="mt-2 w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingSkill ? 'Creating...' : 'Create & Select'}
            </button>
          </form>
        )}
      </div>

      <div className="skills-grid">
        {Object.entries(groupedSkills).map(([categoryName, categorySkills]) => (
          <div key={categoryName} className="category-group">
            <h4 className="category-title">{categoryName}</h4>
            <div className="skills-list">
              {categorySkills.map((skill) => {
                const isSelected = selectedSkillIds.includes(skill.id);
                return (
                  <label
                    key={skill.id}
                    className={`skill-checkbox ${isSelected ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skill.id)}
                    />
                    <span>{skill.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No skills available. Create your first skill above!
        </p>
      )}

      <style jsx>{`
        .skill-selector {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 1rem;
          background: white;
        }

        .selector-header {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .new-skill-form {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 6px;
        }

        .skills-grid {
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .category-group {
          margin-bottom: 0.5rem;
        }

        .category-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-checkbox {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .skill-checkbox:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        .skill-checkbox.selected {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #1e40af;
          font-weight: 500;
        }

        .skill-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .skills-grid::-webkit-scrollbar {
          width: 6px;
        }

        .skills-grid::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .skills-grid::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .skills-grid::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}

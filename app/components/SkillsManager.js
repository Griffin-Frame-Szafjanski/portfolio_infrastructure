'use client';

import { useState, useEffect } from 'react';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSkills();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/skill-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const moveSkill = (skill, direction, categorySkills) => {
    // Find the index within this category
    const indexInCategory = categorySkills.findIndex(s => s.id === skill.id);
    const newIndexInCategory = direction === 'up' ? indexInCategory - 1 : indexInCategory + 1;
    
    if (newIndexInCategory < 0 || newIndexInCategory >= categorySkills.length) return;
    
    // Create a new array of all skills
    const newSkills = [...skills];
    
    // Swap the two skills in the category
    const skill1 = categorySkills[indexInCategory];
    const skill2 = categorySkills[newIndexInCategory];
    
    // Find their indices in the full skills array
    const fullIndex1 = newSkills.findIndex(s => s.id === skill1.id);
    const fullIndex2 = newSkills.findIndex(s => s.id === skill2.id);
    
    // Swap them
    [newSkills[fullIndex1], newSkills[fullIndex2]] = [newSkills[fullIndex2], newSkills[fullIndex1]];
    
    setSkills(newSkills);
    setHasOrderChanges(true);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    setError('');
    setSuccess('');

    try {
      // Group skills by category and assign new display_order within each group
      const uncategorizedSkills = skills.filter(s => !s.category_id);
      const categorizedSkills = {};
      
      categories.forEach(cat => {
        categorizedSkills[cat.id] = skills.filter(s => s.category_id === cat.id);
      });

      const promises = [];
      
      // Update uncategorized skills
      uncategorizedSkills.forEach((skill, index) => {
        promises.push(
          fetch(`/api/skills/${skill.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...skill,
              display_order: index
            })
          })
        );
      });
      
      // Update categorized skills
      Object.values(categorizedSkills).forEach(categorySkillsArray => {
        categorySkillsArray.forEach((skill, index) => {
          promises.push(
            fetch(`/api/skills/${skill.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...skill,
                display_order: index
              })
            })
          );
        });
      });

      await Promise.all(promises);

      setSuccess('Skill order saved successfully!');
      setHasOrderChanges(false);
      await fetchSkills();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving order:', error);
      setError('Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  };

  const cancelOrderChanges = async () => {
    setHasOrderChanges(false);
    await fetchSkills();
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingId 
        ? `/api/skills/${editingId}` 
        : '/api/skills';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingId ? 'Skill updated successfully!' : 'Skill created successfully!');
        setFormData({ name: '', category_id: '', description: '' });
        setEditingId(null);
        fetchSkills();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save skill');
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      setError('An error occurred while saving the skill');
    }
  };

  const handleEdit = (skill) => {
    if (hasOrderChanges) {
      if (!confirm('You have unsaved order changes. Do you want to discard them?')) {
        return;
      }
      setHasOrderChanges(false);
    }
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category_id: skill.category_id || '',
      description: skill.description || ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category_id: '', description: '' });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill? This will remove it from all projects.')) {
      return;
    }

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Skill deleted successfully!');
        fetchSkills();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('An error occurred while deleting the skill');
    }
  };

  const filteredSkills = filterCategory
    ? skills.filter(skill => skill.category_id === parseInt(filterCategory))
    : skills;

  const getSkillsByCategory = () => {
    const grouped = {};
    
    // Add "Uncategorized" group
    grouped['uncategorized'] = filteredSkills.filter(skill => !skill.category_id);
    
    // Group by categories
    categories.forEach(category => {
      const categorySkills = filteredSkills.filter(skill => skill.category_id === category.id);
      if (categorySkills.length > 0) {
        grouped[category.name] = categorySkills;
      }
    });
    
    return grouped;
  };

  if (loading) {
    return <div className="text-center py-8">Loading skills...</div>;
  }

  const groupedSkills = getSkillsByCategory();

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          {editingId ? 'Edit Skill' : 'Add New Skill'}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Skill Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
                disabled={hasOrderChanges}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                disabled={hasOrderChanges}
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              rows="2"
              disabled={hasOrderChanges}
            />
            <small className="text-gray-500 text-sm mt-1 block">
              Skills are ordered within their category. Use the arrows below to change priority.
            </small>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={hasOrderChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={hasOrderChanges}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Skills List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Skills ({filteredSkills.length})
          </h3>
          <div className="flex items-center gap-3">
            {hasOrderChanges && (
              <div className="flex gap-2">
                <button
                  onClick={saveOrder}
                  disabled={savingOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {savingOrder ? 'Saving...' : 'Save Order'}
                </button>
                <button
                  onClick={cancelOrderChanges}
                  disabled={savingOrder}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 text-sm"
                >
                  Cancel Changes
                </button>
              </div>
            )}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <p className="text-gray-500">No skills yet. Create one above!</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([categoryName, categorySkills]) => {
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={categoryName}>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {categoryName === 'uncategorized' ? 'Uncategorized' : categoryName}
                  </h4>
                  <div className="space-y-2">
                    {categorySkills.map((skill, indexInCategory) => (
                      <div
                        key={skill.id}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex gap-3 items-start flex-1">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveSkill(skill, 'up', categorySkills)}
                              disabled={indexInCategory === 0}
                              className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveSkill(skill, 'down', categorySkills)}
                              disabled={indexInCategory === categorySkills.length - 1}
                              className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {skill.name}
                            </h5>
                            {skill.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {skill.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(skill)}
                            disabled={hasOrderChanges}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            disabled={hasOrderChanges}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

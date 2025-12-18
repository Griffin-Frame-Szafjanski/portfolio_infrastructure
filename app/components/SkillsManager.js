'use client';

import { useState, useEffect } from 'react';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    display_order: 0
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
        setFormData({ name: '', category_id: '', description: '', display_order: 0 });
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
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category_id: skill.category_id || '',
      description: skill.description || '',
      display_order: skill.display_order
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category_id: '', description: '', display_order: 0 });
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-gray-900">
                              {skill.name}
                            </h5>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                              Order: {skill.display_order}
                            </span>
                          </div>
                          {skill.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {skill.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
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

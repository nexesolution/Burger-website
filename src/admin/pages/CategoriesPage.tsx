import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, ToggleLeft, ToggleRight } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';
import { Category } from '../../types';

export const CategoriesPage: React.FC = () => {
  const categories = useBuzzStore((state) => state.categories);
  const addCategory = useBuzzStore((state) => state.addCategory);
  const updateCategory = useBuzzStore((state) => state.updateCategory);
  const deleteCategory = useBuzzStore((state) => state.deleteCategory);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description);
      setImage(cat.image);
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, description, image });
    } else {
      addCategory({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        image,
        isActive: true,
        displayOrder: categories.length + 1
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            CATEGORY <span className="text-buzz-yellow">MANAGEMENT</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Create and edit product menu categories. Updates sync with customer website immediately.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-buzz-yellow text-buzz-black font-extrabold text-xs shadow-buzz-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD CATEGORY
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-3xl glass-card border border-zinc-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-36 rounded-2xl object-cover bg-zinc-900"
              />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-display text-white">{cat.name}</h3>
                <button
                  onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                  className="text-buzz-yellow"
                >
                  {cat.isActive ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-zinc-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{cat.description}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => handleOpenModal(cat)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-300 flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-buzz-yellow text-buzz-black font-black text-xs shadow-buzz-glow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

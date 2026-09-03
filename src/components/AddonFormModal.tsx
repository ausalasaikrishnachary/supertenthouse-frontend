// src/components/AddonFormModal.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AddonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  initialData?: any;
  loading?: boolean;
}

const ICONS = [
  '📦', '🍽️', '📸', '🎧', '💐', '🖥️', '💡', '📷', '🎆', '🎵', '🎨', '🏮',
  '🕯️', '🎪', '🎭', '🎬', '🎤', '🎼', '🎹', '🥂', '🍾', '🎊', '🎉', '✨'
];

const CATEGORIES = ['General', 'Catering', 'Photography', 'Music', 'Decoration', 'Technology', 'Lighting', 'Entertainment'];

const AddonFormModal: React.FC<AddonFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    icon: "📦",
    description: "",
    category: "General",
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        icon: initialData.icon || "📦",
        description: initialData.description || "",
        category: initialData.category || "General",
        is_active: initialData.is_active === 1,
      });
    } else {
      setForm({
        name: "",
        price: "",
        icon: "📦",
        description: "",
        category: "General",
        is_active: true,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the data with proper types
    const formData = {
      name: form.name,
      price: parseFloat(form.price) || 0,
      icon: form.icon || '📦',
      description: form.description || null,
      category: form.category || 'General',
      is_active: form.is_active ? 1 : 0 // Convert boolean to 1 or 0
    };
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Add-On" : "Add New Add-On"}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? "Update add-on details" : "Create a new customization option"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                placeholder="Enter add-on name"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2 mb-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`p-2 rounded-lg text-2xl hover:bg-gray-100 transition-colors ${
                      form.icon === icon ? 'bg-[#0c2d67] bg-opacity-10 ring-2 ring-[#0c2d67]' : ''
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Enter description"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#0c2d67] rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active (visible to customers)
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                initialData ? "Update Add-On" : "Add Add-On"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddonFormModal;
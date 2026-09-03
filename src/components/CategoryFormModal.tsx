// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';

// interface CategoryFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: { category_name: string }) => void;
//   initialData?: { id: number; category_name: string } | null;
//   loading?: boolean;
// }

// const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   loading = false,
// }) => {
//   const [categoryName, setCategoryName] = useState('');

//   useEffect(() => {
//     if (initialData) {
//       setCategoryName(initialData.category_name);
//     } else {
//       setCategoryName('');
//     }
//   }, [initialData, isOpen]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (categoryName.trim()) {
//       onSubmit({ category_name: categoryName.trim() });
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-800">
//             {initialData ? 'Edit Category' : 'Add New Category'}
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Category Name
//             </label>
//             <input
//               type="text"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               placeholder="Enter category name"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67]"
//               autoFocus
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !categoryName.trim()}
//               className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CategoryFormModal;


import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import BASE_URL from '@/Config/Api';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData | { category_name: string; image?: string }) => void;
  initialData?: { id?: number; category_name: string; image?: string } | null;
  loading?: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImage, setExistingImage] = useState<string>('');
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Helper function to get full image URL
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('data:image')) return imagePath;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('uploads/')) return `${BASE_URL}/${imagePath}`;
    if (imagePath.startsWith('/uploads/')) return `${BASE_URL}${imagePath}`;
    return `${BASE_URL}/${imagePath}`;
  };

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCategoryName(initialData.category_name || '');
        setExistingImage(initialData.image || '');
        setImageError(false);
        
        // Set preview for existing image
        if (initialData.image) {
          const imageUrl = getImageUrl(initialData.image);
          setImagePreview(imageUrl);
        } else {
          setImagePreview('');
        }
        
        setImageFile(null);
        setRemoveImage(false);
      } else {
        // Reset for new category
        setCategoryName('');
        setImageFile(null);
        setImagePreview('');
        setExistingImage('');
        setRemoveImage(false);
        setImageError(false);
      }
    }
  }, [initialData, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image (JPG, PNG, GIF, WEBP)');
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
      setImageError(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (initialData?.image) {
      setRemoveImage(true);
    }
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      alert('Category name is required');
      return;
    }

    if (imageFile) {
      // If there's a new file, use FormData
      const formData = new FormData();
      formData.append('category_name', categoryName.trim());
      formData.append('image', imageFile);
      onSubmit(formData);
    } else {
      // No new file, send JSON
      const data: { category_name: string; image?: string } = {
        category_name: categoryName.trim()
      };
      
      // If removing existing image
      if (removeImage) {
        data.image = '';
      } else if (existingImage) {
        // Keep existing image
        data.image = existingImage;
      }
      
      onSubmit(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67]"
              autoFocus
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            
            {/* Image Preview */}
            {(imagePreview && !removeImage) && (
              <div className="mb-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
                  onError={handleImageError}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <span className="text-xs text-red-500">Failed to load</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {/* Upload Area */}
            {(!imagePreview || removeImage) && (
              <div className="mb-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF, WEBP (Max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* File info */}
            {imageFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ImageIcon size={16} />
                <span>{imageFile.name}</span>
                <span className="text-gray-400">({(imageFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !categoryName.trim()}
              className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
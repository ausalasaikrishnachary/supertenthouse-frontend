// import React, { useState } from 'react';
// import { Edit, Trash2, Plus, Search, X } from 'lucide-react';

// interface Category {
//   id: number;
//   category_name: string;
//   created_at?: string;
//   updated_at?: string;
// }

// interface CategoriesTableProps {
//   categories: Category[];
//   onEdit: (category: Category) => void;
//   onDelete: (id: number) => void;
//   onAdd: () => void;
//   loading?: boolean;
// }

// const CategoriesTable: React.FC<CategoriesTableProps> = ({
//   categories,
//   onEdit,
//   onDelete,
//   onAdd,
//   loading = false,
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

//   const filteredCategories = categories.filter(category =>
//     category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
//             <p className="text-sm text-gray-500">
//               Total: {categories.length} categories
//             </p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search categories..."
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67] w-full sm:w-64"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Add Button */}
//             <button
//               onClick={onAdd}
//               className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors"
//             >
//               <Plus size={18} />
//               <span>Add Category</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Category Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Created At
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
//                   Loading categories...
//                 </td>
//               </tr>
//             ) : filteredCategories.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
//                   {searchTerm ? 'No categories found matching your search' : 'No categories available'}
//                 </td>
//               </tr>
//             ) : (
//               filteredCategories.map((category) => (
//                 <tr key={category.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     #{category.id}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 font-medium">
//                     {category.category_name}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {category.created_at ? new Date(category.created_at).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => onEdit(category)}
//                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (window.confirm(`Are you sure you want to delete "${category.category_name}"?`)) {
//                             onDelete(category.id);
//                           }
//                         }}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer */}
//       <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
//         <div className="flex justify-between items-center text-sm text-gray-500">
//           <span>Showing {filteredCategories.length} of {categories.length} categories</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoriesTable;


import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BASE_URL from '@/Config/Api';

interface Category {
  id: number;
  category_name: string;
  image?: string;
  product_count?: number;
  created_at?: string;
}

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  loading: boolean;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  onEdit,
  onDelete,
  onAdd,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Helper function to get the correct image source
  const getImageSrc = (imageData?: string) => {
    if (!imageData) return null;
    
    // If it's already a base64 data URL, use it directly
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
    
    // If it's a full URL (http/https), use it directly
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }
    
    // If it's a path (uploads/categories/...), prepend with BASE_URL
    if (imageData.startsWith('uploads/')) {
      return `${BASE_URL}/${imageData}`;
    }
    
    // If it starts with /uploads/, remove the slash and prepend BASE_URL
    if (imageData.startsWith('/uploads/')) {
      return `${BASE_URL}${imageData}`;
    }
    
    // Fallback - treat as relative path
    return `${BASE_URL}/${imageData}`;
  };

  const handleImageError = (categoryId: number) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredCategories.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c2d67]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
            <p className="text-sm text-gray-500">
              Total: {categories.length} categories
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67] w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={onAdd}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors"
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'No categories found matching your search' : 'No categories available'}
                </td>
              </tr>
            ) : (
              currentItems.map((category) => {
                const imageSrc = getImageSrc(category.image);
                const hasError = imageErrors[category.id];
                
                return (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {imageSrc && !hasError ? (
                        <img
                          src={imageSrc}
                          alt={category.category_name}
                          className="h-14 w-14 object-cover rounded-lg border border-gray-200"
                          onError={() => handleImageError(category.id)}
                        />
                      ) : (
                        <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border border-gray-200">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.category_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.product_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.created_at ? new Date(category.created_at).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(category)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${category.category_name}"?`)) {
                              onDelete(category.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - Showing info */}
          <div className="text-sm text-gray-500">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} categories
          </div>

          {/* Right side - Pagination controls */}
          <div className="flex items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Show:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2d67] bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page navigation */}
            {totalPages > 0 && (
              <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#0c2d67] text-white'
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTable;
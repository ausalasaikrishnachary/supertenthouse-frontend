// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import BASE_URL from '@/Config/Api';
// import Navbar from '@/components/Navbar';
// import CategoriesTable from '@/components/CategoriesTable';
// import CategoryFormModal from '@/components/CategoryFormModal';

// interface Category {
//   id: number;
//   category_name: string;
//   created_at?: string;
//   updated_at?: string;
// }

// const AdminCategories = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [formLoading, setFormLoading] = useState(false);

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/categories`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCategories(response.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       alert('Failed to fetch categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Add category
//   const handleAddCategory = async (data: { category_name: string }) => {
//     try {
//       setFormLoading(true);
//       const token = localStorage.getItem('token');
//       await axios.post(`${BASE_URL}/api/categories`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       await fetchCategories();
//       setIsModalOpen(false);
//       alert('Category added successfully!');
//     } catch (error) {
//       console.error('Error adding category:', error);
//       alert('Failed to add category');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Edit category
//   const handleEditCategory = async (data: { category_name: string }) => {
//     if (!editingCategory) return;
    
//     try {
//       setFormLoading(true);
//       const token = localStorage.getItem('token');
//       await axios.put(`${BASE_URL}/api/categories/${editingCategory.id}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       await fetchCategories();
//       setIsModalOpen(false);
//       setEditingCategory(null);
//       alert('Category updated successfully!');
//     } catch (error) {
//       console.error('Error updating category:', error);
//       alert('Failed to update category');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Delete category
//   const handleDeleteCategory = async (id: number) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${BASE_URL}/api/categories/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       await fetchCategories();
//       alert('Category deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting category:', error);
//       alert('Failed to delete category');
//     }
//   };

//   // Open add modal
//   const handleOpenAddModal = () => {
//     setEditingCategory(null);
//     setIsModalOpen(true);
//   };

//   // Open edit modal
//   const handleOpenEditModal = (category: Category) => {
//     setEditingCategory(category);
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingCategory(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
//           <p className="text-gray-600">Manage your product categories</p>
//         </div>

//         <CategoriesTable
//           categories={categories}
//           onEdit={handleOpenEditModal}
//           onDelete={handleDeleteCategory}
//           onAdd={handleOpenAddModal}
//           loading={loading}
//         />
//       </div>

//       <CategoryFormModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
//         initialData={editingCategory}
//         loading={formLoading}
//       />
//     </div>
//   );
// };

// export default AdminCategories;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '@/Config/Api';
import Navbar from '@/components/Navbar';
import CategoriesTable from '@/components/CategoriesTable';
import CategoryFormModal from '@/components/CategoryFormModal';

interface Category {
  id: number;
  category_name: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  product_count?: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = async (data: FormData | { category_name: string; image?: string }) => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      const isFormData = data instanceof FormData;
      
      const response = await axios.post(`${BASE_URL}/api/categories`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
        },
      });
      
      await fetchCategories();
      setIsModalOpen(false);
      alert('Category added successfully!');
    } catch (error: any) {
      console.error('Error adding category:', error);
      alert(error.response?.data?.error || 'Failed to add category');
    } finally {
      setFormLoading(false);
    }
  };

  // Edit category
  const handleEditCategory = async (data: FormData | { category_name: string; image?: string }) => {
    if (!editingCategory) return;
    
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      const isFormData = data instanceof FormData;
      
      const response = await axios.put(`${BASE_URL}/api/categories/${editingCategory.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
        },
      });
      
      await fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
      alert('Category updated successfully!');
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert(error.response?.data?.error || 'Failed to update category');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCategories();
      alert('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.error || 'Failed to delete category');
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>

        <CategoriesTable
          categories={categories}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCategory}
          onAdd={handleOpenAddModal}
          loading={loading}
        />
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={editingCategory}
        loading={formLoading}
      />
    </div>
  );
};

export default AdminCategories;
// AdminProducts.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config/Api";
import Navbar from "@/components/Navbar";
import ProductsTable from "@/components/ProductsTable";
import ProductFormModal from "@/components/ProductFormModal";

export interface Product {
  id: number;
  product_category_id: number;
  category_id: number;
  category_name: string;
  product_name: string;
  material: string;
  color: string;
  available_stock: number;
  rating: number;
  price: number;
  original_price: number;
  discount: number;
  sale_price: number;
  description: string;
  product_description: string;
  dimensions: string;
  product_code: string;
  product_brand: string;
  weight: string;
  specifications: string;
  warranty: string;
  care_instructions: string;
  is_active: number;
  images?: string[];
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (formData: FormData) => {
    try {
      setFormLoading(true);
      await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProducts();
      setIsModalOpen(false);
      alert("Product Added Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Failed to add product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = async (formData: FormData) => {
    if (!editingProduct) return;

    try {
      setFormLoading(true);
      await axios.put(`${BASE_URL}/api/products/${editingProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProducts();
      setEditingProduct(null);
      setIsModalOpen(false);
      alert("Product Updated Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Failed to update product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      await fetchProducts();
      alert("Product Deleted Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>

        <ProductsTable
          products={products}
          loading={loading}
          onAdd={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteProduct}
        />

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          initialData={editingProduct}
          loading={formLoading}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
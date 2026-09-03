// src/pages/AdminAddons.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config/Api";
import Navbar from "@/components/Navbar";
import AddonFormModal from "@/components/AddonFormModal";
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface Addon {
  id: number;
  name: string;
  price: number;
  icon: string;
  description: string;
  category: string;
  is_active: number;
}

const AdminAddons = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchAddons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/addons`);
      setAddons(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch add-ons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  // src/pages/AdminAddons.tsx
// Update the handleAddAddon and handleEditAddon functions:

const handleAddAddon = async (formData: any) => {
  try {
    setFormLoading(true);
    // Ensure is_active is sent as number
    const dataToSend = {
      ...formData,
      is_active: formData.is_active ? 1 : 0
    };
    await axios.post(`${BASE_URL}/api/addons`, dataToSend);
    await fetchAddons();
    setIsModalOpen(false);
    alert("Add-on Added Successfully");
  } catch (err: any) {
    console.log(err);
    alert(err.response?.data?.error || "Failed to add add-on");
  } finally {
    setFormLoading(false);
  }
};

const handleEditAddon = async (formData: any) => {
  if (!editingAddon) return;

  try {
    setFormLoading(true);
    // Ensure is_active is sent as number
    const dataToSend = {
      ...formData,
      is_active: formData.is_active ? 1 : 0
    };
    await axios.put(`${BASE_URL}/api/addons/${editingAddon.id}`, dataToSend);
    await fetchAddons();
    setEditingAddon(null);
    setIsModalOpen(false);
    alert("Add-on Updated Successfully");
  } catch (err: any) {
    console.log(err);
    alert(err.response?.data?.error || "Failed to update add-on");
  } finally {
    setFormLoading(false);
  }
};

  // const handleEditAddon = async (formData: any) => {
  //   if (!editingAddon) return;

  //   try {
  //     setFormLoading(true);
  //     await axios.put(`${BASE_URL}/api/addons/${editingAddon.id}`, formData);
  //     await fetchAddons();
  //     setEditingAddon(null);
  //     setIsModalOpen(false);
  //     alert("Add-on Updated Successfully");
  //   } catch (err: any) {
  //     console.log(err);
  //     alert(err.response?.data?.error || "Failed to update add-on");
  //   } finally {
  //     setFormLoading(false);
  //   }
  // };

  const handleDeleteAddon = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this add-on?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/addons/${id}`);
      await fetchAddons();
      alert("Add-on Deleted Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const filteredAddons = addons.filter(
    (addon) =>
      addon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addon.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredAddons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredAddons.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add-Ons / Customizations</h1>
          <p className="text-gray-500">Manage package customization options</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Add-Ons</h3>
                <p className="text-sm text-gray-500">
                  Total: {addons.length} Add-ons
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search add-ons..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingAddon(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  Add Add-On
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Icon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0c2d67]"></div>
                        <span className="text-gray-500">Loading Add-ons...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAddons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No Add-ons Found</p>
                        <p className="text-sm">Try adjusting your search or add a new add-on</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((addon) => (
                    <tr key={addon.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">#{addon.id}</td>
                      <td className="px-4 py-3 text-2xl">{addon.icon || '📦'}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm text-gray-900">{addon.name}</div>
                        {addon.description && (
                          <div className="text-xs text-gray-400">{addon.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {addon.category || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ₹{addon.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          addon.is_active === 1 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {addon.is_active === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingAddon(addon);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit Add-on"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddon(addon.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete Add-on"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border border-gray-300 ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 transition-colors duration-200'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${
                        currentPage === page
                          ? 'bg-[#0c2d67] text-white border-[#0c2d67]'
                          : 'border-gray-300 hover:bg-gray-100 transition-colors duration-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border border-gray-300 ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 transition-colors duration-200'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <AddonFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAddon(null);
          }}
          onSubmit={editingAddon ? handleEditAddon : handleAddAddon}
          initialData={editingAddon}
          loading={formLoading}
        />
      </div>
    </div>
  );
};

export default AdminAddons;
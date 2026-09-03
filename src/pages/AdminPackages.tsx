// src/pages/AdminPackages.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config/Api";
import Navbar from "@/components/Navbar";
import PackageFormModal from "@/components/PackageFormModal";
import { Edit, Trash2, Plus, Search, Image, ChevronLeft, ChevronRight } from "lucide-react";

export interface Package {
  id: number;
  package_name: string;
  tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum';
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  review_count: number;
  guest_capacity: number;
  description: string;
  includes: string[];
  images: string[];
  catering: boolean | string[];
  stage_decoration: boolean | string[];
  flower_decoration: boolean | string[];
  lighting: boolean | string[];
  photography: boolean | string[];
  videography: boolean | string[];
  sound_system: boolean | string[];
  dj_setup: boolean;
  is_active: number;
  image_count?: number;
}

const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/packages`);
      setPackages(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAddPackage = async (formData: FormData) => {
    try {
      setFormLoading(true);
      await axios.post(`${BASE_URL}/api/packages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchPackages();
      setIsModalOpen(false);
      alert("Package Added Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Failed to add package");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditPackage = async (formData: FormData) => {
    if (!editingPackage) return;

    try {
      setFormLoading(true);
      await axios.put(`${BASE_URL}/api/packages/${editingPackage.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchPackages();
      setEditingPackage(null);
      setIsModalOpen(false);
      alert("Package Updated Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Failed to update package");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/packages/${id}`);
      await fetchPackages();
      alert("Package Deleted Successfully");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.tier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredPackages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredPackages.slice(startIndex, endIndex);

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

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      'Basic': 'bg-gray-100 text-gray-700',
      'Silver': 'bg-gray-300 text-gray-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Platinum': 'bg-purple-100 text-purple-800',
      'Premium': 'bg-blue-100 text-blue-800',
      'Luxury': 'bg-pink-100 text-pink-800',
    };
    return colors[tier] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Packages</h1>
          <p className="text-gray-500">Manage your event packages</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Packages</h3>
                <p className="text-sm text-gray-500">
                  Total: {packages.length} Packages
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
                    placeholder="Search packages..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingPackage(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  Add Package
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guests</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0c2d67]"></div>
                        <span className="text-gray-500">Loading Packages...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No Packages Found</p>
                        <p className="text-sm">Try adjusting your search or add a new package</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">#{pkg.id}</td>
                      <td className="px-4 py-3">
                        {pkg.images && pkg.images.length > 0 ? (
                          <img
                            src={`${BASE_URL}/${pkg.images[0]}`}
                            alt={pkg.package_name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.png';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <Image size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm text-gray-900">{pkg.package_name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(pkg.tier)}`}>
                          {pkg.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ₹{pkg.price?.toLocaleString('en-IN')}
                        {pkg.original_price > pkg.price && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            ₹{pkg.original_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{pkg.guest_capacity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {pkg.rating > 0 ? `${pkg.rating} ⭐` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pkg.is_active === 1 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {pkg.is_active === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingPackage(pkg);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit Package"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete Package"
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

        <PackageFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPackage(null);
          }}
          onSubmit={editingPackage ? handleEditPackage : handleAddPackage}
          initialData={editingPackage}
          loading={formLoading}
        />
      </div>
    </div>
  );
};

export default AdminPackages;
// ProductsTable.tsx
import React, { useState } from "react";
import { Edit, Trash2, Plus, Search, Image, ChevronLeft, ChevronRight } from "lucide-react";
import BASE_URL from '@/Config/Api';

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

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  loading?: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const calculateSalePrice = (price: number, discount: number) => {
    if (!discount || discount === 0) return price;
    return price - (price * discount) / 100;
  };

  // Generate page numbers
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Products</h3>
            <p className="text-sm text-gray-500">
              Total: {products.length} Products
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
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-5 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sale Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0c2d67]"></div>
                    <span className="text-gray-500">Loading Products...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-10">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No Products Found</p>
                    <p className="text-sm">Try adjusting your search or add a new product</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((product) => {
                const salePrice = calculateSalePrice(product.price, product.discount);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#{product.id}</td>
                    <td className="px-4 py-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`${BASE_URL}/${product.images[0]}`}
                          alt={product.product_name}
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
                      <div className="font-medium text-sm text-gray-900">{product.product_name}</div>
                      <div className="text-xs text-gray-500">Code: {product.product_code || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {product.category_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.product_brand || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.available_stock > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.available_stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{product.price}</td>
                    <td className="px-4 py-3 text-sm">
                      {product.discount > 0 ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          {product.discount}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600 text-sm">₹{salePrice.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active === 1 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.is_active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this product?")) {
                              onDelete(product.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete Product"
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

      {/* Footer with Pagination - FIXED */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - Showing entries info */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
            <span className="hidden sm:inline ml-2">
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} products
            </span>
          </div>

          {/* Right side - Pagination buttons - FIXED */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {/* First Page */}
              {/* <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-300 ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100 transition-colors duration-200'
                }`}
                aria-label="First page"
              >
                <div className="flex items-center">
                  <ChevronLeft size={16} className="rotate-180" />
                  <ChevronLeft size={16} className="-ml-2 rotate-180" />
                </div>
              </button> */}
              
              {/* Previous Page */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-300 ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100 transition-colors duration-200'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
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

              {/* Next Page */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border border-gray-300 ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100 transition-colors duration-200'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>

              {/* Last Page */}
              {/* <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border border-gray-300 ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100 transition-colors duration-200'
                }`}
                aria-label="Last page"
              >
                <div className="flex items-center">
                  <ChevronRight size={16} className="rotate-180" />
                  <ChevronRight size={16} className="-ml-2 rotate-180" />
                </div>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
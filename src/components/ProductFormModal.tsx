// // ProductFormModal.tsx
// import React, { useEffect, useState } from "react";
// import { X, Image, Upload, Trash2 } from "lucide-react";
// import axios from "axios";
// import BASE_URL from "@/Config/Api";

// interface ProductFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (formData: FormData) => void;
//   initialData?: any;
//   loading?: boolean;
// }

// const ProductFormModal: React.FC<ProductFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   loading = false,
// }) => {
//   const [form, setForm] = useState({
//     product_category_id: "",
//     product_name: "",
//     material: "",
//     color: "",
//     available_stock: "",
//     rating: "",
//     price: "",
//     discount: "",
//     description: "",
//     dimensions: "",
//     product_code: "",
//     product_brand: "",
//     weight: "",
//     specifications: "",
//     warranty: "",
//     care_instructions: "",
//     is_active: "1",
//   });

//   const [images, setImages] = useState<File[]>([]);
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/categories`);
//         setCategories(res.data);
//       } catch (error) {
//         console.error("Failed to fetch categories", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         product_category_id: initialData.product_category_id || initialData.category_id || "",
//         product_name: initialData.product_name || "",
//         material: initialData.material || "",
//         color: initialData.color || "",
//         available_stock: initialData.available_stock || "",
//         rating: initialData.rating || "",
//         price: initialData.price || initialData.original_price || "",
//         discount: initialData.discount || "",
//         description: initialData.product_description || initialData.description || "",
//         dimensions: initialData.dimensions || "",
//         product_code: initialData.product_code || "",
//         product_brand: initialData.product_brand || "",
//         weight: initialData.weight || "",
//         specifications: initialData.specifications || "",
//         warranty: initialData.warranty || "",
//         care_instructions: initialData.care_instructions || "",
//         is_active: initialData.is_active !== undefined ? String(initialData.is_active) : "1",
//       });

//       // Set existing images
//       if (initialData.images && initialData.images.length > 0) {
//         setExistingImages(initialData.images);
//         setImagePreviews(initialData.images.map((img: string) => `${BASE_URL}/${img}`));
//       } else {
//         setExistingImages([]);
//         setImagePreviews([]);
//       }
//     } else {
//       // Reset form for new product
//       setForm({
//         product_category_id: "",
//         product_name: "",
//         material: "",
//         color: "",
//         available_stock: "",
//         rating: "",
//         price: "",
//         discount: "",
//         description: "",
//         dimensions: "",
//         product_code: "",
//         product_brand: "",
//         weight: "",
//         specifications: "",
//         warranty: "",
//         care_instructions: "",
//         is_active: "1",
//       });
//       setImages([]);
//       setExistingImages([]);
//       setImagePreviews([]);
//     }
//   }, [initialData]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setImages(files);
      
//       // Create previews for new images
//       const previews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews([...imagePreviews, ...previews]);
//     }
//   };

//   const removeImage = (index: number) => {
//     // Remove from previews
//     const newPreviews = [...imagePreviews];
//     newPreviews.splice(index, 1);
//     setImagePreviews(newPreviews);

//     // If it's a new image, remove from files array
//     if (index < images.length) {
//       const newImages = [...images];
//       newImages.splice(index, 1);
//       setImages(newImages);
//     } else {
//       // If it's an existing image, remove from existing images
//       const existingIndex = index - images.length;
//       const newExisting = [...existingImages];
//       newExisting.splice(existingIndex, 1);
//       setExistingImages(newExisting);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     // Append all form fields
//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== null && value !== undefined && value !== "") {
//         formData.append(key, String(value));
//       }
//     });

//     // Append existing images paths
//     existingImages.forEach((imagePath) => {
//       formData.append("existing_images", imagePath);
//     });

//     // Append new images
//     images.forEach((image) => {
//       formData.append("images", image);
//     });

//     onSubmit(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">
//               {initialData ? "Edit Product" : "Add New Product"}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {initialData ? "Update product details" : "Create a new product"}
//             </p>
//           </div>
//           <button 
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//           >
//             <X size={22} className="text-gray-500" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Category Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category *
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.product_category_id}
//                 onChange={(e) =>
//                   setForm({ ...form, product_category_id: e.target.value })
//                 }
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.category_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Product Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter product name"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.product_name}
//                 onChange={(e) => setForm({ ...form, product_name: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Product Code */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product Code (SKU)
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter product code"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.product_code}
//                 onChange={(e) => setForm({ ...form, product_code: e.target.value })}
//               />
//             </div>

//             {/* Product Brand */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Brand
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter brand name"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.product_brand}
//                 onChange={(e) => setForm({ ...form, product_brand: e.target.value })}
//               />
//             </div>

//             {/* Material */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Material
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter material"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.material}
//                 onChange={(e) => setForm({ ...form, material: e.target.value })}
//               />
//             </div>

//             {/* Color */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Color
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter color"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.color}
//                 onChange={(e) => setForm({ ...form, color: e.target.value })}
//               />
//             </div>

//             {/* Price */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Price (₹) *
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 placeholder="Enter price"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.price}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Discount */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Discount (%)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 placeholder="Enter discount percentage"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.discount}
//                 onChange={(e) => setForm({ ...form, discount: e.target.value })}
//               />
//             </div>

//             {/* Available Stock */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Stock *
//               </label>
//               <input
//                 type="number"
//                 placeholder="Enter stock quantity"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.available_stock}
//                 onChange={(e) => setForm({ ...form, available_stock: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Weight */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Weight (kg)
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter weight"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.weight}
//                 onChange={(e) => setForm({ ...form, weight: e.target.value })}
//               />
//             </div>

//             {/* Dimensions */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Dimensions (LxWxH)
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter dimensions (e.g., 30x30x45 cm)"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.dimensions}
//                 onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
//               />
//             </div>

//             {/* Specifications */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Specifications (JSON format)
//               </label>
//               <textarea
//                 rows={2}
//                 placeholder='{"material": "Ceramic", "type": "Table Centerpiece"}'
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.specifications}
//                 onChange={(e) => setForm({ ...form, specifications: e.target.value })}
//               />
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 rows={3}
//                 placeholder="Enter product description"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />
//             </div>

//             {/* Warranty */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Warranty
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter warranty period"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.warranty}
//                 onChange={(e) => setForm({ ...form, warranty: e.target.value })}
//               />
//             </div>

//             {/* Care Instructions */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Care Instructions
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter care instructions"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.care_instructions}
//                 onChange={(e) => setForm({ ...form, care_instructions: e.target.value })}
//               />
//             </div>

//             {/* Active Status */}
//             <div className="md:col-span-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.is_active === "1"}
//                   onChange={(e) =>
//                     setForm({ ...form, is_active: e.target.checked ? "1" : "0" })
//                   }
//                   className="w-4 h-4 text-[#0c2d67] focus:ring-[#0c2d67] border-gray-300 rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">
//                   Active (visible to customers)
//                 </span>
//               </label>
//             </div>

//             {/* Images Upload */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Images
//               </label>
              
//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={preview}
//                         alt={`Product image ${index + 1}`}
//                         className="w-full h-24 object-cover rounded-lg border border-gray-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0c2d67] transition-colors duration-200">
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="w-full"
//                   id="image-upload"
//                 />
//                 <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
//                   <Upload size={32} className="text-gray-400 mb-2" />
//                   <span className="text-sm text-gray-500">
//                     Click to upload images (JPEG, PNG, WebP, GIF)
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     Maximum 10 images, 5MB each
//                   </span>
//                 </label>
//               </div>
//               {images.length > 0 && (
//                 <p className="mt-2 text-sm text-gray-600">
//                   {images.length} new image(s) selected
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2.5 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Saving...
//                 </>
//               ) : (
//                 initialData ? "Update Product" : "Add Product"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductFormModal;




// ProductFormModal.tsx
import React, { useEffect, useState } from "react";
import { X, Image, Upload, Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";
import BASE_URL from "@/Config/Api";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: any;
  loading?: boolean;
}

// Predefined color options with names and hex values
const PREDEFINED_COLORS = [
  { name: "Red", hex: "#FF0000" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Maroon", hex: "#800000" },
  { name: "Pink", hex: "#FF69B4" },
  { name: "Hot Pink", hex: "#FF1493" },
  { name: "Orange", hex: "#FF8C00" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Green", hex: "#008000" },
  { name: "Teal", hex: "#008080" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy", hex: "#000080" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Purple", hex: "#800080" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Brown", hex: "#A52A2A" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Black", hex: "#000000" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Copper", hex: "#B87333" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Emerald", hex: "#50C878" },
  { name: "Sapphire", hex: "#0F52BA" },
  { name: "Ruby", hex: "#9B111E" },
];

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [form, setForm] = useState({
    product_category_id: "",
    product_name: "",
    material: "",
    color: "",
    available_stock: "",
    rating: "",
    price: "",
    discount: "",
    product_description: "",
    dimensions: "",
    product_code: "",
    product_brand: "",
    weight: "",
    specifications: "",
    warranty: "",
    care_instructions: "",
    is_active: "1",
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [colorImages, setColorImages] = useState<Record<string, File[]>>({});
  const [colorImagePreviews, setColorImagePreviews] = useState<Record<string, string[]>>({});
  const [selectedColorForImages, setSelectedColorForImages] = useState<string>("");

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const parseJSONArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const parseColorImages = (value: any): Record<string, string[]> => {
    if (!value) return {};
    if (typeof value === 'object') return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return {};
      }
    }
    return {};
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

// ProductFormModal.tsx
useEffect(() => {
  if (initialData) {
    setForm({
      product_category_id: initialData.product_category_id || initialData.category_id || "",
      product_name: initialData.product_name || "",
      material: initialData.material || "",
      color: initialData.color || "",
      available_stock: initialData.available_stock || "",
      rating: initialData.rating || "",
      price: initialData.price || initialData.original_price || "",
      discount: initialData.discount || "",
      product_description: initialData.product_description || initialData.description || "",
      dimensions: initialData.dimensions || "",
      product_code: initialData.product_code || "",
      product_brand: initialData.product_brand || "",
      weight: initialData.weight || "",
      specifications: typeof initialData.specifications === 'object' 
        ? JSON.stringify(initialData.specifications) 
        : initialData.specifications || "",
      warranty: initialData.warranty || "",
      care_instructions: initialData.care_instructions || "",
      is_active: initialData.is_active !== undefined ? String(initialData.is_active) : "1",
    });

    setSelectedColors(parseJSONArray(initialData.colors));
    setSizes(parseJSONArray(initialData.sizes));

    const colorImagesData = parseColorImages(initialData.color_images);

    setExistingImages(initialData.images || []);
    setImagePreviews(initialData.images ? initialData.images.map((img: string) => `${BASE_URL}/${img}`) : []);
  } else {
    // Reset form for new product
    resetForm();
  }
}, [initialData, isOpen]); // ✅ Add isOpen here

// Create a reset function for cleaner code
const resetForm = () => {
  setForm({
    product_category_id: "",
    product_name: "",
    material: "",
    color: "",
    available_stock: "",
    rating: "",
    price: "",
    discount: "",
    product_description: "",
    dimensions: "",
    product_code: "",
    product_brand: "",
    weight: "",
    specifications: "",
    warranty: "",
    care_instructions: "",
    is_active: "1",
  });
  setSelectedColors([]);
  setSizes([]);
  setImages([]);
  setExistingImages([]);
  setImagePreviews([]);
  setColorImages({});
  setColorImagePreviews({});
  setSelectedColorForImages("");
  setShowColorPicker(false);
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (selectedColorForImages) {
        const currentColorImages = colorImages[selectedColorForImages] || [];
        setColorImages({
          ...colorImages,
          [selectedColorForImages]: [...currentColorImages, ...files],
        });
        
        const previews = files.map(file => URL.createObjectURL(file));
        setColorImagePreviews({
          ...colorImagePreviews,
          [selectedColorForImages]: [...(colorImagePreviews[selectedColorForImages] || []), ...previews],
        });
      } else {
        setImages([...images, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
      }
    }
  };

  const removeImage = (color: string | null, index: number) => {
    if (color) {
      const newColorImages = { ...colorImages };
      const newColorPreviews = { ...colorImagePreviews };
      
      if (newColorImages[color]) {
        newColorImages[color] = newColorImages[color].filter((_, i) => i !== index);
        newColorPreviews[color] = newColorPreviews[color]?.filter((_, i) => i !== index) || [];
        
        if (newColorImages[color].length === 0) {
          delete newColorImages[color];
          delete newColorPreviews[color];
        }
        
        setColorImages(newColorImages);
        setColorImagePreviews(newColorPreviews);
      }
    } else {
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);

      if (index < images.length) {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
      } else {
        const existingIndex = index - images.length;
        const newExisting = [...existingImages];
        newExisting.splice(existingIndex, 1);
        setExistingImages(newExisting);
      }
    }
  };

  const toggleColor = (colorHex: string) => {
    if (selectedColors.includes(colorHex)) {
      setSelectedColors(selectedColors.filter(c => c !== colorHex));
      const newColorImages = { ...colorImages };
      const newColorPreviews = { ...colorImagePreviews };
      delete newColorImages[colorHex];
      delete newColorPreviews[colorHex];
      setColorImages(newColorImages);
      setColorImagePreviews(newColorPreviews);
    } else {
      setSelectedColors([...selectedColors, colorHex]);
    }
  };

  const getColorName = (hex: string) => {
    const color = PREDEFINED_COLORS.find(c => c.hex === hex);
    return color ? color.name : hex;
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (selectedColors.length > 0) {
      formData.append("colors", JSON.stringify(selectedColors));
    }

    if (sizes.length > 0) {
      formData.append("sizes", JSON.stringify(sizes));
    }

    const colorImagesMapping: Record<string, string[]> = {};
    Object.keys(colorImages).forEach(color => {
      colorImagesMapping[color] = colorImages[color].map(file => file.name);
    });
    
    if (Object.keys(colorImagesMapping).length > 0) {
      formData.append("color_images", JSON.stringify(colorImagesMapping));
    }

    existingImages.forEach((imagePath) => {
      formData.append("existing_images", imagePath);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    Object.keys(colorImages).forEach(color => {
      colorImages[color].forEach(file => {
        formData.append("images", file);
      });
    });

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? "Update product details" : "Create a new product"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.product_category_id}
                onChange={(e) =>
                  setForm({ ...form, product_category_id: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                required
              />
            </div>

            {/* Product Code - NO LONGER REQUIRED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code (SKU)
              </label>
              <input
                type="text"
                placeholder="Enter product code"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.product_code}
                onChange={(e) => setForm({ ...form, product_code: e.target.value })}
              />
            </div>

            {/* Product Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                placeholder="Enter brand name"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.product_brand}
                onChange={(e) => setForm({ ...form, product_brand: e.target.value })}
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <input
                type="text"
                placeholder="Enter material"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
              />
            </div>

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter primary color name"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>

            {/* Price - NO LONGER REQUIRED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter discount percentage"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </div>

            {/* Available Stock - NO LONGER REQUIRED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.available_stock}
                onChange={(e) => setForm({ ...form, available_stock: e.target.value })}
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="text"
                placeholder="Enter weight"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>

            {/* Dimensions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions (LxWxH)
              </label>
              <input
                type="text"
                placeholder="Enter dimensions (e.g., 30x30x45 cm)"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              />
            </div>

            {/* ─── DESCRIPTION - NEW SECTION ────────────────────────────────── */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Enter detailed product description..."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.product_description}
                onChange={(e) => setForm({ ...form, product_description: e.target.value })}
               
              />
              <p className="text-xs text-gray-400 mt-1">
                This description will be displayed on the product page in the app.
              </p>
            </div>

            {/* COLORS - with color picker */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
                <span className="text-xs text-gray-400 ml-2">(Click to select/deselect)</span>
              </label>
              
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="mb-3 px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-colors duration-200 text-sm"
              >
                {showColorPicker ? "Hide Color Picker" : "Show Color Picker"}
              </button>

              {showColorPicker && (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => toggleColor(color.hex)}
                      className={`relative group flex flex-col items-center p-1 rounded-lg transition-all duration-200 ${
                        selectedColors.includes(color.hex)
                          ? 'ring-2 ring-[#0c2d67] ring-offset-2 shadow-md'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[10px] text-gray-600 mt-1 truncate max-w-[50px]">
                        {color.name}
                      </span>
                      {selectedColors.includes(color.hex) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0c2d67] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Colors Display */}
              {selectedColors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedColors.map((hex, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-300" 
                        style={{ backgroundColor: hex }}
                      />
                      {getColorName(hex)}
                      <button
                        type="button"
                        onClick={() => toggleColor(hex)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {selectedColors.length} color{selectedColors.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            {/* COLOR-IMAGE MAPPING SECTION */}
            {selectedColors.length > 0 && (
              <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color-Specific Images
                  <span className="text-xs text-gray-400 ml-2">(Upload images for each color)</span>
                </label>
                
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Select a color to upload images:</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                    value={selectedColorForImages}
                    onChange={(e) => setSelectedColorForImages(e.target.value)}
                  >
                    <option value="">Select a color</option>
                    {selectedColors.map((hex) => (
                      <option key={hex} value={hex}>
                        {getColorName(hex)} ({colorImages[hex]?.length || 0} images)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color-specific image previews */}
                {selectedColorForImages && colorImagePreviews[selectedColorForImages]?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
                    {colorImagePreviews[selectedColorForImages].map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`${getColorName(selectedColorForImages)} image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-1 left-1 bg-[#0c2d67] text-white text-xs px-2 py-0.5 rounded">
                          {getColorName(selectedColorForImages)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(selectedColorForImages, index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* General image upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0c2d67] transition-colors duration-200">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {selectedColorForImages 
                        ? `Upload images for ${getColorName(selectedColorForImages)}` 
                        : "Upload general images (or select a color above)"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Maximum 10 images, 5MB each
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter size (e.g., Large)"
                  className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#173d79] transition-colors duration-200"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications (JSON format)
              </label>
              <textarea
                rows={3}
                placeholder='{"material": "Ceramic", "type": "Table Centerpiece", "finish": "Matte"}'
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent font-mono text-sm"
                value={form.specifications}
                onChange={(e) => setForm({ ...form, specifications: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter specifications as JSON object. Example: {"{"}"material": "Ceramic", "finish": "Matte"{"}"}
              </p>
            </div>

            {/* Warranty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty
              </label>
              <input
                type="text"
                placeholder="Enter warranty period"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
              />
            </div>

            {/* Care Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Care Instructions
              </label>
              <input
                type="text"
                placeholder="Enter care instructions"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.care_instructions}
                onChange={(e) => setForm({ ...form, care_instructions: e.target.value })}
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active === "1"}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked ? "1" : "0" })
                  }
                  className="w-4 h-4 text-[#0c2d67] focus:ring-[#0c2d67] border-gray-300 rounded"
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
                initialData ? "Update Product" : "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
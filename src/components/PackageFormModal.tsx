// // components/PackageFormModal.tsx
// import React, { useEffect, useState } from "react";
// import { X, Image, Upload, Trash2, Plus } from "lucide-react";
// import axios from "axios";
// import BASE_URL from "@/Config/Api";

// interface PackageFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (formData: FormData) => void;
//   initialData?: any;
//   loading?: boolean;
// }

// const TIERS = ['Basic', 'Premium', 'Luxury', 'Silver', 'Gold', 'Platinum'];

// const PackageFormModal: React.FC<PackageFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   loading = false,
// }) => {
//   const [form, setForm] = useState({
//     package_name: "",
//     tier: "Basic",
//     price: "",
//     original_price: "",
//     discount: "",
//     rating: "",
//     review_count: "",
//     guest_capacity: "",
//     description: "",
//     includes: "",
//     dj_setup: false,
//     is_active: true,
//   });

//   const [images, setImages] = useState<File[]>([]);
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         package_name: initialData.package_name || "",
//         tier: initialData.tier || "Basic",
//         price: initialData.price || "",
//         original_price: initialData.original_price || "",
//         discount: initialData.discount || "",
//         rating: initialData.rating || "",
//         review_count: initialData.review_count || "",
//         guest_capacity: initialData.guest_capacity || "",
//         description: initialData.description || "",
//         includes: Array.isArray(initialData.includes) 
//           ? initialData.includes.join(", ") 
//           : initialData.includes || "",
//         dj_setup: initialData.dj_setup === 1 || initialData.dj_setup === true,
//         is_active: initialData.is_active !== undefined ? initialData.is_active === 1 : true,
//       });

//       if (initialData.images && initialData.images.length > 0) {
//         setExistingImages(initialData.images);
//         setImagePreviews(initialData.images.map((img: string) => `${BASE_URL}/${img}`));
//       }
//     } else {
//       setForm({
//         package_name: "",
//         tier: "Basic",
//         price: "",
//         original_price: "",
//         discount: "",
//         rating: "",
//         review_count: "",
//         guest_capacity: "",
//         description: "",
//         includes: "",
//         dj_setup: false,
//         is_active: true,
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
//       const previews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews([...imagePreviews, ...previews]);
//     }
//   };

//   const removeImage = (index: number) => {
//     const newPreviews = [...imagePreviews];
//     newPreviews.splice(index, 1);
//     setImagePreviews(newPreviews);

//     if (index < images.length) {
//       const newImages = [...images];
//       newImages.splice(index, 1);
//       setImages(newImages);
//     } else {
//       const existingIndex = index - images.length;
//       const newExisting = [...existingImages];
//       newExisting.splice(existingIndex, 1);
//       setExistingImages(newExisting);
//     }
//   };

// // In PackageFormModal.tsx, update the handleSubmit function:

// const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   const formData = new FormData();

//   // Append all form fields with proper values
//   Object.entries(form).forEach(([key, value]) => {
//     if (value !== null && value !== undefined && value !== "") {
//       // Convert boolean to string for is_active and dj_setup
//       if (key === 'is_active' || key === 'dj_setup') {
//         formData.append(key, value ? '1' : '0');
//       } else {
//         formData.append(key, String(value));
//       }
//     }
//   });

//   // Append includes as JSON
//   if (form.includes) {
//     const includesArray = form.includes.split(',').map((item: string) => item.trim()).filter(Boolean);
//     formData.append("includes", JSON.stringify(includesArray));
//   }

//   // Append existing images
//   existingImages.forEach((imagePath) => {
//     formData.append("existing_images", imagePath);
//   });

//   // Append new images
//   images.forEach((image) => {
//     formData.append("images", image);
//   });

//   onSubmit(formData);
// };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">
//               {initialData ? "Edit Package" : "Add New Package"}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {initialData ? "Update package details" : "Create a new event package"}
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
//             {/* Package Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Package Name *
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter package name"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.package_name}
//                 onChange={(e) => setForm({ ...form, package_name: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Tier */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Tier *
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.tier}
//                 onChange={(e) => setForm({ ...form, tier: e.target.value })}
//                 required
//               >
//                 {TIERS.map((tier) => (
//                   <option key={tier} value={tier}>{tier}</option>
//                 ))}
//               </select>
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

//             {/* Original Price */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Original Price (₹)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 placeholder="Enter original price"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.original_price}
//                 onChange={(e) => setForm({ ...form, original_price: e.target.value })}
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

//             {/* Guest Capacity */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Guest Capacity *
//               </label>
//               <input
//                 type="number"
//                 placeholder="Enter max guests"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.guest_capacity}
//                 onChange={(e) => setForm({ ...form, guest_capacity: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Rating */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Rating
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 max="5"
//                 placeholder="Enter rating (0-5)"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.rating}
//                 onChange={(e) => setForm({ ...form, rating: e.target.value })}
//               />
//             </div>

//             {/* Review Count */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Review Count
//               </label>
//               <input
//                 type="number"
//                 placeholder="Enter review count"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.review_count}
//                 onChange={(e) => setForm({ ...form, review_count: e.target.value })}
//               />
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 rows={3}
//                 placeholder="Enter package description"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />
//             </div>

//             {/* Includes */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 What's Included (comma separated)
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g., Decor, Catering, Photography, Music"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.includes}
//                 onChange={(e) => setForm({ ...form, includes: e.target.value })}
//               />
//               <p className="text-xs text-gray-400 mt-1">
//                 Separate items with commas. Example: Decor, Catering, Photography
//               </p>
//             </div>

//             {/* DJ Setup */}
//             <div className="md:col-span-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.dj_setup}
//                   onChange={(e) =>
//                     setForm({ ...form, dj_setup: e.target.checked })
//                   }
//                   className="w-4 h-4 text-[#0c2d67] focus:ring-[#0c2d67] border-gray-300 rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">
//                   DJ Setup Available
//                 </span>
//               </label>
//             </div>

//             {/* Active Status */}
//             <div className="md:col-span-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.is_active}
//                   onChange={(e) =>
//                     setForm({ ...form, is_active: e.target.checked })
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
//                 Package Images
//               </label>
              
//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={preview}
//                         alt={`Package image ${index + 1}`}
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
//                   id="package-image-upload"
//                 />
//                 <label htmlFor="package-image-upload" className="cursor-pointer flex flex-col items-center">
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
//                 initialData ? "Update Package" : "Add Package"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PackageFormModal;




// src/components/PackageFormModal.tsx
// import React, { useEffect, useState } from "react";
// import { X, Image, Upload, Trash2, Plus, Check } from "lucide-react";
// import axios from "axios";
// import BASE_URL from "@/Config/Api";

// interface PackageFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (formData: FormData) => void;
//   initialData?: any;
//   loading?: boolean;
// }

// const TIERS = ['Basic', 'Premium', 'Luxury', 'Silver', 'Gold', 'Platinum'];

// const PackageFormModal: React.FC<PackageFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   loading = false,
// }) => {
//   const [form, setForm] = useState({
//     package_name: "",
//     tier: "Basic",
//     price: "",
//     original_price: "",
//     discount: "",
//     rating: "",
//     review_count: "",
//     guest_capacity: "",
//     description: "",
//     includes: "",
//     catering: false,
//     stage_decoration: false,
//     flower_decoration: false,
//     lighting: false,
//     photography: false,
//     videography: false,
//     sound_system: false,
//     dj_setup: false,
//     is_active: true,
//   });

//   const [images, setImages] = useState<File[]>([]);
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
//   // ─── Add-Ons State ──────────────────────────────────────────────
//   const [allAddons, setAllAddons] = useState<any[]>([]);
//   const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
//   const [addonLoading, setAddonLoading] = useState(false);

//   // ─── Fetch Add-Ons ──────────────────────────────────────────────
//   useEffect(() => {
//     const fetchAddons = async () => {
//       try {
//         setAddonLoading(true);
//         const res = await axios.get(`${BASE_URL}/api/addons`);
//         setAllAddons(res.data.filter((a: any) => a.is_active === 1));
//       } catch (error) {
//         console.error("Failed to fetch add-ons:", error);
//       } finally {
//         setAddonLoading(false);
//       }
//     };
//     fetchAddons();
//   }, []);

//   // ─── Fetch Package Add-Ons when editing ────────────────────────
//   useEffect(() => {
//     if (initialData && initialData.id) {
//       const fetchPackageAddons = async () => {
//         try {
//           const res = await axios.get(`${BASE_URL}/api/packages/${initialData.id}/addons`);
//           const addonIds = res.data.map((a: any) => a.id);
//           setSelectedAddons(addonIds);
//         } catch (error) {
//           console.error("Failed to fetch package add-ons:", error);
//         }
//       };
//       fetchPackageAddons();
//     }
//   }, [initialData]);

//   // ─── Toggle Add-On Selection ───────────────────────────────────
//   const toggleAddon = (addonId: number) => {
//     setSelectedAddons(prev => 
//       prev.includes(addonId) 
//         ? prev.filter(id => id !== addonId)
//         : [...prev, addonId]
//     );
//   };

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         package_name: initialData.package_name || "",
//         tier: initialData.tier || "Basic",
//         price: initialData.price || "",
//         original_price: initialData.original_price || "",
//         discount: initialData.discount || "",
//         rating: initialData.rating || "",
//         review_count: initialData.review_count || "",
//         guest_capacity: initialData.guest_capacity || "",
//         description: initialData.description || "",
//         includes: Array.isArray(initialData.includes) 
//           ? initialData.includes.join(", ") 
//           : initialData.includes || "",
//         catering: initialData.catering === true || initialData.catering === 1,
//         stage_decoration: initialData.stage_decoration === true || initialData.stage_decoration === 1,
//         flower_decoration: initialData.flower_decoration === true || initialData.flower_decoration === 1,
//         lighting: initialData.lighting === true || initialData.lighting === 1,
//         photography: initialData.photography === true || initialData.photography === 1,
//         videography: initialData.videography === true || initialData.videography === 1,
//         sound_system: initialData.sound_system === true || initialData.sound_system === 1,
//         dj_setup: initialData.dj_setup === true || initialData.dj_setup === 1,
//         is_active: initialData.is_active !== undefined ? initialData.is_active === 1 : true,
//       });

//       if (initialData.images && initialData.images.length > 0) {
//         setExistingImages(initialData.images);
//         setImagePreviews(initialData.images.map((img: string) => `${BASE_URL}/${img}`));
//       }
//     } else {
//       setForm({
//         package_name: "",
//         tier: "Basic",
//         price: "",
//         original_price: "",
//         discount: "",
//         rating: "",
//         review_count: "",
//         guest_capacity: "",
//         description: "",
//         includes: "",
//         catering: false,
//         stage_decoration: false,
//         flower_decoration: false,
//         lighting: false,
//         photography: false,
//         videography: false,
//         sound_system: false,
//         dj_setup: false,
//         is_active: true,
//       });
//       setImages([]);
//       setExistingImages([]);
//       setImagePreviews([]);
//       setSelectedAddons([]);
//     }
//   }, [initialData]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setImages(files);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews([...imagePreviews, ...previews]);
//     }
//   };

//   const removeImage = (index: number) => {
//     const newPreviews = [...imagePreviews];
//     newPreviews.splice(index, 1);
//     setImagePreviews(newPreviews);

//     if (index < images.length) {
//       const newImages = [...images];
//       newImages.splice(index, 1);
//       setImages(newImages);
//     } else {
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
//         if (typeof value === 'boolean') {
//           formData.append(key, value ? '1' : '0');
//         } else {
//           formData.append(key, String(value));
//         }
//       }
//     });

//     // Append includes as JSON
//     if (form.includes) {
//       const includesArray = form.includes.split(',').map((item: string) => item.trim()).filter(Boolean);
//       formData.append("includes", JSON.stringify(includesArray));
//     }

//     // ─── Append selected add-ons ──────────────────────────────────
//     if (selectedAddons.length > 0) {
//       formData.append("addon_ids", JSON.stringify(selectedAddons));
//     }

//     // Append existing images
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
      
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">
//               {initialData ? "Edit Package" : "Add New Package"}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {initialData ? "Update package details" : "Create a new event package"}
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
//             {/* Package Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Package Name *
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter package name"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.package_name}
//                 onChange={(e) => setForm({ ...form, package_name: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Tier */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Tier *
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.tier}
//                 onChange={(e) => setForm({ ...form, tier: e.target.value })}
//                 required
//               >
//                 {TIERS.map((tier) => (
//                   <option key={tier} value={tier}>{tier}</option>
//                 ))}
//               </select>
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

//             {/* Original Price */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Original Price (₹)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 placeholder="Enter original price"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.original_price}
//                 onChange={(e) => setForm({ ...form, original_price: e.target.value })}
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

//             {/* Guest Capacity */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Guest Capacity *
//               </label>
//               <input
//                 type="number"
//                 placeholder="Enter max guests"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.guest_capacity}
//                 onChange={(e) => setForm({ ...form, guest_capacity: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Rating */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Rating (0-5)
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 min="0"
//                 max="5"
//                 placeholder="Enter rating"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.rating}
//                 onChange={(e) => setForm({ ...form, rating: e.target.value })}
//               />
//             </div>

//             {/* Review Count */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Review Count
//               </label>
//               <input
//                 type="number"
//                 placeholder="Enter review count"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.review_count}
//                 onChange={(e) => setForm({ ...form, review_count: e.target.value })}
//               />
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 rows={3}
//                 placeholder="Enter package description"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />
//             </div>

//             {/* Includes */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 What's Included (comma separated)
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g., Decor, Catering, Photography, Music"
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
//                 value={form.includes}
//                 onChange={(e) => setForm({ ...form, includes: e.target.value })}
//               />
//               <p className="text-xs text-gray-400 mt-1">
//                 Separate items with commas. Example: Decor, Catering, Photography
//               </p>
//             </div>

//             {/* Services Section */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Services Included
//               </label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.catering}
//                     onChange={(e) => setForm({ ...form, catering: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Catering</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.stage_decoration}
//                     onChange={(e) => setForm({ ...form, stage_decoration: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Stage Decoration</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.flower_decoration}
//                     onChange={(e) => setForm({ ...form, flower_decoration: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Flower Decoration</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.lighting}
//                     onChange={(e) => setForm({ ...form, lighting: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Lighting</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.photography}
//                     onChange={(e) => setForm({ ...form, photography: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Photography</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.videography}
//                     onChange={(e) => setForm({ ...form, videography: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Videography</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.sound_system}
//                     onChange={(e) => setForm({ ...form, sound_system: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">Sound System</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.dj_setup}
//                     onChange={(e) => setForm({ ...form, dj_setup: e.target.checked })}
//                     className="w-4 h-4 text-[#0c2d67] rounded"
//                   />
//                   <span className="text-sm text-gray-700">DJ Setup</span>
//                 </label>
//               </div>
//             </div>

//             {/* ─── ADD-ONS SELECTION ────────────────────────────────────────── */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Available Add-Ons for this Package
//                 <span className="text-xs text-gray-400 ml-2">(Select add-ons that can be customized)</span>
//               </label>
              
//               {addonLoading ? (
//                 <div className="text-center py-4 text-gray-500">Loading add-ons...</div>
//               ) : allAddons.length === 0 ? (
//                 <div className="text-center py-4 text-gray-500">
//                   No add-ons available. Please add add-ons first.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                   {allAddons.map((addon) => (
//                     <div
//                       key={addon.id}
//                       onClick={() => toggleAddon(addon.id)}
//                       className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                         selectedAddons.includes(addon.id)
//                           ? 'border-[#0c2d67] bg-[#0c2d67]/5'
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <span className="text-2xl">{addon.icon || '📦'}</span>
//                           <div>
//                             <div className="font-medium text-sm text-gray-900">{addon.name}</div>
//                             <div className="text-xs text-gray-500">₹{addon.price}</div>
//                           </div>
//                         </div>
//                         {selectedAddons.includes(addon.id) && (
//                           <Check size={18} className="text-[#0c2d67]" />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <p className="text-xs text-gray-400 mt-2">
//                 Selected: {selectedAddons.length} add-on{selectedAddons.length !== 1 ? 's' : ''}
//               </p>
//             </div>

//             {/* Active Status */}
//             <div className="md:col-span-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.is_active}
//                   onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
//                   className="w-4 h-4 text-[#0c2d67] rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">
//                   Active (visible to customers)
//                 </span>
//               </label>
//             </div>

//             {/* Images Upload */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Package Images
//               </label>
              
//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={preview}
//                         alt={`Package image ${index + 1}`}
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
//                   id="package-image-upload"
//                 />
//                 <label htmlFor="package-image-upload" className="cursor-pointer flex flex-col items-center">
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
//                 initialData ? "Update Package" : "Add Package"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PackageFormModal;




// src/components/PackageFormModal.tsx
import React, { useEffect, useState } from "react";
import { X, Image, Upload, Trash2, Plus, Check } from "lucide-react";
import axios from "axios";
import BASE_URL from "@/Config/Api";

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: any;
  loading?: boolean;
}

const TIERS = ['Basic', 'Premium', 'Luxury', 'Silver', 'Gold', 'Platinum'];

const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [form, setForm] = useState({
    package_name: "",
    tier: "Basic",
    price: "",
    original_price: "",
    discount: "",
    rating: "",
    review_count: "",
    guest_capacity: "",
    description: "",
    includes: "",
    catering: false,
    stage_decoration: false,
    flower_decoration: false,
    lighting: false,
    photography: false,
    videography: false,
    sound_system: false,
    dj_setup: false,
    is_active: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // ─── Add-Ons State ──────────────────────────────────────────────
  const [allAddons, setAllAddons] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [addonLoading, setAddonLoading] = useState(false);

  // ─── Fetch Add-Ons ──────────────────────────────────────────────
  useEffect(() => {
    const fetchAddons = async () => {
      try {
        setAddonLoading(true);
        const res = await axios.get(`${BASE_URL}/api/addons`);
        setAllAddons(res.data.filter((a: any) => a.is_active === 1));
      } catch (error) {
        console.error("Failed to fetch add-ons:", error);
      } finally {
        setAddonLoading(false);
      }
    };
    fetchAddons();
  }, []);

  // ─── Fetch Package Add-Ons when editing ────────────────────────
  useEffect(() => {
    if (initialData && initialData.id) {
      const fetchPackageAddons = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/packages/${initialData.id}/addons`);
          const addonIds = res.data.map((a: any) => a.id);
          setSelectedAddons(addonIds);
        } catch (error) {
          console.error("Failed to fetch package add-ons:", error);
        }
      };
      fetchPackageAddons();
    }
  }, [initialData]);

  // ─── Toggle Add-On Selection ───────────────────────────────────
  const toggleAddon = (addonId: number) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        package_name: initialData.package_name || "",
        tier: initialData.tier || "Basic",
        price: initialData.price || "",
        original_price: initialData.original_price || "",
        discount: initialData.discount || "",
        rating: initialData.rating || "",
        review_count: initialData.review_count || "",
        guest_capacity: initialData.guest_capacity || "",
        description: initialData.description || "",
        includes: Array.isArray(initialData.includes) 
          ? initialData.includes.join(", ") 
          : initialData.includes || "",
        catering: initialData.catering === true || initialData.catering === 1,
        stage_decoration: initialData.stage_decoration === true || initialData.stage_decoration === 1,
        flower_decoration: initialData.flower_decoration === true || initialData.flower_decoration === 1,
        lighting: initialData.lighting === true || initialData.lighting === 1,
        photography: initialData.photography === true || initialData.photography === 1,
        videography: initialData.videography === true || initialData.videography === 1,
        sound_system: initialData.sound_system === true || initialData.sound_system === 1,
        dj_setup: initialData.dj_setup === true || initialData.dj_setup === 1,
        is_active: initialData.is_active !== undefined ? initialData.is_active === 1 : true,
      });

      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
        setImagePreviews(initialData.images.map((img: string) => `${BASE_URL}/${img}`));
      }
    } else {
      setForm({
        package_name: "",
        tier: "Basic",
        price: "",
        original_price: "",
        discount: "",
        rating: "",
        review_count: "",
        guest_capacity: "",
        description: "",
        includes: "",
        catering: false,
        stage_decoration: false,
        flower_decoration: false,
        lighting: false,
        photography: false,
        videography: false,
        sound_system: false,
        dj_setup: false,
        is_active: true,
      });
      setImages([]);
      setExistingImages([]);
      setImagePreviews([]);
      setSelectedAddons([]);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
    }
  };

  const removeImage = (index: number) => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all form fields
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Append includes as JSON
    if (form.includes) {
      const includesArray = form.includes.split(',').map((item: string) => item.trim()).filter(Boolean);
      formData.append("includes", JSON.stringify(includesArray));
    }

    // ─── Append selected add-ons ──────────────────────────────────
    if (selectedAddons.length > 0) {
      formData.append("addon_ids", JSON.stringify(selectedAddons));
    }

    // Append existing images
    existingImages.forEach((imagePath) => {
      formData.append("existing_images", imagePath);
    });

    // Append new images
    images.forEach((image) => {
      formData.append("images", image);
    });

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Package" : "Add New Package"}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? "Update package details" : "Create a new event package"}
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
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Name *
              </label>
              <input
                type="text"
                placeholder="Enter package name"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.package_name}
                onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                required
              />
            </div>

            {/* Tier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                required
              >
                {TIERS.map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter original price"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.original_price}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
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

            {/* Guest Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest Capacity *
              </label>
              <input
                type="number"
                placeholder="Enter max guests"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.guest_capacity}
                onChange={(e) => setForm({ ...form, guest_capacity: e.target.value })}
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Enter rating"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>

            {/* Review Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Count
              </label>
              <input
                type="number"
                placeholder="Enter review count"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.review_count}
                onChange={(e) => setForm({ ...form, review_count: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter package description"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Includes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's Included (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Decor, Catering, Photography, Music"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0c2d67] focus:border-transparent"
                value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate items with commas. Example: Decor, Catering, Photography
              </p>
            </div>

            {/* Services Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Included
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.catering}
                    onChange={(e) => setForm({ ...form, catering: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Catering</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.stage_decoration}
                    onChange={(e) => setForm({ ...form, stage_decoration: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Stage Decoration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.flower_decoration}
                    onChange={(e) => setForm({ ...form, flower_decoration: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Flower Decoration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.lighting}
                    onChange={(e) => setForm({ ...form, lighting: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Lighting</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.photography}
                    onChange={(e) => setForm({ ...form, photography: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Photography</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.videography}
                    onChange={(e) => setForm({ ...form, videography: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Videography</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sound_system}
                    onChange={(e) => setForm({ ...form, sound_system: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">Sound System</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dj_setup}
                    onChange={(e) => setForm({ ...form, dj_setup: e.target.checked })}
                    className="w-4 h-4 text-[#0c2d67] rounded"
                  />
                  <span className="text-sm text-gray-700">DJ Setup</span>
                </label>
              </div>
            </div>

            {/* ─── ADD-ONS SELECTION ────────────────────────────────────────── */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Add-Ons for this Package
                <span className="text-xs text-gray-400 ml-2">(Select add-ons that can be customized)</span>
              </label>
              
              {addonLoading ? (
                <div className="text-center py-4 text-gray-500">Loading add-ons...</div>
              ) : allAddons.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No add-ons available. Please add add-ons first.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allAddons.map((addon) => (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAddons.includes(addon.id)
                          ? 'border-[#0c2d67] bg-[#0c2d67]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{addon.icon || '📦'}</span>
                          <div>
                            <div className="font-medium text-sm text-gray-900">{addon.name}</div>
                            <div className="text-xs text-gray-500">₹{addon.price}</div>
                          </div>
                        </div>
                        {selectedAddons.includes(addon.id) && (
                          <Check size={18} className="text-[#0c2d67]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Selected: {selectedAddons.length} add-on{selectedAddons.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
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

            {/* Images Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Images
              </label>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Package image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0c2d67] transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                  id="package-image-upload"
                />
                <label htmlFor="package-image-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Click to upload images (JPEG, PNG, WebP, GIF)
                  </span>
                  <span className="text-xs text-gray-400">
                    Maximum 10 images, 5MB each
                  </span>
                </label>
              </div>
              {images.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {images.length} new image(s) selected
                </p>
              )}
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
                initialData ? "Update Package" : "Add Package"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageFormModal;
// import React, { useState } from 'react';
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Building,
//   Camera,
//   Save,
//   Shield,
//   Bell,
//   Palette,
//   Globe,
//   Lock,
//   ChevronRight,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';
// import Navbar from '@/components/Navbar';

// interface ProfileData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   company: string;
//   position: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   bio: string;
//   website: string;
//   timezone: string;
//   language: string;
//   notifications: {
//     email: boolean;
//     push: boolean;
//     sms: boolean;
//   };
//   privacy: {
//     profileVisibility: 'public' | 'private' | 'contacts';
//     showEmail: boolean;
//     showPhone: boolean;
//   };
// }

// const ProfileSettings = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [isEditing, setIsEditing] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [avatar, setAvatar] = useState<string | null>('https://i.pravatar.cc/150?img=12');
  
//   const [profileData, setProfileData] = useState<ProfileData>({
//     firstName: 'Ankit',
//     lastName: 'Sharma',
//     email: 'ankit.sharma@example.com',
//     phone: '+91 98765 43210',
//     company: 'TechStore Pvt Ltd',
//     position: 'Store Owner',
//     address: '123, Business Park',
//     city: 'Mumbai',
//     state: 'Maharashtra',
//     zipCode: '400001',
//     country: 'India',
//     bio: 'Passionate store owner with 5+ years of experience in e-commerce. Love building great products and teams.',
//     website: 'https://techstore.com',
//     timezone: 'Asia/Kolkata (UTC +5:30)',
//     language: 'English',
//     notifications: {
//       email: true,
//       push: true,
//       sms: false,
//     },
//     privacy: {
//       profileVisibility: 'public',
//       showEmail: true,
//       showPhone: false,
//     },
//   });

//   const [initialData] = useState(profileData);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setProfileData(prev => ({
//         ...prev,
//         notifications: {
//           ...prev.notifications,
//           [name]: checked,
//         },
//       }));
//     } else {
//       setProfileData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setProfileData(prev => ({
//         ...prev,
//         privacy: {
//           ...prev.privacy,
//           [name]: checked,
//         },
//       }));
//     } else {
//       setProfileData(prev => ({
//         ...prev,
//         privacy: {
//           ...prev.privacy,
//           [name]: value,
//         },
//       }));
//     }
//   };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatar(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     setSuccessMessage('Profile updated successfully!');
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   const handleCancel = () => {
//     setProfileData(initialData);
//     setIsEditing(false);
//   };

//   const handleDeleteAccount = () => {
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = () => {
//     setShowDeleteConfirm(false);
//     alert('Account deletion process initiated');
//   };

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'security', label: 'Security', icon: Shield },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     { id: 'appearance', label: 'Appearance', icon: Palette },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
//           <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
//         </div>

//         {/* Success/Error Messages */}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
//             <CheckCircle size={20} />
//             <span>{successMessage}</span>
//           </div>
//         )}
//         {errorMessage && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
//             <AlertCircle size={20} />
//             <span>{errorMessage}</span>
//           </div>
//         )}

//         {/* Main Layout */}
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar */}
//           <div className="lg:w-64 flex-shrink-0">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
//               {/* Avatar */}
//               <div className="text-center mb-6">
//                 <div className="relative inline-block">
//                   <img
//                     src={avatar || 'https://via.placeholder.com/150'}
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
//                   />
//                   {isEditing && (
//                     <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
//                       <Camera size={16} className="text-white" />
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleAvatarChange}
//                       />
//                     </label>
//                   )}
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mt-2">
//                   {profileData.firstName} {profileData.lastName}
//                 </h3>
//                 <p className="text-sm text-gray-500">{profileData.position}</p>
//               </div>

//               {/* Navigation */}
//               <nav className="space-y-1">
//                 {tabs.map((tab) => {
//                   const Icon = tab.icon;
//                   return (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
//                         activeTab === tab.id
//                           ? 'bg-blue-50 text-blue-700 font-medium'
//                           : 'text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       <Icon size={18} />
//                       <span>{tab.label}</span>
//                       <ChevronRight size={16} className="ml-auto opacity-50" />
//                     </button>
//                   );
//                 })}
//               </nav>

//               {/* Danger Zone */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={handleDeleteAccount}
//                   className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3"
//                 >
//                   <Lock size={18} />
//                   <span>Delete Account</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               {/* Tab Header */}
//               <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     {tabs.find(t => t.id === activeTab)?.label}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     {activeTab === 'profile' && 'Update your personal information'}
//                     {activeTab === 'security' && 'Manage your security settings'}
//                     {activeTab === 'notifications' && 'Configure notification preferences'}
//                     {activeTab === 'appearance' && 'Customize your dashboard appearance'}
//                   </p>
//                 </div>
//                 <div className="flex gap-3">
//                   {isEditing ? (
//                     <>
//                       <button
//                         onClick={handleCancel}
//                         className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSave}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                       >
//                         <Save size={18} />
//                         Save Changes
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Edit Profile
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'profile' && (
//                 <div className="space-y-6">
//                   {/* Personal Information */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={profileData.firstName}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={profileData.lastName}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address
//                       </label>
//                       <div className="relative">
//                         <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                           type="email"
//                           name="email"
//                           value={profileData.email}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone Number
//                       </label>
//                       <div className="relative">
//                         <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={profileData.phone}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Company Information */}
//                   <div className="pt-6 border-t border-gray-200">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Company Name
//                         </label>
//                         <div className="relative">
//                           <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             name="company"
//                             value={profileData.company}
//                             onChange={handleInputChange}
//                             disabled={!isEditing}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Position / Role
//                         </label>
//                         <input
//                           type="text"
//                           name="position"
//                           value={profileData.position}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Website
//                         </label>
//                         <div className="relative">
//                           <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="url"
//                             name="website"
//                             value={profileData.website}
//                             onChange={handleInputChange}
//                             disabled={!isEditing}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Bio
//                         </label>
//                         <textarea
//                           name="bio"
//                           value={profileData.bio}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           rows={2}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div className="pt-6 border-t border-gray-200">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Street Address
//                         </label>
//                         <div className="relative">
//                           <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             name="address"
//                             value={profileData.address}
//                             onChange={handleInputChange}
//                             disabled={!isEditing}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={profileData.city}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           State / Province
//                         </label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={profileData.state}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           ZIP / Postal Code
//                         </label>
//                         <input
//                           type="text"
//                           name="zipCode"
//                           value={profileData.zipCode}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Country
//                         </label>
//                         <select
//                           name="country"
//                           value={profileData.country}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                         >
//                           <option value="India">India</option>
//                           <option value="USA">United States</option>
//                           <option value="UK">United Kingdom</option>
//                           <option value="Canada">Canada</option>
//                           <option value="Australia">Australia</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'security' && (
//                 <div className="space-y-6">
//                   <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                     <p className="text-sm text-yellow-800">
//                       <strong>Note:</strong> For security reasons, password changes require your current password verification.
//                     </p>
//                   </div>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Current Password
//                       </label>
//                       <input
//                         type="password"
//                         placeholder="Enter current password"
//                         disabled={!isEditing}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         New Password
//                       </label>
//                       <input
//                         type="password"
//                         placeholder="Enter new password"
//                         disabled={!isEditing}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Confirm New Password
//                       </label>
//                       <input
//                         type="password"
//                         placeholder="Confirm new password"
//                         disabled={!isEditing}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'notifications' && (
//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <p className="font-medium text-gray-900">Email Notifications</p>
//                         <p className="text-sm text-gray-500">Receive updates via email</p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           name="email"
//                           checked={profileData.notifications.email}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
//                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <p className="font-medium text-gray-900">Push Notifications</p>
//                         <p className="text-sm text-gray-500">Receive push notifications in browser</p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           name="push"
//                           checked={profileData.notifications.push}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
//                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <p className="font-medium text-gray-900">SMS Notifications</p>
//                         <p className="text-sm text-gray-500">Receive updates via SMS</p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           name="sms"
//                           checked={profileData.notifications.sms}
//                           onChange={handleInputChange}
//                           disabled={!isEditing}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'appearance' && (
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Theme
//                     </label>
//                     <select
//                       disabled={!isEditing}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                     >
//                       <option value="light">Light</option>
//                       <option value="dark">Dark</option>
//                       <option value="system">System Default</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Language
//                     </label>
//                     <select
//                       name="language"
//                       value={profileData.language}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                     >
//                       <option value="English">English</option>
//                       <option value="Hindi">Hindi</option>
//                       <option value="Spanish">Spanish</option>
//                       <option value="French">French</option>
//                       <option value="German">German</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Timezone
//                     </label>
//                     <select
//                       name="timezone"
//                       value={profileData.timezone}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                     >
//                       <option value="Asia/Kolkata (UTC +5:30)">Asia/Kolkata (UTC +5:30)</option>
//                       <option value="America/New_York (UTC -5:00)">America/New_York (UTC -5:00)</option>
//                       <option value="Europe/London (UTC +0:00)">Europe/London (UTC +0:00)</option>
//                       <option value="Australia/Sydney (UTC +11:00)">Australia/Sydney (UTC +11:00)</option>
//                     </select>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Delete Account Modal */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-red-100 rounded-full">
//                   <AlertCircle size={24} className="text-red-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900">Delete Account</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
//               </p>
//               <div className="flex gap-3 justify-end">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Yes, Delete Account
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileSettings;
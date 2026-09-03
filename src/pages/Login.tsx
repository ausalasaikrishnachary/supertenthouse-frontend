// import React, { useState } from "react";
// import logo from '@/assets/iiiqbetslogo.png';
// import axios from "axios";
// import BASE_URL from "@/Config/Api";
// import { Eye, EyeOff } from "lucide-react";


// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//  // Update the handleLogin function in AdminLogin.tsx
// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const res = await axios.post(`${BASE_URL}/api/admin/login`, {
//       email,
//       password,
//     });

//     localStorage.setItem("token", res.data.token);
//     alert("Login successful ✅");
    
//     // Redirect to admin categories
//     window.location.href = "/admin-categories";

//   } catch (err: any) {
//     alert(err.response?.data?.message || "Login failed ❌");
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
//       <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

//         {/* LOGO */}
//         <div className="flex flex-col items-center mb-6">
//           <img
//             src={logo}
//             alt="Admin Logo"
//             className="w-40 h-40 object-contain mb-2"
//           />
//           <h2 className="text-2xl font-bold text-[#0c2d67]">
//             Admin Login
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Sign in to your account
//           </p>
//         </div>

//         {/* FORM */}
//         <form className="space-y-5" onSubmit={handleLogin}>

//           {/* EMAIL */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border rounded-lg"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* PASSWORD */}
//           <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Password
//   </label>

//   <div className="relative">
//     <input
//       type={showPassword ? "text" : "password"}
//       placeholder="Enter your password"
//       className="w-full px-4 py-2 border rounded-lg pr-10"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//     />

//     {/* Eye Icon */}
//     <button
//       type="button"
//       onClick={() => setShowPassword(!showPassword)}
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//     >
//       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//     </button>
//   </div>
// </div>

//           {/* REMEMBER + FORGOT */}
//           <div className="flex justify-between items-center text-sm">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" />
//               Remember me
//             </label>
//             <a href="/forgot-password" className="text-[#0c2d67] hover:underline">
//               Forgot password?
//             </a>
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             className="w-full hidden sm:inline-flex justify-center items-center bg-[#0c2d67] text-white border-0 shadow-lg hover:bg-[#1a3d77] transition py-2 rounded-lg font-semibold"
//           >
//             Login
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;



// app/admin/AdminLogin.tsx
import React, { useState } from "react";
import logo from '@/assets/STH PNG.png';
import axios from "axios";
import BASE_URL from "@/Config/Api";
import { Eye, EyeOff, User, UserCog } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "salesman">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${BASE_URL}/api/admin/login`;
      let redirectPath = "/admin/dashboard";

      // If salesman, use salesman login endpoint
      if (role === "salesman") {
        endpoint = `${BASE_URL}/api/admin/salesman-login`;
        redirectPath = "/salesman/dashboard";
      }

      console.log('📦 Login attempt:', { endpoint, email, role });

      const res = await axios.post(endpoint, {
        email,
        password,
      });

      console.log('📦 Login response:', res.data);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", role);
        
        alert("Login successful ✅");
        
        // Redirect based on role
        window.location.href = redirectPath;
      } else {
        setError(res.data.message || "Login failed ❌");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-40 h-40 object-contain mb-2"
          />
          <h2 className="text-2xl font-bold text-[#0c2d67]">
            {role === "admin" ? "Admin" : "Salesman"} Login
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              role === "admin" 
                ? "bg-[#0c2d67] text-white shadow-md" 
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserCog size={18} />
            Admin
          </button>
          <button
            type="button"
            onClick={() => setRole("salesman")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              role === "salesman" 
                ? "bg-[#0c2d67] text-white shadow-md" 
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <User size={18} />
            Salesman
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleLogin}>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#0c2d67]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-[#0c2d67] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-[#0c2d67] text-white border-0 shadow-lg hover:bg-[#1a3d77] transition py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              `Login as ${role === "admin" ? "Admin" : "Salesman"}`
            )}
          </button>

        </form>

        {/* Role indicator */}
        <div className="mt-4 text-center text-xs text-gray-400">
          {role === "admin" ? "🔑 Admin access: Full control" : "📋 Salesman access: View orders only"}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
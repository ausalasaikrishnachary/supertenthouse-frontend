import React, { useState } from "react";
import logo from "@/assets/logo.jpeg";
import axios from "axios";
import BASE_URL from "@/Config/Api";
import { Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/admin/forgot-password`, { email });
      alert("OTP sent");
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/admin/verify-otp`, { email, otp });
      setStep(3);
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await axios.post(`${BASE_URL}/api/admin/reset-password`, {
        email,
        password,
      });

      alert("Password reset successful");
      window.location.href = "/";
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <div className="flex flex-col items-center mb-6">
          <img src={logo} className="w-40 h-40 mb-2" />
          <h2 className="text-2xl font-bold text-[#0c2d67]">
            Forgot Password
          </h2>
        </div>

        <div className="space-y-5">

          {step === 1 && (
            <>
              <label>Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                  onClick={sendOtp} 
                  className="w-full bg-[#0c2d67] hover:bg-[#1a3d77] text-white border-0 shadow-lg hover:scale-105 transition py-2 rounded-lg font-semibold"
                >
                  Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label>OTP</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button 
                onClick={verifyOtp} 
                className="w-full bg-[#0c2d67] hover:bg-[#1a3d77] text-white border-0 shadow-lg hover:scale-105 transition py-2 rounded-lg font-semibold"
              >
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
  <>
    {/* NEW PASSWORD */}
    <label className="block text-sm font-medium text-gray-700 mb-1">
      New Password
    </label>

    <div className="relative mb-3">
      <input
        type={showPassword ? "text" : "password"}
        className="w-full px-4 py-2 border rounded-lg pr-10"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {/* CONFIRM PASSWORD */}
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Confirm Password
    </label>

    <div className="relative mb-3">
      <input
        type={showConfirmPassword ? "text" : "password"}
        className="w-full px-4 py-2 border rounded-lg pr-10"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {/* BUTTON */}
   <button
        onClick={resetPassword}
        className="w-full bg-[#0c2d67] hover:bg-[#1a3d77] text-white border-0 shadow-lg hover:scale-105 transition py-2 rounded-lg font-semibold"
      >
        Reset Password
    </button>
  </>
)}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
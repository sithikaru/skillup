/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (any) {
      setError("Failed to send password reset email. Please check your email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191724] text-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-[#24202e] shadow-lg rounded-xl flex overflow-hidden"
      >
        {/* Left Side - Carousel Section */}
        <div className="w-1/2 relative overflow-hidden">
          {images.map((src, i) => (
            <motion.img 
              key={i}
              src={src} 
              alt="carousel" 
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
            />
          ))}
          <h2 className="absolute bottom-6 left-6 text-lg font-semibold text-white">
            Reset Your Password
          </h2>
        </div>

        {/* Right Side - Password Reset Form Section */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Forgot Password?</h2>
          <p className="text-gray-400 mb-4">
            Enter your email to receive a password reset link.
          </p>
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <input type="email" className="w-full p-3 rounded bg-[#2a273f] text-white" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="w-full bg-[#a78bfa] hover:bg-[#8b5cf6] p-3 rounded text-white font-bold mt-4" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>

          <p className="text-gray-400 mt-4 text-center">
            Remembered your password? <a href="/login" className="text-[#a78bfa] hover:underline">Log in</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

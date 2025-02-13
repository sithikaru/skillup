/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const db = getFirestore(); // Initialize Firestore

const images = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg"
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % images.length;
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError("This email is already in use.");
        setLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      
      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        contactNumber,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      alert("Verification email sent! Please check your inbox.");
      router.push("/verify-email");
    } catch (error: any) {
      setError(error.message);
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
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${indexRef.current === i ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        {/* Right Side - Form Section */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Create an Account</h2>
          <p className="text-gray-400 mb-4">Already have an account? <a href="/login" className="text-[#a78bfa] hover:underline">Log in</a></p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" className="w-full p-3 rounded bg-[#2a273f] text-white" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="email" className="w-full p-3 rounded bg-[#2a273f] text-white" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" className="w-full p-3 rounded bg-[#2a273f] text-white" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
            <input type="password" className="w-full p-3 rounded bg-[#2a273f] text-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" className="w-full p-3 rounded bg-[#2a273f] text-white" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <div className="flex items-center">
              <input type="checkbox" id="terms" className="mr-2" required />
              <label htmlFor="terms" className="text-gray-400">I agree to the <a href="/terms" className="text-[#a78bfa] hover:underline">Terms & Conditions</a></label>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="w-full bg-[#a78bfa] hover:bg-[#8b5cf6] p-3 rounded text-white font-bold mt-4" 
              disabled={loading}
            >
              {loading ? "Registering..." : "Create Account"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

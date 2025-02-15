/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    username: "",
    password: "",
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^(07|94)\d{8}$/.test(form.contact)) newErrors.contact = "Invalid Sri Lankan phone number";
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.username)) newErrors.username = "4-20 characters (letters, numbers, underscores)";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.file) setFileError("Bank slip is required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !fileError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, PNG, or PDF files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setFileError("File size must be less than 2MB");
      return;
    }

    setForm(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const userId = userCredential.user.uid;

      // Upload bank slip
      const fileRef = ref(storage, `bankSlips/${userId}/${form.file!.name}`);
      await uploadBytes(fileRef, form.file!);
      const fileUrl = await getDownloadURL(fileRef);

      // Create user document
      await setDoc(doc(db, "users", userId), {
        name: form.name,
        email: form.email,
        contact: form.contact,
        username: form.username.toLowerCase(),
        bankSlipUrl: fileUrl,
        verified: false,
        createdAt: new Date(),
      });

      alert("Registration submitted for verification!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Registration Error:", error);
      setErrors(prev => ({ ...prev, form: error.message || "An unexpected error occurred" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Student Registration</h2>
      
      {errors.form && (
        <div className="p-3 bg-red-800/25 text-red-500 rounded-lg text-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
          {errors.name && <span className="text-red-400 text-sm">{errors.name}</span>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">IIT Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.20230000@iit.ac.lk"
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email}</span>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Contact Number</label>
          <input
            type="tel"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0712345678"
          />
          {errors.contact && <span className="text-red-400 text-sm">{errors.contact}</span>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="name_20230001"
          />
          {errors.username && <span className="text-red-400 text-sm">{errors.username}</span>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-400 text-sm">{errors.password}</span>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Bank Payment Slip (PDF/Image)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-400"
            />
          </div>
          {form.file && (
            <p className="text-sm text-gray-400 mt-1">
              Selected: {form.file.name}
            </p>
          )}
          {fileError && <span className="text-red-400 text-sm">{fileError}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Register Account"
          )}
        </button>
      </form>
    </div>
  );
}
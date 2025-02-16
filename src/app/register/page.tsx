/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";

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
  const [fileName, setFileName] = useState<string>("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!/^(07|94)\d{8}$/.test(form.contact))
      newErrors.contact = "Invalid Sri Lankan phone number";

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.username))
      newErrors.username = "4-20 characters (letters, numbers, underscores)";

    if (form.password.length < 6 || !/\d/.test(form.password))
      newErrors.password =
        "Password must be at least 6 characters and contain a number";

    if (!form.file) newErrors.file = "Bank slip is required";
    else if (!["image/jpeg", "image/png", "application/pdf"].includes(form.file.type))
      newErrors.file = "Only JPG, PNG, or PDF files allowed";
    else if (form.file.size > 5 * 1024 * 1024) // 5MB limit
      newErrors.file = "File size must be less than 5MB"; // Fixed error message

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, file }));
    setFileName(file.name);
    setErrors((prev) => ({ ...prev, file: "" }));
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
      window.location.href = "/Dashboard";
    } catch (error: any) {
      let errorMsg = "An unexpected error occurred";
      if (error.code === "auth/email-already-in-use") errorMsg = "Email is already registered.";
      else if (error.code === "auth/weak-password") errorMsg = "Weak password. Try a stronger one.";
      else if (error.code === "auth/invalid-email") errorMsg = "Invalid email format.";

      setErrors((prev) => ({ ...prev, form: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const formattedMessage = `Hello, I need help with my Skill Up 3.0 registration.%0A%0A` +
      `Name: ${form.name || "Not provided"}%0A` +
      `Email: ${form.email || "Not provided"}%0A` +
      `Contact: ${form.contact || "Not provided"}%0A` +
      `Username: ${form.username || "Not provided"}`;
    
    return `https://wa.me/94741457706?text=${formattedMessage}`;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg space-y-6 mt-20 ">
      <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent text-center">
        Skillup Registration
      </h2>

      {errors.form && (
        <div className="p-3 bg-red-800/25 text-red-500 rounded-lg text-sm">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
          { label: "Email", name: "email", type: "email", placeholder: "john.20230000@iit.ac.lk" },
          { label: "Contact Number", name: "contact", type: "tel", placeholder: "0712345678" },
          { label: "Username", name: "username", type: "text", placeholder: "name_20230001" },
          { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as 'name' | 'email' | 'contact' | 'username' | 'password'] || ''} // Type-safe value binding
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
            {errors[name] && <span className="text-red-400 text-sm">{errors[name]}</span>}
          </div>
        ))}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Bank Payment Slip (PDF/Image)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-400"
          />
          {fileName && <p className="text-sm text-gray-400">Selected file: {fileName}</p>}
          {errors.file && <span className="text-red-400 text-sm">{errors.file}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition duration-200 flex items-center justify-center"
        >
          {loading ? "Processing..." : "Register Account"}
        </button>
      </form>

      {/* Floating WhatsApp Button */}
      <a
        href={generateWhatsAppMessage()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col items-center space-y-1"
      >
        <div className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition">
          <Image src="/whatsapp-icon.svg" alt="WhatsApp" className="w-8 h-8" width={32} height={32} />
        </div>
        <span className="text-sm text-gray-300 text-center">Contact for<br/>any registration issues</span>
      </a>
    </div>
  );
}

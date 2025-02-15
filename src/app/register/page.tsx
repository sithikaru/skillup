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
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setError("Please select a file.");
      return;
    }

    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Only JPG, PNG, and PDF are allowed.");
      return;
    }

    setError(null);
    setForm((prev) => ({ ...prev, file: selectedFile }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.file) throw new Error("File is required.");
      if (!form.password || form.password.length < 6)
        throw new Error("Password must be at least 6 characters.");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const userId = userCredential.user.uid;

      const fileRef = ref(storage, `bankSlips/${userId}`);
      await uploadBytes(fileRef, form.file);
      const fileUrl = await getDownloadURL(fileRef);

      await setDoc(doc(db, "users", userId), {
        name: form.name,
        email: form.email,
        contact: form.contact,
        username: form.username,
        bankSlipUrl: fileUrl,
        verified: false,
        createdAt: new Date(),
      });

      alert("Registration submitted successfully!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Registration Error:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Register</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="IIT Email"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (Min. 6 chars)"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded disabled:bg-gray-500"
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
}

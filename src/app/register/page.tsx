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
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const userId = userCredential.user.uid;

      // Upload bank slip to Firebase Storage
      const fileRef = ref(storage, `bankSlips/${userId}`);
      if (form.file) {
        await uploadBytes(fileRef, form.file);
      } else {
        throw new Error("File is required");
      }
      const fileUrl = await getDownloadURL(fileRef);

      // Save user data in Firestore
      await setDoc(doc(db, "users", userId), {
        name: form.name,
        email: form.email,
        contact: form.contact,
        username: form.username,
        bankSlipUrl: fileUrl,
        verified: false, // Mark as pending approval
      });

      alert("Registration submitted! Your payment is pending approval.");
      window.location.href = "/dashboard"; // Redirect to pending page
    } catch (error) {
      console.error(error);
      alert("Error: ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Register</h2>
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
          placeholder="Password"
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

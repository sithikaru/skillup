"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    username: "",
    password: "",
    bankSlip: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setFormData({ ...formData, bankSlip: file });
      setError("");
    } else {
      setError("Only JPEG, PNG, or PDF files are allowed.");
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!formData.bankSlip) {
      setError("Please upload a bank slip before registering.");
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Upload bank slip to Firebase Storage
      const storageRef = ref(storage, `bankSlips/${user.uid}`);
      await uploadBytes(storageRef, formData.bankSlip);
      const bankSlipURL = await getDownloadURL(storageRef);

      // Store user data in Firestore with "pending" status
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        username: formData.username,
        bankSlipURL,
        status: "pending", // Waiting for admin approval
        role: "user",
      });

      router.push("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold">Register for Skill Up 3.0</h2>
      <form className="mt-5 w-96 space-y-4" onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" className="input" required onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
        <input type="email" placeholder="Email" className="input" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="text" placeholder="Contact Number" className="input" required onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
        <input type="text" placeholder="Username" className="input" required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
        <input type="password" placeholder="Password" className="input" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn bg-blue-500 w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

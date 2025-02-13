/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        router.push("/login"); // Redirect if not logged in
      } else {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#191724] text-white p-6">
      <div className="max-w-lg w-full bg-[#24202e] shadow-lg rounded-xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.fullName || "User"}!</h2>
        <p className="text-gray-400">Email: {user?.email}</p>
        <p className="text-gray-400">Contact: {user?.contactNumber || "N/A"}</p>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 p-3 rounded text-white font-bold w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

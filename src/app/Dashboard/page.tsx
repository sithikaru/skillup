
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        window.location.href = "/login"; // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* If the user is not verified, show pending message */}
      {!user?.verified ? (
        <div className="bg-yellow-500 text-black p-4 rounded">
          <h3 className="text-lg font-bold">Payment Pending Approval</h3>
          <p>Your payment is under review. Please wait for admin approval.</p>
        </div>
      ) : (
        <div className="bg-green-500 text-black p-4 rounded">
          <h3 className="text-lg font-bold">Approved</h3>
          <p>Welcome to Skill Up 3.0! You now have full access.</p>
        </div>
      )}

      <button
        onClick={() => auth.signOut().then(() => (window.location.href = "/login"))}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}
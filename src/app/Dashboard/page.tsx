/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  const handleLogout = () => {
    auth.signOut().then(() => (window.location.href = "/login"));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <motion.div
        className="max-w-xl w-full mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Dashboard
        </h2>
        <AnimatePresence>
          {!user?.verified ? (
            <motion.div
              className="bg-yellow-500 text-black p-4 rounded shadow-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-1">
                Payment Pending Approval
              </h3>
              <p>
                Your payment is under review. Please wait for admin approval.
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="bg-green-500 text-black p-4 rounded shadow-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-1">Approved</h3>
              <p>
                Welcome to Skill Up 3.0! You now have full access.
                <br />
                Downloadable materials for Phases will be updated soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}

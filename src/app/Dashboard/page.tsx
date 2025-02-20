/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => (window.location.href = "/login"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="text-lg animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.div
        className="max-w-6xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
          Welcome to Skill Up 3.0
        </h2>

        <AnimatePresence>
          {!user?.verified ? (
            <motion.div
              className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-6 rounded-lg shadow-md backdrop-blur-md mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">
                Payment Pending Approval
              </h3>
              <p>
                Your payment is under review. Please wait for admin approval.
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="bg-green-500/20 border border-green-500 text-green-300 p-6 rounded-lg shadow-md backdrop-blur-md mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">Approved</h3>
              <p>
                Welcome to Skill Up 3.0! You now have full access.
                <br />
                Downloadable materials for Phases will be updated soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg p-8 shadow-lg mb-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            Program Phases
          </h3>
          <ul className="space-y-6">
            <li className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-2xl font-semibold mb-2">
                Phase 01: Student Support
              </h4>
              <p className="text-gray-400">
                Foundation for second-year degree modules. Tailored for Computer
                Science to Business Management.
              </p>
            </li>
            <li className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-2xl font-semibold mb-2">
                Phase 02: Industry Survivors
              </h4>
              <p className="text-gray-400">
                Live Broadcast with industry experts sharing experiences and
                insights for internship success.
              </p>
            </li>
            <li className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-2xl font-semibold mb-2">
                Phase 03: Industry Survival
              </h4>
              <p className="text-gray-400">
                Hands-on workshops for personal development, portfolio building,
                and interview preparation.
              </p>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
          >
            Logout
          </button>
        </motion.div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Navigation
          </h3>
          <ul className="space-y-2 text-lg">
            <li>
              <Link href="/" className="text-cyan-400 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-cyan-400 hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-cyan-400 hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/project-board"
                className="text-cyan-400 hover:underline"
              >
                Project Board
              </Link>
            </li>
            <li>
              <Link
                href="/past-events"
                className="text-cyan-400 hover:underline"
              >
                Past Events
              </Link>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

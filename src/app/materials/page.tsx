"use client";
import { useEffect, useState } from "react";
import { protectRoute } from "@/lib/protectRoute";
import Link from "next/link";
import { motion } from "framer-motion";

// Phase Data
const phases = [
  {
    id: "phase-01",
    title: "Phase 01: Student Support",
    description:
      "Foundation for second-year degree modules. Tailored for Computer Science to Business Management.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=800&q=80",
  },
  {
    id: "phase-02",
    title: "Phase 02: Industry Survivors",
    description:
      "Live Broadcast with industry experts sharing experiences and insights for internship success.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=800&q=80",
  },
  {
    id: "phase-03",
    title: "Phase 03: Industry Survival",
    description:
      "Hands-on workshops for personal development, portfolio building, and interview preparation.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=800&q=80",
  },
];

export default function Events() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    protectRoute(() => setAllowed(true));
  }, []);

  if (!allowed)
    return <div className="text-white">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
        Access Learning Materials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {phases.map((phase) => (
          <Link key={phase.id} href={`/materials/phase/${phase.id}`}>
            <motion.div
              className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="overflow-hidden">
                <img
                  src={phase.imageUrl}
                  alt={phase.title}
                  className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {phase.title}
                </h3>
                <p className="text-gray-400">{phase.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

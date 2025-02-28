/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Register() {
  // Framer Motion variants for smooth fade-in animation
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const generateWhatsAppMessage = () => {
    const formattedMessage =
      `Hello, I need help with my Skill Up 3.0 registration.%0A%0A` +
      `I noticed that registrations are closed, and I have some questions.`;

    return `https://wa.me/94741457706?text=${formattedMessage}`;
  };

  return (
    <div className="max-w-lg mx-auto p-8 rounded-xl shadow-lg space-y-6 mt-20">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
          Skill Up 3.0
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Registrations are closed for Skill Up 3.0.
        </p>
        <p className="mt-2 text-gray-400">
          Stay tuned for future events and updates!
        </p>
      </motion.div>

      {/* Floating WhatsApp Button */}
      <a
        href={generateWhatsAppMessage()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col items-center space-y-1 bg-[#000000a7] p-3"
      >
        <div className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition">
          <Image
            src="/whatsapp-icon.svg"
            alt="WhatsApp"
            className="w-4"
            width={16}
            height={16}
          />
        </div>
        <span className="text-xs text-gray-300 text-center">
          Contact for
          <br />
          more info
        </span>
      </a>
    </div>
  );
}

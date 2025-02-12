"use client";
import { motion } from "framer-motion";

const title = "SKILL UP"; // Fullscreen Title Text

const Hero = () => {
  // Staggered text animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Fullscreen SKILL UP 3.0 Text */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-[58vh] font-bold uppercase leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9d27f1] via-[#6420a4] to-[#9B30FF] select-none hero-title"
      >
        {title.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block cursor-pointer transition-all"
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </section>
  );
};

export default Hero;

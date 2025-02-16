"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const title = "SKILL UP"; // Fullscreen Title Text

const Hero = () => {
  // Staggered text animation with 4 seconds delay
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }, // .5s delay added
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Scroll function
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("about-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="h-[80vh] md:min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-[20vw] md:text-[35vw] font-bold uppercase leading-none tracking-tight bg-gradient-to-r from-[#9d27f1] via-[#6420a4] to-[#9B30FF] text-transparent bg-clip-text select-none hero-title"
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

      {/* Add Register Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3 }} // Match animation timing
        className="mt-8 md:mt-12 z-10"
      >
        <Link
          href="/register"
          className="inline-block bg-gradient-to-r from-[#9d27f1] to-[#2196F3] hover:from-[#2196F3] hover:scale-105 hover:to-[#9d27f1] text-white text-lg md:text-xl font-bold py-3 px-8 md:py-4 md:px-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Register Now
        </Link>
      </motion.div>

      {/* Bouncing Scroll Down Button with Custom Icon */}
      <motion.div
        className="absolute bottom-4 md:bottom-10 cursor-pointer mb-4 md:mb-10"
        onClick={scrollToNextSection}
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 4 }} // 4s delay added
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          stroke="white"
          fill="none"
          strokeWidth={4}
          className="w-12 h-12"
        >
          <circle cx="50" cy="50" r="40" strokeWidth="4" stroke="white" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M35 45l15 15 15-15" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;

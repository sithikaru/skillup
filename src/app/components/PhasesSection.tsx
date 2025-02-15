"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const phases = [
  {
    title: "STUDENT SUPPORT",
    description:
      "Providing a solid foundation for selected second-year degree modules at IIT. This phase is tailored to suit every degree, from Computer Science to Business Management.",
    no: "1",
  },
  {
    title: "INDUSTRY SURVIVORS",
    description:
      "A one-on-one panel discussion where industry experts and recruitment personnel share their experiences and provide insights on how to stand out among hundreds of interns.",
    no: "2",
  },
  {
    title: "INDUSTRY SURVIVAL",
    description:
      "Get a hands-on learning experience from professionals in the field. Focus on personal development, portfolio building, interview preparation, GitHub & LinkedIn setup, and public speaking.",
    no: "3",
  },
];

const PhasesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="phases_wrap relative min-h-screen flex items-center bg-black text-white">
      <div className="container mx-auto px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        
        {/* Left Side - Dynamic Phase Description */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="phases_description max-w-lg"
        >
          <h1 className="text-4xl md:text-8xl font-bold">
            {phases[activeIndex].title}
          </h1>
          <p className="text-base md:text-3xl font-light leading-relaxed mt-4">
            {phases[activeIndex].description}
          </p>
        </motion.div>

        {/* Right Side - Clickable Phase List */}
        <div className="phases_list text-right space-y-6">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              className={`cursor-pointer transition-all duration-300 leading-tight ${
                activeIndex === index
                  ? "text-[#00ffcc]"
                  : "text-white opacity-20 hover:opacity-100"
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.p className="text-xs md:text-sm mb-1">
                ------------------------------------------------------------------------------------ phase {phase.no}
              </motion.p>
              <motion.h2 className="text-3xl md:text-5xl lg:text-7xl font-bold">
                {phase.title}
              </motion.h2>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhasesSection;

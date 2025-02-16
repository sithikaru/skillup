"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";

const teamMembers = [
  { role: "Project Chairperson", name: "Ranuli Sakya", image: "/Ranuli.jpg" },
  { role: "Project Head", name: "Thinuki Weerasinghe", image: "/Thinuki.jpg" },
  { role: "Project Secretary", name: "Monali Sooriarachchi", image: "/Monali.jpg" },
  { role: "Project Secretary", name: "Dewmi Tharunya", image: "/Dewmi.jpg" },
  { role: "Project Treasurer", name: "Dinath Wijesooriya", image: "/Dinath.jpg" },
  { role: "Editor", name: "Deveen Rathnayake", image: "/Deveen.jpg" },
  { role: "IT Director", name: "Sithija Karunasena", image: "/Sithija.jpg" },
];

const AnimatedCard = ({
  children,
  role,
  name,
  image,
}: {
  children?: React.ReactNode;
  role: string;
  name: string;
  image: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative group bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-2xl border border-white/10  p-5 rounded-2xl text-white text-center flex flex-col items-center w-[280px] flex-shrink-0 mx-3 overflow-hidden hover:border-white/20 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <h3 className="text-xl font-bold mt-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
        {name}
      </h3>
      <p className="text-sm text-white/70 mt-2 font-medium">{role}</p>
      {children}
    </motion.div>
  );
};

const ProjectBoard = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchScreen = window.matchMedia("(any-pointer: coarse)").matches;
    if (isTouchScreen) return;

    const handleWheelScroll = (event: WheelEvent) => {
      if (scrollRef.current) {
        event.preventDefault();
        scrollRef.current.scrollLeft += event.deltaY * 1.2;
      }
    };

    const container = scrollRef.current;
    container?.addEventListener("wheel", handleWheelScroll, { passive: false });

    return () => container?.removeEventListener("wheel", handleWheelScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-center py-24 px-4 md:px-8 bg-[#0a0a0a]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }} // Changed from 90 to 0.9
          className="absolute -top-1/4 left-1/4 w-[800px] h-[800px] bg-radial-gradient from-purple-500/10 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 0.5, ease: "easeOut" }} // Changed from 20 to 2
          className="absolute -bottom-1/4 right-1/4 w-[600px] h-[600px] bg-radial-gradient from-pink-500/10 to-transparent rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-500/50 rounded-full"
            style={{
              width: Math.random() * 5000 + 3000 + "px",
              height: Math.random() * 5000 + 3000 + "px",
              left: Math.random() * 1 + "%",
              top: Math.random() * 1 + "%",
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 5, // Changed from 999999999 to 10
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-4xl md:text-6xl font-medium bg-gradient-to-r from-purple-300 via-purple-100 to-purple-300 bg-clip-text text-transparent mb-16"
      >
        Meet the <span className="font-extrabold">Project Board</span>
      </motion.h2>

      {/* Cards container */}
      <div
        ref={scrollRef}
        className="relative z-10 w-full max-w-7xl overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        <motion.div
          className="flex gap-8 py-4 px-4 md:px-8 w-max mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.3 },
            },
          }}
        >
          {teamMembers.map((member, index) => (
            <div key={index}>
              <AnimatedCard
                role={member.role}
                name={member.name}
                image={member.image}
              >
                {member.role === "IT Director" && <span className="text-[1px] text-white/70">The Cool Guy</span>}
              </AnimatedCard>
              
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-12 flex items-center justify-center gap-2 hover:opacity-100 transition-opacity"
      >
        <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-sm text-white font-medium">
          Scroll sideways to explore
        </span>
      </motion.div>
    </section>
  );
};

export default ProjectBoard;

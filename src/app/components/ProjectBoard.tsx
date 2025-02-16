"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  { role: "Project Head (President)", name: "Hashaka Munasinghe", image: "/hashaka.jpg" },
  { role: "Chairperson", name: "Ranuli Sakya", image: "/ranuli.jpg" },
  { role: "Project Head", name: "Thinuki Weerasinghe", image: "/thinuki.jpg" },
  { role: "Secretary", name: "Monali Sooriyaarachchi", image: "/monali.jpg" },
  { role: "Secretary", name: "Dewmi Tharunya", image: "/dewmi.jpg" },
  { role: "Treasurer", name: "Dinath Wijesooriya", image: "/dinath.jpg" },
  { role: "Editor", name: "Deveen Rathnayake", image: "/deveen.jpg" }
];

const AnimatedCard = ({ role, name, image }: { role: string; name: string; image: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.07, backdropFilter: "blur(20px)" }}
      whileTap={{ scale: 0.95 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-4 rounded-2xl text-white text-center flex flex-col items-center w-full max-w-[250px] overflow-hidden"
    >
      <div className="w-full h-56 relative rounded-lg overflow-hidden">
        <Image src={image} alt={name} layout="fill" objectFit="cover" className="rounded-lg" />
      </div>
      <h3 className="text-lg md:text-xl font-bold mt-4">{name}</h3>
      <p className="text-sm md:text-md opacity-80">{role}</p>
    </motion.div>
  );
};

const ProjectBoard = () => {
  return (
    <section
      className="relative h-auto py-20 md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 text-center"
      id="project-board"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-800 to-black opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
      />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-3xl md:text-5xl font-extrabold uppercase leading-snug tracking-tight text-white"
      >
        Meet the <span className="text-purple-300">Project Board</span>
      </motion.h2>

      {/* Team Cards */}
      <motion.div
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
          }
        }}
      >
        {teamMembers.map((member, index) => (
          <AnimatedCard key={index} role={member.role} name={member.name} image={member.image} />
        ))}
      </motion.div>

      {/* Subtle Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-noise opacity-10" />
    </section>
  );
};

export default ProjectBoard;

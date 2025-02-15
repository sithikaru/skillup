/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const phases = [
  {
    title: "STUDENT SUPPORT",
    speakers: [
      {
        name: "Dr. Elena Rodriguez",
        title: "Lead Education Strategist",
        bio: "Pioneer in adaptive learning systems with 15+ years experience shaping curriculum development across European universities. Special focus on AI integration in modern pedagogy.",
        image: "/speakers/elena.jpg",
        isMain: true
      },
      {
        name: "Prof. Michael Chen",
        title: "Cognitive Science Expert",
        bio: "MIT graduate leading research in student engagement patterns. Creator of the popular 'NeuroLearning' framework adopted by 200+ institutions worldwide.",
        image: "/speakers/michael.jpg"
      },
      {
        name: "TBA",
        title: "Industry Leader",
        bio: "",
        image: null
      },
      {
        name: "TBA",
        title: "Tech Innovator",
        bio: "",
        image: null
      }
    ]
  },
  {
    title: "INDUSTRY SURVIVORS",
    speakers: [
      {
        name: "Sarah Johnson",
        title: "Google Lead Recruiter",
        bio: "10-year veteran in tech talent acquisition, responsible for hiring 1000+ engineers across EMEA regions. Specializes in portfolio optimization.",
        image: "/speakers/sarah.jpg"
      },
      {
        name: "James Wilson",
        title: "Microsoft Azure Architect",
        bio: "Cloud infrastructure specialist with 8 patents in distributed systems. Regular keynote speaker at AWS re:Invent and DockerCon.",
        image: "/speakers/james.jpg"
      },
      {
        name: "TBA",
        title: "FAANG Engineer",
        bio: "",
        image: null
      },
      {
        name: "TBA",
        title: "Startup Founder",
        bio: "",
        image: null
      }
    ]
  },
  {
    title: "INDUSTRY SURVIVAL",
    speakers: [
      {
        name: "Emma Williams",
        title: "LinkedIn Top Voice",
        bio: "Career growth strategist with 500k+ followers. Author of 'The Silent Interview' - Amazon #1 bestseller in career guides.",
        image: "/speakers/emma.jpg"
      },
      {
        name: "David Kim",
        title: "GitHub Star Developer",
        bio: "Maintainer of 10+ popular open source projects with 50k+ stars. Created DevHub platform for collaborative coding.",
        image: "/speakers/david.jpg"
      },
    ]
  }
];

const SpeakerCard = ({ speaker, isMain }: { speaker: any; isMain?: boolean }) => (
  <motion.div
    className={`group relative cursor-pointer overflow-hidden rounded-md border-2 ${
      isMain ? "border-[#ff6bff]" : "border-[#6420a4]/50"
    } bg-gradient-to-br from-[#1a0828]/90 to-[#2a0a4a]/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#9d27f1]`}
    whileHover={{ scale: 1.03, rotate: isMain ? 0 : -1 }}
    style={{
      boxShadow: "0 8px 32px rgba(157, 39, 241, 0.15)"
    }}
  >
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gradient-to-br from-[#3f1073] to-[#2196F3]">
      {speaker.image ? (
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={100}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#6420a4] to-[#9d27f1] p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-400">Coming Soon</p>
          <div className="h-1 w-16 animate-pulse bg-gradient-to-r from-[#6420a4] to-[#9d27f1]" />
        </div>
      )}
    </div>

    <motion.div 
      className="mt-6 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className={`text-2xl font-bold ${isMain ? "bg-gradient-to-r from-[#ff6bff] to-[#2196F3] bg-clip-text text-transparent" : "text-white"}`}>
        {speaker.name}
      </h3>
      <p className="text-lg text-gray-300">{speaker.title}</p>
      {speaker.bio && (
        <motion.p
          className="text-md line-clamp-3 text-gray-400 transition-all group-hover:text-gray-200"
          initial={{ maxHeight: 0 }}
          animate={{ maxHeight: 100 }}
        >
          {speaker.bio}
        </motion.p>
      )}
    </motion.div>

    {/* Hover Glow Effect */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#9d27f1]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
  </motion.div>
);

const SpeakersSection = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section className="relative min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center text-5xl font-bold text-white md:text-7xl"
        >
          <span className="bg-gradient-to-r from-[#9d27f1] to-[#2196F3] bg-clip-text text-transparent">
            Featured
          </span> Speakers
        </motion.h2>

        {/* Phase Navigation */}
        <motion.div 
          className="mb-16 flex justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {phases.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePhase(index)}
              className={`relative rounded-full px-8 py-3 text-xl font-semibold transition-all ${
                activePhase === index
                  ? "bg-gradient-to-r from-[#9d27f1] to-[#2196F3] text-white"
                  : "text-gray-400 hover:text-[#9d27f1]"
              }`}
            >
              Phase {index + 1}
              {activePhase === index && (
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-full bg-white/5 blur-md"
                  layoutId="phaseNavBg"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Speakers Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
          >
            {phases[activePhase].speakers.map((speaker, index) => (
              <SpeakerCard
                key={index}
                speaker={speaker}
                isMain={index === 0 && activePhase === 0}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-[#9d27f1]/20 blur-3xl" />
        <div className="absolute right-1/4 top-2/3 h-[400px] w-[400px] animate-pulse-slow rounded-full bg-[#2196F3]/20 blur-3xl" />
      </div>
    </section>
  );
};

export default SpeakersSection;
"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Animated Background Component (Responsive & Full-Width)
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 w-full h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute w-full h-full"
      >
        <motion.path
          fill="#FF4E50"
          animate={{ d: [
              "M0,160 C60,186.7 240,267 360,256 C480,245 600,171 720,160 C840,149 960,203 1080,234.7 C1200,267 1320,277 1380,282.7 L1440,288 V0 H0 Z",
              "M0,160 C60,200 240,290 360,280 C480,270 600,190 720,180 C840,170 960,220 1080,250 C1200,280 1320,290 1380,295 L1440,300 V0 H0 Z",
              "M0,160 C60,186.7 240,267 360,256 C480,245 600,171 720,160 C840,149 960,203 1080,234.7 C1200,267 1320,277 1380,282.7 L1440,288 V0 H0 Z"
            ] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          opacity="0.6"
        />
        <motion.path
          fill="#FC913A"
          animate={{ d: [
              "M0,480 C80,480 320,480 480,453.3 C640,427 800,373 960,373.3 C1120,373 1280,427 1360,453.3 L1440,480 V0 H0 Z",
              "M0,480 C80,500 320,500 480,470 C640,440 800,400 960,400 C1120,400 1280,450 1360,470 L1440,490 V0 H0 Z",
              "M0,480 C80,480 320,480 480,453.3 C640,427 800,373 960,373.3 C1120,373 1280,427 1360,453.3 L1440,480 V0 H0 Z"
            ] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

// Word-by-word text animation (fixes breaking issue)
const AnimatedText = ({ text, scrollProgress }: { text: string; scrollProgress: number }) => {
  return (
    <>
      {text.split(" ").map((word, index) => {
        const wordProgress = index / text.split(" ").length;
        return (
          <motion.span
            key={index}
            animate={{
              opacity: scrollProgress >= 1 ? 1 : wordProgress < scrollProgress ? 1 : 0.3,
              y: scrollProgress >= 1 ? 0 : wordProgress < scrollProgress ? 0 : 20,
            }}
            transition={{ duration: 0.2 }}
            className="inline-block mx-[2px]" // Ensures words remain spaced correctly
          >
            {word}&nbsp;
          </motion.span>
        );
      })}
    </>
  );
};

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress: 0 at top, 1 when reaching the middle of viewport
        const progress = Math.min(Math.max(1 - rect.top / (windowHeight / 2), 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden w-full "
      id="next-section"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Word-by-word Scroll Effect (Fixes Line Break Issues) */}
      <motion.div
        className="relative z-10 max-w-4xl text-3xl md:text-5xl font-bold uppercase tracking-wide leading-loose text-white select-none"
      >
        <AnimatedText
          text="Skill Up 3.0 is a transformative workshop series designed to bridge the gap between academic learning and real-world industry demands."
          scrollProgress={scrollProgress}
        />
      </motion.div>

      {/* Bottom Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="relative z-10 text-xl italic text-gray-300 mt-10"
      >
        &quot;Empowering students for a better future.&quot;
      </motion.p>

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 z-5 bg-noise opacity-10 pointer-events-none" />
    </section>
  );
};

export default About;

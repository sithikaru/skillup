"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedBackground = () => {
  return (
    // A full-bleed container for the SVG background
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 600"
        // Changing preserveAspectRatio to maintain the wave’s aspect ratio
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <motion.path
          fill="#9B5DE5" // Vibrant Purple
          animate={{
            d: [
              "M0,160 C60,186.7 240,267 360,256 C480,245 600,171 720,160 C840,149 960,203 1080,234.7 C1200,267 1320,277 1380,282.7 L1440,288 V0 H0 Z",
              "M0,150 C70,190 250,280 370,270 C490,260 610,180 730,170 C850,160 970,220 1090,250 C1210,280 1330,290 1390,295 L1440,300 V0 H0 Z",
              "M0,160 C60,186.7 240,267 360,256 C480,245 600,171 720,160 C840,149 960,203 1080,234.7 C1200,267 1320,277 1380,282.7 L1440,288 V0 H0 Z"
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
          opacity="0.7"
        />

        <motion.path
          fill="#5A189A" // Deep Purple
          animate={{
            d: [
              "M0,480 C80,480 320,480 480,453.3 C640,427 800,373 960,373.3 C1120,373 1280,427 1360,453.3 L1440,480 V0 H0 Z",
              "M0,470 C90,490 330,510 490,480 C650,450 810,410 970,410 C1130,410 1290,460 1370,480 L1440,500 V0 H0 Z",
              "M0,480 C80,480 320,480 480,453.3 C640,427 800,373 960,373.3 C1120,373 1280,427 1360,453.3 L1440,480 V0 H0 Z"
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          }}
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

// Word-by-word text animation
const AnimatedText = ({
  text,
  scrollProgress
}: {
  text: string;
  scrollProgress: number;
}) => {
  return (
    <>
      {text.split(" ").map((word, index) => {
        const wordProgress = index / text.split(" ").length;
        return (
          <motion.span
            key={index}
            animate={{
              opacity:
                scrollProgress >= 1
                  ? 1
                  : wordProgress < scrollProgress
                  ? 1
                  : 0.3,
              y:
                scrollProgress >= 1
                  ? 0
                  : wordProgress < scrollProgress
                  ? 0
                  : 20
            }}
            transition={{ duration: 0.2 }}
            className="inline-block mx-[2px]"
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

        // Calculate scroll progress: 0 at top, 1 when reaching the middle
        const progress = Math.min(
          Math.max(1 - rect.top / (windowHeight / 2), 0),
          1
        );
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
      className="relative h-auto py-20 md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 text-center"
      id="about-section"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Word-by-word Scroll Effect */}
      <motion.div className="relative z-10 max-w-6xl text-xl md:text-3xl font-extrabold uppercase leading-snug md:leading-loose tracking-tight text-white">
        <AnimatedText
          text="Skill Up 3.0 – Industry Survival is a transformative workshop series by the Leo Club of IIT, bridging the gap between academics and industry demands. Focused on technical, professional, and personal branding skills, it prepares students and young professionals for today’s competitive job market.

Powered by the Leo Club of IIT, a dynamic, award-winning youth organization, this initiative fosters leadership, service, and professional growth, equipping participants with real-world expertise and career opportunities."
          scrollProgress={scrollProgress}
        />
      </motion.div>

      {/* Bottom Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="relative z-10 mt-6 md:mt-10 text-lg md:text-xl italic text-gray-300"
      >
        &quot;Empowering students for a better future.&quot;
      </motion.p>

      {/* Subtle Noise Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-noise opacity-10" />
    </section>
  );
};

export default About;

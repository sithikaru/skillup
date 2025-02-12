"use client";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHidden(currentScrollY > prevScrollY);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    controls.start({ y: hidden ? "-100%" : "0%" });
  }, [hidden, controls]);

  return (
    <motion.nav
      initial={{ y: "-100%" }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/80 text-white z-50 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          SKILL UP 3.0
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {["Home", "About", "Project Board", "Past Events", "Contact"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.1, color: "#0096C7" }}
              whileTap={{ scale: 0.9 }}
            >
              <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-skillup-accent transition">
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-black text-center py-4 space-y-4 md:hidden"
        >
          {["Home", "About", "Project Board", "Past Events", "Contact"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.1, color: "#0096C7" }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="block py-2 text-lg hover:text-skillup-accent"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

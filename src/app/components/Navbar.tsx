"use client";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const controls = useAnimation();
  const [user] = useAuthState(auth);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHidden(currentScrollY > prevScrollY && currentScrollY > 50);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  // Animate navbar
  useEffect(() => {
    controls.start({ y: hidden ? "-100%" : "0%" });
  }, [hidden, controls]);

  // Close menu when navbar hides
  useEffect(() => {
    if (hidden) setIsOpen(false);
  }, [hidden]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: "-100%" }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/80 text-white z-50 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent"
        >
          SKILL UP 3.0
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="px-3 py-2 hover:text-purple-400 transition">
              Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/about-us" className="px-3 py-2 hover:text-purple-400 transition">
              About Us
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/materials" className="px-3 py-2 hover:text-purple-400 transition">
              Access Learning Materials
            </Link>
          </motion.div>

          {/* Auth Links */}
          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/login" className="px-3 py-2 hover:text-purple-400 transition">
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/register" className="px-3 py-2 hover:text-purple-400 transition">
                  Register
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <span className="px-3 py-2 text-purple-400">
                  {user.displayName || user.email || "User"}
                </span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <button
                  onClick={() => auth.signOut()}
                  className="px-3 py-2 hover:text-red-400 transition"
                >
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 w-full bg-black/90 text-center py-4 space-y-4 md:hidden"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/"
              className="block py-3 text-lg hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/about-us"
              className="block py-3 text-lg hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/materials"
              className="block py-3 text-lg hover:text-purple-400"
              onClick={() => setIsOpen(false)}
            >
              Access Learning Materials
            </Link>
          </motion.div>

          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/login"
                  className="block py-3 text-lg hover:text-purple-400"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/register"
                  className="block py-3 text-lg hover:text-purple-400"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <span className="block py-3 text-lg text-purple-400">
                  {user.displayName || user.email || "User"}
                </span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="block py-3 text-lg hover:text-red-400 w-full"
                >
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
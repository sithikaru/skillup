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
        {/* Logo with Purple Gradient */}
        <Link href="/" className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
          SKILL UP 3.0
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="hover:text-purple-400 transition">
              Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/materials" className="hover:text-purple-400 transition">
              Access Learning Materials
            </Link>
          </motion.div>

          {/* Authentication Links */}
          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/login" className="hover:text-purple-400 transition">
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/register" className="hover:text-purple-400 transition">
                  Register
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <span className="text-purple-400">{user.displayName || "User"}</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <button onClick={() => auth.signOut()} className="hover:text-red-400 transition">
                  Logout
                </button>
              </motion.div>
            </>
          )}
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
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="/" className="block py-2 text-lg hover:text-purple-400" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="/about-us" className="block py-2 text-lg hover:text-purple-400" onClick={() => setIsOpen(false)}>
              About Us
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="/materials" className="block py-2 text-lg hover:text-purple-400" onClick={() => setIsOpen(false)}>
              Access Learning Materials
            </Link>
          </motion.div>

          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link href="/login" className="block py-2 text-lg hover:text-purple-400" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link href="/register" className="block py-2 text-lg hover:text-purple-400" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.1 }}>
                <span className="block py-2 text-lg text-purple-400">{user.displayName || "User"}</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <button onClick={() => auth.signOut()} className="block py-2 text-lg hover:text-red-400">
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

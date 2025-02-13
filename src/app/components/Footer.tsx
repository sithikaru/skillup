"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-black text-gray-400 py-6 border-t border-gray-700"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">Skill Up 3.0</h2>
          <p className="text-gray-500 text-sm">Industry Survival by Leo Club of IIT</p>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col md:flex-row md:space-x-6 text-center md:text-left mt-4 md:mt-0">
          <p className="flex items-center space-x-2">
            <FaEnvelope className="text-skillup-accent" />
            <Link href="mailto:skillup3.0leoiit@gmail.com" className="hover:text-skillup-accent transition">
              skillup3.0leoiit@gmail.com
            </Link>
          </p>
          <p className="flex items-center space-x-2">
            <FaEnvelope className="text-skillup-accent" />
            <Link href="mailto:leoclub@iit.ac.lk" className="hover:text-skillup-accent transition">
              leoclub@iit.ac.lk
            </Link>
          </p>
        </div>

        {/* Social Links with Icons */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-skillup-accent transition">
            <FaFacebook size={24} />
          </Link>
          <Link href="#" className="hover:text-skillup-accent transition">
            <FaInstagram size={24} />
          </Link>
          <Link href="#" className="hover:text-skillup-accent transition">
            <FaLinkedin size={24} />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-600 text-sm text-center md:text-right mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} Skill Up 3.0. All Rights Reserved.<br/>
          Site by <Link href="https://www.linkedin.com/in/sithija-karunasena/" className="text-skillup-accent hover:underline">Sithija Karunasena</Link>
        </p>

      </div>
    </motion.footer>
  );
};

export default Footer;

"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-black text-gray-400 py-10 text-center border-t border-gray-700"
    >
      <div className="container mx-auto px-6">
        {/* Skill Up Branding */}
        <h2 className="text-3xl font-bold text-white">Skill Up 3.0</h2>
        <p className="mt-2 text-gray-500">Industry Survival by Leo Club of IIT</p>

        {/* Contact Information */}
        <div className="mt-6 space-y-2">
          <p>Email: <Link href="mailto:skillup3.0leoiit@gmail.com" className="text-skillup-accent hover:underline">skillup3.0leoiit@gmail.com</Link></p>
          <p>Leo Club of IIT: <Link href="mailto:leoclub@iit.ac.lk" className="text-skillup-accent hover:underline">leoclub@iit.ac.lk</Link></p>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex justify-center space-x-6">
          <Link href="#" className="hover:text-skillup-accent transition">Facebook</Link>
          <Link href="#" className="hover:text-skillup-accent transition">Instagram</Link>
          <Link href="#" className="hover:text-skillup-accent transition">LinkedIn</Link>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Skill Up 3.0. All Rights Reserved.<br/>
          Site by <Link href="https://www.linkedin.com/in/sithija-karunasena/" className="text-skillup-accent hover:underline">Sithija Karunasena</Link>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;

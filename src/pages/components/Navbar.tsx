import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const mobileMenuVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      borderBottom: "1px solid rgba(156, 163, 175, 0)",
      transition: {
        height: { duration: 0.4 },
        opacity: { duration: 0.3 },
      }
    },
    show: {
      height: "auto",
      opacity: 1,
      borderBottom: "1px solid rgba(156, 163, 175, 0.4)",
      transition: {
        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4, ease: "easeOut" },
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      borderBottom: "1px solid rgba(156, 163, 175, 0)",
      transition: {
        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3 },
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <nav className="w-full font-inter bg-black text-white shadow-sm md:border-b border-gray-400 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="object-fill w-40 hover:scale-105 transition-transform" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="/contest"
            className="text-gray-300 hover:text-green-600 transition-colors font-medium"
          >
            Contest
          </a>
          <a
            href="/leaderboard"
            className="text-gray-300 hover:text-green-600 transition-colors font-medium"
          >
            Leaderboard
          </a>
          <Button className="bg-green-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-green-700 transition-colors">
            Login
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="mobileMenu"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4">
              <motion.a
                variants={mobileItemVariants}
                href="/contest"
                className="block text-white hover:text-gray-400 font-medium px-2"
              >
                Contest
              </motion.a>
              <motion.a
                variants={mobileItemVariants}
                href="/leaderboard"
                className="block text-white hover:text-gray-400 font-medium px-2"
              >
                Leaderboard
              </motion.a>
              <motion.div variants={mobileItemVariants} className="px-2">
                <Button className="w-full bg-green text-white font-semibold px-5 py-2 rounded-full hover:bg-green transition-colors">
                  Login
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

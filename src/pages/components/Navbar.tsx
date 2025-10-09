<<<<<<< HEAD
import { useState } from "react";
=======
import React, { useState } from "react";
>>>>>>> efd5450 (Landing Page)
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const mobileMenuVariants = {
<<<<<<< HEAD
    hidden: {
=======
    hidden: { 
>>>>>>> efd5450 (Landing Page)
      height: 0,
      opacity: 0,
      borderBottom: "1px solid rgba(156, 163, 175, 0)",
      transition: {
<<<<<<< HEAD
        height: { duration: 0.8 },
        opacity: { duration: 0.3 },
      },
=======
        height: { duration: 0.4 },
        opacity: { duration: 0.3 },
      }
>>>>>>> efd5450 (Landing Page)
    },
    show: {
      height: "auto",
      opacity: 1,
      borderBottom: "1px solid rgba(156, 163, 175, 0.4)",
      transition: {
<<<<<<< HEAD
        height: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4, ease: "easeOut" },
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
=======
        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4, ease: "easeOut" },
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
>>>>>>> efd5450 (Landing Page)
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
<<<<<<< HEAD
        staggerDirection: -1,
      },
    },
=======
        staggerDirection: -1
      }
    }
>>>>>>> efd5450 (Landing Page)
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
<<<<<<< HEAD
    exit: { opacity: 0, y: -10 },
  };

  const desktopFade = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.nav
      className="w-full font-dm-sans bg-black text-white shadow-sm md:border-b border-gray-400 px-4 sm:px-6 py-3"
      initial="hidden"
      animate="show"
      variants={desktopFade}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="Logo"
              className="object-fill w-40 hover:scale-105 transition-transform"
            />
=======
    exit: { opacity: 0, y: -10 }
  };

  return (
    <nav className="w-full font-inter bg-black text-white shadow-sm md:border-b border-gray-400 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="object-fill w-40 hover:scale-105 transition-transform" />
>>>>>>> efd5450 (Landing Page)
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
<<<<<<< HEAD
            <div className="py-8 space-y-4">
=======
            <div className="py-4 space-y-4">
>>>>>>> efd5450 (Landing Page)
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
<<<<<<< HEAD
    </motion.nav>
=======
    </nav>
>>>>>>> efd5450 (Landing Page)
  );
}

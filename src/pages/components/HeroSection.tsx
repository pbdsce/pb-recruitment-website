import { motion } from "framer-motion";
import bg from "@/assets/Bg.png";

export default function HeroSection() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.4,
      },
    },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 80 },
    show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.6, ease: "easeOut" } },
  };

  return (
    <section className="relative w-full h-screen flex items-center font-inter justify-center overflow-hidden">
      <motion.img
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="absolute z-0 inset-0 w-full h-full object-cover"
        src={bg}
        alt="Background"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black opacity-60" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
      >
        <motion.h1 variants={slideUp} className="text-beige font-anton text-5xl md:text-8xl font-extrabold leading-snug drop-shadow-lg mb-4">
          READY, SET <br /> RECRUIT!
        </motion.h1>
        <motion.p variants={slideUp} className="text-gray-300 text-lg md:text-2xl font-medium mb-8 drop-shadow-md">
          Challenge yourself, prove your skills, make it count.
        </motion.p>
        <motion.button
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="bg-green text-black font-semibold px-8 py-3 rounded-full text-lg shadow-md hover:bg-green-600 transition-colors"
        >
          Login / Register
        </motion.button>
      </motion.div>
    </section>
  );
}

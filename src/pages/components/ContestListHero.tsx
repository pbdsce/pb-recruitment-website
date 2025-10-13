import React from "react";
import { motion } from "framer-motion";

const ContestListHero: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-4 md:px-8 text-center border-b border-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-anton text-beige mb-4">
          Active Contests
        </h1>
        <p className="text-gray-300 text-lg md:text-xl">
          Challenge yourself with our recruitment contests. Prove your skills and compete with top talent.
        </p>
      </motion.div>
    </section>
  );
};

export default ContestListHero;
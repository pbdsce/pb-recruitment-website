import React from "react";
import { motion } from "framer-motion";
import type { ContestDetail } from "../../data/contestsData";

interface ContestHeroProps {
  contest: ContestDetail;
}

const ContestHero: React.FC<ContestHeroProps> = ({ contest }) => {
  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative w-full py-16 px-4 md:px-8 border-b border-gray-700 bg-gradient-to-b from-green-950/20 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Main Info */}
          <motion.div variants={slideUp} className="md:col-span-2">
            <h1 className="text-4xl md:text-5xl font-anton text-beige mb-4 leading-tight">
              {contest.name}
            </h1>
            <p className="text-gray-300 text-lg mb-6">{contest.description}</p>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div
            variants={slideUp}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 h-fit"
          >
            <h3 className="text-xl font-bold mb-6 text-beige">Quick Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Duration</p>
                <p className="text-white font-semibold text-lg">{contest.duration}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Registration</p>
                <p className="text-white font-semibold text-lg">
                {contest.registrationOpen ? "Open" : "Closed"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContestHero;
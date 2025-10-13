import React from "react";
import { motion } from "framer-motion";
import type { ContestDetail } from "../../data/contestsData";

interface ContestHeroProps {
  contest: ContestDetail;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "Hard":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

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
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm font-semibold bg-green-900/40 border border-green-500/50 text-green-300 px-3 py-1 rounded-full">
                {contest.domain}
              </span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                  contest.registrationOpen
                    ? "bg-green-900/30 border-green-500/50 text-green-400"
                    : "bg-red-900/30 border-red-500/50 text-red-400"
                }`}
              >
                {contest.registrationStatus}
              </span>
            </div>
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
                <p className="text-gray-400 text-sm mb-1">Problems</p>
                <p className="text-white font-semibold text-lg">{contest.problemCount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Difficulty</p>
                <p className={`font-semibold text-lg ${getDifficultyColor(contest.difficulty)}`}>
                  {contest.difficulty}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Participants</p>
                <p className="text-white font-semibold text-lg">{contest.participants}+</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContestHero;
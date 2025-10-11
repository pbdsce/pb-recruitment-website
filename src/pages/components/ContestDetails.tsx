import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Zap } from "lucide-react";
import type { ContestDetail } from "../../data/contestsData";

interface ContestDetailsProps {
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

const ContestDetails: React.FC<ContestDetailsProps> = ({ contest }) => {
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
    <section className="w-full px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <motion.div variants={slideUp} className="md:col-span-2">
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-anton text-beige mb-4 flex items-center gap-2">
                  <Zap className="text-green-400" size={24} />
                  About This Contest
                </h2>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {contest.fullDescription}
                </p>
              </div>

              {/* Rules */}
              <div>
                <h2 className="text-2xl font-anton text-beige mb-4">Contest Rules</h2>
                <ul className="space-y-3">
                  {contest.rules.map((rule, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-3 text-gray-300"
                    >
                      <span className="text-green-400 font-bold flex-shrink-0 mt-1">•</span>
                      <span>{rule}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={slideUp} className="space-y-6">
            {/* Eligibility */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-beige mb-3">Eligibility</h3>
              <p className="text-gray-300 text-sm">{contest.eligibility}</p>
            </div>

            {/* Key Stats */}
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-green-500/50 transition-colors">
                <Clock className="text-green-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="font-semibold text-white">{contest.duration}</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-green-500/50 transition-colors">
                <Users className="text-blue-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-xs text-gray-400">Participants</p>
                  <p className="font-semibold text-white">{contest.participants}+</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-green-500/50 transition-colors">
                <Zap className="text-yellow-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-xs text-gray-400">Difficulty</p>
                  <p className={`font-semibold ${getDifficultyColor(contest.difficulty)}`}>
                    {contest.difficulty}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContestDetails;
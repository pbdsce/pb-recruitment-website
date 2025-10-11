import React from "react";
import { motion } from "framer-motion";

interface ContestFiltersProps {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

const difficulties = ["All", "Easy", "Hard"];

const ContestFilters: React.FC<ContestFiltersProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  return (
    <section className="w-full px-4 md:px-8 py-8 border-b border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div>
          {/* Difficulty Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Filter by Difficulty
            </h3>
            <div className="flex flex-wrap gap-3">
              {difficulties.map((diff) => (
                <motion.button
                  key={diff}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDifficultyChange(diff)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all border ${
                    selectedDifficulty === diff
                      ? "bg-green border-green text-black"
                      : "bg-transparent border-gray-600 text-gray-300 hover:border-green hover:text-green"
                  }`}
                >
                  {diff}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContestFilters;
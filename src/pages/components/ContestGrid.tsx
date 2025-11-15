import React from "react";
import { motion } from "framer-motion";
import ContestCard from "./ContestCard";
import type { Contest } from "@/models/contest";

interface ContestGridProps {
  contests: Contest[];
  onContestClick: (contestId: string) => void;
}

const ContestGrid: React.FC<ContestGridProps> = ({ contests, onContestClick }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="flex-grow w-full px-4 md:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {contests.length > 0 ? (
            contests.map((contest) => (
              <motion.div key={contest.id} variants={itemVariants}>
                <ContestCard
                  contest={contest}
                  onClick={() => onContestClick(contest.id)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12"
            >
              <p className="text-gray-400 text-lg">
                No contests found matching your filters.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContestGrid;
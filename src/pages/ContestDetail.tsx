import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ContestHero from "./components/ContestHero";
import ContestTimeline from "./components/ContestTimeline";
import ContestDetails from "./components/ContestDetails";
import  { contestsDetailData } from "../data/contestsData";

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const contest = id ? contestsDetailData[id] : null;

  if (!contest) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-anton text-beige mb-4">
              Contest Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              The contest you're looking for doesn't exist.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contests")}
              className="bg-green text-black font-semibold px-8 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ChevronLeft size={20} />
              Back to Contests
            </motion.button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Back Button */}
      <div className="w-full px-4 md:px-8 pt-6">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate("/contests")}
          className="flex items-center gap-2 text-green hover:text-green-400 transition-colors font-semibold"
        >
          <ChevronLeft size={20} />
          Back to Contests
        </motion.button>
      </div>

      <ContestHero contest={contest} />
      <ContestTimeline contest={contest} />
      <ContestDetails contest={contest} />

      <Footer />
    </div>
  );
};

export default ContestDetail;
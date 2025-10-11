import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ContestListHero from "./components/ContestListHero";
import ContestFilters from "./components/ContestFilters";
import ContestGrid from "./components/ContestGrid";
import { contestsListData } from "../data/contestsData";

const ContestList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const filteredContests = contestsListData.filter((contest) => {
    const difficultyMatch =
      selectedDifficulty === "All" || contest.difficulty === selectedDifficulty;
    return difficultyMatch;
  });

  const handleContestClick = (contestId: string) => {
    navigate(`/contest/${contestId}`);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <ContestListHero />
      <ContestFilters
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
      />
      <ContestGrid
        contests={filteredContests}
        onContestClick={handleContestClick}
      />
      <Footer />
    </div>
  );
};

export default ContestList;
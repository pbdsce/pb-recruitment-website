import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ContestListHero from "./components/ContestListHero";
import ContestGrid from "./components/ContestGrid";
import { contestsListData } from "../data/contestsData";

const ContestList: React.FC = () => {
  const navigate = useNavigate();
  const handleContestClick = (contestId: string) => {
    navigate(`/contest/${contestId}`);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <ContestListHero />
      <ContestGrid
        contests={contestsListData}
        onContestClick={handleContestClick}
      />
      <Footer />
    </div>
  );
};

export default ContestList;
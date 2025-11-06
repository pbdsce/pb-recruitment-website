import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import AdminHero from "./components/AdminHero";
import ContestManager from "./components/ContestManager";
import { contestsListData } from "../data/contestsData";

const Admin: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);

  // Initialize with existing contests data
  useEffect(() => {
    // Convert the contest data to the format expected by ContestManager
    const formattedContests = contestsListData.map((contest) => ({
      id: contest.id,
      name: contest.name,
      // Parse the date strings and convert to timestamps
      registrationStartTime: Math.floor(new Date("2025-10-25 09:00 AM").getTime() / 1000),
      registrationEndTime: Math.floor(new Date(contest.startTime).getTime() / 1000) - 300, // 5 mins before start
      startTime: Math.floor(new Date(contest.startTime).getTime() / 1000),
      endTime: Math.floor(new Date(contest.endTime).getTime() / 1000),
      eligibleTo: contest.id === "first-years" ? "1st Year" : "2nd & 3rd Year",
    }));
    setContests(formattedContests);
  }, []);

  return (
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      <Navbar />
      <AdminHero />
      
      <div className="flex-grow container mx-auto px-4 py-4">
        <ContestManager
          contests={contests}
          setContests={setContests}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
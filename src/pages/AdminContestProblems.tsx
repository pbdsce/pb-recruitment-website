import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ProblemManager from "./components/ProblemManager";
import { contestsDetailData } from "../data/contestsData";

const AdminContestProblems: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const [contestName, setContestName] = useState<string>("");

  useEffect(() => {
    if (contestId && contestsDetailData[contestId]) {
      setContestName(contestsDetailData[contestId].name);
    }
  }, [contestId]);

  if (!contestId) {
    return (
      <div className="bg-black text-gray-300 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-400">Contest ID is required</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Admin Dashboard
        </button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Manage Problems</h1>
          <p className="text-gray-400">
            Contest: <span className="text-green-400">{contestName || contestId}</span>
          </p>
        </div>

        {/* Problem Manager */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <ProblemManager />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminContestProblems;

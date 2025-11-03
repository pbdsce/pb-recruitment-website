import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import AdminHero from "./components/AdminHero";
import ContestManager from "./components/ContestManager";
import ProblemManager from "./components/ProblemManager";
import ContestantManager from "./components/ContestantManager";

const Admin: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"problems" | "contestants">("problems");
  // Store problems by contestId
  const [problemsByContest, setProblemsByContest] = useState<{ [key: string]: any[] }>({});
  // Store contestants by contestId
  const [contestantsByContest, setContestantsByContest] = useState<{ [key: string]: any[] }>({});

  // Handler to update problems for a contest
  const handleUpdateProblems = (contestId: string, problems: any[]) => {
    setProblemsByContest(prev => ({
      ...prev,
      [contestId]: problems
    }));
  };

  // Update contestants for a specific contest
  const handleUpdateContestants = (contestId: string, contestants: any[]) => {
    setContestantsByContest(prev => ({
      ...prev,
      [contestId]: contestants
    }));
  };

  // When a contest is deleted, also remove its problems and clear selection if needed
  const handleDeleteContestCascade = (contestId: string) => {
    setProblemsByContest(prev => {
      const { [contestId]: _, ...rest } = prev;
      return rest;
    });
    setContestantsByContest(prev => {
      const { [contestId]: __, ...rest } = prev;
      return rest;
    });
    if (selectedContest === contestId) {
      setSelectedContest(null);
      setActiveTab("problems");
    }
  };

  return (
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      <Navbar />
      <AdminHero />
      
  <div className="flex-grow container mx-auto px-4 py-4">
        <ContestManager
          contests={contests}
          setContests={setContests}
          onSelectContest={setSelectedContest}
          onDeleteContest={handleDeleteContestCascade}
        />

        {selectedContest && (
          <div className="mt-8">
            {/* Tabs */}
            <div className="bg-gray-900 border border-gray-800 rounded-t-lg">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab("problems")}
                  className={`px-6 py-4 font-semibold transition-all duration-200 ${
                    activeTab === "problems"
                      ? "bg-green-900/50 text-green-400 border-b-2 border-green-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  Manage Problems
                </button>
                <button
                  onClick={() => setActiveTab("contestants")}
                  className={`px-6 py-4 font-semibold transition-all duration-200 ${
                    activeTab === "contestants"
                      ? "bg-green-900/50 text-green-400 border-b-2 border-green-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  View Contestants
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900 border border-gray-800 border-t-0 rounded-b-lg p-6">
              {activeTab === "problems" && (
                <ProblemManager
                  contestId={selectedContest}
                  problems={problemsByContest[selectedContest] || []}
                  setProblems={problems => handleUpdateProblems(selectedContest, problems)}
                />
              )}
              {activeTab === "contestants" && (
                <ContestantManager
                  contestId={selectedContest}
                  contestants={contestantsByContest[selectedContest] || []}
                  setContestants={(list) => handleUpdateContestants(selectedContest, list)}
                />
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
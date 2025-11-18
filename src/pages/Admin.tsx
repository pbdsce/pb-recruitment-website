import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import AdminHero from "./components/AdminHero";
import ContestManager from "./components/ContestManager";
import type { Contest } from "@/models/contest";
import { adminApi } from "@/services/api/adminApi";
import { toast } from "react-toastify";

const Admin: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getContestsList();
        setContests(response as Contest[]);
      } catch (error) {
        toast.error("Error fetching contests. Please try again later. If problem persists, contact volunteers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      <Navbar />
      <AdminHero />

      <div className="flex-grow container mx-auto px-4 py-4">
        {
          isLoading ? (
            <p>Loading contests...</p>
          ): (
            <ContestManager
              contests = { contests }
              setContests = { setContests }
            />
          )
        }
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
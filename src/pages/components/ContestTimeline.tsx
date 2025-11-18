import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Contest } from "@/models/contest";
import { contestApi } from "@/services/api/contestApi";
import { Popup } from "@/components/ui/popup";
import { getAuth } from "firebase/auth";

interface ContestTimelineProps {
  contest: Contest;
}

const ContestTimeline: React.FC<ContestTimelineProps> = ({ contest }) => {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = React.useState<boolean>(
    contest.is_registered ?? false
  );
  const [popup, setPopup] = useState<{
      isOpen: boolean;
      type: "success" | "error";
      message: string;
    }>({
      isOpen: false,
      type: "error",
      message: "",
    });

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

  useEffect(() => {
    setIsRegistered(contest.is_registered ?? false);
  }, [contest.id, contest.is_registered]);

  const handleRegister = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await contestApi.registerForContest(contest.id);
      setIsRegistered(true);
      setPopup({
        isOpen: true,
        type: "success",
        message: "Successfully registered for the contest!",
      });
      } catch (err: any) {
        let message = "Failed to register. Please try again.";

        if (err?.response?.status) {
          switch (err.response.status) {
            case 403:
              message =
                err.response.data?.error ||
                "Registration is closed or you are not eligible.";
              break;

            case 404:
              message =
                err.response.data?.error || "Contest or user not found.";
              break;

            case 409:
              message = "You are already registered.";
              setIsRegistered(true);
              break;

            case 500:
              message = "Server error. Please try again later.";
              break;

            default:
              message = "Unexpected error occurred.";
          }
        }

        setPopup({
          isOpen: true,
          type: "error",
          message,
        });
      }
    };

    
  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <section className="w-full px-4 md:px-8 py-12 border-b border-gray-700">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Contest Timeline */}
          <motion.div variants={slideUp}>
            <h2 className="text-2xl font-anton text-beige mb-6">Contest Timeline</h2>
            <div className="space-y-4 relative">
              {/* Background vertical line */}
              <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-gray-600" style={{ height: "100%" }} /> 
              {/* Dynamic, sorted timeline */}
                {(() => {
                // Timeline events array
                const timelineEvents = [
                    { label: "Starts at", time: new Date(contest.start_time).toLocaleString('en-IN'), color: "bg-green-400" },
                    { label: "Registration closes at", time: new Date(contest.registration_end_time).toLocaleString('en-IN'), color: "bg-yellow-400" },
                    { label: "Ends at", time: new Date(contest.end_time).toLocaleString('en-IN'), color: "bg-red-400" },
                ];

                // Sort by actual time
                timelineEvents.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

                // Render
                return (
                    <div className="space-y-4 relative">
                    {/* Background vertical line */}
                    <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-gray-600" style={{ height: "100%" }} />

                    {timelineEvents.map((event, index) => (
                        <div key={index} className="flex gap-4 items-start relative z-10">
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-4 h-4 rounded-full border-4 border-gray-900 ${event.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">{event.label}</p>
                            <p className="text-white font-semibold text-lg">{event.time}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                );
                })()}
            </div>
          </motion.div>

          {/* Registration Card */}
          <motion.div
            variants={slideUp}
            className="bg-gradient-to-br from-green-950/40 to-green-900/20 border border-green-500/40 rounded-xl p-8"
          >
            <h2 className="text-2xl font-anton text-beige mb-4">Ready to compete?</h2>
            <p className="text-gray-300 mb-6">
              {contest.isRegistrationOpen()
                ? "Register now and secure your spot in this exciting contest!"
                : "Registration for this contest has closed."}
            </p>
            <motion.button
              whileHover={contest.isRegistrationOpen() ? { scale: 1.05 } : {}}
              whileTap={contest.isRegistrationOpen() ? { scale: 0.95 } : {}}
              onClick={handleRegister}
              disabled={!contest.isRegistrationOpen()}
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2
                ${
                  !contest.isRegistrationOpen() || isRegistered
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-green text-black hover:bg-green-600"
                }
              `}
            >
              {!contest.isRegistrationOpen()
                ? "Registration Closed"
                : isRegistered
                ? "Already Registered"
                : "Register"
              }
              {contest.isRegistrationOpen() && <ChevronRight size={20} />}
            </motion.button>
            {contest.isRegistrationOpen() && (
              <p className="text-xs text-gray-400 mt-4 text-center">
                Free to register
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        message={popup.message}
        autoCloseDelay={popup.type === "success" ? 2000 : 5000}
      />
    </section>
  );
};

export default ContestTimeline;
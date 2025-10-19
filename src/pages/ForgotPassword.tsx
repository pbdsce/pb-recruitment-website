import React, { useState } from "react";
import { resetPassword } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import { motion } from "framer-motion";
import { Popup } from "../components/ui/popup";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "error",
    message: "",
  });

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);

    if (res.success) {
      setPopup({
        isOpen: true,
        type: "success",
        message: "Password reset email sent. Check your inbox.",
      });
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setPopup({
        isOpen: true,
        type: "error",
        message: res.message || "Failed to send reset email.",
      });
    }
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm-sans">
      <Navbar />

      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="border-green border rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-medium text-white mb-2 font-anton tracking-wider">
                Forgot Password?
              </h2>
              <p className="text-gray-400">
                Enter your registered email and we’ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-green-500 hover:text-green-400 font-medium transition-colors"
                >
                  Go back to login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />

      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        message={popup.message}
        autoCloseDelay={popup.type === "success" ? 2000 : 5000}
      />
    </div>
  );
};

export default ForgotPassword;
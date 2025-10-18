import React, { useState, useEffect } from "react";
import { signUpUser, type SignUpData } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import { motion } from "framer-motion";
import { Popup } from "../components/ui/popup";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../lib/firebase";


export const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignUpData & { confirmPassword: string }>({
    name: "",
    id: "",
    email: "",
    mobile: "",
    joiningYear: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });

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

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    id?: string;
    mobile?: string;
  }>({});

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);
  const validateUSN = (usn: string) => /^1DS[A-Z0-9]{7}$/i.test(usn);
  const validatePassword = (password: string) => /^.{6,}$/.test(password);

  const isFirstYear = formData.joiningYear === "1st year";

  const checkEmailExists = async (email: string) => {
    email = email.trim().toLowerCase();
    if (!validateEmail(email)) return false;
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.mobile && !validateMobile(formData.mobile)) {
        setErrors(prev => ({ ...prev, mobile: "Mobile number must be 10 digits" }));
      } else {
        setErrors(prev => ({ ...prev, mobile: undefined }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.mobile]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.password && !validatePassword(formData.password)) {
        setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
      } else {
        setErrors(prev => ({ ...prev, password: undefined }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.password]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (!formData.id || isFirstYear) {
      setErrors(prev => ({ ...prev, id: undefined }));
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!validateUSN(formData.id)) {
        setErrors(prev => ({
          ...prev,
          id: "USN must start with 1DS and have 10 characters (e.g., 1DS24CG019)"
        }));
      } else {
        setErrors(prev => ({ ...prev, id: undefined }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.id, isFirstYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email (example: xxx@xxx.com)";
    if (!validateMobile(formData.mobile)) newErrors.mobile = "Mobile number must be 10 digits";
    if (!isFirstYear && !validateUSN(formData.id)) newErrors.id = "USN must start with 1DS and have 10 characters (e.g., 1DS24CG019)";
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (await checkEmailExists(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Email already exists" }));
      return;
    }

    try {
      setLoading(true);
      await signUpUser(formData);
      
      setPopup({
        isOpen: true,
        type: "success",
        message: "Account created! Redirecting...",
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
       let message = "Signup failed. Please try again.";

      if (err?.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            message = "Email already exists";
            break;
          case "auth/invalid-email":
            message = "Invalid email";
            break;
          case "auth/weak-password":
            message = "Password too weak";
            break;
          default:
            message = "Signup failed. Please try again.";
        }
      }

      setPopup({
        isOpen: true,
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setPopup(prev => ({ ...prev, isOpen: false }));

  return (
    <div className="min-h-screen bg-black text-white font-dm-sans">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-2xl">
          <div className="border border-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-medium font-anton tracking-wider text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join us and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name:</label>
                  <input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="joiningYear" className="block text-sm font-medium text-gray-300">Year of Study:</label>
                  <select id="joiningYear" name="joiningYear" value={formData.joiningYear} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200">
                    <option value="">Select Year of Study</option>
                    <option value="1st year">1st year</option>
                    <option value="2nd year">2nd year</option>
                    <option value="3rd year">3rd year</option>
                    <option value="4th year">4th year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="id" className="block text-sm font-medium text-gray-300">{isFirstYear ? "Application Number:" : "USN:"}</label>
                {errors.id && <p className="text-red-500 text-sm font-dm-sans">{errors.id}</p>}
                <input id="id" name="id" value={formData.id} onChange={handleChange} required
                  placeholder={isFirstYear ? "Enter application number" : "Enter USN (e.g., 1DS24CS000)"}
                  className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.id ? 'border-red-500' : 'border-white'}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email:</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email"
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-white'}`} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">Mobile Number:</label>
                  <input id="mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile number"
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.mobile ? 'border-red-500' : 'border-white'}`} />
                  {errors.mobile && <p className="text-red-500 text-sm font-dm-sans">{errors.mobile}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="branch" className="block text-sm font-medium text-gray-300">Branch:</label>
                <input id="branch" name="branch" value={formData.branch} onChange={handleChange} required placeholder="Enter your branch"
                  className="w-full px-4 py-3 border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password:</label>
                  <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Enter password"
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-white'}`} />
                  {errors.password && <p className="text-red-500 text-sm font-dm-sans">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password:</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password"
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : 'border-white'}`} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm font-dm-sans">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-green-500 hover:text-green-400 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />

      <Popup isOpen={popup.isOpen} onClose={closePopup} type={popup.type} message={popup.message} autoCloseDelay={popup.type === "success" ? 2000 : 5000} />
    </div>
  );
};

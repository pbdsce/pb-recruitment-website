import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
  autoCloseDelay?: number;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  type,
  message,
  autoCloseDelay = 5000,
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  const getIcon = () => {
    if (type === "success") {
      return <CheckCircle className="w-6 h-6 text-green" />;
    }
    return <AlertCircle className="w-6 h-6 text-red-500" />;
  };

  const getBorderColor = () => {
    return type === "success" ? "border-green-500" : "border-red-500";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`bg-black border-2 ${getBorderColor()} rounded-2xl p-6 max-w-md w-full shadow-2xl`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 font-dm-sans">
                  {type === "success" ? "Success" : "Error"}
                </h3>
                <p className="text-gray-300 font-dm-sans">
                  {message}
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
        type === "success" ? "bg-neon-green/20" : "bg-red-500/20"
      }`}
    >
      <span className={type === "success" ? "text-neon-green" : "text-red-400"}>
        {message}
      </span>
      <button onClick={onClose} className="text-light-gray hover:text-white">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MealDetailsModalProps {
  meal: any;
  isOpen: boolean;
  onClose: () => void;
}

const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-dark-secondary rounded-xl max-w-2xl w-full p-6 relative"
          >
            {/* Gamified content here */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-light-gray hover:text-neon-blue"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MealDetailsModal;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface VoiceCommandModalProps {
  isOpen: boolean;
  voiceLevel: number;
  timeoutProgress: number;
  onClose: () => void;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  voiceLevel,
  timeoutProgress,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
        >
          <motion.div
            className="bg-dark-secondary/90 rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            {/* Circular Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                className="text-neon-blue/10"
                strokeWidth="2"
                stroke="currentColor"
                fill="transparent"
                r="48%"
                cx="50%"
                cy="50%"
              />
              <circle
                className="text-neon-blue transition-all duration-200"
                strokeWidth="2"
                strokeDasharray={`${timeoutProgress * 301.59} 301.59`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="48%"
                cx="50%"
                cy="50%"
              />
            </svg>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <motion.h2
                  className="text-2xl font-bold text-neon-blue mb-2"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                >
                  Listening...
                </motion.h2>
                <motion.p
                  className="text-light-gray/60"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Speak your command to Nata
                </motion.p>
              </div>

              {/* Voice Wave Animation */}
              <div className="flex justify-center items-center h-32 mb-8">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 mx-0.5 bg-neon-blue"
                    animate={{
                      height: [
                        4,
                        Math.min(100, voiceLevel * (1 + Math.sin(i / 3) * 0.5)),
                        4,
                      ],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-light-gray" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

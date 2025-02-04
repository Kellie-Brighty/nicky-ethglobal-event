import React from "react";
import { motion } from "framer-motion";

export const WakeWordIndicator = () => {
  return (
    <motion.div 
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-dark-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neon-blue/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-neon-blue"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <span className="text-sm text-light-gray/60">
        Say "Hey Nata" to start
      </span>
    </motion.div>
  );
}; 
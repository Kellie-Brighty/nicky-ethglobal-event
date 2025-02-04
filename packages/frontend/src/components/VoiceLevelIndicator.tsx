import React from "react";
import { motion } from "framer-motion";

interface VoiceLevelIndicatorProps {
  level: number;
}

export const VoiceLevelIndicator: React.FC<VoiceLevelIndicatorProps> = ({
  level,
}) => {
  const bars = 5;
  const threshold = 100 / bars;

  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1">
      {[...Array(bars)].map((_, index) => (
        <motion.div
          key={index}
          className="w-1 bg-neon-blue"
          initial={{ height: 4 }}
          animate={{
            height: level > threshold * index ? 12 + index * 4 : 4,
            opacity: level > threshold * index ? 1 : 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
};

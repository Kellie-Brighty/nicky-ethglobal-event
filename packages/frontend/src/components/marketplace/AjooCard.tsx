import React from "react";
import { motion } from "framer-motion";
import { StarIcon, UserGroupIcon } from "@heroicons/react/24/solid";

interface AjooCardProps {
  name: string;
  duration: string;
  nextPayout: string;
  price: string;
  rating: number;
  memberCount: number;
  onClick?: () => void;
}

export const AjooCard: React.FC<AjooCardProps> = ({
  name,
  duration,
  nextPayout,
  price,
  rating,
  memberCount,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-dark-secondary rounded-xl p-6 border border-neon-blue/20 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-light-gray">{name}</h3>
        <span className="text-xl font-bold text-neon-blue">{price}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-light-gray/60">
          <span className="mr-2">⏱</span>
          <span>Duration: {duration}</span>
        </div>
        
        <div className="flex items-center text-light-gray/60">
          <span className="mr-2">📅</span>
          <span>Next Payout: {nextPayout}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-light-gray">{rating}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <UserGroupIcon className="w-5 h-5 text-neon-blue" />
            <span className="text-light-gray">+{memberCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 
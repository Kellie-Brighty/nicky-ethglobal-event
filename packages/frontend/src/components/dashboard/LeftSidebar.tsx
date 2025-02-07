import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

// Add interface for Mood
interface Mood {
  emoji: string;
  label: string;
  color: string;
}

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-green-400" },
  { emoji: "😴", label: "Tired", color: "bg-blue-400" },
  { emoji: "😔", label: "Sad", color: "bg-purple-400" },
  { emoji: "😤", label: "Stressed", color: "bg-red-400" },
  { emoji: "🤔", label: "Neutral", color: "bg-yellow-400" },
];

const LeftSidebar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-dark-secondary border-r border-neon-blue/20 h-screen fixed left-0 top-0 p-4 overflow-y-auto"
    >
      {/* Time Display */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neon-blue">
          {format(currentTime, "h:mm a")}
        </h2>
        <p className="text-light-gray">
          Good {format(currentTime, "a") === "am" ? "Morning" : "Evening"}!
        </p>
      </div>

      {/* Mood Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-light-gray mb-4">
          How are you feeling?
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood)}
              className={`p-2 rounded-lg ${
                selectedMood?.label === mood.label
                  ? "bg-neon-blue/20 border-2 border-neon-blue"
                  : "bg-dark-primary"
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-light-gray">{mood.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Meal Suggestions */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-light-gray mb-4">
            Recommended for you
          </h3>
          <div className="space-y-4">
            {/* Add meal suggestions based on mood */}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LeftSidebar;

import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-neon-blue border-t-transparent"
      />
    </div>
  );
};

import { motion } from "framer-motion";

const RightSidebar = () => {
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="w-80 bg-dark-secondary border-l border-neon-blue/20 h-screen fixed right-0 top-0 p-4 overflow-y-auto"
    >
      <h2 className="text-xl font-bold text-neon-blue mb-4">Order History</h2>
      {/* Order history content moved from main dashboard */}
    </motion.div>
  );
};

export default RightSidebar;

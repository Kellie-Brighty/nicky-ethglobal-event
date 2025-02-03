import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const FloatingElement: React.FC<{
  className: string;
  delay?: number;
  children: React.ReactNode;
}> = ({ className, delay = 0, children }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.1, 1],
      rotate: [0, 10, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const handleConnect = async () => {
    try {
      await open();
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  // Redirect to dashboard when connected
  React.useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background Graphics */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-neon-blue/20 rounded-full top-10 -right-20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-neon-green/20 rounded-full bottom-10 -left-20 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/src/assets/images/hero-food.png')" }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />

      {/* Floating Tech Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Pizza */}
        <FloatingElement
          className="absolute top-24 right-[20%] w-24 h-24 bg-gradient-to-br from-neon-blue/20 to-neon-green/20 rounded-xl border border-neon-blue/30 flex items-center justify-center"
          delay={0}
        >
          <svg viewBox="0 0 64 64" className="w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="25"
              fill={`#00f2fe`}
              fillOpacity="0.2"
              stroke={`#00f2fe`}
              strokeWidth="2"
            />
            <path
              className="animate-spin-slow"
              d="M32 7L37 32L32 57"
              stroke="#FF4757"
              strokeWidth="2"
            />
            <circle cx="25" cy="25" r="3" fill="#FF4757" />
            <circle cx="38" cy="28" r="3" fill="#1DD1A1" />
            <circle cx="30" cy="40" r="3" fill="#FF4757" />
            <path
              d="M15 25Q32 15 49 25"
              stroke="#FFD43B"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </FloatingElement>

        {/* Delivery Person */}
        <FloatingElement
          className="absolute top-48 left-[15%] w-28 h-28 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-xl border border-blue-400/30 flex items-center justify-center"
          delay={2}
        >
          <svg viewBox="0 0 64 64" className="w-20 h-20">
            <circle
              cx="32"
              cy="20"
              r="8"
              fill="#4834D4"
              fillOpacity="0.3"
              stroke="#4834D4"
              strokeWidth="2"
            />
            <path
              d="M20 48C20 38 25 32 32 32C39 32 44 38 44 48"
              stroke="#4834D4"
              strokeWidth="2"
            />
            <rect
              x="26"
              y="42"
              width="12"
              height="8"
              rx="2"
              fill="#00D2D3"
              className="animate-pulse"
            />
            <path
              className="animate-bounce-slow"
              d="M16 38H24M40 38H48"
              stroke="#4834D4"
              strokeWidth="2"
            />
          </svg>
        </FloatingElement>

        {/* Animated Burger */}
        <FloatingElement
          className="absolute bottom-40 right-[25%] w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl border border-yellow-400/30 flex items-center justify-center"
          delay={1}
        >
          <svg viewBox="0 0 64 64" className="w-24 h-24">
            <path
              d="M16 20H48"
              stroke="#FFB142"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="animate-pulse"
              d="M12 32H52"
              stroke="#FF9F43"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M16 44H48"
              stroke="#FFB142"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="24" cy="32" r="3" fill="#2ED573" />
            <circle cx="40" cy="32" r="3" fill="#FF4757" />
            <path
              d="M12 32C12 20 20 16 32 16C44 16 52 20 52 32"
              fill="#FFB142"
              fillOpacity="0.2"
            />
          </svg>
        </FloatingElement>

        {/* Web3 AI Agent */}
        <FloatingElement
          className="absolute bottom-32 left-[20%] w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-xl border border-green-400/30 flex items-center justify-center"
          delay={3}
        >
          <svg viewBox="0 0 64 64" className="w-16 h-16">
            <path
              className="animate-pulse"
              d="M32 8L56 24L32 40L8 24L32 8Z"
              fill="#0FB9B1"
              fillOpacity="0.2"
              stroke="#0FB9B1"
              strokeWidth="2"
            />
            <path d="M16 36L32 44L48 36" stroke="#4834D4" strokeWidth="2" />
            <circle
              cx="32"
              cy="32"
              r="6"
              fill="#4834D4"
              className="animate-ping-slow"
            />
            <path
              className="animate-pulse"
              d="M24 16L32 20L40 16"
              stroke="#0FB9B1"
              strokeWidth="2"
            />
          </svg>
        </FloatingElement>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-center items-center text-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated tech elements above title */}
          <motion.div
            className="text-neon-blue/60 text-sm tracking-[0.3em] mb-4 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            POWERED BY NICKY
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="relative">
              <span className="text-neon-blue relative z-10">Next-Gen</span>
              <motion.span
                className="absolute -inset-1 bg-neon-blue/20 blur-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
            <br />
            <span className="text-light-gray">Food Delivery</span>
          </motion.h1>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-green mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          <motion.p
            className="text-xl md:text-2xl text-light-gray/90 mb-12 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <span className="text-neon-blue">Decentralized</span> •{" "}
            <span className="text-neon-green">AI-powered</span> •{" "}
            <span className="text-light-gray">eco-friendly</span>
            <br />
            food delivery at your fingertips.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <button
              onClick={handleConnect}
              className="group relative px-8 py-4 bg-transparent border-2 border-neon-blue text-neon-blue font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-neon-blue hover:text-black disabled:opacity-50"
            >
              <span className="relative z-10">Connect Wallet</span>
              <motion.div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue via-neon-green to-neon-blue opacity-0 group-hover:opacity-100" />
            </button>
            {/* <button className="px-8 py-4 border-2 border-neon-blue text-neon-blue font-bold rounded-full hover:bg-neon-blue/10 transition-all transform hover:scale-105">
              Learn More
            </button> */}
          </motion.div>

          {/* Floating tech elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-4 text-xs font-mono tracking-wider">
              <span className="text-neon-blue/60">WEB3</span>
              <span className="w-2 h-2 rounded-full bg-neon-blue/60" />
              <span className="text-neon-green/60">BLOCKCHAIN</span>
              <span className="w-2 h-2 rounded-full bg-neon-green/60" />
              <span className="text-light-gray/60">AI</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Grid Pattern Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {[...Array(48)].map((_, index) => (
            <motion.div
              key={index}
              className="h-8 bg-gray-200/10 rounded-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

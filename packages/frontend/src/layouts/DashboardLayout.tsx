// import React, { useState } from "react";
import { WalletHeader } from "../components/WalletHeader";
import RightSidebar from "../components/sidebars/RightSidebar";
import LeftSidebar from "../components/sidebars/LeftSidebar";
import ChatInterface from "../components/ChatInterface";
import { useMobileMenu } from "../context/MobileMenuContext";

const DashboardLayout = () => {
  const { isMenuOpen, closeMenu } = useMobileMenu();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const handleTouchStart = (e: React.TouchEvent) => {
  //   // Implementation of handleTouchStart
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   // Implementation of handleTouchMove
  // };

  // const handleTouchEnd = () => {
  //   // Implementation of handleTouchEnd
  // };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black to-dark-secondary flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <WalletHeader />
      </div>

      {/* Main content area */}
      <div className="flex-1 relative lg:grid lg:grid-cols-[280px_1fr_300px] min-h-0 mt-16">
        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMenu}
          />
        )}

        {/* Left Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 w-[280px] z-50 mt-16
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:relative lg:transform-none lg:z-0 lg:mt-0
            bg-dark-secondary/50 backdrop-blur-lg
            border-r border-neon-blue/10
          `}
        >
          <LeftSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 h-[calc(100vh-4rem)] bg-dark-secondary/30 backdrop-blur-sm">
          <ChatInterface />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block border-l border-neon-blue/10 bg-dark-secondary/30 backdrop-blur-lg">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

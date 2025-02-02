import React, { useRef } from "react";
import { WalletHeader } from "../components/WalletHeader";
import RightSidebar from "../components/sidebars/RightSidebar";
import LeftSidebar from "../components/sidebars/LeftSidebar";
import ChatInterface from "../components/ChatInterface";
import { useMobileMenu } from "../context/MobileMenuContext";

const DashboardLayout = () => {
  const { isMenuOpen, closeMenu, toggleMenu } = useMobileMenu();
  const touchStart = useRef(0);
  const threshold = 50; // minimum distance for swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const currentX = e.touches[0].clientX;
    const diff = touchStart.current - currentX;

    // Swipe right to open menu (when closed)
    if (diff < -threshold && !isMenuOpen) {
      toggleMenu();
    }
    // Swipe left to close menu (when open)
    else if (diff > threshold && isMenuOpen) {
      closeMenu();
    }
  };

  const handleTouchEnd = () => {
    touchStart.current = 0;
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col overflow-hidden">
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
            bg-white dark:bg-gray-800/50 backdrop-blur-lg
            border-r border-gray-200/50 dark:border-gray-700/50
          `}
        >
          <LeftSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 h-[calc(100vh-4rem)] bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
          <ChatInterface />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block border-l border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30 backdrop-blur-lg">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

import React from "react";
import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabViewProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showLocationFilter?: boolean;
  onLocationChange?: (useNearby: boolean) => void;
  isNearbyActive?: boolean;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  activeTab,
  onTabChange,
  showLocationFilter = false,
  onLocationChange,
  isNearbyActive = false,
}) => {
  return (
    <div className="flex items-center justify-between mb-6 border-b border-neon-blue/10">
      <div className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-neon-blue"
                  : "text-neon-blue/60 hover:text-neon-blue/80"
              }`}
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" />}
                {/* <span>{tab.label}</span> */}
              </div>
              {/* {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )} */}
            </button>
          );
        })}
      </div>

      {showLocationFilter && onLocationChange && (
        <button
          onClick={() => onLocationChange(!isNearbyActive)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            isNearbyActive
              ? "bg-neon-blue/10 text-neon-blue"
              : "text-neon-blue/60 hover:text-neon-blue/80"
          }`}
        >
          <MapPinIcon className="w-5 h-5" />
          <span>{isNearbyActive ? "Nearby Only" : "All Locations"}</span>
        </button>
      )}
    </div>
  );
};

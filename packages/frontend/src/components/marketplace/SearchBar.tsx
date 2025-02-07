import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFilter } from "../../context/FilterContext";

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useFilter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full py-3 px-4 pl-12 bg-dark-secondary/50 border border-neon-blue/20 rounded-lg 
                 text-light-gray placeholder-neon-blue/40 focus:border-neon-blue/50 focus:ring-1 
                 focus:ring-neon-blue/50 transition-colors"
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-blue/60" />
    </form>
  );
};

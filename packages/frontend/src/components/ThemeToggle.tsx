import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-dark-secondary transition-colors border border-neon-blue/20"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5 text-neon-blue" />
      ) : (
        <MoonIcon className="w-5 h-5 text-neon-green" />
      )}
    </button>
  );
}

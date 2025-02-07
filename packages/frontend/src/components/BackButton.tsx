import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-full hover:bg-neon-blue/10 transition-colors group"
      aria-label="Go back"
    >
      <ArrowLeftIcon className="w-6 h-6 text-neon-blue group-hover:text-neon-green transition-colors" />
    </button>
  );
}; 
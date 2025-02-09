import { useEffect } from "react";
import Hero from "../components/landing/Hero";
import { useAccount } from "@starknet-react/core";
import { useLocation, useNavigate } from "react-router-dom";

export const Home = () => {
  const { address } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      // Redirect to the attempted path or default to chat
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    }
  }, [address, navigate, location]);

  return (
    <div className="min-h-screen bg-dark-primary">
      <main className="container mx-auto px-4 py-16">
        <Hero />
      </main>
    </div>
  );
};

export default Home;

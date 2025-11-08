import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AffirmationsLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet /> {/* This is where child routes will render */}
    </div>
  );
};

export default AffirmationsLayout;

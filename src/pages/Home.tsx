import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Domains from "./components/Domains";
import Pattern from "./components/Pattern";
import Footer from "./components/footer";

const Home: React.FC = () => {
  return (
    <div className="bg-black text-white">
        <Navbar />
        <HeroSection />
        <Domains />
        <Pattern />
        <Footer />
    </div>
  );
};

export default Home;

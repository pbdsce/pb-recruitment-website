import React from "react";

const AdminHero: React.FC = () => {
  return (
  <section className="relative bg-black py-8 md:py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-green-800/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-300 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage contests, problems, and contestants
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminHero;
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import TestPage from "./pages/test_page";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/leaderboard" element={<TestPage />} />
        <Route path="/contest" element={<TestPage />} />
      </Routes>
  );
};

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import TestPage from "./pages/test_page";
import Home from "./pages/Home";
import ContestDetail from "./pages/ContestDetail";
import ContestList from "./pages/ContestList";
import { ContestProblemsPage } from './features/contests/pages/ContestProblemsPage';
import { ContestLeaderboardPage } from './features/contests/pages/ContestLeaderboardPage';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/contest/:contestId/problem/:problemId" element={<TestPage />} />
        <Route path="/contests" element={<ContestList />} />
        <Route path="/contest/:id" element={<ContestDetail />} />
        <Route path="/contest/:contestId/problems" element={<ContestProblemsPage />} />
        <Route path="/contests/:contestId/leaderboard" element={<ContestLeaderboardPage />} />
      </Routes>
  );
};

export default App;


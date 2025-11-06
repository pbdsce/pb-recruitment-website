import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import TestPage from "./pages/test_page";
import Home from "./pages/Home";
import ContestDetail from "./pages/ContestDetail";
import ContestList from "./pages/ContestList";
import { ContestProblemsPage } from './features/contests/pages/ContestProblemsPage';
import { ContestProblemPage } from './features/contests/pages/ContestProblemPage';
import { ContestLeaderboardPage } from './features/contests/pages/ContestLeaderboardPage';
import { ContestLayout } from './features/contests/layouts/ContestLayout';
import { Login } from "./pages/LogIn";
import { Signup } from "./pages/SignUp";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Profile } from "./pages/Profile";

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/contests" element={<ContestList />} />
        <Route path="/contest/:id" element={<ContestDetail />} />
        <Route path="/contests/:contestId" element={<ContestLayout />}>
          <Route path="problems" element={<ContestProblemsPage />} />
          <Route path="problems/:problemId" element={<ContestProblemPage />} />
          <Route path="leaderboard" element={<ContestLeaderboardPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contests/:contestId/leaderboard" element={<ContestLeaderboardPage />} />
      </Routes>
  );
};

export default App;

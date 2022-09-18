import React from "react";
import { LoadingScreen, Footer, AuthProvider, useLogin } from "@hex-labs/core";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, inMemoryPersistence } from "firebase/auth";

import "./App.css";
import ApplicationContainer from "./components/application/ApplicationContainer";
import Dashboard from "./components/dashboard/Dashboard";
import EmailScreen from "./components/admin/email/EmailScreen";
import SelectEvent from "./components/selectEvent/SelectEvent";
import ApplicationDetailPage from "./components/admin/applications/ApplicationDetailPage";
import BranchSettings from "./components/admin/branchSettings/BranchSettings";
import CheckValidHexathon from "./util/CheckValidHexathon";
import Statistics from "./components/admin/statistics/Statistics";
import AllApplicationsTable from "./components/admin/applications/AllApplicationsTable";
import AdminControlsHome from "./components/admin/AdminControlsHome";
import GradingDashboard from "./components/admin/grading/GradingDashboard";
import GradeQuestion from "./components/admin/grading/GradeQuestion";
import Leaderboard from "./components/admin/grading/Leaderboard";
import BranchEditor from "./components/branchEditor/BranchEditor";
import Navigation from "./components/Navigation";
import Beacon from "./components/Beacon";

export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "hexlabs-cloud.firebaseapp.com",
});
setPersistence(getAuth(app), inMemoryPersistence);

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin(app);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loading && !loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <LoadingScreen />;
  }

  return (
    <AuthProvider app={app}>
      <Navigation />
      <Routes>
        <Route path="/" element={<SelectEvent />} />
        <Route path="/:hexathonId" element={<CheckValidHexathon />}>
          <Route path="" element={<Dashboard />} />
          <Route path="application/:applicationId" element={<ApplicationContainer />} />
          <Route path="admin" element={<AdminControlsHome />} />
          <Route path="admin/email" element={<EmailScreen />} />
          <Route path="admin/branch-settings" element={<BranchSettings />} />
          <Route path="admin/branch-settings/:branchId" element={<BranchEditor />} />
          <Route path="admin/applications" element={<AllApplicationsTable />} />
          <Route path="admin/applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="admin/statistics" element={<Statistics />} />
          <Route path="grading" element={<GradingDashboard />} />
          <Route path="grading/:gradingGroup/question" element={<GradeQuestion />} />
          <Route path="grading/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
      <Beacon />
      <Footer />
    </AuthProvider>
  );
};

import React from "react";
import { LoadingScreen, AuthProvider, useLogin } from "@hex-labs/core";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, inMemoryPersistence } from "firebase/auth";

import "./App.css";
import ApplicationContainer from "./components/application/ApplicationContainer";
import Dashboard from "./components/dashboard/Dashboard";
import EmailPage from "./components/admin/email/EmailPage";
import BranchEmailTemplatesPage from "./components/admin/branchEmailTemplates/BranchEmailTemplates";
import SelectEvent from "./components/selectEvent/SelectEvent";
import ApplicationDetailPage from "./components/admin/applications/ApplicationDetailPage";
import BranchSettingsPage from "./components/admin/branchSettings/BranchSettingsPage";
import StatisticsPage from "./components/admin/statistics/StatisticsPage";
import ApplicationsTablePage from "./components/admin/applications/ApplicationsTablePage";
import AdminControlsHome from "./components/admin/AdminControlsHome";
import GradingDashboardPage from "./components/admin/grading/GradingDashboardPage";
import GradingQuestionPage from "./components/admin/grading/GradingQuestionPage";
import GradingLeaderboardPage from "./components/admin/grading/GradingLeaderboardPage";
import BranchEditorPage from "./components/admin/branchSettings/branchEditor/BranchEditorPage";
import TeamDashboard from "./components/teamFormation/TeamDashboard";
import AppOutline from "./components/outline/AppOutline";
import StartApplication from "./components/application/StartApplication";

export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "auth.hexlabs.org",
});
setPersistence(getAuth(app), inMemoryPersistence);

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin(app);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <LoadingScreen />;
  }

  return (
    <AuthProvider app={app}>
      <Routes>
        <Route path="" element={<AppOutline />}>
          <Route path="" element={<SelectEvent />} />
          <Route path=":hexathonId">
            <Route path="" element={<Dashboard />} />
            <Route path="start-application/:branchId" element={<StartApplication />} />
            <Route path="application/:applicationId" element={<ApplicationContainer />} />
            <Route path="admin" element={<AdminControlsHome />} />
            <Route path="admin/email" element={<EmailPage />} />
            <Route path="admin/branch-email-templates" element={<BranchEmailTemplatesPage />} />
            <Route path="admin/branch-settings" element={<BranchSettingsPage />} />
            <Route path="admin/branch-settings/:branchId" element={<BranchEditorPage />} />
            <Route path="admin/applications" element={<ApplicationsTablePage />} />
            <Route path="admin/applications/:applicationId" element={<ApplicationDetailPage />} />
            <Route path="admin/statistics" element={<StatisticsPage />} />
            <Route path="grading" element={<GradingDashboardPage />} />
            <Route path="grading/:gradingGroup/question" element={<GradingQuestionPage />} />
            <Route path="grading/leaderboard" element={<GradingLeaderboardPage />} />
            <Route path="team/dashboard" element={<TeamDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

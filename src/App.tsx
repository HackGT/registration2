import React from "react";
import { LoadingScreen, Footer } from "@hex-labs/core";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
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
import BranchEditor from "./components/branchEditor/BranchEditor";
import Navigation from "./components/Navigation";

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loading && !loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
  }

  return (
    <AuthProvider>
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
        </Route>
      </Routes>
      <Footer />
    </AuthProvider>
  );
};

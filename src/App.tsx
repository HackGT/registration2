import React from "react";
import { ErrorScreen, Loading, Footer } from "@hex-labs/core";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import useAxios from "axios-hooks";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
import ApplicationContainer from "./components/application/ApplicationContainer";
import Dashboard from "./components/dashboard/Dashboard";
import EmailScreen from "./components/admin/emailScreen/EmailScreen";
import SelectEvent from "./components/selectEvent/SelectEvent";
import ApplicationDetailPage from "./components/admin/applications/ApplicationDetailPage";
import BranchSettings from "./components/admin/branchSettings/BranchSettings";
import CheckValidHexathon from "./util/CheckValidHexathon";
import Statistics from "./components/statistics/Statistics";
import AllApplicationsTable from "./components/admin/applications/AllApplicationsTable";
import AdminControlsHome from "./components/admin/AdminControlsHome";
import BranchEditor from "./components/branchEditor/BranchEditor";
import Navigation from "./components/Navigation";

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin();
  const [{ data: hexathons, loading: hexathonsLoading, error: hexathonsError }] = useAxios(
    "https://hexathons.api.hexlabs.org/hexathons"
  );

  if (!loading && !loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
  }

  if (loading || hexathonsLoading) {
    return <Loading />;
  }

  if (hexathonsError) {
    return <ErrorScreen error={hexathonsError}/>
  }

  return (
    <AuthProvider>
      <Navigation/>
      <Routes>
        <Route path="/" element={<SelectEvent hexathons={hexathons} />} />
        <Route path="/:hexathonId" element={<CheckValidHexathon hexathons={hexathons} />}>
          <Route path="" element={<Dashboard hexathons={hexathons} />} />
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
      <Footer/>
    </AuthProvider>
  );
};

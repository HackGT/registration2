import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { HexathonsProvider } from "./contexts/HexathonsContext";
import { useLogin } from "./hooks/useLogin";
import ApplicationContainer from "./components/application/ApplicationContainer";
import Dashboard from "./components/dashboard/Dashboard";
import Loading from "./util/Loading";
import EmailScreen from "./components/admin/emailScreen/EmailScreen";
import SelectEvent from "./components/selectEvent/SelectEvent";
import ApplicationDetailPage from "./components/admin/applications/ApplicationDetailPage";
import InternalSettings from "./components/admin/internalSettings/InternalSettings";
import CheckValidHexathon from "./util/CheckValidHexathon";
import AllApplicationsTable from "./components/admin/applications/AllApplicationsTable";
import AdminControlsHome from "./components/admin/AdminControlsHome";

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin();

  if (!loading && !loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
  }

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <HexathonsProvider>
          {loading || !loggedIn ? (
            <Loading />
          ) : (
            <Routes>
              <Route path="/" element={<SelectEvent />} />
              <Route path="/:hexathonId" element={<CheckValidHexathon />}>
                <Route path="" element={<Dashboard />} />
                <Route path="application/:applicationId" element={<ApplicationContainer />} />
                <Route path="admin" element={<AdminControlsHome />} />
                <Route path="admin/email" element={<EmailScreen />} />
                <Route path="admin/internal-settings" element={<InternalSettings />} />
                <Route path="admin/applications" element={<AllApplicationsTable />} />
                <Route
                  path="admin/applications/:applicationId"
                  element={<ApplicationDetailPage />}
                />
              </Route>
            </Routes>
          )}
        </HexathonsProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

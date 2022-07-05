import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HexathonsProvider } from "./contexts/HexathonsContext";
import { useLogin } from "./hooks/useLogin";
import Application from "./components/registration/Application";
import Dashboard from "./components/dashboard/Dashboard";
import User from "./components/user/User";
import Loading from "./util/Loading";
import EmailScreen from "./components/emailScreen/EmailScreen";
import SelectEvent from "./components/SelectEvent";
import ParticipantIndividual from './components/dashboard/ParticipantIndividual';
import InternalSettings from "./components/internalSettings/InternalSettings";
import CheckValidHexathon from "./util/CheckValidHexathon";
import UserInfoTable from "./components/userInfo/UserInfoTable";
import "./App.css";

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
                <Route path="user/:userId" element={<User />} />
                <Route path="application/:applicationId" element={<Application />} />
                <Route path="email" element={<EmailScreen />} />
                <Route path="internal-settings" element={<InternalSettings />} />
                <Route path="users" element={<UserInfoTable />} />
              </Route>
            </Routes>
          )}
        </HexathonsProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
import FormPlayground from "./components/formPlayground/FormPlayground";
import Admin from "./components/dashboard/Dashboard";
import User from "./components/user/User";
import EmailScreen from "./components/emailScreen/EmailScreen";
import SelectEvent from "./components/SelectEvent";
import ParticipantIndividual from './components/dashboard/ParticipantIndividual';

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <h1>Loading...</h1>;
  }

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SelectEvent />} />
            <Route path="" element={<Admin />} />
            <Route path="user/:userId" element={<User />} />
            <Route path="form-playground" element={<FormPlayground />} />
            <Route path="/participant/:applicationId" element={<ParticipantIndividual />} />
            <Route path="email" element={<EmailScreen />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
};

import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
import FormPlayground from "./components/formPlayground/FormPlayground";
import Admin from "./components/dashboard/Dashboard";
import User from "./components/user/User";
import Loading from "./util/Loading";
import EmailScreen from "./components/emailScreen/EmailScreen";
import SelectEvent from "./components/SelectEvent";

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin();

  if (!loading && !loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
  }

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        {
          (loading || !loggedIn) ? (
            <Loading />
          ) : (
            <Routes>
              <Route path="/" element={<SelectEvent />} />
              <Route path="/:hexathonId">
                <Route path="" element={<Admin />} />
                <Route path="user/:userId" element={<User />} />
                <Route path="form-playground" element={<FormPlayground />} />
                <Route path="email" element={<EmailScreen />} />
              </Route>
            </Routes>
          )
        }
      </AuthProvider>
    </ChakraProvider>
  );
};

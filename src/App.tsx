import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
import FormTools from "./components/FormTools";
import Admin from "./components/Admin";
import User from "./components/User";

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
    <Route path='/user/:userId' element={<User/>} />
    </Routes>
    <Admin />
      </AuthProvider>
    </ChakraProvider>
  );
};

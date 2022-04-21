import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";

import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
import FormTools from "./components/FormTools";
<<<<<<< HEAD
import Admin from "./components/Admin";
import UserInfoTable from "./components/UserInfoTable"

=======

import UserInfoTable from "./components/UserInfoTable"


import Admin from "./components/Admin";


>>>>>>> 25634d83a24ec6e7d18507c378d8d89a8d0103eb
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
<<<<<<< HEAD
        <FormTools />
        <Admin />
        <UserInfoTable />
=======

        <FormTools />
        <UserInfoTable/>
        <Admin />

>>>>>>> 25634d83a24ec6e7d18507c378d8d89a8d0103eb
      </AuthProvider>

    </ChakraProvider>
  );
};

import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import useAxios from "axios-hooks";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { useLogin } from "./hooks/useLogin";
import ApplicationContainer from "./components/application/ApplicationContainer";
import Dashboard from "./components/dashboard/Dashboard";
import User from "./components/user/User";
import Loading from "./util/Loading";
import EmailScreen from "./components/emailScreen/EmailScreen";
import SelectEvent from "./components/selectEvent/SelectEvent";
import ParticipantIndividual from "./components/dashboard/ParticipantIndividual";
import InternalSettings from "./components/internalSettings/InternalSettings";
import CheckValidHexathon from "./util/CheckValidHexathon";
import UserInfoTable from "./components/userInfo/UserInfoTable";
import BranchEditor from "./components/branchEditor/BranchEditor";
import AdminControlsHome from "./components/dashboard/AdminControlsHome";

axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin();
  const [{ data: hexathons, loading: hexathonsLoading, error: hexathonsError }] = useAxios(
    "https://hexathons.api.hexlabs.org/hexathons"
  );

  if (loading || hexathonsLoading || hexathonsError) {
    return <Loading />;
  }

  if (!loading && !loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
  }

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SelectEvent hexathons={hexathons} />} />
          <Route path="/admin" element={<AdminControlsHome />} />
          <Route path="/:hexathonId" element={<CheckValidHexathon hexathons={hexathons} />}>
            <Route path="" element={<Dashboard hexathons={hexathons} />} />
            <Route path="user/:userId" element={<User />} />
            <Route path="application/:applicationId" element={<ApplicationContainer />} />
            <Route path="email" element={<EmailScreen />} />
            <Route path="internal-settings" element={<InternalSettings />} />
            <Route path="users" element={<UserInfoTable />} />
            <Route path="users/:applicationId" element={<ParticipantIndividual />} />
            <Route path="branch/:branchId" element={<BranchEditor />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
};

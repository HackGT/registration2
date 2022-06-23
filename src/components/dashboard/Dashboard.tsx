import React from "react";
import useAxios from "axios-hooks";

import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../util/Loading";
import ParticipantDashboard from "./dashboardViews/ParticipantDashboardView";
import AdminDashboard from "./dashboardViews/AdminDashboardView";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [{ data: profile, loading, error }] = useAxios(
    `https://users.api.hexlabs.org/users/${user?.uid}`
  );

  if (loading || error) {
    return <Loading />;
  }

  if (profile.permissions?.admin) {
    return <AdminDashboard profile={profile} />;
  }

  return <ParticipantDashboard profile={profile} />;
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../util/Loading"
import ParticipantDashboard from "./dashboardViews/ParticipantDashboardView";
import AdminDashboard from "./dashboardViews/AdminDashboardView";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({});
  const [hexathons, setHexathons] = useState<any>([]);

  useEffect(() => {
    const getDetails = async () => {
      const res = await axios.get(
        `https://users.api.hexlabs.org/users/${user?.uid}`
      );
      setProfile(res.data);
      setLoading(false);
    };
    const getHexathons = async () => {
      const res = await axios.get(
        `https://hexathons.api.hexlabs.org/hexathons`
      );
      setHexathons(res.data);
    };

    getDetails();
    getHexathons();
  }, [hexathons, user?.uid]);
    
  if (loading) {
    return <Loading/>
  }

  if (profile.permissions?.admin) {
    return <AdminDashboard profile={profile}/>;
  }

  return <ParticipantDashboard profile={profile} hexathons={hexathons}/>;
}

export default Dashboard;

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
  const [curHexathon, setCurHexathon] = useState<any>({});

  useEffect(() => {
    const getDetails = async () => {
      const res = await axios.get(
        `https://users.api.hexlabs.org/users/${user?.uid}`
      );
      setProfile(res.data);
      setLoading(false);
    };
    const getHexathons = async () => {
      const curDate = new Date();
      const res = await axios.get(
        "http://hexathons.api.hexlabs.org/hexathons"
      );
      const filteredHexathons = res.data.filter((a: any) => (
        (a.startDate <= curDate <= a.endDate) || (a.startDate >= curDate)
      ))
      const sortedHexathons = filteredHexathons.sort((a: any, b: any) => (
        (a.startDate < b.startDate) ? -1 : 1
      )).slice(0, 3);
      setHexathons(sortedHexathons);
      if (sortedHexathons.length > 0 && sortedHexathons[0].startDate <= curDate <= sortedHexathons[0].endDate) {
        setCurHexathon(sortedHexathons[0]);
      }
    };
    getDetails();
    getHexathons();
  }, [curHexathon, hexathons, user?.uid]);
    
  if (loading) {
    return <Loading/>
  }

  if (profile.permissions?.admin) {
    return <AdminDashboard profile={profile}/>;
  }

  return (
    <ParticipantDashboard
      profile={profile}
      hexathons={hexathons}
      curHexathon={curHexathon}
    />
  );
}

export default Dashboard;

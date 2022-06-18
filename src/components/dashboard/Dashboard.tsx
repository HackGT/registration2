import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useHexathons } from "../../contexts/HexathonsContext";
import Loading from "../../util/Loading"
import ParticipantDashboard from "./dashboardViews/ParticipantDashboardView";
import AdminDashboard from "./dashboardViews/AdminDashboardView";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { hexathons } = useHexathons();
  const { hexathonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({});
  const [filteredHexathons, setFilteredHexathons] = useState<any>([]);
  const [curHexathon, setCurHexathon] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const filterHexathons = (index: number) => {
      setFilteredHexathons(hexathons.slice(index, index + 3))
    }
    const getDetails = async () => {
      const res = await axios.get(
        `https://users.api.hexlabs.org/users/${user?.uid}`
      )
      setProfile(res.data);
      setLoading(false);
    };
    const checkValidHexathon = () => {
      // eslint-disable-next-line
      const curHexathonIndex = hexathons.findIndex((hexathon: any) => hexathon._id === hexathonId);
      if (curHexathonIndex === -1) {
        navigate("/")
      } else {
        setCurHexathon(hexathons[curHexathonIndex]);
        filterHexathons(curHexathonIndex);
        getDetails();
      }
    }

    checkValidHexathon();
  }, [hexathonId, hexathons, navigate, user?.uid]);
    
  if (loading) {
    return <Loading/>
  }

  if (profile.permissions?.admin) {
    return (
      <AdminDashboard
        profile={profile}
      />
    );
  }

  return (
    <ParticipantDashboard
      profile={profile}
      hexathons={filteredHexathons}
      curHexathon={curHexathon}
    />
  );
}

export default Dashboard;

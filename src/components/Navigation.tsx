import React, { useEffect, useState } from "react";
import { Header, HeaderItem } from "@hex-labs/core";
import axios from "axios";
import { signOut, getAuth } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { app } from "../util/firebase";
import { apiUrl, Service } from "../util/apiUrl";

const auth = getAuth(app);

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const hexathonId = window.sessionStorage.getItem("hexathonId");
  const [role, setRoles] = useState<any>({
    member: false,
    exec: false,
    admin: false,
  });

  const logOut = async () => {
    signOut(auth);
    await axios.post(apiUrl(Service.AUTH, "/auth/logout"));
    window.location.href = `https://login.hexlabs.org`;
  };

  useEffect(() => {
    const getRoles = async () => {
      const response = await axios.get(apiUrl(Service.USERS, `/users/${user?.uid}`));
      setRoles({ ...response.data.roles });
    };

    if (hexathonId === undefined) {
      navigate("/");
    }

    getRoles();
  }, [user?.uid, hexathonId, navigate]);

  return (
    <Header>
      {location.pathname !== "/" ? (
        <>
          {location.pathname !== `/${hexathonId}` ? (
            <HeaderItem>
              <Link to={`/${hexathonId}`}>Dashboard</Link>
            </HeaderItem>
          ) : null}
          {role.admin || role.exec ? (
            <HeaderItem>
              <Link to={`/${hexathonId}/admin`}>Admin Home</Link>
            </HeaderItem>
          ) : null}
          <HeaderItem>
            <Link to="/">Change Event</Link>
          </HeaderItem>
        </>
      ) : null}
      <HeaderItem show>
        <Link to="/" onClick={logOut}>
          Sign Out
        </Link>
      </HeaderItem>
    </Header>
  );
};

export default Navigation;

import React, { useEffect, useState } from "react";
import { apiUrl, Header, HeaderItem, Service, useAuth } from "@hex-labs/core";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
    await axios.post(apiUrl(Service.AUTH, "/auth/logout"));
    window.location.href = `https://login.hexlabs.org/login?redirect=${window.location.href}`;
  };

  useEffect(() => {
    const getRoles = async () => {
      if (user?.uid) {
        const response = await axios.get(apiUrl(Service.USERS, `/users/${user?.uid}`));
        setRoles({ ...response.data.roles });
      }
    };

    if (hexathonId === undefined) {
      navigate("/");
    }

    getRoles();
  }, [user?.uid, hexathonId]);

  return (
    <Header>
      {location.pathname !== "/" ? (
        <>
          {location.pathname !== `/${hexathonId}` ? (
            <HeaderItem>
              <Link to={`/${hexathonId}`}>Dashboard</Link>
            </HeaderItem>
          ) : null}
          {location.pathname !== `/${hexathonId}/team/dashboard` ? (
            <HeaderItem>
              <Link to={`/${hexathonId}/team/dashboard`}>Team Formation</Link>
            </HeaderItem>
          ) : null}
          {role.admin || role.exec ? (
            <HeaderItem>
              <Link to={`/${hexathonId}/admin`}>Admin Home</Link>
            </HeaderItem>
          ) : null}
          {role.member ? (
            <HeaderItem>
              <Link to={`/${hexathonId}/grading`}>Grading</Link>
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

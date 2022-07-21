import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

import { CurrentHexathonProvider } from "../contexts/CurrentHexathonContext";

interface Props {
  hexathons: any[];
}

const CheckValidHexathon: React.FC<Props> = props => {
  const { hexathonId } = useParams();
  const currentHexathon = props.hexathons.find((hexathon: any) => hexathon._id === hexathonId);

  if (!currentHexathon) {
    return <Navigate to="/" />;
  }
  return (
    <CurrentHexathonProvider hexathons={props.hexathons}>
      <Outlet />
    </CurrentHexathonProvider>
  );
};

export default CheckValidHexathon;

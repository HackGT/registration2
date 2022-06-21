import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import useCurrentHexathon from "../hooks/useCurrentHexathon";

const CheckValidHexathon: React.FC = () => {
  const currentHexathon = useCurrentHexathon();

  if (!currentHexathon) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default CheckValidHexathon;

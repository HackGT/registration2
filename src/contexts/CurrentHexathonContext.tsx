import React, { useContext, createContext, useMemo } from "react";
import { useParams } from "react-router-dom";

const initialState = {
  currentHexathon: undefined,
};

const CurrentHexathonContext = createContext<{ currentHexathon: any }>(initialState);

export function useCurrentHexathon() {
  return useContext(CurrentHexathonContext);
}

interface Props {
  hexathons: any[];
}

const CurrentHexathonProvider: React.FC<Props> = ({ children, hexathons }) => {
  const { hexathonId } = useParams();

  const value = useMemo(
    () => ({ currentHexathon: hexathons.find((hexathon: any) => hexathon.id === hexathonId) }),
    [hexathons, hexathonId]
  );

  return (
    <CurrentHexathonContext.Provider value={value}>{children}</CurrentHexathonContext.Provider>
  );
};

export { CurrentHexathonProvider };

import React, { useContext, createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

const HexathonsContext = createContext<any>(null);

export function useHexathons() {
  return useContext(HexathonsContext);
}

const HexathonsProvider: React.FC = ({ children }) => {
  const [hexathons, setHexathons] = useState<any>([]);

  const value = useMemo(() => ({ hexathons }), [hexathons]);

  useEffect(() => {
    const getHexathons = async () => {
      const res = await axios.get(
        "http://hexathons.api.hexlabs.org/hexathons"
      );
      setHexathons(res.data.sort((a: any, b: any) => (
        (a.startDate < b.startDate) ? -1 : 1
      )));
    };
    getHexathons();
  }, []);

  return <HexathonsContext.Provider value={value}>{children}</HexathonsContext.Provider>;
};

export { HexathonsProvider };

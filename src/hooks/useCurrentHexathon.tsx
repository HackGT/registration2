/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHexathons } from "../contexts/HexathonsContext";

const useCurrentHexathon = () => {
  const [currentHexathon, setCurrentHexathon] = useState<any>({});
  const { hexathons } = useHexathons();
  const { hexathonId } = useParams();

  useEffect(() => {
    setCurrentHexathon(hexathons.find((hexathon: any) => hexathon._id === hexathonId));
  }, [hexathons, hexathonId]);

  return currentHexathon;
};

export default useCurrentHexathon;

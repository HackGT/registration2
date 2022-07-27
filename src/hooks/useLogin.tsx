import axios from "axios";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { app } from "../util/firebase";

const auth = getAuth(app);

export const useLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        if (searchParams.get("idToken")) {
          await axios.post("https://auth.api.hexlabs.org/auth/login", {
            idToken: searchParams.get("idToken"),
          });
        }

        const response = await axios.get("https://auth.api.hexlabs.org/auth/status");
        await signInWithCustomToken(auth, response.data.customToken);

        // If user's profile isn't valid, prevent them from logging in
        if (!response.data.validProfile) {
          setLoading(false);
          return;
        }

        setLoggedIn(true);
        setLoading(false);

        // Remove idToken from URL after we use it
        searchParams.delete("idToken");
        navigate(`${location.pathname}?${searchParams.toString()}`);
      } catch (err: any) {
        setLoading(false);
      }
    };

    login();
  }, []);

  return [loading, loggedIn];
};

import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import { FirebaseApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const useLogin = (app: FirebaseApp): [loading: boolean, loggedIn: boolean] => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useMemo(() => getAuth(app), [app]);

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        if (searchParams.get("idToken")) {
          await axios.post(apiUrl(Service.AUTH, "/auth/login"), {
            idToken: searchParams.get("idToken"),
          });
        }

        const response = await axios.get(apiUrl(Service.AUTH, "/auth/status"));
        await signInWithCustomToken(auth, response.data.customToken);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [loading, loggedIn];
};

export { useLogin };

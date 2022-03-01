import axios from "axios";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { app } from "../util/firebase";

const auth = getAuth(app);

export const useLogin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        if (searchParams.get("idToken")) {
          await axios.post(
            "https://users.api.hexlabs.org/auth/login",
            {
              idToken: searchParams.get("idToken"),
            },
            { withCredentials: true }
          );
        }

        const response = await axios.get(
          "https://users.api.hexlabs.org/auth/status",
          {
            withCredentials: true,
          }
        );

        signInWithCustomToken(auth, response.data.customToken);
        setLoggedIn(true);
        setLoading(false);

        // Remove idToken from URL after we use it
        searchParams.delete("idToken");
        navigate(location.pathname + "?" + searchParams.toString());
      } catch (err: any) {
        console.log(err.message);
        setLoading(false);
      }
    };

    login();
  }, [searchParams]);

  return [loading, loggedIn];
};

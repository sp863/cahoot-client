import { fetchApiPrivate } from "../api/apiConfig";
import { useEffect } from "react";
import useRefreshToken from "./refreshToken-hook";
import useAuth from "./auth-hook";

const useApiPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = fetchApiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = fetchApiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;
        if (error?.response?.status === 403 && !previousRequest?.sent) {
          previousRequest.sent = true;

          const newAccessToken = await refresh();
          previousRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return fetchApiPrivate(previousRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      fetchApiPrivate.interceptors.request.eject(requestIntercept);
      fetchApiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return fetchApiPrivate;
};

export default useApiPrivate;

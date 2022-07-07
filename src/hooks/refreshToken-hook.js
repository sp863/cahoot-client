import useAuth from "./auth-hook";
import { refreshUser } from "../api/authApi";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await refreshUser();
    const user = response.data.user;
    const accessToken = response.data.accessToken;

    setAuth({ user, accessToken });

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

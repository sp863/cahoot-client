import { fetchApi } from "./apiConfig";

export const createUser = async (newUserInfo) => {
  const response = await fetchApi.post("api/auth/new", newUserInfo);

  return response;
};

export const loginUser = async (email, password) => {
  const response = await fetchApi.post("api/auth/login", { email, password });

  return response;
};

export const logoutUser = async () => {
  const response = await fetchApi.post("api/auth/logout");

  return response;
};

export const refreshUser = async () => {
  const response = await fetchApi.get("api/auth/refresh");

  return response;
};

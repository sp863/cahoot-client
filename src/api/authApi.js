import fetchApi from "./apiConfig";

export const getUser = async (email) => {
  const response = await fetchApi.get("api/users", {
    params: {
      email,
    },
  });

  return response;
};

export const createUser = async (newUserInfo) => {
  const response = await fetchApi.post("api/users", newUserInfo);

  return response;
};

export const updateUser = async ({ nickname, email }) => {
  const response = await fetchApi.patch("api/users", { nickname, email });

  return response;
};

import fetchApi from "./apiConfig";

export const getUser = async ({ user_id }) => {
  const response = await fetchApi.get(`api/users/${user_id}`);

  return response;
};

export const getUserFaceId = async ({ user_id }) => {
  const response = await fetchApi.get(`api/users/${user_id}/face-id`, {});

  return response;
};

export const registerUserFaceId = async (formData) => {
  const response = await fetchApi.post(`api/users/face-id`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
// export const registerUserFaceId = async (user_id, formData) => {
//   const response = await fetchApi.post(
//     `api/users/${user_id}/face-id`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return response;
// };

export const getUserProfileImage = async ({ user_id }) => {
  const response = await fetchApi.get(`api/users/${user_id}/profile_img`, {});

  return response;
};

export const updateUserProfileImage = async ({ user_id }) => {
  const response = await fetchApi.patch(`api/users/${user_id}/profile-img`, {});

  return response;
};

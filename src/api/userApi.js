import { fetchApi } from "./apiConfig";

export const getUser = async ({ user_id }) => {
  const response = await fetchApi.get(`api/users/${user_id}`);

  return response;
};

export const getUserFaceId = async ({ user_id }) => {
  const response = await fetchApi.get(`api/users/${user_id}/face-id`, {});

  return response;
};

export const registerUserFaceId = async (fetchApiPrviate, formData) => {
  const response = await fetchApiPrviate.post(`api/users/face-id`, formData, {
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

export const getUserProfileImage = async (fetchApiPrivate, user_id) => {
  const response = await fetchApiPrivate.get(
    `api/users/${user_id}/profile-image`
  );

  return response;
};

export const updateUserProfileImage = async ({ user_id }) => {
  const response = await fetchApi.patch(`api/users/${user_id}/:image-key`, {});

  return response;
};

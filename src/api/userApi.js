import { fetchApi } from "./apiConfig";

export const getUser = async ({ user_id }) => {
  const response = await fetchApi.get(`api/users/${user_id}`);

  return response;
};

export const getMyProjects = async (fetchApiPrivate, user_id) => {
  const response = await fetchApiPrivate.get(`api/users/${user_id}/projects`);

  return response;
};

export const getUserFaceId = async (fetchApiPrivate, user_id) => {
  const response = await fetchApiPrivate.get(`api/users/${user_id}/face-id`);

  return response;
};

export const verifyFaceId = async (user_id, fetchApiPrivate, faceData) => {
  const response = await fetchApiPrivate.post(
    `api/users/${user_id}/face-id/verification`,
    faceData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

export const registerUserFaceId = async (
  fetchApiPrviate,
  user_id,
  faceData
) => {
  const response = await fetchApiPrviate.post(
    `api/users/${user_id}/face-id/new`,
    faceData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

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

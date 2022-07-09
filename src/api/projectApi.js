export const createProject = async ({ fetchApiPrivate, newProjectInfo }) => {
  const response = await fetchApiPrivate.post(
    "api/projects/new",
    newProjectInfo
  );

  return response;
};

export const createProject = async ({ fetchApiPrivate, newProjectInfo }) => {
  const response = await fetchApiPrivate.post(
    "api/projects/new",
    newProjectInfo
  );

  return response;
};

export const getProject = async (fetchApiPrivate, project_id) => {
  const response = await fetchApiPrivate.get(`api/projects/${project_id}`);

  return response;
};

export const createTask = async ({ fetchApiPrivate, project_id, taskData }) => {
  const response = await fetchApiPrivate.post(
    `api/projects/${project_id}/tasks/new`,
    taskData
  );

  return response;
};

export const updateTask = async ({
  fetchApiPrivate,
  project_id,
  task_id,
  taskData,
}) => {
  const response = await fetchApiPrivate.patch(
    `api/projects/${project_id}/tasks/${task_id}`,
    taskData
  );

  return response;
};

export const sendInvitationEmail = async ({
  fetchApiPrivate,
  project_id,
  emailData,
}) => {
  const response = await fetchApiPrivate.post(
    `api/projects/${project_id}/invite`,
    emailData
  );

  return response;
};

export const verifyInvitation = async (fetchApiPrivate, confirmationCode) => {
  const response = await fetchApiPrivate.patch(
    `api/projects/invite/verify`,
    confirmationCode
  );

  return response;
};

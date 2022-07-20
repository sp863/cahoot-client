export const uploadNewDocForm = async ({ fetchApiPrivate, formData }) => {
  const response = await fetchApiPrivate.post("api/docs/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const getProjectDocFormsList = async (fetchApiPrivate, project_id) => {
  const response = await fetchApiPrivate.get(`api/docs/${project_id}/forms`);

  return response;
};

export const getDocumentForm = async (fetchApiPrivate, form_id) => {
  const response = await fetchApiPrivate.get(`api/docs/${form_id}`);

  return response;
};

export const getDocumentFormFile = async (fetchApiPrivate, form_id) => {
  const response = await fetchApiPrivate.get(`api/docs/${form_id}/file`);

  return response;
};

export const signDocumentForm = async ({
  fetchApiPrivate,
  form_id,
  inputData,
  user_id,
}) => {
  const response = await fetchApiPrivate.patch(`api/docs/${form_id}/sign`, {
    inputData,
    user_id,
  });

  return response;
};

export const uploadSignedFormImages = async ({
  fetchApiPrivate,
  form_id,
  pageData,
}) => {
  const response = await fetchApiPrivate.patch(
    `api/docs/${form_id}/images`,
    pageData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

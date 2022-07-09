export const uploadNewDocForm = async ({ fetchApiPrivate, formData }) => {
  const response = await fetchApiPrivate.post("api/docs/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const getProjectDocFormsList = async (fetchApiPrivate, project_id) => {
  const response = await fetchApiPrivate.get(`api/docs/${project_id}`);

  return response;
};

export const getDocumentForm = async (fetchApiPrivate, form_id) => {
  const response = await fetchApiPrivate.get(`api/docs/${form_id}`);

  return response;
};

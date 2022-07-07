export const uploadNewDocForm = async (fetchApiPrivate, formData) => {
  const response = await fetchApiPrivate.post("api/docs/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

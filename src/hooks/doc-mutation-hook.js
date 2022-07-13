import { useMutation, useQueryClient } from "react-query";
import { uploadNewDocForm, uploadSignedFormImages } from "../api/docApi";

const useFormMutation = () => {
  const queryClient = useQueryClient();

  const uploadFormMutation = useMutation(uploadNewDocForm, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms");
    },
  });

  const uploadFormImagesMutation = useMutation(uploadSignedFormImages, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms");
    },
  });

  return {
    uploadFormMutation,
    uploadFormImagesMutation,
  };
};

export default useFormMutation;

import { useMutation, useQueryClient } from "react-query";
import { signDocumentForm, uploadNewDocForm } from "../api/docApi";

const useFormMutation = () => {
  const queryClient = useQueryClient();

  const uploadFormMutation = useMutation(uploadNewDocForm, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms");
    },
  });

  const signFormMutation = useMutation(signDocumentForm, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms");
    },
  });

  return {
    uploadFormMutation,
    signFormMutation,
  };
};

export default useFormMutation;

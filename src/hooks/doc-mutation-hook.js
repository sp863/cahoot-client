import { useMutation, useQueryClient } from "react-query";
import { uploadNewDocForm } from "../api/docApi";

const useFormMutation = () => {
  const queryClient = useQueryClient();

  const uploadFormMutation = useMutation(uploadNewDocForm, {
    onSuccess: () => {
      queryClient.invalidateQueries("forms");
    },
  });

  return {
    uploadFormMutation,
  };
};

export default useFormMutation;

import { useMutation, useQueryClient } from "react-query";
import { createProject } from "../api/projectApi";

const useProjectMutation = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation(createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
    },
  });

  return {
    createProjectMutation,
  };
};

export default useProjectMutation;

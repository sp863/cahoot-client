import { useMutation, useQueryClient } from "react-query";
import { createProject, createTask, updateTask } from "../api/projectApi";

const useProjectMutation = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation(createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
    },
  });

  const createTaskMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
    },
  });

  const updateTaskMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
    },
  });

  return {
    createProjectMutation,
    createTaskMutation,
    updateTaskMutation,
  };
};

export default useProjectMutation;

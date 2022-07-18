import { useMutation, useQueryClient } from "react-query";
import { createRoom } from "../api/chatApi";

const useChatMutation = () => {
  const queryClient = useQueryClient();

  const createRoomMutation = useMutation(createRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
    },
  });

  return {
    createRoomMutation,
  };
};

export default useChatMutation;

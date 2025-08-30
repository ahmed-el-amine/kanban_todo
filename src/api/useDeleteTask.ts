import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useTodoStore from "../store/useTodoStore";

const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`https://68b3130dc28940c9e69e1693.mockapi.io/tasks/${id}`);
};

function useDeleteTask() {
  const removeTask = useTodoStore((state) => state.removeTask);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, id) => {
      removeTask(id);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export default useDeleteTask;

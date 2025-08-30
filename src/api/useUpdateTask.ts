import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useTodoStore, { type Todo } from "../store/useTodoStore";

type UpdateTodo = { id: string } & Partial<Omit<Todo, "id">>;

const updateTask = async (task: UpdateTodo): Promise<Todo> => {
  const { id, ...rest } = task;
  const { data } = await axios.put<Todo>(`https://68b3130dc28940c9e69e1693.mockapi.io/tasks/${id}`, rest);
  return data;
};

function useUpdateTask() {
  const updateTaskInStore = useTodoStore((state) => state.updateTask);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      updateTaskInStore(updatedTask);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export default useUpdateTask;

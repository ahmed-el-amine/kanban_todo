import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useTodoStore, { type Todo } from "../store/useTodoStore";

const createTask = async (task: Omit<Todo, "id">): Promise<Todo> => {
  const { data } = await axios.post<Todo>("https://68b3130dc28940c9e69e1693.mockapi.io/tasks", task);
  return data;
};

function useCreateTask() {
  const addTask = useTodoStore((state) => state.addTask);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      addTask(newTask);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export default useCreateTask;

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTodoStore, { type Todo } from "../store/useTodoStore";
import { useEffect } from "react";

const searchTasks = async (query: string): Promise<Todo[]> => {
  try {
    const { data } = await axios.get<Todo[]>(`https://68b3130dc28940c9e69e1693.mockapi.io/tasks`, { params: { title: query } });

    return data;
  } catch {
    return [];
  }
};

function useSearchTasks(query: string, enabled: boolean = false) {
  const setTasks = useTodoStore((state) => state.setTasks);

  const queryResult = useQuery({
    queryKey: ["tasks", "search", query],
    queryFn: () => searchTasks(query),
    enabled,
  });

  useEffect(() => {
    if (queryResult.data) {
      setTasks(queryResult.data);
    }
  }, [queryResult.data, setTasks]);

  return queryResult;
}

export default useSearchTasks;

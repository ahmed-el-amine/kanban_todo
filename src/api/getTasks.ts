import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTodoStore, { type Todo } from "../store/useTodoStore";
import { useEffect } from "react";

const fetchTasks = async (): Promise<Todo[]> => {
  const { data } = await axios.get<Todo[]>("https://68b3130dc28940c9e69e1693.mockapi.io/tasks");
  return data;
};

function useFetchTasks() {
  const setTasks = useTodoStore((state) => state.setTasks);

  // Run the query
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    if (query.data) {
      setTasks(query.data);
    }
  }, [query.data, setTasks]);

  return query;
}

export default useFetchTasks;

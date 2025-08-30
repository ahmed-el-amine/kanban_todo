import toast from "react-hot-toast";
import useUpdateTask from "../api/useUpdateTask";
import useTodoStore, { Columns } from "../store/useTodoStore";

function handleDrop(e: React.DragEvent, toCol: Columns, updateTaskProps: ReturnType<typeof useUpdateTask>) {
  const id = String(e.dataTransfer.getData("taskId"));
  const currentColumn = String(e.dataTransfer.getData("column"));
  const { mutate: updateTask } = updateTaskProps;
  if (currentColumn === toCol) return;

  const updatedAt = new Date();
  useTodoStore.setState((state) => {
    return { ...state, tasks: state.tasks.map((t) => (t.id === id ? { ...t, updatedAt, column: toCol || "backlog" } : t)) };
  });

  try {
    updateTask({
      id,
      column: toCol || "backlog",
      updatedAt,
    });
  } catch {
    toast.error("❌ Failed to update task");
  }
}

export default handleDrop;

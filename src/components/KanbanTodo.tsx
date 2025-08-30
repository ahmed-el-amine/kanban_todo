import { Grid } from "@mui/material";
import useTodoStore, { Columns } from "../store/useTodoStore";
import useFetchTasks from "../api/getTasks";
import Column from "./Column";
import { DialogContainer, useDialogConfig } from "../hooks/useDialog";
import Filters from "./Filters";

const columns = ["backlog", "progress", "review", "done"];

const KanbanTodo = () => {
  const config = useDialogConfig({
    title: "Create New Task",
    confirmBtnContent: "Create Task",
    confirmBtnProps: { variant: "contained" },
    closeDialogOnConfirm: false,
    closeDialogOnClickAway: false,
  });

  const { isLoading, isError, error } = useFetchTasks();
  const tasks = useTodoStore((state) => state.tasks);

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  const grouped = columns.reduce((acc: Record<string, typeof tasks>, col) => {
    acc[col] = tasks.filter((t) => t.column === col);
    return acc;
  }, {});

  return (
    <Grid size={12}>
      <Filters />
      <Grid container spacing={2} flexWrap={"nowrap"}>
        {columns.map((col, idx) => (
          <Column key={col + idx} title={col as Columns} todos={grouped[col]} dialog={config} />
        ))}

        <DialogContainer config={config} />
      </Grid>
    </Grid>
  );
};

export default KanbanTodo;

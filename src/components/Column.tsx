import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import type { UseDialogConfig } from "../hooks/useDialog";
import type { Columns, Todo } from "../store/useTodoStore";
import handleDrop from "../utils/handleDrop";
import TaskCard from "./TaskCard";
import TaskForm, { type TaskFormData } from "./TaskForm";
import useCreateTask from "../api/useCreateTask";
import toast from "react-hot-toast";
import useUpdateTask from "../api/useUpdateTask";

interface ColumnProps {
  title: Columns;
  dialog: UseDialogConfig;
  todos: Todo[];
}
const Column = (props: ColumnProps) => {
  const { mutateAsync: createTaskAction } = useCreateTask();
  const updateTaskAction = useUpdateTask();
  const [isOver, setIsOver] = useState(false);

  const openCreateTaskDialog = () => {
    props.dialog.setSettings({
      isOpen: true,
      content: <TaskForm dialog={props.dialog} onSubmit={createTask} initForm={{ column: props.title }} />,
    });
  };

  const createTask = async (formData: TaskFormData): Promise<boolean> => {
    try {
      await createTaskAction({
        title: formData.title,
        description: formData.description,
        column: formData.column || "backlog",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("✅ Task created successfully");
      return true;
    } catch {
      toast.error("❌ Failed to create task");
      return false;
    }
  };

  return (
    <Grid
      size={3}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        handleDrop(e, props.title, updateTaskAction);
        setIsOver(false);
      }}
      minHeight={500}
      sx={{
        border: "1px solid",
        borderColor: (x) => x.palette.divider,
        backgroundColor: isOver ? "action.hover" : "transparent",
        transition: "background-color 0.3s ease",
        minWidth: 250,
      }}
    >
      <Paper sx={{ height: "100%" }}>
        <Grid container alignItems={"center"} justifyContent={"space-between"} size={12} sx={{ p: 1 }}>
          <Grid>
            <Typography>{props.title.toUpperCase()}</Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} sx={{ p: 1 }}>
          {props.todos
            .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
            .map((task) => (
              <TaskCard key={task.id} todo={task} dialog={props.dialog} />
            ))}

          <Button variant="outlined" sx={{ width: "100%" }} onClick={openCreateTaskDialog}>
            Create Task
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Column;

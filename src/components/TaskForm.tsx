import { Grid, Grow, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { UseDialogConfig } from "../hooks/useDialog";
import type { Todo } from "../store/useTodoStore";

interface TaskFormProps {
  dialog: UseDialogConfig;
  initForm?: Partial<TaskFormData>;
  onSubmit: (formData: TaskFormData) => Promise<boolean> | boolean;
}
const columns = ["backlog", "progress", "review", "done"];

export type TaskFormData = Omit<Todo, "createdAt" | "updatedAt" | "id">;
const initFormData: TaskFormData = {
  title: "",
  description: "",
  column: "backlog",
};

const TaskForm = (props: TaskFormProps) => {
  const [form, setForm] = useState<TaskFormData>({ ...initFormData, ...props.initForm });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (): Promise<boolean> => {
    let formData: TaskFormData = initFormData;
    setForm((x) => {
      formData = x;
      return x;
    });

    if (!formData.title || !formData.column) {
      return false;
    }

    return await props.onSubmit(formData);
  };

  useEffect(() => {
    props.dialog.setSettings({
      async onConfirm() {
        if (await handleSubmit()) props.dialog.setSettings({ isOpen: false });
      },
    });
  }, []);

  return (
    <Grow in timeout={400}>
      <Grid container size={12} gap={2}>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} fullWidth />
        <TextField
          select
          label="Column"
          name="column"
          value={form.column}
          onChange={handleChange}
          fullWidth
          slotProps={{
            select: {
              MenuProps: {
                disablePortal: true,
              },
            },
          }}
        >
          {columns.map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grow>
  );
};

export default TaskForm;

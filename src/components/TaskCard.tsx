import { Check, Delete, Edit, MoreHoriz } from "@mui/icons-material";
import { Grid, Grow, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import useDeleteTask from "../api/useDeleteTask";
import useUpdateTask from "../api/useUpdateTask";
import { type UseDialogConfig } from "../hooks/useDialog";
import type { Todo } from "../store/useTodoStore";
import TaskForm, { type TaskFormData } from "./TaskForm";

interface TaskCardProps {
  todo: Todo;
  dialog: UseDialogConfig;
}

const TaskCard = (props: TaskCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { mutateAsync: deleteTask } = useDeleteTask();
  const updateTaskAction = useUpdateTask();

  const onDelete = () => {
    props.dialog.setSettings({
      isOpen: true,
      title: "Delete Task",
      content: (
        <Grid size={12}>
          <Typography>Are you sure you want to delete this task?</Typography>
          <br />
          <Typography variant="caption">{props.todo.title}</Typography>
        </Grid>
      ),
      confirmBtnContent: "Delete Task",
      confirmBtnProps: { variant: "outlined", color: "error", endIcon: <Delete /> },
      cancelBtnContent: "Cancel",
      cancelBtnProps: { variant: "contained", color: "primary", endIcon: <Check /> },
      onConfirm: async () => {
        try {
          await deleteTask(props.todo.id);
          toast.success("✅ Task deleted successfully");
        } catch {
          toast.error("❌ Failed to delete task");
        }
        props.dialog.setSettings({ isOpen: false });
      },
    });
    handleClose();
  };

  const onEdit = () => {
    props.dialog.setSettings({
      isOpen: true,
      title: "Edit Task",
      content: <TaskForm dialog={props.dialog} onSubmit={editTask} initForm={props.todo} />,
      confirmBtnContent: "Edit Task",
      confirmBtnProps: { variant: "contained", color: "primary", endIcon: <Edit /> },
    });
  };

  const editTask = async (formData: TaskFormData): Promise<boolean> => {
    try {
      await updateTaskAction.mutateAsync({
        id: props.todo.id,
        title: formData.title,
        description: formData.description,
        column: formData.column || "backlog",
        updatedAt: new Date(),
      });
      toast.success("✅ Task updated successfully");
      return true;
    } catch {
      toast.error("❌ Failed to update task");
      return false;
    }
  };

  return (
    <Grow in timeout={400}>
      <Grid size={12}>
        <Paper
          variant="outlined"
          sx={{ p: 2, cursor: "grab" }}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("taskId", String(props.todo.id));
            e.dataTransfer.setData("column", String(props.todo.column));
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <Grid size={12} container justifyContent={"space-between"} alignItems={"flex-start"} flexWrap={"nowrap"}>
            <Typography variant="subtitle1">{props.todo.title}</Typography>
            <IconButton size="small" color="primary" onClick={handleClick}>
              <MoreHoriz />
            </IconButton>
          </Grid>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {props.todo.description}
          </Typography>
        </Paper>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={onEdit}>
            <ListItemIcon>
              <Edit color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>

          <MenuItem onClick={onDelete}>
            <ListItemIcon>
              <Delete color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Grid>
    </Grow>
  );
};

export default TaskCard;

import { create } from "zustand";

export const Columns = {
  backlog: "backlog",
  progress: "progress",
  review: "review",
  done: "done",
} as const;

export type Columns = (typeof Columns)[keyof typeof Columns];

export interface Todo {
  id: string;
  title: string;
  description: string;
  column: Columns;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoStore {
  tasks: Todo[];
  setTasks: (tasks: Todo[]) => void;
  addTask: (tasks: Todo) => void;
  removeTask: (id: string) => void;
  updateTask: (task: Todo) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ ...state, tasks: [...state.tasks, task] })),
  removeTask: (id) => set((state) => ({ ...state, tasks: state.tasks.filter((t) => t.id !== id) })),
  updateTask: (task) => set((state) => ({ ...state, tasks: state.tasks.map((t) => (t.id === task.id ? task : t)) })),
}));

export default useTodoStore;

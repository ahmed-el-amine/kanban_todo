import { Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KanbanTodo from "./components/KanbanTodo";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth={"xl"}>
        <KanbanTodo />
        <Toaster position="top-right" />
      </Container>
    </QueryClientProvider>
  );
}

export default App;

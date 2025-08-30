import { Grid, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useSearchTasks from "../api/useSearchTasks";

const Filters = () => {
  const useSearch = useRef(false);

  const [search, setSearch] = useState("");
  useSearchTasks(search, useSearch.current);

  useEffect(() => {
    if (useSearch.current) return;
    useSearch.current = true;
  }, [search]);

  return (
    <Grid size={12} sx={{ mb: 1 }}>
      <TextField label="Search" fullWidth variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)} />
    </Grid>
  );
};

export default Filters;

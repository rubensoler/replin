// components/Dashboard.jsx
import { Box, Typography } from "@mui/material";

export default function Usuarios() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard
      </Typography>
      <Typography variant="body1">
        Usuarios
      </Typography>
    </Box>
  );
}

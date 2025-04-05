import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Box
} from "@mui/material";

export default function CargoTable() {
  const [cargos, setCargos] = useState([]);
  const [open, setOpen] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCargos = async () => {
    const res = await fetch("http://localhost:8000/cargos/");
    const data = await res.json();
    setCargos(data);
  };

  const saveCargo = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `http://localhost:8000/cargos/${editId}` : "http://localhost:8000/cargos/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion }),
    });
    handleClose();
    fetchCargos();
  };

  const deleteCargo = async (id) => {
    await fetch(`http://localhost:8000/cargos/${id}`, { method: "DELETE" });
    fetchCargos();
  };

  const editCargo = (cargo) => {
    setEditId(cargo.id);
    setDescripcion(cargo.descripcion);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDescripcion("");
    setEditId(null);
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, width: '100%', maxWidth: '900px' }}>
        <Typography variant="h5">Cargos</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Nuevo Cargo
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ maxWidth: '900px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargos.map((cargo) => (
              <TableRow key={cargo.id}>
                <TableCell>{cargo.id}</TableCell>
                <TableCell>{cargo.descripcion}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button variant="outlined" onClick={() => editCargo(cargo)}>Editar</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteCargo(cargo.id)}>
                      Eliminar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Editar Cargo" : "Nuevo Cargo"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={saveCargo}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


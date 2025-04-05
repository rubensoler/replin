import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Stack
} from "@mui/material";

export default function PlantaTable() {
  const [plantas, setPlantas] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [contratoId, setContratoId] = useState("");

  const fetchPlantas = async () => {
    const res = await axios.get("http://localhost:8000/plantas/");
    setPlantas(res.data);
  };

  const fetchContratos = async () => {
    const res = await axios.get("http://localhost:8000/contratos/");
    setContratos(res.data);
  };

  const handleOpen = (planta = null) => {
    if (planta) {
      setEditId(planta.id);
      setNombre(planta.nombre);
      setDescripcion(planta.descripcion || "");
      setMunicipio(planta.municipio || "");
      setLocalizacion(planta.localizacion || "");
      setContratoId(planta.contrato_id);
    } else {
      setEditId(null);
      setNombre("");
      setDescripcion("");
      setMunicipio("");
      setLocalizacion("");
      setContratoId("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const savePlanta = async () => {
    const payload = {
      nombre,
      descripcion,
      municipio,
      localizacion,
      contrato_id: Number(contratoId),
    };
    if (editId) {
      await axios.put(`http://localhost:8000/plantas/${editId}`, payload);
    } else {
      await axios.post("http://localhost:8000/plantas/", payload);
    }
    fetchPlantas();
    handleClose();
  };

  const deletePlanta = async (id) => {
    await axios.delete(`http://localhost:8000/plantas/${id}`);
    fetchPlantas();
  };

  useEffect(() => {
    fetchPlantas();
    fetchContratos();
  }, []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Plantas</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Nueva Planta</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Municipio</TableCell>
              <TableCell>Localización</TableCell>
              <TableCell>Contrato</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantas.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.descripcion}</TableCell>
                <TableCell>{p.municipio}</TableCell>
                <TableCell>{p.localizacion}</TableCell>
                <TableCell>{contratos.find(c => c.id === p.contrato_id)?.nombre || "—"}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button variant="outlined" onClick={() => handleOpen(p)}>Editar</Button>
                    <Button variant="outlined" color="error" onClick={() => deletePlanta(p.id)}>Eliminar</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Editar Planta" : "Nueva Planta"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Municipio"
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Localización"
            value={localizacion}
            onChange={(e) => setLocalizacion(e.target.value)}
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Contrato"
            value={contratoId}
            onChange={(e) => setContratoId(e.target.value)}
          >
            {contratos.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={savePlanta}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

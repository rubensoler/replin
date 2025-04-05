import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SubsistemaTable() {
  const [subsistemas, setSubsistemas] = useState([]);
  const [sistemas, setSistemas] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    modo: "crear",
    subsistema: { codigo: "", nombre: "", descripcion: "", sistema_id: "" }
  });

  const cargarSubsistemas = async () => {
    const res = await axios.get("http://localhost:8000/subsistemas/");
    setSubsistemas(res.data);
  };

  const cargarSistemas = async () => {
    const res = await axios.get("http://localhost:8000/sistemas/");
    setSistemas(res.data);
  };

  const abrirModal = (modo, subsistema = { codigo: "", nombre: "", descripcion: "", sistema_id: "" }) => {
    setModal({ open: true, modo, subsistema });
  };

  const cerrarModal = () => {
    setModal({ open: false, modo: "crear", subsistema: { codigo: "", nombre: "", descripcion: "", sistema_id: "" } });
  };

  const guardarSubsistema = async () => {
    const { subsistema, modo } = modal;
    const payload = {
      codigo: subsistema.codigo,
      nombre: subsistema.nombre,
      descripcion: subsistema.descripcion,
      sistema_id: subsistema.sistema_id
    };
    if (modo === "crear") {
      await axios.post("http://localhost:8000/subsistemas/", payload);
    } else {
      await axios.put(`http://localhost:8000/subsistemas/${subsistema.id}`, payload);
    }
    cerrarModal();
    cargarSubsistemas();
  };

  const eliminarSubsistema = async (id) => {
    await axios.delete(`http://localhost:8000/subsistemas/${id}`);
    cargarSubsistemas();
  };

  useEffect(() => {
    cargarSubsistemas();
    cargarSistemas();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Gestión de Subsistemas
      </Typography>
      <Button variant="contained" onClick={() => abrirModal("crear")}>Agregar Subsistema</Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Sistema</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subsistemas.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.codigo}</TableCell>
                <TableCell>{s.nombre}</TableCell>
                <TableCell>{s.descripcion}</TableCell>
                <TableCell>{sistemas.find(sys => sys.id === s.sistema_id)?.nombre || `ID: ${s.sistema_id}`}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => abrirModal("editar", { ...s })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => eliminarSubsistema(s.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modal.open} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle>{modal.modo === "crear" ? "Nuevo Subsistema" : "Editar Subsistema"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Código" fullWidth value={modal.subsistema.codigo} onChange={(e) => setModal({ ...modal, subsistema: { ...modal.subsistema, codigo: e.target.value } })} />
            <TextField label="Nombre" fullWidth value={modal.subsistema.nombre} onChange={(e) => setModal({ ...modal, subsistema: { ...modal.subsistema, nombre: e.target.value } })} />
            <TextField label="Descripción" fullWidth value={modal.subsistema.descripcion} onChange={(e) => setModal({ ...modal, subsistema: { ...modal.subsistema, descripcion: e.target.value } })} />
            <FormControl fullWidth>
              <InputLabel>Sistema</InputLabel>
              <Select
                value={modal.subsistema.sistema_id || ""}
                onChange={(e) => setModal({ ...modal, subsistema: { ...modal.subsistema, sistema_id: e.target.value } })}
                label="Sistema"
              >
                {sistemas.map((sys) => (
                  <MenuItem key={sys.id} value={sys.id}>{sys.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit">Cancelar</Button>
          <Button onClick={guardarSubsistema} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

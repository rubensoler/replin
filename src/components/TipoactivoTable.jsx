import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TipoactivoTable() {
  const [tipos, setTipos] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    modo: "crear",
    tipo: { descripcion: "", imagen: "" }
  });

  const cargarTipos = async () => {
    const res = await axios.get("http://localhost:8000/tipos-activo/");
    setTipos(res.data);
  };

  const abrirModal = (modo, tipo = { descripcion: "", imagen: "" }) => {
    setModal({ open: true, modo, tipo });
  };

  const cerrarModal = () => {
    setModal({ open: false, modo: "crear", tipo: { descripcion: "", imagen: "" } });
  };

  const guardarTipo = async () => {
    const { tipo, modo } = modal;
    const payload = {
      descripcion: tipo.descripcion,
      imagen: tipo.imagen
    };
    if (modo === "crear") {
      await axios.post("http://localhost:8000/tipos-activo/", payload);
    } else {
      await axios.put(`http://localhost:8000/tipos-activo/${tipo.id}`, payload);
    }
    cerrarModal();
    cargarTipos();
  };

  const eliminarTipo = async (id) => {
    await axios.delete(`http://localhost:8000/tipos-activo/${id}`);
    cargarTipos();
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tipos de Activo
      </Typography>
      <Button variant="contained" onClick={() => abrirModal("crear")}>Nuevo Tipo</Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tipos.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.descripcion}</TableCell>
                <TableCell>{t.imagen}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => abrirModal("editar", { ...t })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => eliminarTipo(t.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modal.open} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle>{modal.modo === "crear" ? "Nuevo Tipo de Activo" : "Editar Tipo de Activo"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Descripción"
            value={modal.tipo.descripcion}
            onChange={(e) => setModal({ ...modal, tipo: { ...modal.tipo, descripcion: e.target.value } })}
          />
          <TextField
            fullWidth margin="dense" label="Imagen"
            value={modal.tipo.imagen}
            onChange={(e) => setModal({ ...modal, tipo: { ...modal.tipo, imagen: e.target.value } })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit">Cancelar</Button>
          <Button onClick={guardarTipo} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

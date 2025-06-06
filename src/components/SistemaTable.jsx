import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchFromAPI, postToAPI, putToAPI, deleteFromAPI } from "../utils/api";

export default function SistemaTable() {
  const [sistemas, setSistemas] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    modo: "crear",
    sistema: { codigo: "", nombre: "", descripcion: "", planta_id: "" }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const mostrarSnackbar = (mensaje, severidad = "success") => {
    setSnackbar({
      open: true,
      message: mensaje,
      severity: severidad
    });
  };

  const cargarSistemas = async () => {
    try {
      const data = await fetchFromAPI("/sistemas/");
      setSistemas(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar sistemas", "error");
    }
  };

  const cargarPlantas = async () => {
    try {
      const data = await fetchFromAPI("/plantas/");
      setPlantas(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar plantas", "error");
    }
  };

  const abrirModal = (modo, sistema = { codigo: "", nombre: "", descripcion: "", planta_id: "" }) => {
    setModal({ open: true, modo, sistema });
  };

  const cerrarModal = () => {
    setModal({
      open: false,
      modo: "crear",
      sistema: { codigo: "", nombre: "", descripcion: "", planta_id: "" }
    });
  };

  const guardarSistema = async () => {
    try {
      const { sistema, modo } = modal;
      const payload = {
        codigo: sistema.codigo,
        nombre: sistema.nombre,
        descripcion: sistema.descripcion,
        planta_id: sistema.planta_id
      };
      
      if (modo === "crear") {
        await postToAPI("/sistemas/", payload);
        mostrarSnackbar("Sistema creado con éxito");
      } else {
        await putToAPI(`/sistemas/${sistema.id}`, payload);
        mostrarSnackbar("Sistema actualizado con éxito");
      }
      
      cerrarModal();
      cargarSistemas();
    } catch (error) {
      mostrarSnackbar("Error al guardar sistema", "error");
    }
  };

  const eliminarSistema = async (id) => {
    try {
      await deleteFromAPI(`/sistemas/${id}`);
      mostrarSnackbar("Sistema eliminado con éxito");
      cargarSistemas();
    } catch (error) {
      mostrarSnackbar("Error al eliminar sistema", "error");
    }
  };

  useEffect(() => {
    cargarSistemas();
    cargarPlantas();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Gestión de Sistemas
      </Typography>
      <Button variant="contained" onClick={() => abrirModal("crear")}>
        Agregar Sistema
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Planta</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sistemas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay sistemas registrados</TableCell>
              </TableRow>
            ) : (
              sistemas.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.codigo}</TableCell>
                  <TableCell>{s.nombre}</TableCell>
                  <TableCell>{s.descripcion}</TableCell>
                  <TableCell>{plantas.find(p => p.id === s.planta_id)?.nombre || `ID: ${s.planta_id}`}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => abrirModal("editar", { ...s })}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => eliminarSistema(s.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modal.open} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle>{modal.modo === "crear" ? "Nuevo Sistema" : "Editar Sistema"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField 
              label="Código" 
              fullWidth 
              value={modal.sistema.codigo} 
              onChange={(e) => setModal({ ...modal, sistema: { ...modal.sistema, codigo: e.target.value } })} 
            />
            <TextField 
              label="Nombre" 
              fullWidth 
              value={modal.sistema.nombre} 
              onChange={(e) => setModal({ ...modal, sistema: { ...modal.sistema, nombre: e.target.value } })} 
            />
            <TextField 
              label="Descripción" 
              fullWidth 
              value={modal.sistema.descripcion} 
              onChange={(e) => setModal({ ...modal, sistema: { ...modal.sistema, descripcion: e.target.value } })} 
            />
            <FormControl fullWidth>
              <InputLabel>Planta</InputLabel>
              <Select
                value={modal.sistema.planta_id || ""}
                onChange={(e) => setModal({ ...modal, sistema: { ...modal.sistema, planta_id: e.target.value } })}
                label="Planta"
              >
                {plantas.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit">Cancelar</Button>
          <Button 
            onClick={guardarSistema} 
            variant="contained"
            disabled={!modal.sistema.codigo || !modal.sistema.nombre || !modal.sistema.planta_id}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

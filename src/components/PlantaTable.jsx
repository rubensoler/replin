import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Stack, Snackbar, Alert
} from "@mui/material";
import { fetchFromAPI, postToAPI, putToAPI, deleteFromAPI } from "../utils/api";

export default function PlantaTable() {
  const [plantas, setPlantas] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [contratoId, setContratoId] = useState("");

  const mostrarSnackbar = (mensaje, severidad = "success") => {
    setSnackbar({
      open: true,
      message: mensaje,
      severity: severidad
    });
  };

  const fetchPlantas = async () => {
    try {
      const data = await fetchFromAPI("/plantas/");
      setPlantas(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar plantas", "error");
    }
  };

  const fetchContratos = async () => {
    try {
      const data = await fetchFromAPI("/contratos/");
      setContratos(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar contratos", "error");
    }
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
    try {
      const payload = {
        nombre,
        descripcion,
        municipio,
        localizacion,
        contrato_id: Number(contratoId),
      };
      
      if (editId) {
        await putToAPI(`/plantas/${editId}`, payload);
        mostrarSnackbar("Planta actualizada con éxito");
      } else {
        await postToAPI("/plantas/", payload);
        mostrarSnackbar("Planta creada con éxito");
      }
      
      fetchPlantas();
      handleClose();
    } catch (error) {
      mostrarSnackbar("Error al guardar planta", "error");
    }
  };

  const deletePlanta = async (id) => {
    try {
      await deleteFromAPI(`/plantas/${id}`);
      mostrarSnackbar("Planta eliminada con éxito");
      fetchPlantas();
    } catch (error) {
      mostrarSnackbar("Error al eliminar planta", "error");
    }
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
            {plantas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay plantas registradas</TableCell>
              </TableRow>
            ) : (
              plantas.map((p) => (
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
              ))
            )}
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
            <MenuItem value="">Seleccionar contrato</MenuItem>
            {contratos.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={savePlanta}
            disabled={!nombre || !municipio || !contratoId}
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
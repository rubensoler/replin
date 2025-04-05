import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack, Snackbar, Alert
} from "@mui/material";
import ClienteSelector from "./ClienteSelector";

export default function ContratoTable() {
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [clienteId, setClienteId] = useState("");

  const fetchContratos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/contratos/");
      setContratos(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar contratos: " + error.message,
        severity: "error"
      });
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/clientes/");
      setClientes(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar clientes: " + error.message,
        severity: "error"
      });
    }
  };

  const handleOpen = (contrato = null) => {
    if (contrato) {
      setEditId(contrato.id);
      setNombre(contrato.nombre);
      setDescripcion(contrato.descripcion || "");
      setClienteId(contrato.cliente_id);
    } else {
      setEditId(null);
      setNombre("");
      setDescripcion("");
      setClienteId("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveContrato = async () => {
    try {
      const payload = {
        nombre,
        descripcion,
        cliente_id: Number(clienteId),
      };
      
      if (editId) {
        await axios.put(`http://localhost:8000/contratos/${editId}`, payload);
        setSnackbar({
          open: true,
          message: "Contrato actualizado correctamente",
          severity: "success"
        });
      } else {
        await axios.post("http://localhost:8000/contratos/", payload);
        setSnackbar({
          open: true,
          message: "Contrato creado correctamente",
          severity: "success"
        });
      }
      fetchContratos();
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar contrato: " + error.message,
        severity: "error"
      });
    }
  };

  const deleteContrato = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/contratos/${id}`);
      setSnackbar({
        open: true,
        message: "Contrato eliminado correctamente",
        severity: "success"
      });
      fetchContratos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar contrato: " + error.message,
        severity: "error"
      });
    }
  };

  useEffect(() => {
    fetchContratos();
    fetchClientes();
  }, []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Contratos</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Nuevo Contrato</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contratos.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.descripcion}</TableCell>
                <TableCell>{clientes.find(cl => cl.id === c.cliente_id)?.nombre || "—"}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button variant="outlined" onClick={() => handleOpen(c)}>Editar</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteContrato(c.id)}>Eliminar</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Editar Contrato" : "Nuevo Contrato"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
          />
          <ClienteSelector
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={saveContrato}
            disabled={!nombre || !clienteId}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
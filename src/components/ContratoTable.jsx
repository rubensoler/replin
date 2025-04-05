import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Stack
} from "@mui/material";

export default function ContratoTable() {
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [clienteId, setClienteId] = useState("");

  const fetchContratos = async () => {
    const res = await axios.get("http://localhost:8000/contratos/");
    setContratos(res.data);
  };

  const fetchClientes = async () => {
    const res = await axios.get("http://localhost:8000/clientes/");
    setClientes(res.data);
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
    const payload = {
      nombre,
      descripcion,
      cliente_id: Number(clienteId),
    };
    if (editId) {
      await axios.put(`http://localhost:8000/contratos/${editId}`, payload);
    } else {
      await axios.post("http://localhost:8000/contratos/", payload);
    }
    fetchContratos();
    handleClose();
  };

  const deleteContrato = async (id) => {
    await axios.delete(`http://localhost:8000/contratos/${id}`);
    fetchContratos();
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
              <TableCell>Plantas</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contratos.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.descripcion}</TableCell>
                <TableCell>{clientes.find(cl => cl.id === c.cliente_id)?.nombre || "—"}</TableCell>
                <TableCell>{c.plantas?.map(p => p.nombre).join(", ") || "—"}</TableCell>
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
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            {clientes.map((cl) => (
              <MenuItem key={cl.id} value={cl.id}>{cl.nombre}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={saveContrato}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

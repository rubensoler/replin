import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

export default function ClienteTable() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", descripcion: "" });
  const [editando, setEditando] = useState(null);
  const [editCliente, setEditCliente] = useState({});

  const fetchClientes = async () => {
    const res = await axios.get("http://localhost:8000/clientes/");
    setClientes(res.data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e, estado, setEstado) => {
    const { name, value } = e.target;
    setEstado({ ...estado, [name]: value });
  };

  const crearCliente = async () => {
    await axios.post("http://localhost:8000/clientes/", nuevoCliente);
    setNuevoCliente({ nombre: "", descripcion: "" });
    fetchClientes();
  };

  const actualizarCliente = async (id) => {
    await axios.put(`http://localhost:8000/clientes/${id}`, editCliente);
    setEditando(null);
    setEditCliente({});
    fetchClientes();
  };

  const eliminarCliente = async (id) => {
    await axios.delete(`http://localhost:8000/clientes/${id}`);
    fetchClientes();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Clientes</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Crear nuevo cliente:</Typography>
        <Box display="flex" gap={2} alignItems="center" mt={1}>
          <TextField label="Nombre" name="nombre" value={nuevoCliente.nombre}
            onChange={(e) => handleChange(e, nuevoCliente, setNuevoCliente)} />
          <TextField label="Descripción" name="descripcion" value={nuevoCliente.descripcion}
            onChange={(e) => handleChange(e, nuevoCliente, setNuevoCliente)} />
          <Button variant="contained" onClick={crearCliente}>Crear</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  {editando === cliente.id ? (
                    <TextField name="nombre" value={editCliente.nombre}
                      onChange={(e) => handleChange(e, editCliente, setEditCliente)} />
                  ) : (
                    cliente.nombre
                  )}
                </TableCell>
                <TableCell>
                  {editando === cliente.id ? (
                    <TextField name="descripcion" value={editCliente.descripcion}
                      onChange={(e) => handleChange(e, editCliente, setEditCliente)} />
                  ) : (
                    cliente.descripcion
                  )}
                </TableCell>
                <TableCell>
                  {editando === cliente.id ? (
                    <>
                      <IconButton onClick={() => actualizarCliente(cliente.id)}><SaveIcon /></IconButton>
                      <IconButton onClick={() => setEditando(null)}><CancelIcon /></IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => {
                        setEditando(cliente.id);
                        setEditCliente({ nombre: cliente.nombre, descripcion: cliente.descripcion });
                      }}><EditIcon /></IconButton>
                      <IconButton onClick={() => eliminarCliente(cliente.id)}><DeleteIcon /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

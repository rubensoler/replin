import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, IconButton,
  Snackbar, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { fetchFromAPI, postToAPI, putToAPI, deleteFromAPI } from "../utils/api";

export default function ClienteTable() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", descripcion: "" });
  const [editando, setEditando] = useState(null);
  const [editCliente, setEditCliente] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchClientes = async () => {
    try {
      const data = await fetchFromAPI("/clientes/");
      setClientes(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar clientes",
        severity: "error"
      });
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e, estado, setEstado) => {
    const { name, value } = e.target;
    setEstado({ ...estado, [name]: value });
  };

  const crearCliente = async () => {
    try {
      await postToAPI("/clientes/", nuevoCliente);
      setNuevoCliente({ nombre: "", descripcion: "" });
      fetchClientes();
      setSnackbar({
        open: true,
        message: "Cliente creado con éxito",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al crear cliente",
        severity: "error"
      });
    }
  };

  const actualizarCliente = async (id) => {
    try {
      await putToAPI(`/clientes/${id}`, editCliente);
      setEditando(null);
      setEditCliente({});
      fetchClientes();
      setSnackbar({
        open: true,
        message: "Cliente actualizado con éxito",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al actualizar cliente",
        severity: "error"
      });
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await deleteFromAPI(`/clientes/${id}`);
      fetchClientes();
      setSnackbar({
        open: true,
        message: "Cliente eliminado con éxito",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar cliente",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Clientes</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Crear nuevo cliente:</Typography>
        <Box display="flex" gap={2} alignItems="center" mt={1}>
          <TextField 
            label="Nombre" 
            name="nombre" 
            value={nuevoCliente.nombre}
            onChange={(e) => handleChange(e, nuevoCliente, setNuevoCliente)} 
          />
          <TextField 
            label="Descripción" 
            name="descripcion" 
            value={nuevoCliente.descripcion}
            onChange={(e) => handleChange(e, nuevoCliente, setNuevoCliente)} 
          />
          <Button 
            variant="contained" 
            onClick={crearCliente} 
            disabled={!nuevoCliente.nombre}
          >
            Crear
          </Button>
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
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">No hay clientes registrados</TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    {editando === cliente.id ? (
                      <TextField 
                        name="nombre" 
                        value={editCliente.nombre}
                        onChange={(e) => handleChange(e, editCliente, setEditCliente)} 
                      />
                    ) : (
                      cliente.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {editando === cliente.id ? (
                      <TextField 
                        name="descripcion" 
                        value={editCliente.descripcion}
                        onChange={(e) => handleChange(e, editCliente, setEditCliente)} 
                      />
                    ) : (
                      cliente.descripcion
                    )}
                  </TableCell>
                  <TableCell>
                    {editando === cliente.id ? (
                      <>
                        <IconButton 
                          color="primary" 
                          onClick={() => actualizarCliente(cliente.id)}
                          disabled={!editCliente.nombre}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setEditando(null)}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          color="primary" 
                          onClick={() => {
                            setEditando(cliente.id);
                            setEditCliente({ 
                              nombre: cliente.nombre, 
                              descripcion: cliente.descripcion || "" 
                            });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => eliminarCliente(cliente.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
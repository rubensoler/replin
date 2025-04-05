import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function Aplicaciones() {
  const [aplicaciones, setAplicaciones] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [aplicacion, setAplicacion] = useState({ id: null, nombre: '', descripcion: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all aplicaciones from the API
  useEffect(() => {
    const fetchAplicaciones = async () => {
      try {
        const response = await axios.get('http://localhost:8000/aplicaciones/');
        setAplicaciones(response.data);
      } catch (error) {
        console.error('Error fetching aplicaciones:', error);
      }
    };
    fetchAplicaciones();
  }, []);

  // Handle opening and closing of the dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setAplicacion({ id: null, descripcion: '' });
    setIsEditing(false);
  };

  const handleOpenDialog = (aplicacion = { id: null, descripcion: '' }) => {
    setAplicacion(aplicacion);
    setIsEditing(aplicacion.id !== null);
    setOpenDialog(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/aplicaciones/${aplicacion.id}`, aplicacion);
        setSnackbarMessage('Aplicación updated successfully');
      } else {
        await axios.post('http://localhost:8000/aplicaciones/', aplicacion);
        setSnackbarMessage('Aplicación created successfully');
      }
      setOpenDialog(false);
      setOpenSnackbar(true);
      // Reload the aplicaciones list
      const response = await axios.get('http://localhost:8000/aplicaciones/');
      setAplicaciones(response.data);
    } catch (error) {
      console.error('Error saving aplicacion:', error);
      setSnackbarMessage('Error saving aplicacion');
      setOpenSnackbar(true);
    }
  };

  // Handle deleting an aplicacion
  const handleDelete = async (aplicacionId) => {
    try {
      await axios.delete(`http://localhost:8000/aplicaciones/${aplicacionId}`);
      setSnackbarMessage('Aplicación deleted successfully');
      setOpenSnackbar(true);
      // Reload the aplicaciones list
      const response = await axios.get('http://localhost:8000/aplicaciones/');
      setAplicaciones(response.data);
    } catch (error) {
      console.error('Error deleting aplicacion:', error);
      setSnackbarMessage('Error deleting aplicacion');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Aplicaciones
      </Typography>

      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>
        Create New Aplicación
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aplicaciones.map((aplicacion) => (
              <TableRow key={aplicacion.id}>
                <TableCell>{aplicacion.nombre}</TableCell>
                <TableCell>{aplicacion.descripcion}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(aplicacion)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(aplicacion.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for creating/editing aplicaciones */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? 'Edit Aplicación' : 'Create Aplicación'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={aplicacion.nombre}
            onChange={(e) => setAplicacion({ ...aplicacion, nombre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={aplicacion.descripcion}
            onChange={(e) => setAplicacion({ ...aplicacion, descripcion: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

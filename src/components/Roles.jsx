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

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [role, setRole] = useState({ id: null, descripcion: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/roles/');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Handle opening and closing of the dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setRole({ id: null, descripcion: '' });
    setIsEditing(false);
  };

  const handleOpenDialog = (role = { id: null, descripcion: '' }) => {
    setRole(role);
    setIsEditing(role.id !== null);
    setOpenDialog(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/roles/${role.id}`, role);
        setSnackbarMessage('Role updated successfully');
      } else {
        await axios.post('http://localhost:8000/roles/', role);
        setSnackbarMessage('Role created successfully');
      }
      setOpenDialog(false);
      setOpenSnackbar(true);
      // Reload the roles list
      const response = await axios.get('http://localhost:8000/roles/');
      setRoles(response.data);
    } catch (error) {
      console.error('Error saving role:', error);
      setSnackbarMessage('Error saving role');
      setOpenSnackbar(true);
    }
  };

  // Handle deleting a role
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`http://localhost:8000/roles/${roleId}`);
      setSnackbarMessage('Role deleted successfully');
      setOpenSnackbar(true);
      // Reload the roles list
      const response = await axios.get('http://localhost:8000/roles/');
      setRoles(response.data);
    } catch (error) {
      console.error('Error deleting role:', error);
      setSnackbarMessage('Error deleting role');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Roles
      </Typography>

      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>
        Create New Role
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.descripcion}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(role)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(role.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for creating/editing roles */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? 'Edit Role' : 'Create Role'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Description"
            variant="outlined"
            fullWidth
            value={role.descripcion}
            onChange={(e) => setRole({ ...role, descripcion: e.target.value })}
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

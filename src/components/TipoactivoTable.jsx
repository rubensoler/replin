import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Snackbar, Alert, CircularProgress,
  DialogContentText, Avatar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function TipoactivoTable() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    modo: "crear",
    tipo: { descripcion: "", imagen: "" }
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const cargarTipos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/tipos-activo/");
      setTipos(res.data);
    } catch (error) {
      console.error("Error al cargar tipos de activo:", error);
      mostrarSnackbar("Error al cargar tipos de activo", "error");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (modo, tipo = { descripcion: "", imagen: "" }) => {
    setModal({ open: true, modo, tipo });
  };

  const cerrarModal = () => {
    setModal({ open: false, modo: "crear", tipo: { descripcion: "", imagen: "" } });
  };

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const mostrarConfirmDialog = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const cerrarConfirmDialog = () => {
    setConfirmDialog({ open: false, id: null });
  };

  const guardarTipo = async () => {
    if (!modal.tipo.descripcion.trim()) {
      mostrarSnackbar("La descripción es obligatoria", "error");
      return;
    }
    
    setLoadingSubmit(true);
    try {
      const { tipo, modo } = modal;
      const payload = {
        descripcion: tipo.descripcion.trim(),
        imagen: tipo.imagen
      };
      
      if (modo === "crear") {
        await axios.post("http://localhost:8000/tipos-activo/", payload);
        mostrarSnackbar("Tipo de activo creado correctamente");
      } else {
        await axios.put(`http://localhost:8000/tipos-activo/${tipo.id}`, payload);
        mostrarSnackbar("Tipo de activo actualizado correctamente");
      }
      cerrarModal();
      cargarTipos();
    } catch (error) {
      console.error("Error al guardar tipo de activo:", error);
      mostrarSnackbar(`Error al ${modal.modo === "crear" ? "crear" : "actualizar"} tipo de activo: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!confirmDialog.id) return;
    
    setLoadingSubmit(true);
    try {
      await axios.delete(`http://localhost:8000/tipos-activo/${confirmDialog.id}`);
      mostrarSnackbar("Tipo de activo eliminado correctamente");
      cerrarConfirmDialog();
      cargarTipos();
    } catch (error) {
      console.error("Error al eliminar tipo de activo:", error);
      mostrarSnackbar(`Error al eliminar tipo de activo: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Función para renderizar la imagen si existe
  const renderImagen = (imagenPath) => {
    if (!imagenPath) return null;
    
    // Intentar primero como URL
    const isURL = imagenPath.startsWith('http://') || imagenPath.startsWith('https://');
    const src = isURL ? imagenPath : `/assets/img/${imagenPath}`;
    
    return (
      <Avatar 
        src={src} 
        variant="rounded"
        alt="Imagen de tipo de activo"
        sx={{ width: 40, height: 40 }}
        onError={(e) => {
          e.target.src = "/assets/img/default.png";
          e.target.onerror = null;
        }}
      >
        <AddPhotoAlternateIcon />
      </Avatar>
    );
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tipos de Activo
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => abrirModal("crear")}
        startIcon={<AddPhotoAlternateIcon />}
      >
        Nuevo Tipo
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {tipos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay tipos de activo registrados
                  </TableCell>
                </TableRow>
              ) : (
                tipos.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.descripcion}</TableCell>
                    <TableCell>
                      {renderImagen(t.imagen)}
                      <Typography variant="caption" display="block">
                        {t.imagen || "Sin imagen"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => abrirModal("editar", { ...t })}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => mostrarConfirmDialog(t.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de crear/editar */}
      <Dialog 
        open={modal.open} 
        onClose={cerrarModal} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          {modal.modo === "crear" ? "Nuevo Tipo de Activo" : "Editar Tipo de Activo"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth 
            margin="dense" 
            label="Descripción"
            value={modal.tipo.descripcion}
            onChange={(e) => setModal({ ...modal, tipo: { ...modal.tipo, descripcion: e.target.value } })}
            required
            error={!modal.tipo.descripcion.trim()}
            helperText={!modal.tipo.descripcion.trim() ? "Este campo es obligatorio" : ""}
          />
          <TextField
            fullWidth 
            margin="dense" 
            label="Imagen"
            value={modal.tipo.imagen || ""}
            onChange={(e) => setModal({ ...modal, tipo: { ...modal.tipo, imagen: e.target.value } })}
            helperText="Nombre de archivo o URL de la imagen"
          />
          
          {modal.tipo.imagen && (
            <Box mt={2} display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle2" gutterBottom>
                Vista previa:
              </Typography>
              {renderImagen(modal.tipo.imagen)}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit" disabled={loadingSubmit}>
            Cancelar
          </Button>
          <Button 
            onClick={guardarTipo} 
            variant="contained"
            disabled={!modal.tipo.descripcion.trim() || loadingSubmit}
            startIcon={loadingSubmit && <CircularProgress size={20} color="inherit" />}
          >
            {loadingSubmit ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={confirmDialog.open}
        onClose={cerrarConfirmDialog}
      >
        <DialogTitle>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este tipo de activo? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarConfirmDialog} color="inherit" disabled={loadingSubmit}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmarEliminar} 
            color="error" 
            variant="contained"
            disabled={loadingSubmit}
            startIcon={loadingSubmit && <CircularProgress size={20} color="inherit" />}
          >
            {loadingSubmit ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
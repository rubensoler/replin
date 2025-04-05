import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Box
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function PersonaTable() {
  const [personas, setPersonas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [open, setOpen] = useState(false);
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [editId, setEditId] = useState(null);
  const [cvStatus, setCvStatus] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputs = useRef({});

  const fetchPersonas = async () => {
    const res = await axios.get("http://localhost:8000/personas/");
    setPersonas(res.data);
    checkCvFiles(res.data);
  };

  const fetchCargos = async () => {
    const res = await axios.get("http://localhost:8000/cargos/");
    setCargos(res.data);
  };

  const checkCvFiles = async (personasList) => {
    const status = {};
    for (const persona of personasList) {
      try {
        const res = await axios.get(`http://localhost:8000/verificar_cv/${persona.identificacion}`);
        status[persona.identificacion] = res.data.exists;
      } catch {
        status[persona.identificacion] = false;
      }
    }
    setCvStatus(status);
  };

  const savePersona = async () => {
    const payload = {
      identificacion: Number(identificacion),
      nombres,
      cargo_id: cargoId ? Number(cargoId) : null,
    };
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/personas/${editId}`, payload);
      } else {
        await axios.post("http://localhost:8000/personas/", payload);
      }
      handleClose();
      fetchPersonas();
      setSnackbar({ open: true, message: 'Persona guardada con éxito', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Error al guardar persona', severity: 'error' });
    }
  };

  const deletePersona = async (id) => {
    await axios.delete(`http://localhost:8000/personas/${id}`);
    fetchPersonas();
  };

  const editPersona = (persona) => {
    setEditId(persona.identificacion);
    setIdentificacion(persona.identificacion);
    setNombres(persona.nombres);
    setCargoId(persona.cargo_id || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setIdentificacion("");
    setNombres("");
    setCargoId("");
  };

  const handleUploadClick = (id) => {
    if (fileInputs.current[id]) {
      fileInputs.current[id].click();
    }
  };

  const handleFileChange = async (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await axios.post(`http://localhost:8000/upload_cv/${id}`, formData);
        await checkCvFiles([{ identificacion: id }]);
        await fetchPersonas();
        setSnackbar({ open: true, message: 'Archivo subido con éxito', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Error al subir el archivo', severity: 'error' });
      }
    }
  };

  useEffect(() => {
    fetchPersonas();
    fetchCargos();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, width: '100%', maxWidth: '900px' }}>
        <Typography variant="h5">Personas</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Nueva Persona
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ maxWidth: '900px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Identificación</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>CV</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personas.map((p) => (
              <TableRow key={p.identificacion}>
                <TableCell>{p.identificacion}</TableCell>
                <TableCell>{p.nombres}</TableCell>
                <TableCell>{cargos.find(c => c.id === p.cargo_id)?.descripcion || ""}</TableCell>
                <TableCell>
                  <input
                    ref={el => fileInputs.current[p.identificacion] = el}
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => handleFileChange(e, p.identificacion)}
                  />
                  <IconButton
                    color={cvStatus[p.identificacion] ? "primary" : "secondary"}
                    onClick={() => {
                      if (cvStatus[p.identificacion]) {
                        window.open(`http://localhost:8000/assets/cvs/${p.identificacion}-101.pdf`, '_blank');
                      } else {
                        handleUploadClick(p.identificacion);
                      }
                    }}
                  >
                    {cvStatus[p.identificacion] ? <PictureAsPdfIcon /> : <UploadFileIcon />}
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button variant="outlined" onClick={() => editPersona(p)}>Editar</Button>
                    <Button variant="outlined" color="error" onClick={() => deletePersona(p.identificacion)}>Eliminar</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Editar Persona" : "Nueva Persona"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Identificación"
            type="number"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            disabled={!!editId}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            select
            label="Cargo"
            value={cargoId}
            onChange={(e) => setCargoId(e.target.value)}
          >
            {cargos.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.descripcion}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={savePersona}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

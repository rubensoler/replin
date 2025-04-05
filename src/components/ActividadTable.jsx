import { useEffect, useState } from "react";
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
  useMediaQuery,
  useTheme,
  Box,
  Grid,
} from "@mui/material";
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';

export default function ActividadTable() {
  const [actividades, setActividades] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [open, setOpen] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [editId, setEditId] = useState(null);
  const [filtroPersona, setFiltroPersona] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [rangoFechas, setRangoFechas] = useState([null, null]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchActividades = async () => {
    const params = {};
    if (rangoFechas[0]) params.desde = rangoFechas[0].toISOString().split('T')[0];
    if (rangoFechas[1]) params.hasta = rangoFechas[1].toISOString().split('T')[0];
    if (filtroPersona) params.persona_id = filtroPersona;
    if (filtroEquipo) params.equipo_id = filtroEquipo;

    const res = await axios.get("http://localhost:8000/actividades/detalladas/", { params });
    setActividades(res.data);
  };

  const fetchEquipos = async () => {
    const res = await axios.get("http://localhost:8000/equipos/");
    setEquipos(res.data);
  };

  const fetchPersonas = async () => {
    const res = await axios.get("http://localhost:8000/personas/");
    setPersonas(res.data);
  };

  const saveActividad = async () => {
    const payload = {
      descripcion,
      fecha,
      equipo_id: Number(equipoId),
      persona_id: Number(personaId),
    };
    if (editId) {
      await axios.put(`http://localhost:8000/actividades/${editId}`, payload);
    } else {
      await axios.post("http://localhost:8000/actividades/", payload);
    }
    handleClose();
    fetchActividades();
  };

  const deleteActividad = async (id) => {
    await axios.delete(`http://localhost:8000/actividades/${id}`);
    fetchActividades();
  };

  const editActividad = (act) => {
    setEditId(act.id);
    setDescripcion(act.descripcion);
    setFecha(act.fecha);
    setEquipoId(equipos.find(e => e.nombre === act.equipo)?.id || "");
    setPersonaId(personas.find(p => p.nombres === act.persona)?.identificacion || "");
    setOpen(true);
  };

  const exportarActividades = async () => {
    try {
      const params = {};
      if (rangoFechas[0]) params.desde = rangoFechas[0].toISOString().split('T')[0];
      if (rangoFechas[1]) params.hasta = rangoFechas[1].toISOString().split('T')[0];
      if (filtroPersona) params.persona_id = filtroPersona;
      if (filtroEquipo) params.equipo_id = filtroEquipo;

      const res = await axios.get("http://localhost:8000/actividades/exportar/", {
        params,
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "actividades.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error exportando actividades: " + error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setDescripcion("");
    setFecha("");
    setEquipoId("");
    setPersonaId("");
  };

  useEffect(() => {
    fetchActividades();
    fetchEquipos();
    fetchPersonas();
  }, [rangoFechas, filtroPersona, filtroEquipo]);

  return (
    <Box>
      <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h5">Actividades</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <DateRangePicker
              value={rangoFechas}
              onChange={setRangoFechas}
              placeholder="Seleccionar rango de fechas"
              style={{ width: '100%', height: 40 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Persona"
              value={filtroPersona}
              onChange={(e) => setFiltroPersona(e.target.value)}
              size="small"
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {personas.map(p => (
                <MenuItem key={p.identificacion} value={p.identificacion}>{p.nombres}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Equipo"
              value={filtroEquipo}
              onChange={(e) => setFiltroEquipo(e.target.value)}
              size="small"
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {equipos.map(e => (
                <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <Button fullWidth variant="contained" sx={{ height: 40 }} onClick={() => setOpen(true)}>Nueva</Button>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <Button fullWidth variant="outlined" color="success" sx={{ height: 40 }} onClick={exportarActividades}>Exportar</Button>
          </Grid>
        </Grid>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Persona</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Equipo</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actividades.map((act, idx) => (
              <TableRow key={idx}>
                <TableCell>{act.fecha}</TableCell>
                <TableCell>{act.descripcion}</TableCell>
                <TableCell>{act.persona}</TableCell>
                <TableCell>{act.cargo || ""}</TableCell>
                <TableCell>{act.equipo}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button variant="outlined" onClick={() => editActividad(act)}>Editar</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteActividad(act.id)}>Eliminar</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Editar Actividad" : "Nueva Actividad"}</DialogTitle>
        <DialogContent>
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
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="dense"
            select
            label="Equipo"
            value={equipoId}
            onChange={(e) => setEquipoId(e.target.value)}
          >
            {equipos.map((eq) => (
              <MenuItem key={eq.id} value={eq.id}>{eq.nombre}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            select
            label="Persona"
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
          >
            {personas.map((p) => (
              <MenuItem key={p.identificacion} value={p.identificacion}>{p.nombres}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={saveActividad}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

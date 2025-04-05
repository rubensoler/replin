import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EquipoTable() {
  const [equipos, setEquipos] = useState([]);
  const [subsistemas, setSubsistemas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    modo: "crear",
    equipo: { nombre: "", ubicacion: "", imagen: "", subsistema_id: "", tipo_activo_id: "" }
  });

  const cargarEquipos = async () => {
    const res = await axios.get("http://localhost:8000/equipos/");
    setEquipos(res.data);
  };

  const cargarSubsistemas = async () => {
    const res = await axios.get("http://localhost:8000/subsistemas/");
    setSubsistemas(res.data);
  };

  const cargarTipos = async () => {
    const res = await axios.get("http://localhost:8000/tipos-activo/");
    setTipos(res.data);
  };

  const abrirModal = (modo, equipo = { nombre: "", ubicacion: "", imagen: "", subsistema_id: "", tipo_activo_id: "" }) => {
    setModal({ open: true, modo, equipo });
  };

  const cerrarModal = () => {
    setModal({
      open: false,
      modo: "crear",
      equipo: { nombre: "", ubicacion: "", imagen: "", subsistema_id: "", tipo_activo_id: "" }
    });
  };

  const guardarEquipo = async () => {
    const { equipo, modo } = modal;
    const payload = {
      nombre: equipo.nombre,
      ubicacion: equipo.ubicacion,
      imagen: equipo.imagen,
      subsistema_id: equipo.subsistema_id,
      tipo_activo_id: equipo.tipo_activo_id
    };
    if (modo === "crear") {
      await axios.post("http://localhost:8000/equipos/", payload);
    } else {
      await axios.put(`http://localhost:8000/equipos/${equipo.id}`, payload);
    }
    cerrarModal();
    cargarEquipos();
  };

  const eliminarEquipo = async (id) => {
    await axios.delete(`http://localhost:8000/equipos/${id}`);
    cargarEquipos();
  };

  useEffect(() => {
    cargarEquipos();
    cargarSubsistemas();
    cargarTipos();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Equipos
      </Typography>
      <Button variant="contained" onClick={() => abrirModal("crear")}>NUEVO EQUIPO</Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Subsistema</TableCell>
              <TableCell>Tipo Activo</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipos.map((eq) => (
              <TableRow key={eq.id}>
                <TableCell>{eq.id}</TableCell>
                <TableCell>{eq.nombre}</TableCell>
                <TableCell>{eq.ubicacion}</TableCell>
                <TableCell>
                  {subsistemas.find(s => s.id === eq.subsistema_id)?.nombre || `ID: ${eq.subsistema_id}`}
                </TableCell>
                <TableCell>
                  {tipos.find(t => t.id === eq.tipo_activo_id)?.descripcion || `ID: ${eq.tipo_activo_id}`}
                </TableCell>
                <TableCell>
                  <img
                    src={`/assets/img/${eq.nombre}.png`}
                    alt={eq.nombre}
                    onError={(e) => {
                      const extAlternativas = ["jpg", "jpeg", "JPG", "JPEG", "PNG"];
                      const actual = extAlternativas.shift();
                      let intentos = 0;
                      const tryNext = () => {
                        if (intentos >= extAlternativas.length) {
                          e.target.src = "/assets/img/default.png"; // fallback final
                          return;
                        }
                        const ext = extAlternativas[intentos++];
                        e.target.src = `/assets/img/${eq.nombre}.${ext}`;
                      };
                      e.target.onerror = tryNext;
                      tryNext();
                    }}
                    style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => abrirModal("editar", { ...eq })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => eliminarEquipo(eq.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modal.open} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle>{modal.modo === "crear" ? "Nuevo Equipo" : "Editar Equipo"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={modal.equipo.nombre} onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, nombre: e.target.value } })} />
          <TextField fullWidth margin="dense" label="Ubicación" value={modal.equipo.ubicacion} onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, ubicacion: e.target.value } })} />
          <TextField fullWidth margin="dense" label="Imagen" value={modal.equipo.imagen} onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, imagen: e.target.value } })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Subsistema</InputLabel>
            <Select value={modal.equipo.subsistema_id} label="Subsistema" onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, subsistema_id: e.target.value } })}>
              {subsistemas.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo de Activo</InputLabel>
            <Select value={modal.equipo.tipo_activo_id} label="Tipo de Activo" onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, tipo_activo_id: e.target.value } })}>
              {tipos.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="inherit">Cancelar</Button>
          <Button onClick={guardarEquipo} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


import { useEffect, useState } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText, Paper, Alert } from "@mui/material";
import axios from "axios";

export default function LlamaIndex() {
  const [archivos, setArchivos] = useState([]);
  const [indexados, setIndexados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const fetchArchivos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/listar_cvs");
      setArchivos(res.data.archivos);
    } catch (err) {
      console.error("Error obteniendo archivos:", err);
    }
  };

  const handleIndexar = async () => {
    try {
      const res = await axios.post("http://localhost:8000/indexar_cvs");
      setIndexados(res.data.documentos_indexados || []);
      setMensaje(res.data.message);
    } catch (err) {
      alert("Error al indexar archivos");
    }
  };

  useEffect(() => {
    fetchArchivos();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Indexador de Hojas de Vida
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Archivos disponibles en carpeta /assets/cvs:</Typography>
        <List>
          {archivos.map((file, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={file} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Button variant="contained" color="primary" onClick={handleIndexar} sx={{ mb: 2 }}>
        Indexar
      </Button>

      {mensaje && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}

      {indexados.length > 0 && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1">Documentos efectivamente indexados:</Typography>
          <List>
            {indexados.map((file, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={file} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
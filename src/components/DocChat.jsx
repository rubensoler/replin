import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, Divider } from "@mui/material";
import axios from "axios";

export default function DocChat() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const pregunta = input.trim();
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/consultar", null, {
        params: { pregunta }
      });

      setHistory((prev) => [
        ...prev,
        { pregunta, respuesta: res.data.respuesta }
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { pregunta, respuesta: "Error al consultar los documentos." }
      ]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        DocChat - Consulta documentos indexados
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        {history.map((entry, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">Usuario:</Typography>
            <Typography>{entry.pregunta}</Typography>
            <Typography variant="subtitle2" color="secondary" sx={{ mt: 1 }}>Respuesta:</Typography>
            <Typography>{entry.respuesta}</Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Escribe tu pregunta"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>
          Enviar
        </Button>
      </Stack>
    </Box>
  );
}

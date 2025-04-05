import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Typography,
  Box,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";

export default function AdminCargue({ previewMode = false }) {
  const [tabla, setTabla] = useState("cargos");
  const [archivo, setArchivo] = useState(null);
  const [datosPrevios, setDatosPrevios] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [open, setOpen] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setArchivo(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setDatosPrevios(data);
      setColumnas(Object.keys(data[0] || {}));
    };
    reader.readAsBinaryString(file);
  };

  const enviarArchivo = async () => {
    if (!archivo) return;
    const formData = new FormData();
    formData.append("file", archivo);

    try {
      const res = await axios.post(`http://localhost:8000/cargue_masivo/${tabla}`, formData);
      const { registros_insertados, registros_omitidos } = res.data;
      const detalles = [];
      if (registros_insertados) detalles.push(`${registros_insertados} insertados`);
      if (registros_omitidos) detalles.push(`${registros_omitidos} omitidos`);
      setMensaje(`Cargue exitoso: ${detalles.join(", ")}`);
      setOpen(true);
      setArchivo(null);
      setDatosPrevios([]);
    } catch (err) {
      setMensaje("Error procesando el archivo: " + (err.response?.data?.detail || err.message));
      setOpen(true);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cargue Masivo de Datos
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FormControl>
          <InputLabel>Tabla</InputLabel>
          <Select value={tabla} label="Tabla" onChange={(e) => setTabla(e.target.value)}>
            <MenuItem value="cargos">Cargos</MenuItem>
            <MenuItem value="personas">Personas</MenuItem>
            <MenuItem value="equipos">Equipos</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" component="label">
          Seleccionar archivo Excel
          <input type="file" hidden accept=".xlsx,.xls" onChange={handleFile} />
        </Button>

        <Button variant="contained" color="primary" onClick={enviarArchivo} disabled={!archivo}>
          Confirmar Cargue
        </Button>
      </Stack>

      {previewMode && datosPrevios.length > 0 && (
        <Paper sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columnas.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPrevios.slice(0, 10).map((row, i) => (
                <TableRow key={i}>
                  {columnas.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert
          onClose={() => setOpen(false)}
          severity={mensaje.includes("Error") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}


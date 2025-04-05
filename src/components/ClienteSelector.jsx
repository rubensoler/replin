import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";

export default function ClienteSelector({ value, onChange, fullWidth = true, required = false, label = "Cliente" }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/clientes/");
        setClientes(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching clientes:", err);
        setError("No se pudieron cargar los clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <TextField
      select
      fullWidth={fullWidth}
      margin="dense"
      label={label}
      value={value || ""}
      onChange={onChange}
      required={required}
      error={!!error}
      helperText={error}
      disabled={loading}
    >
      <MenuItem value="">Seleccionar...</MenuItem>
      {clientes.map((cliente) => (
        <MenuItem key={cliente.id} value={cliente.id}>
          {cliente.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
}
// MantenimientoIA.jsx
import React, { useState, useEffect } from "react";
import { 
  Box, Card, Typography, TextField, Button, CircularProgress, 
  FormControl, InputLabel, Select, MenuItem, 
  Stepper, Step, StepLabel, StepContent, Paper, Divider,
  Alert, AlertTitle
} from "@mui/material";
import axios from "axios";

const MantenimientoIA = ({ tipoEquipo = "", modeloEquipo = "", marcaEquipo = "" }) => {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(tipoEquipo || "");
  const [marca, setMarca] = useState(marcaEquipo || "");
  const [modelo, setModelo] = useState(modeloEquipo || "");
  const [tiposEquipo, setTiposEquipo] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [procedimiento, setProcedimiento] = useState(null);
  const [error, setError] = useState("");

  // Cargar tipos de equipo disponibles
  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tipos-activo/");
        // Extraer los valores únicos de descripción
        const tiposUnicos = [...new Set(response.data.map(item => item.descripcion))];
        setTiposEquipo(tiposUnicos);
      } catch (error) {
        console.error("Error al cargar tipos de equipo:", error);
        setError("No se pudieron cargar los tipos de equipo.");
      }
    };
    
    cargarTipos();
  }, []);

  // Establecer valores iniciales si se proporcionan
  useEffect(() => {
    if (tipoEquipo) setEquipoSeleccionado(tipoEquipo);
    if (marcaEquipo) setMarca(marcaEquipo);
    if (modeloEquipo) setModelo(modeloEquipo);
  }, [tipoEquipo, marcaEquipo, modeloEquipo]);

  const generarProcedimiento = async () => {
    if (!equipoSeleccionado) {
      setError("Por favor seleccione un tipo de equipo");
      return;
    }
    
    setCargando(true);
    setError("");
    setProcedimiento(null);
    
    try {
      const response = await axios.post("http://localhost:8000/api/generar-procedimiento/", {
        tipo_equipo: equipoSeleccionado,
        marca: marca || "Genérico",
        modelo: modelo || "Genérico"
      });
      
      setProcedimiento(response.data);
    } catch (error) {
      console.error("Error al generar el procedimiento:", error);
      setError(
        error.response?.data?.detail || 
        "No se pudo generar el procedimiento de mantenimiento. Por favor intente nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Generador de Procedimientos de Mantenimiento con IA
      </Typography>
      
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Configure los parámetros del equipo para generar un procedimiento de mantenimiento personalizado
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel id="tipo-equipo-label">Tipo de Equipo</InputLabel>
            <Select
              labelId="tipo-equipo-label"
              value={equipoSeleccionado}
              label="Tipo de Equipo *"
              onChange={(e) => setEquipoSeleccionado(e.target.value)}
              disabled={cargando}
            >
              {tiposEquipo.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Marca (opcional)"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            fullWidth
            disabled={cargando}
          />
          
          <TextField
            label="Modelo (opcional)"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            fullWidth
            disabled={cargando}
          />
        </Box>
        
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button 
            variant="contained" 
            onClick={generarProcedimiento}
            disabled={!equipoSeleccionado || cargando}
            startIcon={cargando ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {cargando ? "Generando..." : "Generar Procedimiento"}
          </Button>
        </Box>
      </Card>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {cargando && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Generando procedimiento de mantenimiento...
          </Typography>
        </Box>
      )}
      
      {procedimiento && (
        <Paper elevation={2} sx={{ p: 4, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Procedimiento de Mantenimiento: {equipoSeleccionado}
            {marca && ` - ${marca}`}
            {modelo && ` ${modelo}`}
          </Typography>
          
          <Typography variant="subtitle2" color="text.secondary" paragraph>
            Generado por IA • Procedimiento de referencia
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Precauciones de Seguridad
            </Typography>
            <Typography variant="body1">
              {procedimiento.precauciones}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Herramientas Necesarias
            </Typography>
            <Typography variant="body1">
              {procedimiento.herramientas}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Pasos del Procedimiento
          </Typography>
          
          <Stepper orientation="vertical" sx={{ mt: 2 }}>
            {procedimiento.pasos.map((paso, index) => (
              <Step key={index} active={true} expanded={true}>
                <StepLabel>
                  <Typography variant="subtitle1">{paso.titulo}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography paragraph>{paso.descripcion}</Typography>
                  {paso.notas && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Nota: {paso.notas}
                    </Typography>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Este procedimiento es generado automáticamente y debe ser revisado por un técnico calificado antes de su implementación.
            </Typography>
            
            <Button variant="outlined" onClick={() => window.print()}>
              Imprimir Procedimiento
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MantenimientoIA;
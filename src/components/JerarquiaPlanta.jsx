import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tree } from "@minoru/react-dnd-treeview";
import { 
  Box, Card, Typography, IconButton, Grid, Checkbox, Paper,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { Settings as SettingsIcon, Info as InfoIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const JerarquiaPlanta = () => {
  // Estados principales
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedAction, setSelectedAction] = useState("detalles");
  const [checkedNodes, setCheckedNodes] = useState({});
  const [nodeDetails, setNodeDetails] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [subsistemas, setSubsistemas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [openNodes, setOpenNodes] = useState({}); // Nuevo estado para controlar qué nodos están abiertos
  const [modal, setModal] = useState({
    open: false,
    modo: "crear",
    equipo: { nombre: "", ubicacion: "", imagen: "", subsistema_id: "", tipo_activo_id: "" }
  });

  // Inicialización
  useEffect(() => {
    Promise.all([
      cargarDatosJerarquia(),
      cargarSubsistemas(),
      cargarTipos(),
      cargarEquipos()
    ]);
  }, []);

  // Funciones de carga de datos
  const cargarEquipos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/equipos/");
      setEquipos(res.data);
      return res.data;
    } catch (error) {
      console.error("Error cargando equipos:", error);
      return [];
    }
  };

  const cargarSubsistemas = async () => {
    try {
      const res = await axios.get("http://localhost:8000/subsistemas/");
      setSubsistemas(res.data);
      return res.data;
    } catch (error) {
      console.error("Error cargando subsistemas:", error);
      return [];
    }
  };

  const cargarTipos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/tipos-activo/");
      setTipos(res.data);
      return res.data;
    } catch (error) {
      console.error("Error cargando tipos:", error);
      return [];
    }
  };

  const cargarDatosJerarquia = async () => {
    try {
      const res = await axios.get("http://localhost:8000/plantas/");
      const plantas = res.data;
      const fetched = [];
      const details = {};
      const expandedNodes = {}; // Para almacenar los nodos que deben estar abiertos
      let nodeId = 1;

      for (const p of plantas) {
        // Procesar plantas
        const plantaId = nodeId++;
        fetched.push({ id: plantaId, parent: 0, text: p.nombre, tipo: "planta", datos: p });
        details[plantaId] = {
          nombre: p.nombre,
          ubicacion: p.ubicacion || "No especificada",
          capacidad: p.capacidad || "No especificada",
          fechaInstalacion: p.fechaInstalacion || "No especificada"
        };
        expandedNodes[plantaId] = true; // Abrir plantas por defecto

        // Procesar sistemas
        const sistemasRes = await axios.get(`http://localhost:8000/plantas/${p.id}/sistemas`);
        for (const s of sistemasRes.data) {
          const sistemaId = nodeId++;
          fetched.push({ id: sistemaId, parent: plantaId, text: s.nombre, tipo: "sistema", datos: s });
          details[sistemaId] = {
            nombre: s.nombre,
            funcion: s.funcion || "No especificada",
            estado: s.estado || "Activo"
          };
          expandedNodes[sistemaId] = true; // Abrir sistemas por defecto

          // Procesar subsistemas
          const subsistemasRes = await axios.get(`http://localhost:8000/sistemas/${s.id}/subsistemas`);
          for (const sub of subsistemasRes.data) {
            const subsistemaId = nodeId++;
            fetched.push({ id: subsistemaId, parent: sistemaId, text: sub.nombre, tipo: "subsistema", datos: sub });
            details[subsistemaId] = {
              nombre: sub.nombre,
              tipo: sub.tipo || "No especificado",
              criticidad: sub.criticidad || "Normal"
            };
            expandedNodes[subsistemaId] = true; // Abrir subsistemas por defecto

            // Procesar equipos
            const equiposRes = await axios.get(`http://localhost:8000/subsistemas/${sub.id}/equipos`);
            for (const eq of equiposRes.data) {
              const equipoId = nodeId++;
              fetched.push({ id: equipoId, parent: subsistemaId, text: eq.nombre, tipo: "equipo", datos: eq });
              details[equipoId] = {
                id: eq.id,
                nombre: eq.nombre,
                ubicacion: eq.ubicacion || "No especificada",
                subsistema_id: eq.subsistema_id,
                tipo_activo_id: eq.tipo_activo_id,
                modelo: eq.modelo || "No especificado",
                fabricante: eq.fabricante || "No especificado",
                fechaInstalacion: eq.fechaInstalacion || "No especificada",
                ultimoMantenimiento: eq.ultimoMantenimiento || "No registrado",
                estado: eq.estado || "Operativo",
                imagen: eq.imagen || ""
              };
            }
          }
        }
      }
      setNodes(fetched);
      setNodeDetails(details);
      setOpenNodes(expandedNodes); // Establecer los nodos abiertos
    } catch (error) {
      console.error("Error al cargar datos de jerarquía:", error);
    }
  };

  // Manejadores y funciones para equipos
  const handleCheckboxChange = (nodeId) => {
    setCheckedNodes({ [nodeId]: true });
    setSelectedNode(nodes.find(n => n.id === nodeId));
    setSelectedAction("detalles");
  };

  // Función para manejar la apertura/cierre de nodos
  const handleToggle = (nodeId) => {
    setOpenNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
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
    try {
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
      await Promise.all([cargarEquipos(), cargarDatosJerarquia()]);
    } catch (error) {
      console.error("Error al guardar equipo:", error);
    }
  };

  const eliminarEquipo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/equipos/${id}`);
      await Promise.all([cargarEquipos(), cargarDatosJerarquia()]);
      if (selectedNode && nodeDetails[selectedNode.id]?.id === id) {
        setSelectedNode(null);
        setCheckedNodes({});
      }
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
    }
  };

  // Componentes de renderizado
  const renderDetallesEquipo = () => {
    if (!selectedNode || selectedNode.tipo !== "equipo") 
      return <Box sx={{ p: 3, textAlign: 'center' }}><Typography variant="body1">Seleccione un equipo para ver sus detalles</Typography></Box>;
    
    const equipoData = nodeDetails[selectedNode.id] || {};
    
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">{getIcon("equipo")} {equipoData.nombre}</Typography>
          <Box>
            <IconButton color="primary" onClick={() => abrirModal("editar", { ...equipoData })}><EditIcon /></IconButton>
            <IconButton color="error" onClick={() => eliminarEquipo(equipoData.id)}><DeleteIcon /></IconButton>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <img
              src={`/assets/img/${equipoData.nombre}.png`}
              alt={equipoData.nombre}
              onError={(e) => {
                const extAlternativas = ["jpg", "jpeg", "JPG", "JPEG", "PNG"];
                const tryNext = () => {
                  if (extAlternativas.length === 0) {
                    e.target.src = "/assets/img/default.png";
                    return;
                  }
                  const ext = extAlternativas.shift();
                  e.target.src = `/assets/img/${equipoData.nombre}.${ext}`;
                  e.target.onerror = tryNext;
                };
                tryNext();
              }}
              style={{ width: '100%', maxHeight: 200, objectFit: "contain", borderRadius: 4 }}
            />
          </Grid>
          <Grid item xs={8}>
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table size="small">
                <TableBody>
                  {[
                    ["ID", equipoData.id],
                    ["Nombre", equipoData.nombre],
                    ["Ubicación", equipoData.ubicacion],
                    ["Subsistema", subsistemas.find(s => s.id === equipoData.subsistema_id)?.nombre || `ID: ${equipoData.subsistema_id}`],
                    ["Tipo de Activo", tipos.find(t => t.id === equipoData.tipo_activo_id)?.descripcion || `ID: ${equipoData.tipo_activo_id}`],
                    ["Modelo", equipoData.modelo],
                    ["Fabricante", equipoData.fabricante],
                    ["Fecha Instalación", equipoData.fechaInstalacion],
                    ["Último Mantenimiento", equipoData.ultimoMantenimiento],
                    ["Estado", equipoData.estado]
                  ].map(([label, value]) => (
                    <TableRow key={label}>
                      <TableCell component="th" sx={{ fontWeight: 'bold', width: '40%' }}>{label}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderDetallesOtrosNodos = () => {
    if (!selectedNode) 
      return <Box sx={{ p: 3, textAlign: 'center' }}><Typography variant="body1">Seleccione un nodo para ver sus detalles</Typography></Box>;

    const details = nodeDetails[selectedNode.id] || {};
    
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{getIcon(selectedNode.tipo)} {selectedNode.text}</Typography>
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>Tipo: {selectedNode.tipo.toUpperCase()}</Typography>
        
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableBody>
              {Object.entries(details).filter(([key]) => key !== 'nombre').map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" sx={{ fontWeight: 'bold', width: '30%' }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderComponente = () => {
    // Renderizar según la acción seleccionada
    if (selectedAction === "detalles") {
      return selectedNode?.tipo === "equipo" ? renderDetallesEquipo() : renderDetallesOtrosNodos();
    } else if (selectedAction === "configurar") {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Configuración</Typography>
          <Typography sx={{ mt: 2 }}>Funcionalidad de configuración en desarrollo.</Typography>
        </Box>
      );
    } else if (selectedAction === "agregar") {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Agregar Nuevo</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => abrirModal("crear")}>Nuevo Equipo</Button>
        </Box>
      );
    }
    
    return <Box sx={{ p: 3, textAlign: 'center' }}><Typography>Seleccione una acción y un nodo para continuar</Typography></Box>;
  };

  // Componente principal
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', width: '100%', position: 'absolute', top: 64, left: 0, right: 0, bottom: 0, paddingLeft: '250px', boxSizing: 'border-box' }}>
      <Grid container spacing={2} sx={{ flexGrow: 1, margin: 0, width: '100%', height: '100%', padding: 2 }}>
        {/* Panel izquierdo - Árbol jerárquico */}
        <Grid item xs={3} sx={{ height: '100%', padding: '0 !important' }}>
          <Card sx={{ height: '100%', p: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, px: 1 }}>Jerarquía de Plantas</Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto', pl: 0, '& ul': { listStyle: 'none', padding: 0, margin: 0 } }}>
              <Tree
                tree={nodes}
                rootId={0}
                onDrop={(newTree) => setNodes(newTree)}
                initialOpen={Object.keys(openNodes).filter(nodeId => openNodes[nodeId]).map(id => parseInt(id))}
                render={(node, { depth, isOpen, onToggle }) => (
                  <div style={{ marginLeft: depth * 8, cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', backgroundColor: checkedNodes[node.id] ? '#e3f2fd' : 'transparent' }}>
                    <Checkbox size="small" checked={!!checkedNodes[node.id]} onChange={() => handleCheckboxChange(node.id)} onClick={(e) => e.stopPropagation()} sx={{ padding: '2px', marginRight: '2px' }} />
                    
                    {node.tipo !== "equipo" && (
                      <span 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onToggle(); 
                          handleToggle(node.id); 
                        }} 
                        style={{ marginRight: 2, fontSize: '10px', width: '10px', display: 'inline-block', textAlign: 'center' }}
                      >
                        {isOpen ? "▼" : "▶"}
                      </span>
                    )}
                    <span style={{ marginRight: 4, fontSize: '12px' }}>{getIcon(node.tipo)}</span>
                    <span style={{ fontSize: '14px' }} onClick={() => handleCheckboxChange(node.id)}>{node.text}</span>
                  </div>
                )}
              />
            </Box>
          </Card>
        </Grid>

        {/* Panel derecho - Detalles */}
        <Grid item xs={9} sx={{ height: '100%', padding: '0 !important', paddingLeft: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Barra de acciones */}
            <Card sx={{ p: 1, display: 'flex', justifyContent: 'flex-start', mb: 2, boxShadow: 1 }}>
              {[
                { action: "configurar", icon: <SettingsIcon /> },
                { action: "detalles", icon: <InfoIcon /> },
                { action: "agregar", icon: <AddIcon /> }
              ].map(item => (
                <IconButton key={item.action} onClick={() => setSelectedAction(item.action)} color={selectedAction === item.action ? "primary" : "default"}>
                  {item.icon}
                </IconButton>
              ))}
            </Card>
            
            {/* Panel de contenido */}
            <Card sx={{ flexGrow: 1, p: 0, overflow: 'auto', boxShadow: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              {renderComponente()}
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Modal para crear/editar equipo */}
      <Dialog open={modal.open} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle>{modal.modo === "crear" ? "Nuevo Equipo" : "Editar Equipo"}</DialogTitle>
        <DialogContent>
          {[
            { field: "nombre", label: "Nombre", type: "text" },
            { field: "ubicacion", label: "Ubicación", type: "text" },
            { field: "imagen", label: "Imagen", type: "text" }
          ].map(field => (
            <TextField 
              key={field.field}
              fullWidth 
              margin="dense" 
              label={field.label} 
              value={modal.equipo[field.field]} 
              onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, [field.field]: e.target.value } })} 
            />
          ))}
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Subsistema</InputLabel>
            <Select 
              value={modal.equipo.subsistema_id} 
              label="Subsistema" 
              onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, subsistema_id: e.target.value } })}
            >
              {subsistemas.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo de Activo</InputLabel>
            <Select 
              value={modal.equipo.tipo_activo_id} 
              label="Tipo de Activo" 
              onChange={(e) => setModal({ ...modal, equipo: { ...modal.equipo, tipo_activo_id: e.target.value } })}
            >
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
};

const getIcon = (tipo) => {
  switch (tipo) {
    case "planta": return "🏭";
    case "sistema": return "🛠️";
    case "subsistema": return "🔧";
    case "equipo": return "⚙️";
    default: return "🔹";
  }
};

export default JerarquiaPlanta;
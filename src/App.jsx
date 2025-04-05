import { useEffect, useState } from "react";
import {
  Box, Typography, Button, List, ListItem, ListItemText, Paper, Alert,
  Drawer, List as MUIList, ListItemIcon, Tooltip, IconButton, AppBar, Toolbar, Collapse
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ChatIcon from '@mui/icons-material/Chat';
import ActIcon from '@mui/icons-material/Chat';
import TableChartIcon from '@mui/icons-material/TableChart'; // Icono para "Tablas"
import AccountBoxIcon from '@mui/icons-material/AccountBox'; // Icono para "Usuarios"
import RoleIcon from '@mui/icons-material/Security'; // Icono para "Roles"
import AppsIcon from '@mui/icons-material/Apps'; // Icono para "Aplicaciones"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import FactoryIcon from '@mui/icons-material/Factory';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsAplicationsIcon from '@mui/icons-material/SettingsApplications';
import CategoryIcon from '@mui/icons-material/Category';
import ConstructionIcon from '@mui/icons-material/Construction'; // Nuevo icono para mantenimiento

import axios from "axios";

import ActividadTable from "./components/ActividadTable.jsx";
import PersonaTable from "./components/PersonaTable.jsx";
import EquipoTable from "./components/EquipoTable.jsx";
import CargoTable from "./components/cargoTable.jsx";
import ClienteTable from "./components/ClienteTable.jsx";
import AdminCargue from "./components/AdminCargue.jsx";
import DocChat from "./components/DocChat.jsx";
import LlamaIndex from "./components/LlamaIndex.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Usuarios from "./components/Usuarios.jsx";  // Componente para gestionar usuarios
import Roles from "./components/Roles.jsx";      // Componente para gestionar roles
import Aplicaciones from "./components/Aplicaciones.jsx"; // Componente para gestionar aplicaciones
import ContratoTable from "./components/ContratoTable.jsx";
import PlantaTable from "./components/PlantaTable.jsx";
import JerarquiaPlanta from "./components/JerarquiaPlanta.jsx";
import SistemaTable from "./components/SistemaTable.jsx";
import SubsistemaTable from "./components/SubsistemaTable.jsx";
import TipoactivoTable from "./components/TipoactivoTable.jsx";
import MantenimientoIA from "./components/MantenimientoIA.jsx";

export default function App() {
  const [archivos, setArchivos] = useState([]);
  const [indexados, setIndexados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [apiError, setApiError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedView, setSelectedView] = useState("dashboard");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false); // Estado para manejar el submenú de administración
  const [tablasMenuOpen, setTablasMenuOpen] = useState(false); // Estado para manejar el submenú de Tablas

  // Esta es la única modificación que necesitamos - un elemento de estilo para el body
  useEffect(() => {
    // Crear un elemento de estilo
    const style = document.createElement('style');
    style.textContent = `
      body::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: -1;
      } 
    `;
    // Añadir el elemento de estilo al head
    document.head.appendChild(style);
    // Limpieza al desmontar
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
      .MuiBox-root[component="main"] {
        padding-right: 0 !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(scrollStyle);
    
    return () => {
      document.head.removeChild(scrollStyle);
    };
  }, []);


  const renderView = () => {
    switch (selectedView) {
      case "dashboard":
        return <Dashboard />;
      case "docchat":
        return <DocChat />;
      case "actividades":
        return <ActividadTable />;
      case "personas":
        return <PersonaTable />;
      case "equipos":
        return <EquipoTable />;
      case "cargos":
        return <CargoTable />;
      case "cargue":
        return <AdminCargue />;
      case "indexar":
        return <LlamaIndex />;
      case "usuarios":
        return <Usuarios />;
      case "roles":
        return <Roles />;
      case "aplicaciones":
        return <Aplicaciones />;
      case "clientes":
        return <ClienteTable />;
      case "contratos":
        return <ContratoTable />;
      case "plantas":
        return <PlantaTable />;
      case "jerarquia":
        return <JerarquiaPlanta />;
      case "sistemas":
        return <SistemaTable />;
      case "subsistemas":
        return <SubsistemaTable />;
      case "tipoactivos":
        return <TipoactivoTable />;
      case "mantenimientoIA":
        return <MantenimientoIA />;
      default:
        return <Typography>Vista no disponible</Typography>;
    }
  };

  const renderMenu = () => {
    return (
      <MUIList>
        <Tooltip title={!drawerOpen ? "Dashboard" : ""} placement="right">
          <ListItem button selected={selectedView === "dashboard"} onClick={() => setSelectedView("dashboard")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            {drawerOpen && <ListItemText primary="Dashboard" />}
          </ListItem>
        </Tooltip>

        <Tooltip title={!drawerOpen ? "Jerarquia" : ""} placement="right">
          <ListItem button selected={selectedView === "jerarquia"} onClick={() => setSelectedView("jerarquia")}>
            <ListItemIcon><AccountTreeIcon /></ListItemIcon>
            {drawerOpen && <ListItemText primary="Jerarquia" />}
          </ListItem>
        </Tooltip>

        <Tooltip title={!drawerOpen ? "Mantenimiento IA" : ""} placement="right">
          <ListItem
            button
            selected={selectedView === "mantenimientoIA"}
            onClick={() => setSelectedView("mantenimientoIA")}
          >
            <ListItemIcon><ConstructionIcon /></ListItemIcon>
            {drawerOpen && <ListItemText primary="Mantenimiento IA" />}
          </ListItem>
        </Tooltip>

        <Tooltip title={!drawerOpen ? "DocChat" : ""} placement="right">
          <ListItem button selected={selectedView === "docchat"} onClick={() => setSelectedView("docchat")}>
            <ListItemIcon><ChatIcon /></ListItemIcon>
            {drawerOpen && <ListItemText primary="DocChat" />}
          </ListItem>
        </Tooltip>

        <Tooltip title={!drawerOpen ? "Actividades" : ""} placement="right">
          <ListItem button selected={selectedView === "actividades"} onClick={() => setSelectedView("actividades")}>
            <ListItemIcon><TableChartIcon /></ListItemIcon>
            {drawerOpen && <ListItemText primary="Actividades" />}
          </ListItem>
        </Tooltip>

        {/* Menu Tablas */}
        <Tooltip title={!drawerOpen ? "Tablas" : ""} placement="right">
          <ListItem button onClick={() => setTablasMenuOpen(!tablasMenuOpen)}>
            <ListItemIcon>
              <SettingsIcon style={{ opacity: drawerOpen ? 0 : 1 }} />
            </ListItemIcon> {/* Icono para "Tablas" */}
            {drawerOpen && <ListItemText primary="Tablas" />}
          </ListItem>
        </Tooltip>

        {/* Submenu Tablas */}
        <Collapse in={tablasMenuOpen} timeout="auto" unmountOnExit>
          <MUIList component="div" disablePadding>
            <ListItem button selected={selectedView === "personas"} onClick={() => setSelectedView("personas")}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Personas" />}
            </ListItem>
            <ListItem button selected={selectedView === "cargos"} onClick={() => setSelectedView("cargos")}>
              <ListItemIcon><EngineeringIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Cargos" />}
            </ListItem>
            <ListItem button selected={selectedView === "equipos"} onClick={() => setSelectedView("equipos")}>
              <ListItemIcon><DevicesIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Equipos" />}
            </ListItem>
            <ListItem button selected={selectedView === "clientes"} onClick={() => setSelectedView("clientes")}>
              <ListItemIcon><BusinessIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Clientes" />}
            </ListItem>
            <ListItem button selected={selectedView === "contratos"} onClick={() => setSelectedView("contratos")}>
              <ListItemIcon><DescriptionIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Contratos" />}
            </ListItem>
            <ListItem button selected={selectedView === "plantas"} onClick={() => setSelectedView("plantas")}>
              <ListItemIcon><FactoryIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Plantas" />}
            </ListItem>
            <ListItem button selected={selectedView === "sistemas"} onClick={() => setSelectedView("sistemas")}>
              <ListItemIcon><SettingsAplicationsIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Sistemas" />}
            </ListItem>
            <ListItem button selected={selectedView === "subsistemas"} onClick={() => setSelectedView("subsistemas")}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="SubSistemas" />}
            </ListItem>
            <ListItem button selected={selectedView === "tipoactivos"} onClick={() => setSelectedView("tipoactivos")}>
              <ListItemIcon><CategoryIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Tipos Activo" />}
            </ListItem>
          </MUIList>
        </Collapse>

        {/* Menu de Administración */}
        <Tooltip title={!drawerOpen ? "Administración" : ""} placement="right">
          <ListItem button onClick={() => setAdminMenuOpen(!adminMenuOpen)}>
            <ListItemIcon>
              <SettingsIcon style={{ opacity: drawerOpen ? 0 : 1 }} />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Administración" />}
          </ListItem>
        </Tooltip>

        {/* Submenu de Administración */}
        <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
          <MUIList component="div" disablePadding>
            <ListItem button selected={selectedView === "cargue"} onClick={() => setSelectedView("cargue")}>
              <ListItemIcon><CloudUploadIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Cargue Masivo" />}
            </ListItem>
            <ListItem button selected={selectedView === "indexar"} onClick={() => setSelectedView("indexar")}>
              <ListItemIcon><ManageSearchIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Indexar HV" />}
            </ListItem>
            <ListItem button selected={selectedView === "usuarios"} onClick={() => setSelectedView("usuarios")}>
              <ListItemIcon><AccountBoxIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Usuarios" />}
            </ListItem>
            <ListItem button selected={selectedView === "roles"} onClick={() => setSelectedView("roles")}>
              <ListItemIcon><RoleIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Roles" />}
            </ListItem>
            <ListItem button selected={selectedView === "aplicaciones"} onClick={() => setSelectedView("aplicaciones")}>
              <ListItemIcon><AppsIcon /></ListItemIcon>
              {drawerOpen && <ListItemText primary="Aplicaciones" />}
            </ListItem>
          </MUIList>
        </Collapse>

      </MUIList>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: "100vh", bgcolor: "#f5f5f5", color: "#000" }}>
      {/* BARRA SUPERIOR */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            GAME
          </Typography>
        </Toolbar>
      </AppBar>

      {/* MENÚ LATERAL */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? 240 : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 240 : 72,
            overflowX: 'hidden',
            transition: 'width 0.3s',
          }
        }}
      >
        {/* Separación superior para alinear con la AppBar */}
        <Toolbar />

        {/* Flecha para expandir/colapsar */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)} type="button">
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        {renderMenu()}
      </Drawer>

      {/* CONTENIDO PRINCIPAL - Solo añadimos overflow: auto */}
      <Box component="main" sx={{
        flexGrow: 1, p: 3, pr: 0, mt: 8, overflow: 'auto',
        width: '100%'
      }}>
        {renderView()}
      </Box>
    </Box>
  );
}
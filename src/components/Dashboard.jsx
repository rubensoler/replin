// MantenimientoDashboard.jsx
import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './styles.css'; // Importando el archivo CSS

// Datos simulados (mantenemos los mismos)
const dataCumplimiento = [
  { mes: 'Ene', programado: 48, ejecutado: 45 },
  { mes: 'Feb', programado: 52, ejecutado: 49 },
  { mes: 'Mar', programado: 45, ejecutado: 42 },
  { mes: 'Abr', programado: 50, ejecutado: 48 },
  { mes: 'May', programado: 55, ejecutado: 53 },
  { mes: 'Jun', programado: 48, ejecutado: 46 },
];

const dataTipoMantenimiento = [
  { name: 'Correctivo', value: 35, color: '#FF6384' },
  { name: 'Preventivo', value: 45, color: '#36A2EB' },
  { name: 'Predictivo', value: 20, color: '#FFCE56' },
];

const dataHistorico = [
  { mes: 'Ene', disponibilidad: 96.2, confiabilidad: 94.8 },
  { mes: 'Feb', disponibilidad: 95.8, confiabilidad: 94.5 },
  { mes: 'Mar', disponibilidad: 97.1, confiabilidad: 95.2 },
  { mes: 'Abr', disponibilidad: 98.2, confiabilidad: 96.8 },
  { mes: 'May', disponibilidad: 97.5, confiabilidad: 95.5 },
  { mes: 'Jun', disponibilidad: 98.4, confiabilidad: 96.9 },
];

const equiposCriticos = [
  { id: 1, nombre: 'Compresor XR-500', disponibilidad: 96.5, confiabilidad: 94.2, mtbf: 720, mttr: 4.5 },
  { id: 2, nombre: 'Bomba Hidráulica P-302', disponibilidad: 98.1, confiabilidad: 97.3, mtbf: 1440, mttr: 2.8 },
  { id: 3, nombre: 'Turbina T-1000', disponibilidad: 94.3, confiabilidad: 92.0, mtbf: 520, mttr: 8.2 },
  { id: 4, nombre: 'Línea de Producción A', disponibilidad: 97.8, confiabilidad: 96.5, mtbf: 900, mttr: 3.2 },
  { id: 5, nombre: 'Caldera Industrial B-200', disponibilidad: 95.6, confiabilidad: 93.8, mtbf: 680, mttr: 5.7 },
];

const Dashboard = () => {
  const [periodo, setPeriodo] = useState('mensual');

  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };

  // Función para calcular el porcentaje de cumplimiento
  const calcularCumplimiento = () => {
    const totalProgramado = dataCumplimiento.reduce((acc, item) => acc + item.programado, 0);
    const totalEjecutado = dataCumplimiento.reduce((acc, item) => acc + item.ejecutado, 0);
    return (totalEjecutado / totalProgramado * 100).toFixed(1);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard de Mantenimiento</h1>
      
      <div className="dashboard-header">
        <select 
          value={periodo} 
          onChange={handlePeriodoChange}
          className="periodo-select"
        >
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">MTBF (horas)</div>
          <div className="metric-value">852</div>
          <div className="metric-trend trend-positive">+3.2%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">MTTR (horas)</div>
          <div className="metric-value">4.2</div>
          <div className="metric-trend trend-positive">-1.8%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Disponibilidad</div>
          <div className="metric-value">97.8%</div>
          <div className="metric-trend trend-positive">+0.6%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Confiabilidad</div>
          <div className="metric-value">95.4%</div>
          <div className="metric-trend trend-positive">+1.2%</div>
        </div>
      </div>

      {/* Cumplimiento de programación */}
      <div className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Cumplimiento de Programación</h2>
            <p className="section-subtitle">Mantenimientos programados vs ejecutados</p>
          </div>
          <div>
            <div className="cumplimiento-value">{calcularCumplimiento()}%</div>
            <div className="cumplimiento-label">de cumplimiento</div>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dataCumplimiento}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="programado" fill="#8884d8" name="Programado" />
              <Bar dataKey="ejecutado" fill="#82ca9d" name="Ejecutado" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tipos de mantenimiento */}
      <div className="section-container">
        <h2 className="section-title">Distribución por Tipo de Mantenimiento</h2>
        <p className="section-subtitle">Correctivo vs Preventivo vs Predictivo</p>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={dataTipoMantenimiento}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {dataTipoMantenimiento.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Histórico */}
      <div className="section-container">
        <h2 className="section-title">Histórico de Disponibilidad y Confiabilidad</h2>
        <p className="section-subtitle">Evolución mensual de indicadores clave</p>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dataHistorico}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis domain={[90, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="disponibilidad" stroke="#8884d8" name="Disponibilidad %" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="confiabilidad" stroke="#82ca9d" name="Confiabilidad %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Equipos críticos */}
      <div className="section-container">
        <h2 className="section-title">Equipos Críticos</h2>
        <p className="section-subtitle">Métricas clave por equipo</p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Disponibilidad</th>
                <th>Confiabilidad</th>
                <th>MTBF (h)</th>
                <th>MTTR (h)</th>
              </tr>
            </thead>
            <tbody>
              {equiposCriticos.map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.nombre}</td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill-blue" 
                          style={{ width: `${equipo.disponibilidad}%` }}
                        ></div>
                      </div>
                      <div className="progress-value">
                        {equipo.disponibilidad}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill-green" 
                          style={{ width: `${equipo.confiabilidad}%` }}
                        ></div>
                      </div>
                      <div className="progress-value">
                        {equipo.confiabilidad}%
                      </div>
                    </div>
                  </td>
                  <td>{equipo.mtbf}</td>
                  <td>{equipo.mttr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
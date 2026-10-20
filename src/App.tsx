import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/taller/Dashboard';
import Clientes from './pages/taller/Clientes';
import Vehiculos from './pages/taller/Vehiculos';
import Ordenes from './pages/taller/Ordenes';
import OrdenDetalle from './pages/taller/OrdenDetalle';
import Presupuestos from './pages/taller/Presupuestos';
import Mensajes from './pages/taller/Mensajes';
import Equipo from './pages/taller/Equipo';
import Configuracion from './pages/taller/Configuracion';
import PortalCliente from './pages/portal/PortalCliente';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTalleres from './pages/admin/AdminTalleres';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import Planes from './pages/admin/Planes';
import Auditoria from './pages/admin/Auditoria';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { currentUser } = useStore();

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        
        {/* Workshop routes */}
        <Route element={<ProtectedRoute allowedRoles={['owner', 'advisor', 'mechanic']}><Layout /></ProtectedRoute>}>
          <Route path="/taller/dashboard" element={<Dashboard />} />
          <Route path="/taller/clientes" element={<Clientes />} />
          <Route path="/taller/vehiculos" element={<Vehiculos />} />
          <Route path="/taller/ordenes" element={<Ordenes />} />
          <Route path="/taller/ordenes/:id" element={<OrdenDetalle />} />
          <Route path="/taller/presupuestos" element={<Presupuestos />} />
          <Route path="/taller/mensajes" element={<Mensajes />} />
          <Route path="/taller/equipo" element={<Equipo />} />
          <Route path="/taller/configuracion" element={<Configuracion />} />
        </Route>

        {/* Customer portal */}
        <Route element={<ProtectedRoute allowedRoles={['customer']}><Layout /></ProtectedRoute>}>
          <Route path="/portal" element={<PortalCliente />} />
          <Route path="/portal/mensajes" element={<PortalCliente />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/talleres" element={<AdminTalleres />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/planes" element={<Planes />} />
          <Route path="/admin/auditoria" element={<Auditoria />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

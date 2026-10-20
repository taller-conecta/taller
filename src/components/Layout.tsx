import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';
import { LayoutDashboard, Users, Car, ClipboardList, FileText, MessageSquare, Bell, Settings, LogOut, Menu, X, ChevronDown, Building2, Shield, CreditCard, Wrench, UserCircle } from 'lucide-react';

export default function Layout() {
  const { currentUser, currentWorkshop, logout, notifications } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!currentUser) return null;

  const unreadNotifs = notifications.filter(n => n.userId === currentUser.id && !n.read);
  const isAdmin = currentUser.role === 'admin';
  const isCustomer = currentUser.role === 'customer';

  const workshopNav = [
    { path: '/taller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/taller/ordenes', label: 'Órdenes de Servicio', icon: ClipboardList },
    { path: '/taller/clientes', label: 'Clientes', icon: Users },
    { path: '/taller/vehiculos', label: 'Vehículos', icon: Car },
    { path: '/taller/presupuestos', label: 'Presupuestos', icon: FileText },
    { path: '/taller/mensajes', label: 'Mensajes', icon: MessageSquare },
    { path: '/taller/equipo', label: 'Equipo', icon: UserCircle },
    { path: '/taller/configuracion', label: 'Configuración', icon: Settings },
  ];

  const adminNav = [
    { path: '/admin/dashboard', label: 'Panel General', icon: LayoutDashboard },
    { path: '/admin/talleres', label: 'Talleres', icon: Building2 },
    { path: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { path: '/admin/planes', label: 'Planes', icon: CreditCard },
    { path: '/admin/auditoria', label: 'Auditoría', icon: Shield },
  ];

  const customerNav = [
    { path: '/portal', label: 'Mis Vehículos', icon: Car },
    { path: '/portal/mensajes', label: 'Mensajes', icon: MessageSquare },
  ];

  const nav = isAdmin ? adminNav : isCustomer ? customerNav : workshopNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">Taller Conecta</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentWorkshop && (
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-xs text-slate-400">Taller</p>
            <p className="text-sm font-medium truncate">{currentWorkshop.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-300 capitalize">{currentWorkshop.plan}</span>
          </div>
        )}

        <nav className="mt-4 px-2 space-y-1">
          {nav.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-800">{nav.find(n => isActive(n.path))?.label || 'Taller Conecta'}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadNotifs.length}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-auto">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-semibold text-sm text-gray-800">Notificaciones</h3>
                  </div>
                  {unreadNotifs.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">No hay notificaciones nuevas</p>
                  ) : (
                    unreadNotifs.slice(0, 5).map(n => (
                      <div key={n.id} className="p-3 border-b border-gray-50 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600 capitalize">{currentUser.role === 'owner' ? 'Propietario' : currentUser.role === 'advisor' ? 'Asesor' : currentUser.role === 'mechanic' ? 'Mecánico' : currentUser.role === 'admin' ? 'Admin' : 'Cliente'}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

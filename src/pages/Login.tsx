import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Wrench, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Complete todos los campos'); return; }
    const success = login(email, password);
    if (success) {
      const user = useStore.getState().currentUser;
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'customer') navigate('/portal');
      else navigate('/taller/dashboard');
    } else {
      setError('Credenciales incorrectas o usuario inactivo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Taller Conecta</h1>
          <p className="text-blue-200 mt-2">Plataforma de gestión para talleres mecánicos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Ingresar</button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-3">Credenciales de demostración:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">Admin SaaS:</span>
                <span>admin@tallerconecta.com / admin123</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">Propietario:</span>
                <span>dueno@autoservicio.com / dueno123</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">Asesor:</span>
                <span>asesor@autoservicio.com / asesor123</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">Mecánico:</span>
                <span>mecanico@autoservicio.com / mec123</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">Cliente:</span>
                <span>cliente1@email.com / cliente123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

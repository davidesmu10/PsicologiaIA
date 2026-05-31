import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [isProfessional, setIsProfessional] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    try {
     /*
const endpoint = isProfessional
  ? 'http://localhost:7145/api/auth/login-professional'
  : 'http://localhost:7145/api/auth/login-user';
*/

      /* CODIGO PARA VRIFICAR EL TOKEN AUN NO SE TIENE EL TOKEN DE BACKEND
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error de login');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', isProfessional ? 'professional' : 'user');
      */

      // Simulamos éxito por ahora para probar el flujo del front
      localStorage.setItem('userId', '1'); 
      localStorage.setItem('role', isProfessional ? 'professional' : 'user');
      
      if (isProfessional) {
          navigate('/professional/dashboard'); // Redirige al panel del psicólogo que creamos
        } else {
          navigate('/dashboard'); // Redirige al panel común del paciente
        }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Hubo un error inesperado';
  alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-900">PsicologíaIA</h2>
          <p className="text-slate-500 text-sm mt-1">Tu espacio seguro de salud mental</p>
        </div>

        {/* Selector de Rol (Tabs) */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${!isProfessional ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setIsProfessional(false)}
          >
            <User size={16} /> Paciente
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${isProfessional ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setIsProfessional(true)}
          >
            <Briefcase size={16} /> Soy Psicólogo/a
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Cargando...' : isProfessional ? 'Ingresar como Profesional' : 'Ingresar'}
          </button>
        </form>

        {/* Link de Registro */}
        {!isProfessional && (
          <p className="text-center text-sm text-slate-600 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
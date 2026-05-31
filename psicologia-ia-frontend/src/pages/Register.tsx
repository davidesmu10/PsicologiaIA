import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí pegamos a tu endpoint de creación de usuarios de .NET
      const response = await fetch('http://localhost:7145/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, email: email, password: password }) // Ajusta las propiedades según tu DTO/Modelo
      });

      if (!response.ok) throw new Error('Error al crear el usuario');

      alert('¡Usuario creado con éxito! Ya puedes iniciar sesión.');
      navigate('/');
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
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-900">Crear Cuenta</h2>
          <p className="text-slate-500 text-sm mt-1">Regístrate para empezar tus sesiones</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

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
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
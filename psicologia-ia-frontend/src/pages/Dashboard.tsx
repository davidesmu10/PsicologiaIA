import { useNavigate } from 'react-router-dom';
import { Bot, Calendar, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Superior */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-indigo-900">Panel de Control</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-rose-600 font-medium hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800">¿Cómo deseas recibir ayuda hoy?</h2>
          <p className="text-slate-500 mt-2">Elige la opción que mejor se adapte a tu momento actual.</p>
        </div>

        {/* Contenedor de Opciones */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          
          {/* Opción A: Chat con IA */}
          <div 
            onClick={() => navigate('/chat-ia')}
            className="bg-white border-2 border-slate-200 hover:border-indigo-500 p-8 rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-all flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sesión Inmediata con IA</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Habla de inmediato con la Dra. Escobar, nuestra IA entrenada para escucharte y darte soporte emocional las 24/7 de forma confidencial.
            </p>
            <span className="mt-auto text-indigo-600 font-semibold text-sm group-hover:underline">Iniciar chat ahora &rarr;</span>
          </div>

          {/* Opción B: Agendar con Profesional */}
          <div 
           onClick={() => navigate('/agendar')}
            className="bg-white border-2 border-slate-200 hover:border-emerald-500 p-8 rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-all flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Agendar con un Profesional</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Reserva una cita formal para una video-consulta en vivo con un psicólogo o psicóloga certificado de nuestro equipo médico.
            </p>
            <span className="mt-auto text-emerald-600 font-semibold text-sm group-hover:underline">Ver agenda disponible &rarr;</span>
          </div>

        </div>
      </main>
    </div>
  );
}
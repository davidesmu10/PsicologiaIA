import { useState, useEffect } from 'react';
import { Calendar, Clock, Check, AlertCircle, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AgendaItem {
  id: number;
  appointmentDate: string;
  isImmediate: boolean;
  status: string;
  patientName: string;
  patientEmail: string;
}

export default function ProfessionalDashboard() {
  const [appointments, setAppointments] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const psychologistId = "1"; 

  const fetchAgenda = () => {
    setLoading(true);
    fetch(`http://localhost:7145/api/appointment/psychologist/${psychologistId}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando la agenda:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  // Función para confirmar la cita
  const handleConfirm = async (appointmentId: number) => {
    try {
      const response = await fetch(`http://localhost:7145/api/appointment/confirm/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error("No se pudo confirmar la cita");
      
      // Refrescamos la lista localmente para ver el cambio de estado de una
      setAppointments(prev => 
        prev.map(app => app.id === appointmentId ? { ...app, status: 'Confirmed' } : app)
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al confirmar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-400">
            P
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Panel Profesional</h1>
            <span className="text-xs text-indigo-200">Portal de Especialistas</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 text-xs py-2 px-3 rounded-lg transition-colors"
        >
          <LogOut size={14} /> Salir
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tu Agenda de Consultas</h2>
            <p className="text-slate-500 text-sm">Gestiona tus pacientes, confirma asistencia y revisa solicitudes urgentes.</p>
          </div>
          <button 
            onClick={fetchAgenda} 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white border px-3 py-2 rounded-lg shadow-sm transition-all"
          >
            Actualizar Lista
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">Cargando agenda del día...</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-slate-400">
            <Calendar className="mx-auto mb-2 opacity-40" size={40} />
            <p className="text-sm font-semibold">No tienes citas agendadas por el momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className={`bg-white p-5 rounded-2xl shadow-sm border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  app.isImmediate ? 'border-l-4 border-l-amber-500' : 'border-slate-200'
                }`}
              >
                {/* Datos Cita y Paciente */}
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-xl hidden sm:flex ${app.isImmediate ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}`}>
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-base">{app.patientName}</h3>
                      {app.isImmediate && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <AlertCircle size={10}/> Inmediata
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {app.status === 'Confirmed' ? 'Confirmada' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2.5">{app.patientEmail}</p>
                    
                    {/* Fecha y Hora */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(app.appointmentDate).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(app.appointmentDate).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="w-full md:w-auto flex justify-end">
                  {app.status !== 'Confirmed' ? (
                    <button
                      onClick={() => handleConfirm(app.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      <Check size={14} /> Confirmar Cita
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 px-3 py-2 bg-emerald-50 rounded-xl">
                      <Check size={14} /> Lista para consulta
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
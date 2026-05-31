import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, FileText, CheckCircle } from 'lucide-react';

interface Professional {
  id: number;
  fullName: string;  
  specialty: string; 
}

export default function BookAppointment() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProf, setSelectedProf] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notas, setNotas] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    fetch('http://localhost:7145/api/appointment/professionals')
      .then((res) => res.json())
      .then((data) => setProfessionals(data))
      .catch((err) => console.error('Error cargando profesionales:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProf || !date || !time) return alert('Por favor completa los campos obligatorios');

    setLoading(true);
    const fullDateTime = new Date(`${date}T${time}`).toISOString();

    try {
      const response = await fetch('http://localhost:7145/api/appointment/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          psychologistId: parseInt(selectedProf), 
          appointmentDate: fullDateTime
        })
      });

      if (!response.ok) throw new Error('No se pudo agendar la cita');
      
      setSuccess(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">¡Cita Agendada!</h2>
          <p className="text-slate-500 text-sm mt-2">Tu espacio ha sido reservado de forma exitosa. El profesional revisará los detalles.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-colors">
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center shadow-sm max-w-2xl mx-auto w-full">
        <button onClick={() => navigate('/dashboard')} className="mr-4 hover:bg-slate-100 p-2 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-indigo-900">Agendar Cita Médica</h1>
      </header>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Selector de Psicólogos */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 flex items-center gap-1"><User size={14}/> Selecciona tu Psicólogo/a *</label>
              <select
                required
                value={selectedProf}
                onChange={(e) => setSelectedProf(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700"
              >
                <option value="">-- Elige un especialista --</option>
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 flex items-center gap-1"><Calendar size={14}/> Fecha *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 flex items-center gap-1"> Hora *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Notas Adicionales */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 flex items-center gap-1"><FileText size={14}/> Motivo de la consulta / Notas</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Cuéntanos brevemente la razón de tu cita..."
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Confirmando espacio...' : 'Confirmar y Agendar Cita'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
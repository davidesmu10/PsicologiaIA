import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import ProfessionalDashboard from './pages/ProfessionalDashboard';

// Encapsulamos el Chat anterior en un componente limpio para la ruta
function ChatIAPage() {
  const [messages, setMessages] = useState([
    { role: 'model', message: '¡Hola! Soy Escobar, tu psicóloga virtual. Estoy aquí para escucharte en un espacio seguro. ¿Cómo te has sentido hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 1;

  const handleSend = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', message: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:7145/api/chat/${userId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage })
      });
      if (!response.ok) throw new Error('Error de servidor');
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', message: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'model', message: 'Hubo un error de conexión con la IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border bg-white shadow-xl">
      <header className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-3 hover:bg-indigo-700 p-1.5 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xl mr-3">E</div>
          <div>
            <h1 className="font-semibold text-lg">Dra. Escobar</h1>
            <p className="text-xs text-indigo-200 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span> IA Activa
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
              <p className="whitespace-pre-line">{msg.message}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </main>

      <form onSubmit={handleSend} className="p-4 border-t bg-white flex items-center space-x-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe cómo te sientes..." disabled={loading} className="flex-1 border border-slate-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
        <button type="submit" disabled={loading || !input.trim()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium">Enviar</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat-ia" element={<ChatIAPage />} />
        <Route path="/agendar" element={<BookAppointment />} />
        <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
      </Routes>
    </Router>
  );
}
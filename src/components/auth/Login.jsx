import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaUtensils } from 'react-icons/fa';
import useStore from '../../store/useStore';
import { USERS } from '../../data/restaurant';

export default function Login() {
  const login = useStore((s) => s.login);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin]   = useState('');
  const [error, setError] = useState('');

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    setPin((p) => p + d);
    setError('');
  };

  const handleDel = () => setPin((p) => p.slice(0, -1));

  const handleLogin = () => {
    if (!selectedUser) { setError('Selecciona un usuario'); return; }
    if (pin !== selectedUser.pin) { setError('PIN incorrecto'); setPin(''); return; }
    login(selectedUser);
  };

  const roleColors = {
    admin:    'bg-violet-600',
    mesero:   'bg-sky-600',
    cocinero: 'bg-orange-600',
    cajero:   'bg-emerald-600',
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-4">
            <FaUtensils size={28} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-black tracking-wide">TYL ERP</h1>
          <p className="text-slate-500 text-sm mt-1">Sistema de gestión para restaurante</p>
        </div>

        {/* User selector */}
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Selecciona tu perfil</p>
          <div className="grid grid-cols-2 gap-2">
            {USERS.map((u) => (
              <button key={u.id} onClick={() => { setSelectedUser(u); setPin(''); setError(''); }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${selectedUser?.id === u.id
                    ? `${roleColors[u.role]} border-transparent text-white`
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${selectedUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {u.initials}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{u.name}</p>
                  <p className={`text-xs capitalize ${selectedUser?.id === u.id ? 'text-white/70' : 'text-slate-500'}`}>{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PIN pad */}
        {selectedUser && (
          <div className="bg-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 text-center">PIN de acceso</p>
              <div className="flex justify-center gap-3">
                {[0,1,2,3].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black border-2 transition-all
                    ${i < pin.length ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-500'}`}>
                    {i < pin.length ? '●' : '○'}
                  </div>
                ))}
              </div>
              {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6,7,8,9].map((d) => (
                <button key={d} onClick={() => handleDigit(String(d))}
                  className="h-12 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-lg font-bold transition-colors">
                  {d}
                </button>
              ))}
              <button onClick={() => handleDigit('0')} className="col-start-2 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-lg font-bold transition-colors">0</button>
              <button onClick={handleDel} className="h-12 rounded-xl bg-slate-700 hover:bg-red-900 text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center">
                <MdDelete size={20} />
              </button>
            </div>

            <button onClick={handleLogin}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-colors
                ${pin.length === 4 ? `${roleColors[selectedUser.role]} hover:opacity-90` : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
              Ingresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

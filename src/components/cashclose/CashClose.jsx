import { useState, useMemo } from 'react';
import { MdPointOfSale, MdCheckCircle, MdHistory, MdEdit, MdDelete, MdAdd, MdSave, MdClose, MdSettings } from 'react-icons/md';
import useStore from '../../store/useStore';

const PAYMENT_COLORS = {
  Efectivo:      'bg-emerald-100 text-emerald-700',
  Tarjeta:       'bg-sky-100 text-sky-700',
  Transferencia: 'bg-violet-100 text-violet-700',
  Uber:          'bg-slate-100 text-slate-700',
  Rappi:         'bg-orange-100 text-orange-700',
  Didi:          'bg-amber-100 text-amber-700',
};

const fmtMXN = (n) => '$' + (n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });

/* ─── Shift manager modal ─────────────────────────────────────────────── */
function ShiftManager({ onClose }) {
  const shifts      = useStore((s) => s.shifts);
  const updateShift = useStore((s) => s.updateShift);
  const addShift    = useStore((s) => s.addShift);
  const deleteShift = useStore((s) => s.deleteShift);

  const [editId, setEditId]   = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow]   = useState({ label: '', start: '08:00', end: '16:00' });
  const [showNew, setShowNew] = useState(false);

  const startEdit = (sh) => { setEditId(sh.id); setEditRow({ label: sh.label, start: sh.start, end: sh.end }); };
  const saveEdit  = () => { updateShift(editId, editRow); setEditId(null); };

  const handleAdd = () => {
    if (!newRow.label.trim()) return;
    addShift(newRow);
    setNewRow({ label: '', start: '08:00', end: '16:00' });
    setShowNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <MdSettings size={18} className="text-primary-600" /> Gestionar turnos
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><MdClose size={18} /></button>
        </div>

        <div className="space-y-2">
          {shifts.map((sh) => (
            <div key={sh.id} className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50">
              {editId === sh.id ? (
                <>
                  <input value={editRow.label} onChange={(e) => setEditRow({ ...editRow, label: e.target.value })}
                    placeholder="Nombre del turno"
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="time" value={editRow.start} onChange={(e) => setEditRow({ ...editRow, start: e.target.value })}
                    className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <span className="text-slate-400 text-xs">–</span>
                  <input type="time" value={editRow.end} onChange={(e) => setEditRow({ ...editRow, end: e.target.value })}
                    className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <button onClick={saveEdit} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"><MdSave size={15} /></button>
                  <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><MdClose size={15} /></button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700">{sh.label}</p>
                    <p className="text-xs text-slate-400">{sh.start} – {sh.end}</p>
                  </div>
                  <button onClick={() => startEdit(sh)} className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"><MdEdit size={15} /></button>
                  {shifts.length > 1 && (
                    <button onClick={() => deleteShift(sh.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><MdDelete size={15} /></button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new shift */}
        {showNew ? (
          <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/30">
            <input value={newRow.label} onChange={(e) => setNewRow({ ...newRow, label: e.target.value })}
              placeholder="Nombre del turno"
              className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input type="time" value={newRow.start} onChange={(e) => setNewRow({ ...newRow, start: e.target.value })}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <span className="text-slate-400 text-xs">–</span>
            <input type="time" value={newRow.end} onChange={(e) => setNewRow({ ...newRow, end: e.target.value })}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <button onClick={handleAdd} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"><MdSave size={15} /></button>
            <button onClick={() => setShowNew(false)} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><MdClose size={15} /></button>
          </div>
        ) : (
          <button onClick={() => setShowNew(true)}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <MdAdd size={16} /> Agregar turno
          </button>
        )}

        <button onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors">
          Listo
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────── */
export default function CashClose() {
  const incomes     = useStore((s) => s.incomes);
  const expenses    = useStore((s) => s.expenses);
  const cashCloses  = useStore((s) => s.cashCloses);
  const currentUser = useStore((s) => s.currentUser);
  const shifts      = useStore((s) => s.shifts);
  const saveCashClose = useStore((s) => s.saveCashClose);

  const [shiftId,    setShiftId]    = useState(() => shifts[0]?.id ?? '');
  const [actualCash, setActualCash] = useState('');
  const [notes,      setNotes]      = useState('');
  const [saved,      setSaved]      = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const todayStr = new Date().toDateString();

  const todayIncomes  = useMemo(() => incomes.filter((i)  => new Date(i.date).toDateString() === todayStr), [incomes]);
  const todayExpenses = useMemo(() => expenses.filter((e) => new Date(e.date).toDateString() === todayStr), [expenses]);

  const totalSales    = useMemo(() => todayIncomes.reduce((s, i)  => s + i.amount, 0), [todayIncomes]);
  const totalExpenses = useMemo(() => todayExpenses.reduce((s, e) => s + e.amount, 0), [todayExpenses]);
  const netProfit     = totalSales - totalExpenses;

  const byMethod = useMemo(() => {
    const map = {};
    todayIncomes.forEach((i) => { map[i.paymentMethod] = (map[i.paymentMethod] ?? 0) + i.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [todayIncomes]);

  const expectedCash = byMethod.find(([m]) => m === 'Efectivo')?.[1] ?? 0;
  const diff = +actualCash - expectedCash;

  const activeShift = shifts.find((s) => s.id === shiftId) ?? shifts[0];

  const handleClose = () => {
    saveCashClose({
      shift: activeShift?.label ?? shiftId,
      shiftHours: activeShift ? `${activeShift.start} – ${activeShift.end}` : '',
      date: new Date().toISOString(),
      closedBy: currentUser?.name ?? 'Sistema',
      expectedCash,
      actualCash: +actualCash,
      diff,
      totalSales,
      totalExpenses,
      netProfit,
      byMethod: Object.fromEntries(byMethod),
      notes,
    });
    setSaved(true);
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdPointOfSale className="text-primary-600" size={26} /> Cierre de caja
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}
          </p>
        </div>
        <button onClick={() => setShowConfig(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          <MdSettings size={16} /> Configurar turnos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Ventas del día',  value: fmtMXN(totalSales),    color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Egresos del día', value: fmtMXN(totalExpenses), color: 'text-red-600',     bg: 'bg-red-50' },
              { label: 'Utilidad neta',   value: fmtMXN(netProfit),     color: netProfit >= 0 ? 'text-primary-600' : 'text-red-600', bg: 'bg-primary-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4`}>
                <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
                <p className={`text-xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Ventas por método de pago</h2>
            {byMethod.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">Sin ventas hoy</p>
            ) : (
              <div className="space-y-3">
                {byMethod.map(([method, amount]) => {
                  const pct = totalSales > 0 ? Math.round((amount / totalSales) * 100) : 0;
                  return (
                    <div key={method}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_COLORS[method] ?? 'bg-slate-100 text-slate-600'}`}>{method}</span>
                        <span className="text-sm font-bold text-slate-800">{fmtMXN(amount)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Últimas ventas del día ({todayIncomes.length})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todayIncomes.slice(0, 10).map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-700 font-medium">{i.concept}</p>
                    <p className="text-slate-400 text-xs">{new Date(i.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} · {i.paymentMethod}</p>
                  </div>
                  <span className="font-bold text-emerald-600">{fmtMXN(i.amount)}</span>
                </div>
              ))}
              {todayIncomes.length === 0 && <p className="text-slate-400 text-sm text-center py-2">Sin ventas hoy</p>}
            </div>
          </div>
        </div>

        {/* Right: close form */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Realizar cierre</h2>

            {/* Shift selector */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Turno</label>
              <div className="space-y-1.5">
                {shifts.map((sh) => (
                  <button key={sh.id} onClick={() => setShiftId(sh.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors
                      ${shiftId === sh.id ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <span className="font-medium">{sh.label}</span>
                    <span className={`text-xs ${shiftId === sh.id ? 'text-white/70' : 'text-slate-400'}`}>{sh.start} – {sh.end}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Efectivo esperado</span>
                <span className="font-bold text-slate-700">{fmtMXN(expectedCash)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Efectivo contado ($)</label>
              <input type="number" value={actualCash} onChange={(e) => { setActualCash(e.target.value); setSaved(false); }} placeholder="0.00"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {actualCash !== '' && (
              <div className={`rounded-xl p-3 text-sm font-semibold flex justify-between
                ${diff === 0 ? 'bg-emerald-50 text-emerald-700' : diff > 0 ? 'bg-sky-50 text-sky-700' : 'bg-red-50 text-red-700'}`}>
                <span>{diff === 0 ? 'Cuadrado ✓' : diff > 0 ? 'Sobrante' : 'Faltante'}</span>
                <span>{diff >= 0 ? '+' : ''}{fmtMXN(diff)}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Notas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Observaciones del turno…"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>

            {saved ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <MdCheckCircle size={18} /> Cierre guardado
              </div>
            ) : (
              <button onClick={handleClose}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-colors">
                Guardar cierre de caja
              </button>
            )}
          </div>

          {cashCloses.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <MdHistory size={16} /> Cierres anteriores
              </h2>
              <div className="space-y-2">
                {cashCloses.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-slate-700">{c.shift}</p>
                      <p className="text-slate-400">{new Date(c.date).toLocaleDateString('es-MX')} · {c.shiftHours}</p>
                      <p className="text-slate-400">{c.closedBy}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{fmtMXN(c.totalSales)}</p>
                      <p className={`font-semibold ${c.diff >= 0 ? 'text-sky-600' : 'text-red-500'}`}>
                        {c.diff >= 0 ? '+' : ''}{fmtMXN(c.diff)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfig && <ShiftManager onClose={() => setShowConfig(false)} />}
    </div>
  );
}

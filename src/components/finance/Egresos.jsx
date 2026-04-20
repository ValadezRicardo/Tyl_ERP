import { useState, useMemo } from 'react';
import { MdAdd, MdDelete, MdClose, MdTrendingDown } from 'react-icons/md';
import useStore from '../../store/useStore';
import { EXPENSE_CATEGORIES } from '../../data/restaurant';

const EMPTY = { concept: '', amount: '', category: EXPENSE_CATEGORIES[0], date: new Date().toISOString().slice(0, 10), notes: '' };

const CAT_COLORS = {
  'Insumos / Ingredientes':       'bg-orange-100 text-orange-700',
  'Personal / Nómina':            'bg-violet-100 text-violet-700',
  'Renta':                        'bg-red-100 text-red-700',
  'Servicios (luz, agua, gas)':   'bg-sky-100 text-sky-700',
  'Mantenimiento':                'bg-amber-100 text-amber-700',
  'Marketing':                    'bg-pink-100 text-pink-700',
  'Equipo y utensilios':          'bg-teal-100 text-teal-700',
  'Otros':                        'bg-slate-100 text-slate-600',
};

function periodFilter(records, period) {
  const now = new Date();
  return records.filter((r) => {
    const d = new Date(r.date);
    if (period === 'hoy')    return d.toDateString() === now.toDateString();
    if (period === 'semana') { const w = new Date(now); w.setDate(w.getDate() - 7); return d >= w; }
    if (period === 'mes')    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });
}

export default function Egresos() {
  const expenses      = useStore((s) => s.expenses);
  const addExpense    = useStore((s) => s.addExpense);
  const deleteExpense = useStore((s) => s.deleteExpense);

  const [period,  setPeriod]  = useState('mes');
  const [catFilter, setCat]   = useState('Todos');
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});

  const filtered = useMemo(() => {
    const byPeriod = periodFilter(expenses, period);
    return catFilter === 'Todos' ? byPeriod : byPeriod.filter((e) => e.category === catFilter);
  }, [expenses, period, catFilter]);

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);

  const byCategory = useMemo(() => {
    const all = periodFilter(expenses, period);
    const map = {};
    all.forEach((e) => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses, period]);

  const validate = () => {
    const e = {};
    if (!form.concept.trim()) e.concept = 'Requerido';
    if (+form.amount <= 0)    e.amount  = 'Monto > 0';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addExpense({ ...form, amount: +form.amount, date: new Date(form.date + 'T12:00:00').toISOString() });
    setForm(EMPTY); setShowAdd(false); setErrors({});
  };

  const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 });

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdTrendingDown className="text-red-500" size={26} /> Egresos
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} registros · Total: <span className="font-semibold text-red-600">{fmt(total)}</span></p>
        </div>
        <button onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
          <MdAdd size={16} /> Registrar egreso
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Nuevo egreso</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Concepto</label>
              <input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Descripción del gasto"
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.concept ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.concept && <p className="text-xs text-red-500 mt-0.5">{errors.concept}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Monto ($)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.amount ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.amount && <p className="text-xs text-red-500 mt-0.5">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400">
                {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Notas (opcional)</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Detalles adicionales"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
              <MdTrendingDown size={15} /> Guardar
            </button>
            <button onClick={() => { setShowAdd(false); setErrors({}); }} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <MdClose size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Period + summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Period + total */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">Período</p>
          <div className="flex gap-1">
            {[['hoy','Hoy'],['semana','7 días'],['mes','Este mes'],['todo','Todo']].map(([v, l]) => (
              <button key={v} onClick={() => setPeriod(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === v ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {l}
              </button>
            ))}
          </div>
          <p className="text-2xl font-black text-red-600 mt-3">{fmt(total)}</p>
        </div>

        {/* By category breakdown */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wide">Por categoría</p>
          <div className="grid grid-cols-2 gap-2">
            {byCategory.map(([cat, amount]) => {
              const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
              return (
                <div key={cat} className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${CAT_COLORS[cat] ?? 'bg-slate-100 text-slate-600'}`}>
                    {pct}%
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600 truncate">{cat}</p>
                    <p className="text-xs font-semibold text-slate-800">{fmt(amount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['Todos', ...EXPENSE_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${catFilter === c ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['#', 'Fecha', 'Concepto', 'Categoría', 'Notas', 'Monto', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.id}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(r.date).toLocaleDateString('es-MX')}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{r.concept}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CAT_COLORS[r.category] ?? 'bg-slate-100 text-slate-600'}`}>{r.category}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.notes}</td>
                  <td className="px-4 py-3 font-bold text-red-600">{fmt(r.amount)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteExpense(r.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                      <MdDelete size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

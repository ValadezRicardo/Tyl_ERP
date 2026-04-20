import { useState, useMemo } from 'react';
import { MdAdd, MdDelete, MdAttachMoney, MdClose, MdTrendingUp } from 'react-icons/md';
import useStore from '../../store/useStore';
import { INCOME_CATEGORIES } from '../../data/restaurant';

const PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Transferencia'];
const EMPTY = { concept: '', amount: '', category: INCOME_CATEGORIES[0], paymentMethod: 'Efectivo', date: new Date().toISOString().slice(0, 10), notes: '' };

function periodFilter(records, period) {
  const now = new Date();
  return records.filter((r) => {
    const d = new Date(r.date);
    if (period === 'hoy')   return d.toDateString() === now.toDateString();
    if (period === 'semana') { const w = new Date(now); w.setDate(w.getDate() - 7); return d >= w; }
    if (period === 'mes')   return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });
}

export default function Ingresos() {
  const incomes    = useStore((s) => s.incomes);
  const addIncome  = useStore((s) => s.addIncome);
  const deleteIncome = useStore((s) => s.deleteIncome);

  const [period,  setPeriod]  = useState('mes');
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});

  const filtered = useMemo(() => periodFilter(incomes, period), [incomes, period]);
  const total    = useMemo(() => filtered.reduce((s, i) => s + i.amount, 0), [filtered]);

  const byMethod = useMemo(() => {
    const map = {};
    filtered.forEach((i) => { map[i.paymentMethod] = (map[i.paymentMethod] ?? 0) + i.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map = {};
    filtered.forEach((i) => { map[i.category] = (map[i.category] ?? 0) + i.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const validate = () => {
    const e = {};
    if (!form.concept.trim()) e.concept = 'Requerido';
    if (+form.amount <= 0)    e.amount  = 'Monto > 0';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addIncome({ ...form, amount: +form.amount, date: new Date(form.date + 'T12:00:00').toISOString() });
    setForm(EMPTY); setShowAdd(false); setErrors({});
  };

  const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 });

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdTrendingUp className="text-emerald-600" size={26} /> Ingresos
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} registros · Total: <span className="font-semibold text-emerald-700">{fmt(total)}</span></p>
        </div>
        <button onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
          <MdAdd size={16} /> Registrar ingreso
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Nuevo ingreso</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Concepto</label>
              <input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })}
                placeholder="Descripción del ingreso"
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.concept ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.concept && <p className="text-xs text-red-500 mt-0.5">{errors.concept}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Monto ($)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.amount ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.amount && <p className="text-xs text-red-500 mt-0.5">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {INCOME_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Método de pago</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              <MdAttachMoney size={15} /> Guardar
            </button>
            <button onClick={() => { setShowAdd(false); setErrors({}); }} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <MdClose size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Period filter + summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Period toggle */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">Período</p>
          <div className="flex gap-1">
            {[['hoy','Hoy'],['semana','7 días'],['mes','Este mes'],['todo','Todo']].map(([v, l]) => (
              <button key={v} onClick={() => setPeriod(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === v ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {l}
              </button>
            ))}
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-3">{fmt(total)}</p>
        </div>

        {/* By method */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wide">Por método de pago</p>
          <div className="space-y-2">
            {byMethod.map(([method, amount]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{method}</span>
                <span className="text-sm font-semibold text-slate-800">{fmt(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By category */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wide">Por categoría</p>
          <div className="space-y-2">
            {byCategory.map(([cat, amount]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 truncate mr-2">{cat}</span>
                <span className="text-sm font-semibold text-slate-800 shrink-0">{fmt(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['#', 'Fecha', 'Concepto', 'Categoría', 'Método', 'Monto', ''].map((h) => (
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
                  <td className="px-4 py-3 text-slate-500">{r.category}</td>
                  <td className="px-4 py-3 text-slate-500">{r.paymentMethod}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{fmt(r.amount)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteIncome(r.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
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

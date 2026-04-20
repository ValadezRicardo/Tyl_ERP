import { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { MdBarChart, MdTrendingUp, MdTrendingDown, MdAccountBalance } from 'react-icons/md';
import useStore from '../../store/useStore';

const PIE_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#84cc16'];
const fmtMXN = (n) => '$' + (n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtK   = (n) => n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + n;

function KPI({ label, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Reports() {
  const incomes  = useStore((s) => s.incomes);
  const expenses = useStore((s) => s.expenses);
  const menuItems = useStore((s) => s.menuItems);

  const [period, setPeriod] = useState('mes');

  const filtered = useMemo(() => {
    const now = new Date();
    const filterDate = (arr) => arr.filter((r) => {
      const d = new Date(r.date);
      if (period === 'hoy')    return d.toDateString() === now.toDateString();
      if (period === 'semana') { const w = new Date(now); w.setDate(w.getDate() - 7); return d >= w; }
      if (period === 'mes')    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    });
    return { incomes: filterDate(incomes), expenses: filterDate(expenses) };
  }, [incomes, expenses, period]);

  const totalIncome  = useMemo(() => filtered.incomes.reduce((s, i) => s + i.amount, 0), [filtered.incomes]);
  const totalExpense = useMemo(() => filtered.expenses.reduce((s, e) => s + e.amount, 0), [filtered.expenses]);
  const netProfit    = totalIncome - totalExpense;
  const margin       = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Monthly 6-month trend
  const monthly = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const label = d.toLocaleString('es-MX', { month: 'short' });
      const ing = incomes.filter((r) => { const rd = new Date(r.date); return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear(); }).reduce((s, r) => s + r.amount, 0);
      const eg  = expenses.filter((r) => { const rd = new Date(r.date); return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear(); }).reduce((s, r) => s + r.amount, 0);
      return { label, ingresos: Math.round(ing), egresos: Math.round(eg), utilidad: Math.round(ing - eg) };
    });
  }, [incomes, expenses]);

  // Payment method breakdown
  const byMethod = useMemo(() => {
    const map = {};
    filtered.incomes.forEach((i) => { map[i.paymentMethod] = (map[i.paymentMethod] ?? 0) + i.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [filtered.incomes]);

  // Expense by category
  const byExpCat = useMemo(() => {
    const map = {};
    filtered.expenses.forEach((e) => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, amount }));
  }, [filtered.expenses]);

  // Hourly sales (filtered period)
  const hourly = useMemo(() => {
    const map = Array(24).fill(0);
    filtered.incomes.forEach((i) => { map[new Date(i.date).getHours()] += i.amount; });
    return map.map((v, h) => ({ hour: `${String(h).padStart(2, '0')}h`, ventas: Math.round(v) })).filter((_, h) => h >= 7 && h <= 23);
  }, [filtered.incomes]);

  // Food cost per dish (top 10 by food cost %)
  const foodCostItems = useMemo(() =>
    menuItems
      .filter((m) => m.price > 0 && m.cost > 0)
      .map((m) => ({ ...m, fc: Math.round((m.cost / m.price) * 100) }))
      .sort((a, b) => b.fc - a.fc)
      .slice(0, 10),
    [menuItems]
  );

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdBarChart className="text-primary-600" size={26} /> Reportes
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Análisis financiero y operativo</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {[['hoy','Hoy'],['semana','7 días'],['mes','Este mes'],['todo','Todo']].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period === v ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPI label="Ingresos"     value={fmtMXN(totalIncome)}  color="text-emerald-600" sub={`${filtered.incomes.length} transacciones`} />
        <KPI label="Egresos"      value={fmtMXN(totalExpense)} color="text-red-600"     sub={`${filtered.expenses.length} registros`} />
        <KPI label="Utilidad neta" value={fmtMXN(netProfit)}   color={netProfit >= 0 ? 'text-primary-600' : 'text-red-600'} />
        <KPI label="Margen neto"  value={`${margin}%`}          color={margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-600' : 'text-red-600'} sub="sobre ingresos" />
      </div>

      {/* P&L 6 months */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4">P&L — Últimos 6 meses</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthly} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55} />
            <Tooltip formatter={(v, n) => [fmtMXN(v), n === 'ingresos' ? 'Ingresos' : n === 'egresos' ? 'Egresos' : 'Utilidad']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600 capitalize">{v}</span>} />
            <Bar dataKey="ingresos"  fill="#10b981" radius={[4,4,0,0]} barSize={14} />
            <Bar dataKey="egresos"   fill="#ef4444" radius={[4,4,0,0]} barSize={14} />
            <Bar dataKey="utilidad"  fill="#6366f1" radius={[4,4,0,0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row: hourly sales + payment methods */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Ventas por hora del día</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourly} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip formatter={(v) => [fmtMXN(v), 'Ventas']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="ventas" fill="#6366f1" radius={[4,4,0,0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Métodos de pago</h2>
          {byMethod.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={byMethod} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {byMethod.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, _, p) => [fmtMXN(v), p.payload.name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row: expense breakdown + food cost */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Egresos por categoría</h2>
          {byExpCat.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Sin egresos en este período</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byExpCat} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={130} />
                <Tooltip formatter={(v) => [fmtMXN(v), 'Monto']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="amount" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Food cost por platillo (top 10)</h2>
          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {foodCostItems.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-slate-700 truncate">{m.name}</p>
                    <span className={`text-xs font-bold ml-2 shrink-0 ${m.fc <= 30 ? 'text-emerald-600' : m.fc <= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {m.fc}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.fc <= 30 ? 'bg-emerald-500' : m.fc <= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(m.fc, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  MdTrendingUp, MdTrendingDown, MdAccountBalance,
  MdInventory2, MdWarning, MdTableRestaurant,
} from 'react-icons/md';
import useStore from '../../store/useStore';

const fmt = (n) =>
  n >= 1000
    ? '$' + (n / 1000).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + 'k'
    : '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function KPICard({ icon: Icon, label, value, color, sub, trend }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        {trend !== undefined && (
          <p className={`text-xs mt-0.5 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% vs mes anterior
          </p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const incomes    = useStore((s) => s.incomes);
  const expenses   = useStore((s) => s.expenses);
  const ingredients = useStore((s) => s.ingredients);
  const kanbanTickets = useStore((s) => s.kanbanTickets);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    const incomeToday   = incomes.filter((i)  => new Date(i.date).toDateString() === todayStr).reduce((s, i) => s + i.amount, 0);
    const expenseToday  = expenses.filter((e) => new Date(e.date).toDateString() === todayStr).reduce((s, e) => s + e.amount, 0);

    const thisMonth = (arr) => arr.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const incomeMonth  = thisMonth(incomes).reduce((s, i) => s + i.amount, 0);
    const expenseMonth = thisMonth(expenses).reduce((s, e) => s + e.amount, 0);
    const netMonth     = incomeMonth - expenseMonth;

    const lastMonth = (arr) => arr.filter((r) => {
      const d = new Date(r.date);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    });
    const incomeLastMonth = lastMonth(incomes).reduce((s, i) => s + i.amount, 0);
    const incomeTrend = incomeLastMonth > 0 ? ((incomeMonth - incomeLastMonth) / incomeLastMonth) * 100 : 0;

    const lowStock = ingredients.filter((i) => i.stock <= i.minStock).length;
    const activeTickets = kanbanTickets.filter((t) => t.status !== 'entregado').length;

    const monthly = Array.from({ length: 6 }, (_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const label = d.toLocaleString('es-MX', { month: 'short' });
      const ing = incomes.filter((r) => {
        const rd = new Date(r.date);
        return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
      }).reduce((s, r) => s + r.amount, 0);
      const eg = expenses.filter((r) => {
        const rd = new Date(r.date);
        return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
      }).reduce((s, r) => s + r.amount, 0);
      return { label, ingresos: Math.round(ing), egresos: Math.round(eg), utilidad: Math.round(ing - eg) };
    });

    const catMap = {};
    thisMonth(expenses).forEach((e) => { catMap[e.category] = (catMap[e.category] ?? 0) + e.amount; });
    const topExpCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, amount]) => ({ name: name.length > 22 ? name.slice(0, 20) + '…' : name, amount }));

    const lowIngredients = ingredients.filter((i) => i.stock <= i.minStock).slice(0, 5);

    return { incomeToday, expenseToday, incomeMonth, expenseMonth, netMonth, incomeTrend, lowStock, activeTickets, monthly, topExpCats, lowIngredients };
  }, [incomes, expenses, ingredients, kanbanTickets]);

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={MdTrendingUp}      label="Ingresos este mes"    value={fmt(stats.incomeMonth)}   color="bg-emerald-500" trend={stats.incomeTrend} />
        <KPICard icon={MdTrendingDown}    label="Egresos este mes"     value={fmt(stats.expenseMonth)}  color="bg-red-500"     sub={`Hoy: ${fmt(stats.expenseToday)}`} />
        <KPICard icon={MdAccountBalance}  label="Utilidad neta mes"    value={fmt(stats.netMonth)}      color={stats.netMonth >= 0 ? 'bg-primary-600' : 'bg-rose-600'} sub={`Ingresos hoy: ${fmt(stats.incomeToday)}`} />
        <KPICard icon={MdInventory2}      label="Insumos con stock bajo" value={stats.lowStock}         color="bg-amber-500"   sub={`${stats.activeTickets} tickets activos`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area chart — 6 months */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Ingresos vs Egresos (últimos 6 meses)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.monthly} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="egGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                formatter={(v, name) => [fmt(v), name === 'ingresos' ? 'Ingresos' : 'Egresos']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} fill="url(#ingGrad)" dot={false} />
              <Area type="monotone" dataKey="egresos"  stroke="#ef4444" strokeWidth={2} fill="url(#egGrad)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <MdWarning className="text-amber-500" size={18} /> Alertas de stock
          </h2>
          <p className="text-xs text-slate-400 mb-4">Insumos por debajo del mínimo</p>
          {stats.lowIngredients.length === 0 ? (
            <p className="text-sm text-emerald-600 font-medium">Todo el inventario OK ✓</p>
          ) : (
            <div className="space-y-3">
              {stats.lowIngredients.map((ing) => (
                <div key={ing.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 truncate max-w-36">{ing.name}</p>
                    <p className="text-xs text-slate-400">{ing.unit} · mín {ing.minStock}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ing.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {ing.stock <= 0 ? 'Agotado' : ing.stock + ' ' + ing.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar — top expense categories */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Principales egresos del mes</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.topExpCats} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip
                formatter={(v) => [fmt(v), 'Monto']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="amount" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active tickets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <MdTableRestaurant className="text-primary-600" size={18} /> Cocina activa
          </h2>
          <p className="text-xs text-slate-400 mb-4">Tickets en proceso ahora</p>
          <div className="space-y-2">
            {[
              { status: 'nuevo',   color: 'bg-sky-100 text-sky-700',         label: 'Nuevos' },
              { status: 'cocina',  color: 'bg-orange-100 text-orange-700',   label: 'En cocina' },
              { status: 'listo',   color: 'bg-emerald-100 text-emerald-700', label: 'Listos' },
            ].map(({ status, color, label }) => {
              const count = kanbanTickets.filter((t) => t.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm text-slate-600 font-medium">{label}</span>
                  <span className={`px-3 py-0.5 rounded-full text-sm font-bold ${color}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

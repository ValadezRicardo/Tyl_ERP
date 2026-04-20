import { useState, useMemo } from 'react';
import { MdSearch, MdAdd, MdEdit, MdSave, MdClose, MdDelete, MdFilterList, MdRestaurantMenu } from 'react-icons/md';
import useStore from '../../store/useStore';
import { MENU_CATEGORIES } from '../../data/restaurant';

const EMPTY = { sku: '', name: '', category: MENU_CATEGORIES[0], description: '', price: '', cost: '' };

function Badge({ children, color = 'slate' }) {
  const map = { green: 'bg-emerald-100 text-emerald-700', red: 'bg-red-100 text-red-600', slate: 'bg-slate-100 text-slate-600', amber: 'bg-amber-100 text-amber-700' };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[color]}`}>{children}</span>;
}

function foodCostColor(pct) {
  if (pct <= 30) return 'text-emerald-600';
  if (pct <= 40) return 'text-amber-600';
  return 'text-red-600';
}

export default function MenuManager() {
  const menuItems      = useStore((s) => s.menuItems);
  const addMenuItem    = useStore((s) => s.addMenuItem);
  const updateMenuItem = useStore((s) => s.updateMenuItem);
  const deleteMenuItem = useStore((s) => s.deleteMenuItem);
  const toggleAvailable = useStore((s) => s.toggleAvailable);

  const [search,  setSearch]  = useState('');
  const [catFilter, setCat]   = useState('Todos');
  const [showAdd, setShowAdd] = useState(false);
  const [newData, setNewData] = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [editId,  setEditId]  = useState(null);
  const [editData, setEditData] = useState({});

  const rows = useMemo(() => menuItems.filter((m) => {
    const matchS = m.name.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase());
    const matchC = catFilter === 'Todos' || m.category === catFilter;
    return matchS && matchC;
  }), [menuItems, search, catFilter]);

  const validate = (d) => {
    const e = {};
    if (!d.name.trim())   e.name  = 'Requerido';
    if (!d.sku.trim())    e.sku   = 'Requerido';
    if (+d.price <= 0)    e.price = 'Precio > 0';
    if (+d.cost  <= 0)    e.cost  = 'Costo > 0';
    return e;
  };

  const handleAdd = () => {
    const e = validate(newData);
    setErrors(e);
    if (Object.keys(e).length) return;
    addMenuItem({ ...newData, price: +newData.price, cost: +newData.cost });
    setNewData(EMPTY); setShowAdd(false); setErrors({});
  };

  const saveEdit = () => {
    updateMenuItem(editId, { ...editData, price: +editData.price, cost: +editData.cost });
    setEditId(null);
  };

  const Field = ({ k, label, type = 'text', data, set, err }) => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input type={type} value={data[k]} onChange={(e) => set({ ...data, [k]: e.target.value })}
        className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${err?.[k] ? 'border-red-400' : 'border-slate-200'}`} />
      {err?.[k] && <p className="text-xs text-red-500 mt-0.5">{err[k]}</p>}
    </div>
  );

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdRestaurantMenu className="text-primary-600" size={26} /> Menú
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {menuItems.filter((m) => m.available).length} disponibles · {menuItems.filter((m) => !m.available).length} no disponibles
          </p>
        </div>
        <button onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
          <MdAdd size={16} /> Nuevo platillo
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Agregar al menú</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Field k="sku"   label="Clave / SKU"    data={newData} set={setNewData} err={errors} />
            <Field k="name"  label="Nombre"          data={newData} set={setNewData} err={errors} />
            <Field k="price" label="Precio venta ($)" type="number" data={newData} set={setNewData} err={errors} />
            <Field k="cost"  label="Costo estimado ($)" type="number" data={newData} set={setNewData} err={errors} />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
              <select value={newData.category} onChange={(e) => setNewData({ ...newData, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                {MENU_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field k="description" label="Descripción" data={newData} set={setNewData} err={errors} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
              <MdSave size={15} /> Guardar
            </button>
            <button onClick={() => { setShowAdd(false); setErrors({}); }} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <MdClose size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <MdSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Buscar por nombre o clave…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex items-center gap-2">
          <MdFilterList size={17} className="text-slate-400" />
          <select value={catFilter} onChange={(e) => setCat(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Todos</option>
            {MENU_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['SKU', 'Nombre', 'Categoría', 'Precio', 'Costo', '% Food Cost', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((m) => {
                const fc = Math.round((m.cost / m.price) * 100);
                return editId === m.id ? (
                  <tr key={m.id} className="bg-primary-50">
                    <td className="px-4 py-2 text-slate-400 text-xs font-mono">{m.sku}</td>
                    <td className="px-4 py-2">
                      <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none" />
                    </td>
                    <td className="px-4 py-2">
                      <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none">
                        {MENU_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </td>
                    {['price', 'cost'].map((k) => (
                      <td key={k} className="px-4 py-2">
                        <input type="number" value={editData[k]} onChange={(e) => setEditData({ ...editData, [k]: e.target.value })}
                          className="w-20 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none" />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button onClick={saveEdit} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"><MdSave size={14} /></button>
                        <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><MdClose size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{m.sku}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{m.name}</p>
                      {m.description && <p className="text-xs text-slate-400 truncate max-w-48">{m.description}</p>}
                    </td>
                    <td className="px-4 py-3"><Badge>{m.category}</Badge></td>
                    <td className="px-4 py-3 font-semibold text-slate-700">${m.price}</td>
                    <td className="px-4 py-3 text-slate-600">${m.cost}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${foodCostColor(fc)}`}>{fc}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAvailable(m.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${m.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                        {m.available ? '● Disponible' : '○ No disponible'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditId(m.id); setEditData({ name: m.name, category: m.category, price: m.price, cost: m.cost }); }}
                          className="p-1.5 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"><MdEdit size={14} /></button>
                        <button onClick={() => deleteMenuItem(m.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"><MdDelete size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

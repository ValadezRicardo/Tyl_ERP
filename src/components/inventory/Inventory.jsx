import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { MdSearch, MdAdd, MdEdit, MdSave, MdClose, MdDelete, MdFileDownload, MdInventory2, MdWarning } from 'react-icons/md';
import useStore from '../../store/useStore';
import { INGREDIENT_UNITS } from '../../data/restaurant';

const EMPTY = { name: '', unit: INGREDIENT_UNITS[0], stock: '', minStock: '', cost: '', supplier: '' };

function StockBadge({ stock, minStock }) {
  if (stock <= 0)          return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Agotado</span>;
  if (stock <= minStock)   return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Stock bajo</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">OK</span>;
}

export default function Inventory() {
  const ingredients     = useStore((s) => s.ingredients);
  const addIngredient   = useStore((s) => s.addIngredient);
  const updateIngredient = useStore((s) => s.updateIngredient);
  const deleteIngredient = useStore((s) => s.deleteIngredient);
  const adjustStock     = useStore((s) => s.adjustStock);

  const [search,  setSearch]  = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newData, setNewData] = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [editId,  setEditId]  = useState(null);
  const [editData, setEditData] = useState({});
  const [adjustId, setAdjustId] = useState(null);
  const [delta, setDelta]     = useState('');

  const lowStockCount = useMemo(() => ingredients.filter((i) => i.stock <= i.minStock).length, [ingredients]);

  const rows = useMemo(() =>
    ingredients.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
    [ingredients, search]
  );

  const validate = (d) => {
    const e = {};
    if (!d.name.trim()) e.name = 'Requerido';
    if (+d.cost <= 0)   e.cost = 'Costo > 0';
    return e;
  };

  const handleAdd = () => {
    const e = validate(newData);
    setErrors(e);
    if (Object.keys(e).length) return;
    addIngredient({ ...newData, stock: +newData.stock || 0, minStock: +newData.minStock || 0, cost: +newData.cost });
    setNewData(EMPTY); setShowAdd(false); setErrors({});
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows.map(({ name, unit, stock, minStock, cost, supplier }) =>
      ({ Nombre: name, Unidad: unit, Stock: stock, 'Stock mínimo': minStock, 'Costo/unidad': cost, Proveedor: supplier })
    ));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, 'inventario_insumos.xlsx');
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdInventory2 className="text-primary-600" size={26} /> Inventario de insumos
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
            {ingredients.length} ingredientes
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <MdWarning size={14} /> {lowStockCount} con stock bajo
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <MdFileDownload size={16} /> Exportar
          </button>
          <button onClick={() => setShowAdd((v) => !v)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
            <MdAdd size={16} /> Nuevo insumo
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Agregar insumo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { k: 'name',      label: 'Nombre',           type: 'text' },
              { k: 'stock',     label: 'Stock inicial',    type: 'number' },
              { k: 'minStock',  label: 'Stock mínimo',     type: 'number' },
              { k: 'cost',      label: 'Costo por unidad ($)', type: 'number' },
              { k: 'supplier',  label: 'Proveedor',        type: 'text' },
            ].map(({ k, label, type }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                <input type={type} value={newData[k]} onChange={(e) => setNewData({ ...newData, [k]: e.target.value })}
                  className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors[k] ? 'border-red-400' : 'border-slate-200'}`} />
                {errors[k] && <p className="text-xs text-red-500 mt-0.5">{errors[k]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Unidad</label>
              <select value={newData.unit} onChange={(e) => setNewData({ ...newData, unit: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                {INGREDIENT_UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
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

      {/* Search */}
      <div className="relative max-w-sm">
        <MdSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Buscar insumo…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Insumo', 'Unidad', 'Stock actual', 'Mínimo', 'Costo/u', 'Valor total', 'Estado', 'Proveedor', 'Acciones'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((item) =>
                editId === item.id ? (
                  <tr key={item.id} className="bg-primary-50">
                    <td className="px-4 py-2">
                      <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs" />
                    </td>
                    <td className="px-4 py-2">
                      <select value={editData.unit} onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                        className="border border-slate-200 rounded px-2 py-1 text-xs">
                        {INGREDIENT_UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </td>
                    {['stock', 'minStock', 'cost'].map((k) => (
                      <td key={k} className="px-4 py-2">
                        <input type="number" value={editData[k]} onChange={(e) => setEditData({ ...editData, [k]: e.target.value })}
                          className="w-20 border border-slate-200 rounded px-2 py-1 text-xs" />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2">
                      <input value={editData.supplier} onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                        className="w-32 border border-slate-200 rounded px-2 py-1 text-xs" />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => { updateIngredient(item.id, { ...editData, stock: +editData.stock, minStock: +editData.minStock, cost: +editData.cost }); setEditId(null); }}
                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><MdSave size={14} /></button>
                        <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><MdClose size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${item.stock <= item.minStock ? 'bg-amber-50/40' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500">{item.unit}</td>
                    <td className="px-4 py-3">
                      {adjustId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" value={delta} onChange={(e) => setDelta(e.target.value)} placeholder="±"
                            className="w-16 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none" />
                          <button onClick={() => { adjustStock(item.id, +delta); setAdjustId(null); setDelta(''); }}
                            className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs"><MdSave size={13} /></button>
                          <button onClick={() => { setAdjustId(null); setDelta(''); }}
                            className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs"><MdClose size={13} /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setAdjustId(item.id); setDelta(''); }}
                          className="font-semibold text-slate-700 hover:text-primary-600 transition-colors text-sm">
                          {item.stock} {item.unit}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.minStock} {item.unit}</td>
                    <td className="px-4 py-3 text-slate-600">${item.cost}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">${(item.stock * item.cost).toFixed(2)}</td>
                    <td className="px-4 py-3"><StockBadge stock={item.stock} minStock={item.minStock} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-36">{item.supplier}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditId(item.id); setEditData({ name: item.name, unit: item.unit, stock: item.stock, minStock: item.minStock, cost: item.cost, supplier: item.supplier }); }}
                          className="p-1.5 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"><MdEdit size={14} /></button>
                        <button onClick={() => deleteIngredient(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"><MdDelete size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <p className="text-sm text-slate-600">
            Valor total inventario: <span className="font-bold text-slate-800">
              ${ingredients.reduce((s, i) => s + i.stock * i.cost, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { MdSearch, MdAdd, MdDelete, MdClose, MdSave, MdMenuBook } from 'react-icons/md';
import useStore from '../../store/useStore';

export default function Recipes() {
  const menuItems   = useStore((s) => s.menuItems);
  const ingredients = useStore((s) => s.ingredients);
  const recipes     = useStore((s) => s.recipes);
  const saveRecipe  = useStore((s) => s.saveRecipe);
  const deleteRecipe = useStore((s) => s.deleteRecipe);

  const [search,  setSearch]  = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editRows, setEditRows] = useState([]);

  const filtered = useMemo(() =>
    menuItems.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())),
    [menuItems, search]
  );

  const getRecipe = (menuItemId) => recipes.find((r) => r.menuItemId === menuItemId);

  const openEdit = (item) => {
    const recipe = getRecipe(item.id);
    setEditItem(item);
    setEditRows(recipe ? recipe.ingredients.map((r) => ({ ...r })) : []);
  };

  const addRow = () => setEditRows((r) => [...r, { ingredientId: ingredients[0]?.id ?? 0, qty: '' }]);
  const removeRow = (i) => setEditRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => setEditRows((r) => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const handleSave = () => {
    const valid = editRows.filter((r) => r.ingredientId && +r.qty > 0)
      .map((r) => ({ ingredientId: +r.ingredientId, qty: +r.qty }));
    if (valid.length) saveRecipe(editItem.id, valid);
    else deleteRecipe(editItem.id);
    setEditItem(null);
  };

  const fmtCost = (item) => {
    const recipe = getRecipe(item.id);
    if (!recipe) return null;
    const cost = recipe.ingredients.reduce((s, { ingredientId, qty }) => {
      const ing = ingredients.find((i) => i.id === ingredientId);
      return s + (ing ? ing.cost * qty : 0);
    }, 0);
    return { cost, pct: Math.round((cost / item.price) * 100) };
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdMenuBook className="text-primary-600" size={26} /> Recetas
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Vincula ingredientes a cada platillo para descontar inventario automáticamente
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <MdSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Buscar platillo…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Platillo', 'Categoría', 'Precio', 'Costo receta', 'Food cost real', 'Ingredientes', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((item) => {
              const cf = fmtCost(item);
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{item.category}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">${item.price}</td>
                  <td className="px-4 py-3 text-slate-600">{cf ? `$${cf.cost.toFixed(2)}` : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">
                    {cf ? (
                      <span className={`font-bold ${cf.pct <= 30 ? 'text-emerald-600' : cf.pct <= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cf.pct}%
                      </span>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const r = getRecipe(item.id);
                      return r ? (
                        <span className="text-xs text-emerald-600 font-medium">{r.ingredients.length} ingredientes</span>
                      ) : (
                        <span className="text-xs text-slate-300">Sin receta</span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors">
                      Editar receta
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">Receta — {editItem.name}</h2>
                <p className="text-slate-400 text-xs mt-0.5">Define qué ingredientes y cantidades usa este platillo</p>
              </div>
              <button onClick={() => setEditItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <MdClose size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {editRows.map((row, i) => {
                const ing = ingredients.find((x) => x.id === +row.ingredientId);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <select value={row.ingredientId} onChange={(e) => updateRow(i, 'ingredientId', e.target.value)}
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {ingredients.map((ing) => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
                    </select>
                    <input type="number" value={row.qty} onChange={(e) => updateRow(i, 'qty', e.target.value)}
                      placeholder="Cant."
                      className="w-24 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <span className="text-xs text-slate-400 w-8 shrink-0">{ing?.unit ?? ''}</span>
                    <button onClick={() => removeRow(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <MdDelete size={14} />
                    </button>
                  </div>
                );
              })}
              {editRows.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Sin ingredientes — agrega uno</p>
              )}
            </div>

            <button onClick={addRow} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              <MdAdd size={16} /> Agregar ingrediente
            </button>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <MdSave size={15} /> Guardar receta
              </button>
              <button onClick={() => setEditItem(null)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              {getRecipe(editItem.id) && (
                <button onClick={() => { deleteRecipe(editItem.id); setEditItem(null); }}
                  className="ml-auto px-4 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  Eliminar receta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

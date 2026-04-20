import { useState } from 'react';
import { MdTableRestaurant, MdAdd, MdClose, MdAttachMoney, MdEdit, MdDelete, MdSave, MdPeople } from 'react-icons/md';
import { FaUtensils } from 'react-icons/fa';
import useStore from '../../store/useStore';

const STATUS_CONFIG = {
  libre:   { label: 'Libre',            dot: 'bg-emerald-400', card: 'border-emerald-200 bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-700' },
  ocupada: { label: 'Ocupada',          dot: 'bg-amber-400',   card: 'border-amber-200   bg-amber-50/40',   badge: 'bg-amber-100   text-amber-700'   },
  cuenta:  { label: 'Esperando cuenta', dot: 'bg-red-400 animate-pulse', card: 'border-red-200 bg-red-50/40', badge: 'bg-red-100 text-red-700' },
};

const EMPTY_TABLE = { number: '', capacity: 4 };

const fmtMXN = (n) => '$' + (n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });

export default function Tables() {
  const tables         = useStore((s) => s.tables);
  const kanbanTickets  = useStore((s) => s.kanbanTickets);
  const setTableStatus = useStore((s) => s.setTableStatus);
  const moveTicket     = useStore((s) => s.moveTicket);
  const addTable       = useStore((s) => s.addTable);
  const updateTable    = useStore((s) => s.updateTable);
  const deleteTable    = useStore((s) => s.deleteTable);

  const [selected,  setSelected]  = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY_TABLE);
  const [formErr,   setFormErr]   = useState({});

  const getTicket = (t) => t.ticketId
    ? kanbanTickets.find((k) => k.id === t.ticketId)
    : kanbanTickets.find((k) => k.mesa === t.number && k.status !== 'entregado');

  const libre   = tables.filter((t) => t.status === 'libre').length;
  const ocupada = tables.filter((t) => t.status === 'ocupada').length;
  const cuenta  = tables.filter((t) => t.status === 'cuenta').length;

  const handleCobrar = (table) => {
    const ticket = getTicket(table);
    if (ticket) moveTicket(ticket.id, 'entregado');
    else setTableStatus(table.id, 'libre', null);
    setSelected(null);
  };

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_TABLE);
    setFormErr({});
    setShowForm(true);
  };

  const openEdit = (e, table) => {
    e.stopPropagation();
    setEditId(table.id);
    setForm({ number: table.number, capacity: table.capacity });
    setFormErr({});
    setShowForm(true);
    setSelected(null);
  };

  const validateForm = () => {
    const err = {};
    if (!String(form.number).trim()) err.number = 'Requerido';
    else if (tables.some((t) => String(t.number) === String(form.number).trim() && t.id !== editId))
      err.number = 'Ya existe esa mesa';
    if (!form.capacity || +form.capacity < 1) err.capacity = 'Mín. 1';
    setFormErr(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const data = { number: String(form.number).trim(), capacity: +form.capacity };
    if (editId) updateTable(editId, data);
    else addTable(data);
    setShowForm(false);
  };

  const handleDelete = (e, table) => {
    e.stopPropagation();
    if (table.status !== 'libre') return;
    deleteTable(table.id);
    if (selected?.id === table.id) setSelected(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdTableRestaurant className="text-primary-600" size={26} /> Mesas
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {tables.length} mesas · {libre} libres · {ocupada} ocupadas · {cuenta} esperando cuenta
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className={`w-2 h-2 rounded-full ${cfg.dot.replace('animate-pulse','')}`} />
                {cfg.label}
              </span>
            ))}
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
            <MdAdd size={16} /> Nueva mesa
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            {editId ? 'Editar mesa' : 'Agregar mesa'}
          </h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Número / Nombre</label>
              <input
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="Ej: 13, Terraza 1, Barra"
                className={`text-sm border rounded-lg px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErr.number ? 'border-red-400' : 'border-slate-200'}`}
              />
              {formErr.number && <p className="text-xs text-red-500 mt-0.5">{formErr.number}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                <MdPeople size={13} /> Comensales (capacidad)
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setForm((f) => ({ ...f, capacity: Math.max(1, +f.capacity - 1) }))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center transition-colors">−</button>
                <input
                  type="number" min="1" max="30"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className={`w-16 text-center text-sm font-bold border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErr.capacity ? 'border-red-400' : 'border-slate-200'}`}
                />
                <button onClick={() => setForm((f) => ({ ...f, capacity: Math.min(30, +f.capacity + 1) }))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center transition-colors">+</button>
              </div>
              {formErr.capacity && <p className="text-xs text-red-500 mt-0.5">{formErr.capacity}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <MdSave size={15} /> Guardar
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floor plan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {tables.map((table) => {
          const cfg     = STATUS_CONFIG[table.status];
          const ticket  = getTicket(table);
          const isSel   = selected?.id === table.id;
          const canDel  = table.status === 'libre';

          return (
            <button key={table.id} onClick={() => setSelected(isSel ? null : table)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 group
                ${isSel ? 'border-primary-500 shadow-lg scale-[1.03] bg-primary-50' : `${cfg.card} border hover:shadow-md hover:scale-[1.01]`}`}>

              {/* Status dot */}
              <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${cfg.dot}`} />

              {/* Edit / Delete on hover */}
              {!isSel && (
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => openEdit(e, table)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center shadow-sm">
                    <MdEdit size={12} />
                  </button>
                  {canDel && (
                    <button onClick={(e) => handleDelete(e, table)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 text-red-400 hover:bg-red-50 flex items-center justify-center shadow-sm">
                      <MdDelete size={12} />
                    </button>
                  )}
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 mt-2
                ${isSel ? 'bg-primary-600' : table.status === 'libre' ? 'bg-emerald-500' : table.status === 'ocupada' ? 'bg-amber-500' : 'bg-red-500'}`}>
                <FaUtensils size={14} className="text-white" />
              </div>

              <p className="text-base font-black text-slate-800 leading-none">Mesa {table.number}</p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MdPeople size={11} /> {table.capacity} pers.
              </p>
              <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                {cfg.label}
              </span>
              {ticket && (
                <p className="text-xs text-slate-400 mt-1 truncate">{ticket.id}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Table detail panel */}
      {selected && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Mesa {selected.number}</h2>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <MdPeople size={14} /> {selected.capacity} comensales ·{' '}
                <span className="font-medium">{STATUS_CONFIG[selected.status].label}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => openEdit(e, selected)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <MdEdit size={13} /> Editar
              </button>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <MdClose size={18} />
              </button>
            </div>
          </div>

          {(() => {
            const ticket = getTicket(selected);
            if (!ticket) {
              return (
                <div className="text-center py-6 text-slate-400">
                  <MdTableRestaurant size={36} className="mx-auto mb-2 text-slate-200" />
                  <p className="text-sm">Mesa libre — sin orden activa</p>
                </div>
              );
            }
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Ticket</p>
                    <p className="font-bold text-slate-800">{ticket.id}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Pago</p>
                    <p className="font-bold text-slate-800">{ticket.paymentMethod ?? '—'}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-emerald-600 text-xs mb-1">Total</p>
                    <p className="font-black text-emerald-700">{fmtMXN(ticket.total)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Orden</p>
                  <ul className="space-y-1">
                    {ticket.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="text-slate-300">›</span>{item}
                      </li>
                    ))}
                  </ul>
                  {ticket.notes && (
                    <p className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">⚠ {ticket.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  {selected.status === 'ocupada' && (
                    <button onClick={() => setTableStatus(selected.id, 'cuenta', selected.ticketId)}
                      className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                      Pedir cuenta
                    </button>
                  )}
                  <button onClick={() => handleCobrar(selected)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <MdAttachMoney size={16} /> Cobrar y liberar
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

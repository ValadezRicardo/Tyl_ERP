import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MdAdd, MdClose, MdClearAll, MdRemove, MdAttachMoney, MdPrint } from 'react-icons/md';
import { FaFire, FaUtensils, FaBell, FaCheckCircle, FaClock } from 'react-icons/fa';
import useStore from '../../store/useStore';
import { MENU_CATEGORIES } from '../../data/restaurant';

/* ─── Column config ─────────────────────────────────────────────────── */
const COLUMNS = [
  { id: 'nuevo',     label: 'NUEVOS',    sub: 'Esperando cocina', headerBg: 'bg-sky-600',     glow: 'shadow-sky-900/40',     ring: 'ring-sky-500',     dot: 'bg-sky-400',     emptyIcon: FaUtensils   },
  { id: 'cocina',    label: 'EN COCINA', sub: 'En preparación',   headerBg: 'bg-orange-600',  glow: 'shadow-orange-900/40',  ring: 'ring-orange-500',  dot: 'bg-orange-400',  emptyIcon: FaFire       },
  { id: 'listo',     label: 'LISTO',     sub: 'Para servir',      headerBg: 'bg-emerald-600', glow: 'shadow-emerald-900/40', ring: 'ring-emerald-500', dot: 'bg-emerald-400', emptyIcon: FaBell       },
  { id: 'entregado', label: 'ENTREGADO', sub: 'Completado',       headerBg: 'bg-slate-600',   glow: 'shadow-slate-900/40',   ring: 'ring-slate-500',   dot: 'bg-slate-400',   emptyIcon: FaCheckCircle},
];

const NEXT       = { nuevo: 'cocina', cocina: 'listo', listo: 'entregado' };
const NEXT_LABEL = { nuevo: '🍳  Enviar a cocina', cocina: '🔔  Marcar listo', listo: '✅  Entregar' };
const NEXT_BTN   = { nuevo: 'bg-orange-500 hover:bg-orange-400 text-white', cocina: 'bg-emerald-500 hover:bg-emerald-400 text-white', listo: 'bg-slate-500 hover:bg-slate-400 text-white' };

/* ─── Helpers ────────────────────────────────────────────────────────── */
function elapsedMins(createdAt) { return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000); }
function elapsedLabel(mins)     { return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`; }
function timerClasses(mins, status) {
  if (status === 'entregado') return 'text-slate-500';
  if (mins < 10) return 'text-emerald-400';
  if (mins < 20) return 'text-amber-400';
  return 'text-red-400 animate-pulse';
}
const fmtMXN = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 });

/* ─── Ticket card ─────────────────────────────────────────────────────── */
/* ─── Print comanda ──────────────────────────────────────────────────── */
function PrintModal({ ticket, onClose }) {
  const printRef = useRef(null);
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const w = window.open('', '_blank', 'width=380,height=600');
    w.document.write(`<html><head><title>Comanda ${ticket.id}</title>
      <style>
        body { font-family: monospace; font-size: 13px; padding: 12px; max-width: 320px; }
        h2 { text-align: center; margin: 0 0 4px; font-size: 16px; }
        .sub { text-align: center; font-size: 11px; color: #666; margin-bottom: 8px; }
        hr { border: none; border-top: 1px dashed #000; margin: 6px 0; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .total { font-weight: bold; font-size: 15px; }
        .notes { background: #fffbe6; padding: 4px 6px; border-left: 3px solid #fbbf24; font-size: 11px; margin: 6px 0; }
        .footer { text-align: center; font-size: 10px; color: #999; margin-top: 12px; }
      </style></head><body>${content}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Comanda — {ticket.id}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><MdClose size={18} /></button>
        </div>

        {/* Preview */}
        <div ref={printRef} className="font-mono text-sm border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
          <h2>🍽 TYL Restaurante</h2>
          <p className="sub">COMANDA DE COCINA</p>
          <hr />
          <div className="row"><span>Mesa: <b>{ticket.mesa}</b></span><span>{ticket.id}</span></div>
          <div className="row"><span>Hora:</span><span>{new Date(ticket.createdAt).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</span></div>
          {ticket.priority === 'urgente' && <div style={{color:'red',fontWeight:'bold',textAlign:'center'}}>⚠ URGENTE</div>}
          <hr />
          {ticket.items.map((item, i) => <div key={i} className="row"><span>› {item}</span></div>)}
          {ticket.notes && <div className="notes">⚠ {ticket.notes}</div>}
          <hr />
          <div className="row total"><span>TOTAL</span><span>${(ticket.total ?? 0).toLocaleString('es-MX',{minimumFractionDigits:2})}</span></div>
          <div className="row"><span>Pago:</span><span>{ticket.paymentMethod ?? 'Efectivo'}</span></div>
          <p className="footer">{new Date().toLocaleDateString('es-MX',{dateStyle:'short'})}</p>
        </div>

        <button onClick={handlePrint}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
          <MdPrint size={16} /> Imprimir comanda
        </button>
      </div>
    </div>
  );
}

/* ─── Ticket card ─────────────────────────────────────────────────────── */
function TicketCard({ ticket, onDragStart, onDragEnd }) {
  const moveTicket        = useStore((s) => s.moveTicket);
  const deleteTicket      = useStore((s) => s.deleteTicket);
  const setTicketPriority = useStore((s) => s.setTicketPriority);
  const [, setNow]        = useState(Date.now());
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    if (ticket.status === 'entregado') return;
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, [ticket.status]);

  const mins    = elapsedMins(ticket.createdAt);
  const isLate  = mins >= 20 && ticket.status !== 'entregado';
  const isUrgent = ticket.priority === 'urgente';

  return (
    <>
    <div
      draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
      className={`rounded-xl select-none cursor-grab active:cursor-grabbing transition-all duration-200 overflow-hidden
        ${isUrgent ? 'bg-gradient-to-b from-red-950 to-gray-900 border border-red-700 shadow-lg shadow-red-950/60'
                   : 'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 shadow-md'}
        ${isLate && !isUrgent ? 'border-amber-700/60' : ''}`}
    >
      <div className={`h-1 w-full ${isUrgent ? 'bg-red-500' : ticket.status === 'cocina' ? 'bg-orange-500' : ticket.status === 'listo' ? 'bg-emerald-500' : ticket.status === 'entregado' ? 'bg-slate-500' : 'bg-sky-500'}`} />

      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${isUrgent ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}>
            {ticket.mesa}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest leading-none mb-0.5">Mesa</p>
            <p className="text-white font-bold text-sm leading-none">{ticket.id}</p>
            {isUrgent && <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold mt-0.5"><FaFire size={9} /> URGENTE</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`flex items-center gap-1 text-sm font-bold tabular-nums ${timerClasses(mins, ticket.status)}`}>
            <FaClock size={11} />{elapsedLabel(mins)}
          </span>
          <button onClick={() => deleteTicket(ticket.id)} className="text-gray-600 hover:text-red-400 transition-colors p-0.5">
            <MdClose size={14} />
          </button>
        </div>
      </div>

      <div className="mx-4 border-t border-dashed border-gray-700 mb-2" />

      <ul className="px-4 pb-2 space-y-1">
        {ticket.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-gray-600 mt-0.5 shrink-0">›</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {ticket.notes && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-amber-950/60 border border-amber-800/50">
          <p className="text-xs text-amber-300 font-medium">⚠ {ticket.notes}</p>
        </div>
      )}

      {ticket.total > 0 && (
        <div className="mx-4 mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-700/50">
          <span className="text-xs text-gray-500 font-medium">
            {ticket.paymentMethod ?? 'Efectivo'}
          </span>
          <span className="text-emerald-400 font-black text-sm">{fmtMXN(ticket.total)}</span>
        </div>
      )}

      <div className="mx-4 border-t border-dashed border-gray-700 mb-2" />

      <div className="px-3 pb-3 space-y-2">
        {NEXT[ticket.status] && (
          <button onClick={() => moveTicket(ticket.id, NEXT[ticket.status])}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${NEXT_BTN[ticket.status]}`}>
            {NEXT_LABEL[ticket.status]}
          </button>
        )}
        <div className="flex gap-2">
          {ticket.priority === 'normal' ? (
            <button onClick={() => setTicketPriority(ticket.id, 'urgente')}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400 transition-colors">
              🔥 Urgente
            </button>
          ) : (
            <button onClick={() => setTicketPriority(ticket.id, 'normal')}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-red-700 text-red-400 hover:bg-red-950 transition-colors">
              Quitar urgente
            </button>
          )}
          <button onClick={() => setShowPrint(true)}
            className="p-1.5 rounded-lg border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors">
            <MdPrint size={13} />
          </button>
        </div>
      </div>
    </div>
    {showPrint && <PrintModal ticket={ticket} onClose={() => setShowPrint(false)} />}
    </>
  );
}

/* ─── New ticket modal ───────────────────────────────────────────────── */
function NewTicketModal({ onClose }) {
  const addTicket  = useStore((s) => s.addTicket);
  const menuItems  = useStore((s) => s.menuItems);
  const tables     = useStore((s) => s.tables);

  const availableMenu = useMemo(() => menuItems.filter((m) => m.available), [menuItems]);
  const allCats = useMemo(() => {
    const cats = MENU_CATEGORIES.filter((c) => availableMenu.some((m) => m.category === c));
    return ['Todos', ...cats];
  }, [availableMenu]);

  const libreTables = useMemo(() => tables.filter((t) => t.status === 'libre'), [tables]);

  const [mesaMode,  setMesaMode]  = useState('mesa');   // 'mesa' | 'otro'
  const [mesa,      setMesa]      = useState('');
  const [otroTexto, setOtroTexto] = useState('');
  const [notes,     setNotes]     = useState('');
  const [priority,  setPriority]  = useState('normal');
  const [payment,   setPayment]   = useState('Efectivo');
  const [activeCat, setActiveCat] = useState('Todos');
  const [cart,      setCart]      = useState({});
  const [errors,    setErrors]    = useState({});

  const mesaFinal = mesaMode === 'mesa' ? mesa : otroTexto;

  const visibleItems = useMemo(() =>
    activeCat === 'Todos' ? availableMenu : availableMenu.filter((m) => m.category === activeCat),
    [availableMenu, activeCat]
  );

  const addToCart = (item) => setCart((c) => ({ ...c, [item.id]: { ...item, qty: (c[item.id]?.qty ?? 0) + 1 } }));
  const decCart   = (id)   => setCart((c) => {
    if (!c[id]) return c;
    if (c[id].qty <= 1) { const n = { ...c }; delete n[id]; return n; }
    return { ...c, [id]: { ...c[id], qty: c[id].qty - 1 } };
  });

  const cartItems  = useMemo(() => Object.values(cart).filter((i) => i.qty > 0), [cart]);
  const total      = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.qty, 0), [cartItems]);
  const cartCount  = useMemo(() => cartItems.reduce((s, i) => s + i.qty, 0), [cartItems]);

  const validate = () => {
    const e = {};
    if (!mesaFinal.trim())      e.mesa = 'Selecciona una mesa o escribe la ubicación';
    if (cartItems.length === 0) e.cart = 'Agrega al menos un platillo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const itemStrings = cartItems.map((i) => `${i.name} x${i.qty}`);
    addTicket({
      mesa: mesaFinal, items: itemStrings, notes, priority, total,
      paymentMethod: payment,
      orderItems: cartItems.map(({ id: menuItemId, name, qty, price }) => ({ menuItemId, name, qty, price })),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Nueva orden</h2>
            <p className="text-gray-500 text-xs mt-0.5">Selecciona los platillos del menú</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
            <MdClose size={18} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">

          {/* ── Left: menu picker ── */}
          <div className="flex-1 flex flex-col border-r border-gray-800 min-w-0">

            {/* Mesa + notas */}
            <div className="px-5 pt-4 pb-3 space-y-3 shrink-0">

              {/* Mesa selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mesa / Ubicación</label>
                  <div className="flex gap-1">
                    {[['mesa','🪑 Mesas'],['otro','✏️ Otro']].map(([mode, label]) => (
                      <button key={mode} onClick={() => { setMesaMode(mode); setMesa(''); setOtroTexto(''); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors
                          ${mesaMode === mode ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {mesaMode === 'mesa' ? (
                  <>
                    {libreTables.length === 0 ? (
                      <p className="text-gray-500 text-xs py-2">No hay mesas libres disponibles</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5">
                        {libreTables.map((t) => (
                          <button key={t.id} onClick={() => setMesa(t.number)}
                            className={`py-2 rounded-xl text-sm font-black border transition-all
                              ${mesa === t.number
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-600 hover:text-white'}`}>
                            <span className="block leading-none">{t.number}</span>
                            <span className="text-xs font-normal opacity-60">{t.capacity}p</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input type="text" placeholder="Ej: Para llevar, Domicilio, Terraza…"
                    value={otroTexto} onChange={(e) => setOtroTexto(e.target.value)}
                    className="w-full bg-gray-800 text-white placeholder-gray-600 text-sm border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                )}
                {errors.mesa && <p className="text-xs text-red-400 mt-1">{errors.mesa}</p>}
              </div>

              <div className="flex gap-2 justify-end">
                  {['normal', 'urgente'].map((p) => (
                    <button key={p} onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${priority === p
                        ? p === 'urgente' ? 'bg-red-600 border-red-600 text-white' : 'bg-sky-600 border-sky-600 text-white'
                        : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}>
                      {p === 'urgente' ? '🔥 Urgente' : 'Normal'}
                    </button>
                  ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notas especiales</label>
                <input type="text" placeholder="Alergias, modificaciones, sin X…"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-600 text-sm border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Método de pago</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Efectivo','Tarjeta','Transferencia','Uber','Rappi','Didi'].map((m) => (
                    <button key={m} onClick={() => setPayment(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                        ${payment === m ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category tabs */}
            <div className="px-5 pb-2 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {allCats.map((cat) => (
                  <button key={cat} onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors shrink-0
                      ${activeCat === cat ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu items grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              {errors.cart && <p className="text-xs text-red-400 mb-2">{errors.cart}</p>}
              {visibleItems.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">Sin platillos disponibles en esta categoría</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {visibleItems.map((item) => {
                    const qty = cart[item.id]?.qty ?? 0;
                    return (
                      <button key={item.id} onClick={() => addToCart(item)}
                        className={`text-left p-3 rounded-xl border transition-all
                          ${qty > 0 ? 'bg-orange-950/40 border-orange-700' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 truncate">{item.category}</p>
                          </div>
                          {qty > 0 && (
                            <span className="shrink-0 bg-orange-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                              {qty}
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-400 font-bold text-sm mt-1">{fmtMXN(item.price)}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: cart ── */}
          <div className="w-64 flex flex-col shrink-0">
            <div className="px-4 pt-4 pb-2 shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Orden {cartCount > 0 && <span className="text-orange-400">({cartCount} items)</span>}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-2">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-700">
                  <FaUtensils size={22} className="mb-2" />
                  <p className="text-xs text-center">Selecciona platillos del menú</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-xl p-3">
                    <p className="text-white text-xs font-semibold leading-tight">{item.name}</p>
                    <p className="text-gray-500 text-xs">{fmtMXN(item.price)} c/u</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => decCart(item.id)}
                          className="w-6 h-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors">
                          <MdRemove size={12} />
                        </button>
                        <span className="text-white font-bold text-sm tabular-nums">{item.qty}</span>
                        <button onClick={() => addToCart(item)}
                          className="w-6 h-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors">
                          <MdAdd size={12} />
                        </button>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">{fmtMXN(item.price * item.qty)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total + submit */}
            <div className="px-4 pt-3 pb-4 border-t border-gray-800 space-y-3 shrink-0">
              <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-gray-800">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                  <MdAttachMoney size={16} className="text-emerald-400" /> Total
                </span>
                <span className="text-emerald-400 font-black text-lg">{fmtMXN(total)}</span>
              </div>
              <button onClick={submit}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors">
                Crear orden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main board ─────────────────────────────────────────────────────── */
export default function Kanban() {
  const tickets        = useStore((s) => s.kanbanTickets);
  const moveTicket     = useStore((s) => s.moveTicket);
  const clearDelivered = useStore((s) => s.clearDelivered);

  const [showModal, setShowModal] = useState(false);
  const [, setTick]               = useState(0);
  const dragId                    = useRef(null);
  const [dragOver, setDragOver]   = useState(null);
  const [clock, setClock]         = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => { setTick((t) => t + 1); setClock(new Date()); }, 30000);
    return () => clearInterval(id);
  }, []);

  const byStatus    = useCallback((status) => tickets.filter((t) => t.status === status), [tickets]);
  const onDragStart = (id) => () => { dragId.current = id; };
  const onDragEnd   = ()     => { dragId.current = null; setDragOver(null); };
  const onDragOver  = (col)  => (e) => { e.preventDefault(); setDragOver(col); };
  const onDrop      = (col)  => (e) => { e.preventDefault(); if (dragId.current) moveTicket(dragId.current, col); setDragOver(null); };

  const active         = tickets.filter((t) => t.status !== 'entregado').length;
  const urgentCount    = tickets.filter((t) => t.priority === 'urgente' && t.status !== 'entregado').length;
  const deliveredCount = tickets.filter((t) => t.status === 'entregado').length;

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <FaUtensils size={14} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none tracking-wide">COCINA</h1>
              <p className="text-gray-500 text-xs leading-none mt-0.5">Kitchen Display</p>
            </div>
          </div>
          <div className="h-5 w-px bg-gray-700" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              <span className="text-white font-bold text-sm">{active}</span> activos
            </span>
            {urgentCount > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950 border border-red-800 text-red-400 text-xs font-bold animate-pulse">
                <FaFire size={10} /> {urgentCount} URGENTE{urgentCount > 1 ? 'S' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm font-mono">
            {clock.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {deliveredCount > 0 && (
            <button onClick={clearDelivered}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors">
              <MdClearAll size={14} /> Limpiar ({deliveredCount})
            </button>
          )}
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold transition-colors">
            <MdAdd size={16} /> Nueva orden
          </button>
        </div>
      </div>

      {/* ── Board ── */}
      <div className="flex-1 overflow-x-auto p-5">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colTickets = byStatus(col.id);
            const isOver     = dragOver === col.id;
            const EmptyIcon  = col.emptyIcon;

            return (
              <div key={col.id}
                onDragOver={onDragOver(col.id)} onDrop={onDrop(col.id)}
                className={`flex flex-col w-72 rounded-xl bg-gray-900 border overflow-hidden transition-all duration-150
                  ${isOver ? `ring-2 ${col.ring} border-transparent` : 'border-gray-800'}`}>
                <div className={`${col.headerBg} px-4 py-3 flex items-center justify-between shrink-0`}>
                  <div>
                    <p className="text-white font-black text-sm tracking-widest leading-none">{col.label}</p>
                    <p className="text-white/60 text-xs mt-0.5">{col.sub}</p>
                  </div>
                  <span className="bg-black/30 text-white text-sm font-black rounded-full w-7 h-7 flex items-center justify-center">
                    {colTickets.length}
                  </span>
                </div>

                <div className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-40 transition-colors ${isOver ? 'bg-gray-800/40' : ''}`}>
                  {colTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-700">
                      <EmptyIcon size={28} className="mb-2" />
                      <p className="text-xs uppercase tracking-wider">Sin órdenes</p>
                    </div>
                  ) : (
                    colTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket}
                        onDragStart={onDragStart(ticket.id)} onDragEnd={onDragEnd} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <NewTicketModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

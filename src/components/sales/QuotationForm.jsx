import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  MdSearch, MdAdd, MdDelete, MdPictureAsPdf, MdShoppingCart,
  MdCheckCircle, MdReceipt,
} from 'react-icons/md';
import useStore from '../../store/useStore';
import iconImage from '../../assets/Logolivana.png';

const IVA = 0.16;

function OrderConfirmedBanner({ order, onClose }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
      <MdCheckCircle size={28} className="text-emerald-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-emerald-800">Pedido {order.id} confirmado</p>
        <p className="text-sm text-emerald-600 mt-0.5">
          {order.items.length} producto(s) · Total: ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} · {order.paymentMethod}
        </p>
      </div>
      <button onClick={onClose} className="text-emerald-400 hover:text-emerald-600">✕</button>
    </div>
  );
}

export default function QuotationForm() {
  const catalog     = useStore((s) => s.catalog);
  const inventory   = useStore((s) => s.inventory);
  const orders      = useStore((s) => s.orders);
  const addOrder    = useStore((s) => s.addOrder);
  const deleteOrder = useStore((s) => s.deleteOrder);

  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState(null);
  const [qty,         setQty]         = useState(1);
  const [items,       setItems]       = useState([]);
  const [payment,     setPayment]     = useState('');
  const [lastOrder,   setLastOrder]   = useState(null);
  const [errors,      setErrors]      = useState({});

  const availableProducts = useMemo(
    () =>
      catalog.map((p) => {
        const inv = inventory.find((i) => i.productId === p.id);
        return { ...p, free: inv ? inv.total - inv.sold - inv.inTransit : 0 };
      }).filter((p) => p.free > 0),
    [catalog, inventory]
  );

  const filtered = useMemo(
    () => availableProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [availableProducts, search]
  );

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.subtotal, 0), [items]);
  const iva      = subtotal * IVA;
  const total    = subtotal + iva;

  const addItem = () => {
    if (!selected) return;
    const q = Math.max(1, parseInt(qty) || 1);
    const existing = items.findIndex((i) => i.productId === selected.id);
    if (existing >= 0) {
      setItems((prev) => prev.map((item, idx) =>
        idx === existing
          ? { ...item, qty: item.qty + q, subtotal: (item.qty + q) * item.unitPrice }
          : item
      ));
    } else {
      setItems((prev) => [...prev, { productId: selected.id, name: selected.name, unitPrice: selected.salePrice, qty: q, subtotal: selected.salePrice * q }]);
    }
    setSelected(null);
    setSearch('');
    setQty(1);
  };

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (items.length === 0) e.items = 'Agrega al menos un producto';
    if (!payment)           e.payment = 'Selecciona método de pago';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirmOrder = () => {
    if (!validate()) return;
    const order = { items, subtotal, iva, total, paymentMethod: payment };
    addOrder(order);
    const orderId = `ORD-${String(orders.length + 1).padStart(4, '0')}`;
    setLastOrder({ ...order, id: orderId });
    setItems([]);
    setPayment('');
    setErrors({});
  };

  const generatePDF = () => {
    if (items.length === 0) { alert('Agrega productos antes de generar el PDF'); return; }
    const doc = new jsPDF();
    doc.addImage(iconImage, 'PNG', 10, 8, 15, 15);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('Cotización de Productos', 105, 18, null, null, 'center');
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 170, 12);
    doc.setDrawColor(200, 200, 210);
    doc.line(10, 28, 200, 28);

    let y = 40;
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Producto', 10, y); doc.text('Cant.', 120, y); doc.text('Precio U.', 148, y); doc.text('Subtotal', 178, y);
    doc.line(10, y + 3, 200, y + 3);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);

    items.forEach((item) => {
      y += 10;
      const lines = doc.splitTextToSize(item.name, 100);
      doc.text(lines, 10, y);
      doc.text(String(item.qty), 122, y, { align: 'center' });
      doc.text(`$${item.unitPrice.toFixed(2)}`, 148, y, { align: 'right' });
      doc.text(`$${item.subtotal.toFixed(2)}`, 198, y, { align: 'right' });
      if (lines.length > 1) y += (lines.length - 1) * 5;
    });

    y += 14;
    doc.setFont('helvetica', 'bold');
    doc.text(`Subtotal: $${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 198, y, { align: 'right' });
    doc.text(`IVA (16%): $${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 198, y + 8, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`Total: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 198, y + 18, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text('Gracias por su preferencia — Livana MTY', 105, 285, null, null, 'center');
    doc.save('cotizacion.pdf');
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MdReceipt className="text-primary-600" size={26} />
          Cotización / Ventas
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Crea cotizaciones y registra pedidos</p>
      </div>

      {lastOrder && <OrderConfirmedBanner order={lastOrder} onClose={() => setLastOrder(null)} />}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — product search */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Agregar producto</h2>

            <div className="relative mb-3">
              <MdSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Buscar producto del catálogo…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {search && filtered.length > 0 && (
              <ul className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50 max-h-52 overflow-y-auto mb-3">
                {filtered.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => { setSelected(p); setSearch(p.name); }}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-primary-50 transition-colors text-sm ${selected?.id === p.id ? 'bg-primary-50 text-primary-700' : 'text-slate-700'}`}
                  >
                    <span>{p.name}</span>
                    <span className="font-semibold text-slate-500">${p.salePrice} <span className="text-xs font-normal text-slate-400">({p.free} disp.)</span></span>
                  </li>
                ))}
              </ul>
            )}

            {selected && (
              <div className="flex items-center gap-3">
                <div className="flex-1 text-sm font-medium text-slate-700 truncate">{selected.name}</div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500">Cantidad</label>
                  <input
                    type="number" min={1} max={selected.free} value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                    className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button onClick={addItem} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                  <MdAdd size={16} /> Agregar
                </button>
              </div>
            )}
            {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
          </div>

          {/* Items table */}
          {items.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Producto', 'P. Unitario', 'Cantidad', 'Subtotal', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-600">{item.qty}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">${item.subtotal.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => removeItem(idx)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                          <MdDelete size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right — summary + actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-600"><span>IVA (16%)</span><span>${iva.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-slate-800 text-base border-t border-slate-100 pt-2 mt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Método de pago</label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.payment ? 'border-red-400' : 'border-slate-200'}`}
              >
                <option value="">Seleccionar…</option>
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
              </select>
              {errors.payment && <p className="text-xs text-red-500 mt-1">{errors.payment}</p>}
            </div>

            <div className="mt-4 space-y-2">
              <button onClick={confirmOrder} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium">
                <MdShoppingCart size={16} /> Confirmar pedido
              </button>
              <button onClick={generatePDF} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <MdPictureAsPdf size={16} /> Generar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders history */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-700">Historial de pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Pedido', 'Fecha', 'Productos', 'M. Pago', 'Subtotal', 'IVA', 'Total', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{o.id}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(o.date).toLocaleDateString('es-MX')}</td>
                    <td className="px-4 py-3 text-slate-600">{o.items.length} prod.</td>
                    <td className="px-4 py-3 text-slate-600">{o.paymentMethod}</td>
                    <td className="px-4 py-3 text-slate-600">${o.subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-600">${o.iva.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteOrder(o.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                        <MdDelete size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
            <p className="text-sm font-bold text-slate-700">
              Total ventas: ${orders.reduce((s, o) => s + o.total, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

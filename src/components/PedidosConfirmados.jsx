// src/components/PedidosConfirmados.jsx
import React, { useState, useEffect } from 'react';
import './PedidosConfirmados.css';

const PedidosConfirmados = ({ pedidos }) => {
  const [granTotal, setGranTotal] = useState(0);

  useEffect(() => {
    // Calcular el gran total cada vez que se actualice la lista de pedidos
    const total = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);
    setGranTotal(total);
  }, [pedidos]);

  return (
    <div className="pedidos-confirmados">
      <h2>Pedidos Confirmados</h2>
      <table className="pedidos-table">
        <thead>
          <tr>
            <th>Número de Pedido</th>
            <th>Productos</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Método de Pago</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.orderNumber}>
              <td>{pedido.orderNumber}</td>
              <td>
                <ul>
                  {pedido.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - Cantidad: {item.quantity}, Precio: ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${pedido.subtotal.toFixed(2)}</td>
              <td>${pedido.iva.toFixed(2)}</td>
              <td>${pedido.total.toFixed(2)}</td>
              <td>{pedido.paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="gran-total">
        <label>Gran Total: ${granTotal.toFixed(2)}</label>
      </div>
    </div>
  );
};

export default PedidosConfirmados;

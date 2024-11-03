// src/components/Pedido.jsx
import React, { useState, useMemo } from 'react';
import './Pedido.css';

const Pedido = ({ items, subtotal, iva, total, onConfirmOrder }) => {
  const orderNumber = useMemo(() => Math.floor(100000 + Math.random() * 900000), []);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  const confirmOrder = () => {
    if (!isOrderConfirmed) {
      const confirmedOrder = {
        orderNumber,
        items,
        subtotal,
        iva,
        total,
        paymentMethod,
      };
      setIsOrderConfirmed(true);
      onConfirmOrder(confirmedOrder);
      alert(`Pedido #${orderNumber} confirmado.`);
    }
  };

  return (
    <div className="pedido">
      <h2 className='txtBlack'>Pedido #{orderNumber}</h2>
      <div className="pedido-details">
        <h3 className='txtBlack'>Productos</h3>
        <ul className="pedido-items">
          {items.map((item, index) => (
            <li key={index} className="pedido-item txtBlack">
              <span> <strong>{item.name}</strong></span>
              <span> Cantidad: <strong> {item.quantity}</strong></span>
              <span> Precio unitario: <strong> ${item.price.toFixed(2)}</strong></span>
              <span> Total: <strong>${(item.price * item.quantity).toFixed(2)}</strong></span>
            </li>
          ))}
        </ul>
        <div className="pedido-summary">
          <p className='txtBlack'>Subtotal: ${subtotal.toFixed(2)}</p>
          <p className='txtBlack'>IVA: ${iva.toFixed(2)}</p>
          <p className='txtBlack'>Total: ${total.toFixed(2)}</p>
        </div>
      </div>

      {!isOrderConfirmed && (
        <>
          <div className="payment-methods">
            <button onClick={() => handlePaymentMethod('transfer')}>Transferencia</button>
            <button onClick={() => handlePaymentMethod('cash')}>Efectivo</button>
          </div>
          <button className="btnConfirm" onClick={confirmOrder}>Confirmar Pedido</button>
        </>
      )}

      {isOrderConfirmed && (
        <div className="confirmation-message">
          <p className='txtBlack'>Pedido confirmado con el número #{orderNumber}</p>
          <p className='txtBlack'>Método de pago: {paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'}</p>
          <p className='txtBlack'>Total a pagar: ${total.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Pedido;

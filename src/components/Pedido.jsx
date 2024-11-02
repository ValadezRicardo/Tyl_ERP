// src/components/Pedido.jsx
import React, { useState } from 'react';
import './Pedido.css';

const Pedido = ({ items, subtotal, iva, total }) => {
  const orderNumber = Math.floor(100000 + Math.random() * 900000); // Genera un número de folio único
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handlePaymentClick = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setOrderConfirmed(true);
    setShowPaymentOptions(false);
  };

  const confirmPayment = () => {
    alert(`Pedido #${orderNumber} confirmado.
    Total a pagar: $${total.toFixed(2)}
    Método de pago: ${paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'}`);
  };

  return (
    <div className="pedido">
      <h2 className='txtBlack'>Pedido #{orderNumber}</h2>
      <div className="pedido-details">
        <h3 className='txtBlack'>Productos</h3>
        <ul>
          {items.map((item, index) => (
            <li className='txtBlack' key={index}>
              {item.name} - Cantidad: {item.quantity} - Subtotal: ${item.subtotal.toFixed(2)}
            </li>
          ))}
        </ul>
        <p className='txtBlack'>Subtotal: ${subtotal.toFixed(2)}</p>
        <p className='txtBlack'>IVA: ${iva.toFixed(2)}</p>
        <p className='txtBlack'><strong>Total: ${total.toFixed(2)}</strong></p>
      </div>

      {!showPaymentOptions && !orderConfirmed && (
        <button className="btn-pay" onClick={handlePaymentClick}>Pagar</button>
      )}

      {/* Opciones de método de pago */}
      {showPaymentOptions && (
        <div className="payment-options">
          <p className='txtBlack'>Total a pagar: ${total.toFixed(2)}</p>
          <p className='txtBlack'>Selecciona el método de pago:</p>
          <button onClick={() => handlePaymentMethodChange('transfer')}>Transferencia</button>
          <button onClick={() => handlePaymentMethodChange('cash')}>Efectivo</button>
        </div>
      )}

      {/* Confirmación del pago */}
      {orderConfirmed && (
        <div className="payment-confirmation">
          <p className='txtBlack'>Total pagado: ${total.toFixed(2)}</p>
          <p className='txtBlack'>Método de pago: {paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'}</p>
          <button className='btnConfirm' onClick={confirmPayment}>Confirmar Pedido</button>
        </div>
      )}
    </div>
  );
};

export default Pedido;

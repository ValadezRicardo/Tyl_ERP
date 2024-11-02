// src/components/SupplyChainCard.jsx
import React from 'react';
import { FaTruck } from 'react-icons/fa';

const SupplyChainCard = () => {
  return (
    <div className="card">
      <h2>Cadena de Suministro</h2>
      <FaTruck size={40} color="#2196F3" />
      <p>Órdenes en Proceso: 25</p>
      <p>Órdenes Retrasadas: 3</p>
    </div>
  );
};

export default SupplyChainCard;

// src/components/SalesCard.jsx
import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const SalesCard = () => {
  return (
    <div className="card">
      <h2>Ventas</h2>
      <FaChartLine size={40} color="#4CAF50" />
      <p>Total de Ventas: $1,200,000</p>
      <p>Meta Alcanzada: 85%</p>
    </div>
  );
};

export default SalesCard;

// src/components/InventoryCard.jsx
import React from 'react';
import { FaWarehouse } from 'react-icons/fa';

const InventoryCard = () => {
  return (
    <div className="card">
      <h2>Inventarios</h2>
      <FaWarehouse size={40} color="#FF9800" />
      <p>Stock Total: 8,000 unidades</p>
      <p>Productos Críticos: 15</p>
    </div>
  );
};

export default InventoryCard;

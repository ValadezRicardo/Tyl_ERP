// src/components/TopProductsCard.jsx
import React from 'react';
import { FaCrown } from 'react-icons/fa';

const TopProductsCard = () => {
  return (
    <div className="card">
      <h2>Productos Top</h2>
      <FaCrown size={40} color="#FF5722" />
      <ul>
        <li>Producto A - 1,000 unidades</li>
        <li>Producto B - 800 unidades</li>
        <li>Producto C - 750 unidades</li>
      </ul>
    </div>
  );
};

export default TopProductsCard;

// src/components/TopCustomersCard.jsx
import React from 'react';
import { FaUsers } from 'react-icons/fa';

const TopCustomersCard = () => {
  return (
    <div className="card">
      <h2>Clientes Top</h2>
      <FaUsers size={40} color="#9C27B0" />
      <ul>
        <li>Cliente A - $300,000</li>
        <li>Cliente B - $250,000</li>
        <li>Cliente C - $200,000</li>
      </ul>
    </div>
  );
};

export default TopCustomersCard;

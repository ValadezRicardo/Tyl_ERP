// src/components/Dashboard.jsx
import React from 'react';
import SalesCard from './SalesCard';
import SupplyChainCard from './SupplyChainCard';
import InventoryCard from './InventoryCard';
import TopCustomersCard from './TopCustomersCard';
import TopProductsCard from './TopProductsCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard Organizacional</h1>
      <div className="dashboard-row">
        <SalesCard />
        <SupplyChainCard />
      </div>
      <div className="dashboard-row">
        <InventoryCard />
        <TopCustomersCard />
        <TopProductsCard />
      </div>
    </div>
  );
};

export default Dashboard;

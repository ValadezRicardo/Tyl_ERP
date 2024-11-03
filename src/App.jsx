import './App.css';
import Menu from './components/Menu';
// import Contacto from './components/Contacto';
// import Dashboard from './components/Dashboard';
import QuotationForm from './components/QuotationForm';
import React, { useState } from 'react';
import Pedido from './components/Pedido';
import PedidosConfirmados from './components/PedidosConfirmados';
import Products from './components/Products';

function App() {
  // const [pedidosConfirmados, setPedidosConfirmados] = useState([]);

  // const handleConfirmOrder = (newOrder) => {
  //   // Agregar el nuevo pedido a la lista de pedidos confirmados
  //   setPedidosConfirmados((prevOrders) => [...prevOrders, newOrder]);
  // };

  return (
    <>
      <Menu/>
      <Products/>
      {/* <QuotationForm/> */}
      {/* <Pedido onConfirmOrder={handleConfirmOrder} />
      <PedidosConfirmados pedidos={pedidosConfirmados} /> */}
      {/* <Contacto/> */}
      {/* <Dashboard/> */}
    </>
  )
}

export default App

// src/components/Catalogo.jsx
import React, { useState } from "react";
import "./Products.css";

const Products = ({ onAddToCart }) => {
  const [productos] = useState([
    {
      id: 1,
      name: "Producto 1",
      description: "Descripción breve del producto 1.",
      price: 29.99,
      image: "/images/producto1.jpg",
    },
    {
      id: 2,
      name: "Producto 2",
      description: "Descripción breve del producto 2.",
      price: 49.99,
      image: "/images/producto2.jpg",
    },
    {
      id: 3,
      name: "Producto 3",
      description: "Descripción breve del producto 3.",
      price: 19.99,
      image: "/images/producto3.jpg",
    },
    {
      id: 4,
      name: "Producto 4",
      description: "Descripción breve del producto 4.",
      price: 19.99,
      image: "/images/producto3.jpg",
    },
    {
      id: 5,
      name: "Producto 5",
      description: "Descripción breve del producto 5.",
      price: 19.99,
      image: "/images/producto3.jpg",
    },
    {
      id: 6,
      name: "Producto 6",
      description: "Descripción breve del producto 6.",
      price: 19.99,
      image: "/images/producto3.jpg",
    },
    // Agrega más productos aquí
  ]);

  return (
    <div className="catalogo">
      <h2>Catálogo de Productos</h2>
      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <img
              src={producto.image}
              alt={producto.name}
              className="producto-imagen"
            />
            <h3>{producto.name}</h3>
            <p>{producto.description}</p>
            <p className="producto-precio">${producto.price.toFixed(2)}</p>
            <button className="btnProd" onClick={() => onAddToCart(producto)}>
              Agregar a la cotización
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

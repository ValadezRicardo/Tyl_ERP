import React, { useState } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cadena Van Cleef",
      total: 0,
      sold: 2,
      inTransit: 3,
      free: 3,
      location: "Almacén 1",
    },
    {
      id: 2,
      name: "Cadena Torzal",
      total: 8,
      sold: 5,
      inTransit: 7,
      free: 7,
      location: "Almacén 2",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    total: 0,
    location: "",
  });

  const [inTransitValue, setInTransitValue] = useState({});
  const [editTotalId, setEditTotalId] = useState(null); // Estado para controlar la edición del total

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleInTransitChange = (id, value) => {
    setInTransitValue({ ...inTransitValue, [id]: value });
  };

  const addProduct = () => {
    const total = parseInt(newProduct.total, 10);
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: newProduct.name,
        total,
        sold: 0,
        inTransit: 0,
        free: total,
        location: newProduct.location,
      },
    ]);
    setNewProduct({ name: "", total: 0, location: "" });
  };

  const updateInTransit = (id) => {
    const value = parseInt(inTransitValue[id], 10) || 0;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              inTransit: product.inTransit + value,
              total: product.total + value,
              free: product.free + value,
            }
          : product
      )
    );

    setInTransitValue({ ...inTransitValue, [id]: "" });
  };

  // Función para activar el modo de edición del total
  const editTotal = (id) => {
    setEditTotalId(id);
  };

  // Función para actualizar el total de un producto
  const saveTotal = (id, newTotal) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              total: newTotal,
              free: newTotal - product.sold - product.inTransit, // Recalcula la cantidad libre
            }
          : product
      )
    );
    setEditTotalId(null); // Cierra el campo de edición
  };

  return (
    <div>
      <h1>Gestión de Inventario</h1>

      {/* Formulario para agregar un producto */}
      <div>
        <h2>Agregar Producto</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre del Producto"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="total"
          placeholder="Cantidad Total"
          value={newProduct.total}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Ubicación"
          value={newProduct.location}
          onChange={handleInputChange}
        />
        <button className='btn' onClick={addProduct}>Agregar</button>
      </div>

      {/* Tabla de inventario */}
      <div>
        <h2>Lista de Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Total</th>
              <th>Vendido</th>
              <th>En Tránsito</th>
              <th>Libre</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className='txtBlack'>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  {editTotalId === product.id ? (
                    <div>
                      <input
                        type="number"
                        defaultValue={product.total}
                        onChange={(e) => saveTotal(product.id, e.target.value)}
                      />
                      <button
                        className="btn"
                        onClick={() => saveTotal(product.id, product.total)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    product.total
                  )}
                </td>
                <td>{product.sold}</td>
                <td>{product.inTransit}</td>
                <td>{product.free}</td>
                <td>{product.location}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Cantidad en Tránsito"
                    value={inTransitValue[product.id] || ""}
                    onChange={(e) => handleInTransitChange(product.id, e.target.value)}
                  />
                  <button className='btn' onClick={() => updateInTransit(product.id)}>
                    Añadir En Tránsito
                  </button>
                  <button className='btn' onClick={() => editTotal(product.id)}>
                    Modificar Total
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

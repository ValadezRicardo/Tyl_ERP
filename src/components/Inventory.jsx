import React, { useState } from "react";
import * as XLSX from "xlsx"; // Biblioteca para manejar Excel
import "./Inventory.css";

const Inventory = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Earcuff Gota Zirconia",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 85,
    },
    {
      id: 2,
      name: "Earcuff Hojas Colores",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 40,
      salePrice: 95,
    },
    {
      id: 3,
      name: "Earcuff Avion Perla",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 40,
      salePrice: 95,
    },
    {
      id: 4,
      name: "Earcuff Moño Zirconia",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 40,
      salePrice: 95,
    },
    {
      id: 5,
      name: "Earcuff Rayo Zirconia",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 85,
    },
    {
      id: 6,
      name: "Anillo Jaguar",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 75,
      salePrice: 325,
    },
    {
      id: 7,
      name: "Anillo Corrugado",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 8,
      name: "Anillo Tortuga Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 9,
      name: "Anillo Cadena Perla",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 10,
      name: "Broquel Circulo Corrugado",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 11,
      name: "Anillo Palma Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 12,
      name: "Brazalete Inspiración Cartier",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 120,
      salePrice: 515,
    },
    {
      id: 13,
      name: "Anillo Piedra Verde",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 200,
      salePrice: 430,
    },
    {
      id: 14,
      name: "Anillo Zirconia Perla Celeste",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 15,
      name: "Huggies Cuadrado Zirconia",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 16,
      name: "Anillo Concha Perla",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 17,
      name: "Anillo Cangrejo Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 18,
      name: "Anillo Inspiración Rolex",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 75,
      salePrice: 325,
    },
    {
      id: 19,
      name: "Broquel Circulo Cristales Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 70,
      salePrice: 305,
    },
    {
      id: 20,
      name: "Pulso Van Cleef Zirconia Plata",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 120,
      salePrice: 515,
    },
    {
      id: 21,
      name: "Pulso Van Cleef Zirconia Dorado",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 120,
      salePrice: 515,
    },
    {
      id: 22,
      name: "Arracada Media Luna Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 32,
      salePrice: 145,
    },
    {
      id: 23,
      name: "Huggies Zirconia Rosa/Celeste",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 40,
      salePrice: 180,
    },
    {
      id: 24,
      name: "Huggies Turqueza Zirconia",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 55,
      salePrice: 240,
    },
    {
      id: 25,
      name: "Arracada Perlas",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 55,
      salePrice: 240,
    },
    {
      id: 26,
      name: "Huggies Cadena Sencilla",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 25,
      salePrice: 115,
    },
    {
      id: 27,
      name: "Huggies Cristal Incrustado",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 160,
    },
    {
      id: 28,
      name: "Broquel Mariposa Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 160,
    },
    {
      id: 29,
      name: "Broquel Circulos Zirconia Pequeños",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 160,
    },
    {
      id: 30,
      name: "Huggies Cristales Zirconia Colores Delgado",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 160,
    },
    {
      id: 31,
      name: "Huggies Doble Zirconia Colores",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 160,
    },
    {
      id: 32,
      name: "Huggies Lazos Zirconia",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 50,
      salePrice: 220,
    },
    {
      id: 33,
      name: "Huggies Cristal Cuadrado Zirconias",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 35,
      salePrice: 160,
    },
    {
      id: 34,
      name: "Huggies Hojas Zirconia Blanca",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 32,
      salePrice: 145,
    },
    {
      id: 35,
      name: "Broquel Petalo Gota Zirconias",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 36,
      name: "Broquel Petalo Gota Zirconias",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 37,
      name: "Collar Corazón Perlas FE",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 70,
      salePrice: 305,
    },
    {
      id: 38,
      name: "Collar Perro Globo Zirconias Multicolor",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 80,
      salePrice: 350,
    },
    {
      id: 39,
      name: "Collar Perro Globo Zirconias Blancas",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 80,
      salePrice: 350,
    },
    {
      id: 40,
      name: "Corbatero Perlas Blanca y Dorada",
      total: 3,
      sold: 0,
      inTransit: 0,
      free: 3,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 41,
      name: "Collar Sol Perla",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 70,
      salePrice: 305,
    },
    {
      id: 42,
      name: "Collar Cuadrado Zirconia Cristal Celeste",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 70,
      salePrice: 305,
    },
    {
      id: 43,
      name: "Collar Cuadrado Zirconia Negro",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 44,
      name: "Corbatero Tambor Negro",
      total: 1,
      sold: 0,
      inTransit: 0,
      free: 1,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 65,
      salePrice: 280,
    },
    {
      id: 45,
      name: "Collar Doble Cristal Cuadrados",
      total: 2,
      sold: 0,
      inTransit: 0,
      free: 2,
      location: "Almacén",
      supplier: "Malaj Fashion",
      purchasePrice: 80,
      salePrice: 350,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    total: 0,
    location: "",
    supplier: "",
    purchasePrice: 0,
    salePrice: 0,
  });

  const [editProductId, setEditProductId] = useState(null);
  const [editableProduct, setEditableProduct] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addProduct = () => {
    const total = parseInt(newProduct.total, 10);
    const purchasePrice = parseFloat(newProduct.purchasePrice);
    const salePrice = parseFloat(newProduct.salePrice);

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
        supplier: newProduct.supplier,
        purchasePrice,
        salePrice,
      },
    ]);
    setNewProduct({
      name: "",
      total: 0,
      location: "",
      supplier: "",
      purchasePrice: 0,
      salePrice: 0,
    });
  };

  const startEdit = (product) => {
    setEditProductId(product.id);
    setEditableProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct({ ...editableProduct, [name]: value });
  };

  const saveEdit = () => {
    const { total, sold, inTransit } = editableProduct;

    // Validar y convertir los valores editados
    const updatedProduct = {
      ...editableProduct,
      total: parseInt(total, 10),
      sold: parseInt(sold, 10),
      inTransit: parseInt(inTransit, 10),
      free: parseInt(total, 10) - parseInt(sold, 10) - parseInt(inTransit, 10),
      purchasePrice: parseFloat(editableProduct.purchasePrice),
      salePrice: parseFloat(editableProduct.salePrice),
    };

    // Actualizar el producto en la lista
    setProducts((prev) =>
      prev.map((product) =>
        product.id === editProductId ? updatedProduct : product
      )
    );

    // Resetear el estado de edición
    setEditProductId(null);
    setEditableProduct({});
  };

  const cancelEdit = () => {
    setEditProductId(null);
    setEditableProduct({});
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, "Inventario.xlsx");
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
        <input
          type="text"
          name="supplier"
          placeholder="Proveedor"
          value={newProduct.supplier}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="purchasePrice"
          placeholder="Precio de Compra"
          value={newProduct.purchasePrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="salePrice"
          placeholder="Precio de Venta"
          value={newProduct.salePrice}
          onChange={handleInputChange}
        />
        <button className="btn" onClick={addProduct}>
          Agregar
        </button>
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
              <th>Proveedor</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="txtBlack">
            {products.map((product) => (
              <tr key={product.id}>
                {editProductId === product.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editableProduct.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="total"
                        value={editableProduct.total}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="sold"
                        value={editableProduct.sold}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="inTransit"
                        value={editableProduct.inTransit}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      {editableProduct.total -
                        editableProduct.sold -
                        editableProduct.inTransit}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="location"
                        value={editableProduct.location}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="supplier"
                        value={editableProduct.supplier}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={editableProduct.purchasePrice}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="salePrice"
                        value={editableProduct.salePrice}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={saveEdit}
                        disabled={
                          !editableProduct.name ||
                          editableProduct.total === "" ||
                          editableProduct.sold === "" ||
                          editableProduct.inTransit === "" ||
                          !editableProduct.location ||
                          !editableProduct.supplier ||
                          editableProduct.purchasePrice === "" ||
                          editableProduct.salePrice === ""
                        }
                      >
                        Guardar
                      </button>

                      <button className="btn" onClick={cancelEdit}>
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{product.name}</td>
                    <td>{product.total}</td>
                    <td>{product.sold}</td>
                    <td>{product.inTransit}</td>
                    <td>{product.free}</td>
                    <td>{product.location}</td>
                    <td>{product.supplier}</td>
                    <td>${product.purchasePrice.toFixed(2)}</td>
                    <td>${product.salePrice.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => startEdit(product)}
                      >
                        Editar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Botón para exportar a Excel */}
        <button className="btn" onClick={exportToExcel}>Exportar a Excel</button>
      </div>
    </div>
  );
};

export default Inventory;

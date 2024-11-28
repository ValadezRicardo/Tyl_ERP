import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./Inventory.css";

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
      supplier: "Proveedor A",
      purchasePrice: 100,
      salePrice: 150,
    },
    {
      id: 2,
      name: "Cadena Torzal",
      total: 8,
      sold: 5,
      inTransit: 7,
      free: 7,
      location: "Almacén 2",
      supplier: "Proveedor B",
      purchasePrice: 80,
      salePrice: 120,
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

    const updatedProduct = {
      ...editableProduct,
      total: parseInt(total, 10),
      sold: parseInt(sold, 10),
      inTransit: parseInt(inTransit, 10),
      free: parseInt(total, 10) - parseInt(sold, 10) - parseInt(inTransit, 10),
      purchasePrice: parseFloat(editableProduct.purchasePrice),
      salePrice: parseFloat(editableProduct.salePrice),
    };

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editProductId ? updatedProduct : product
      )
    );
    setEditProductId(null);
    setEditableProduct({});
  };

  const cancelEdit = () => {
    setEditProductId(null);
    setEditableProduct({});
  };

  const exportToExcel = () => {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Crear una hoja con los datos del inventario
    const worksheetData = products.map((product) => ({
      Nombre: product.name,
      Total: product.total,
      Vendido: product.sold,
      "En Tránsito": product.inTransit,
      Libre: product.free,
      Ubicación: product.location,
      Proveedor: product.supplier,
      "Precio Compra": product.purchasePrice,
      "Precio Venta": product.salePrice,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, "Inventario.xlsx");
  };

  return (
    <div>
      <h1>Gestión de Inventario</h1>

      <button className="btn" onClick={exportToExcel}>
        Descargar en Excel
      </button>

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
                  <button className="btn" onClick={() => startEdit(product)}>
                    Editar
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

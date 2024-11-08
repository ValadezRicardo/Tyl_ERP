import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./QuotationForm.css";
import Pedido from "./Pedido"; // Importamos el nuevo componente Pedido
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";

const QuotationForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quotationItems, setQuotationItems] = useState([]);
  const [showPedido, setShowPedido] = useState(false); // Estado para mostrar Pedido
  const [confirmedOrders, setConfirmedOrders] = useState([]); // Estado para almacenar pedidos confirmados
  const [paymentMethod, setPaymentMethod] = useState(""); // Estado para el método de pago

  const IVA_RATE = 0.16; // 16% de IVA

  const products = [
    { id: "p1", name: "Axilas", price: 100 },
    { id: "p2", name: "Bikini Completo", price: 300 },
    { id: "p3", name: "Entre gluteos", price: 100 },
    { id: "p4", name: "Bikini Spa", price: 500 },
    { id: "p5", name: "Bikini Spa Premium", price: 600 },
    { id: "p6", name: "Diseño y Depilación de Cejas", price: 300 },
    { id: "p7", name: "Depilación de Cejas", price: 200 },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedProduct(null);
  };

  const handleProductSelect = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setQuantity(1); // Resetea la cantidad cuando selecciona un nuevo producto
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value) || 1);
  };

  const addProductToQuotation = () => {
    if (!selectedProduct) return;

    const newItem = {
      ...selectedProduct,
      quantity,
      subtotal: selectedProduct.price * quantity,
    };

    setQuotationItems([...quotationItems, newItem]);
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const removeProductFromQuotation = (index) => {
    const updatedItems = quotationItems.filter((_, i) => i !== index);
    setQuotationItems(updatedItems);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Cotización de Productos", 10, 10);

    let yOffset = 20;
    quotationItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal.toFixed(2)}`,
        10,
        yOffset
      );
      yOffset += 10;
    });

    const subtotal = quotationItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, yOffset + 10);
    doc.text(`IVA (16%): $${iva.toFixed(2)}`, 10, yOffset + 20);
    doc.text(`Total: $${total.toFixed(2)}`, 10, yOffset + 30);

    doc.save("Cotizacion.pdf");
  };

  const generateOrder = () => {
    if (total <= 0) {
      alert("El total debe ser mayor a 0 para generar un pedido");
      return;
    }

    // Guardamos el pedido confirmado en el estado de confirmedOrders
    const newOrder = {
      items: quotationItems,
      subtotal,
      iva,
      total,
      paymentMethod,
      date: new Date().toLocaleString(),
    };

    setConfirmedOrders([...confirmedOrders, newOrder]); // Agregar el nuevo pedido
    setShowPedido(true); // Muestra el componente Pedido
    setQuotationItems([]); // Limpiar los productos cotizados después de confirmar
    setPaymentMethod(""); // Reseteamos el método de pago
  };

  const subtotal = quotationItems.reduce((sum, item) => sum + item.subtotal, 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  // Sumatoria de subtotales de todos los pedidos confirmados
  const totalConfirmedSubtotal = confirmedOrders.reduce(
    (sum, order) => sum + order.subtotal,
    0
  );

  const removeOrder = (index) => {
    // Eliminar el pedido de confirmedOrders
    const updatedOrders = confirmedOrders.filter((_, i) => i !== index);
    setConfirmedOrders(updatedOrders);
  };

  return (
    <div className="quotation-form main-content">
      <h2 className="txtBlack">Cotización de Productos</h2>

      {/* Buscador de Producto */}
      <div className="form-group">
        <label htmlFor="search">Buscar Producto:</label>
        <input
          type="text"
          id="search"
          placeholder="Escribe el nombre del producto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Lista de Productos Filtrados */}
      {filteredProducts.length > 0 && (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-item ${
                selectedProduct && selectedProduct.id === product.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleProductSelect(product.id)}
            >
              {product.name} - ${product.price}
            </div>
          ))}
        </div>
      )}

      {/* Selector de Cantidad */}
      {selectedProduct && (
        <div className="form-group">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <button className="btn-add" onClick={addProductToQuotation}>
            Agregar Producto
          </button>
        </div>
      )}

      {/* Tabla de Productos en la Cotización */}
      {quotationItems.length > 0 && (
        <div className="quotation-items">
          <h3 className="txtBlack">Productos Cotizados</h3>
          <ul>
            {quotationItems.map((item, index) => (
              <li className="txtBlack" key={index}>
                {item.name} - Cantidad: {item.quantity} - Subtotal: $
                {item.subtotal.toFixed(2)}
                <button
                  className="btn-remove"
                  onClick={() => removeProductFromQuotation(index)}
                >
                  <RiDeleteBin5Fill />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Desglose de Precio */}
      <div className="price-breakdown">
        <p className="txtBlack">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="txtBlack">IVA (16%): ${iva.toFixed(2)}</p>
        <p className="txtBlack">
          <strong>Total: ${total.toFixed(2)}</strong>
        </p>
      </div>

      {/* Método de Pago */}
      <div className="payment-method">
        <label>Método de Pago:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
      </div>

      <button className="btn-quote" onClick={generatePDF}>
        Generar Cotización en PDF <FaFilePdf />{" "}
      </button>
      <button className="btn-order" onClick={generateOrder}>
        Generar Pedido <FcSalesPerformance />
      </button>

      {/* Tabla de Pedidos Confirmados */}
      {confirmedOrders.length > 0 && (
        <div className="confirmed-orders">
          <h3 className="txtBlack">Pedidos Confirmados</h3>
          <div className="table-container">
            <table className="txtBlack">
              <thead className="txtBlack">
                <tr>
                  <th>Fecha</th>
                  <th>M. Pago</th>
                  <th>Subtotal</th>
                  <th>IVA</th>
                  <th>Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.date}</td>
                    <td>{order.paymentMethod}</td>
                    <td>${order.subtotal.toFixed(2)}</td>
                    <td>${order.iva.toFixed(2)}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => removeOrder(index)}
                      >
                        <RiDeleteBin5Fill />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sumatoria de Subtotales de Todos los Pedidos Confirmados */}
          <div className="total-confirmed-subtotal">
            <p className="txtBlack">
              <strong>Venta: ${totalConfirmedSubtotal.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationForm;

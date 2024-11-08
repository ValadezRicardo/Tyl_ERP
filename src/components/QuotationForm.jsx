import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './QuotationForm.css';
import Pedido from './Pedido'; // Importamos el nuevo componente Pedido

const QuotationForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quotationItems, setQuotationItems] = useState([]);
  const [showPedido, setShowPedido] = useState(false); // Estado para mostrar Pedido
  const [confirmedOrders, setConfirmedOrders] = useState([]); // Estado para almacenar pedidos confirmados
  const [paymentMethod, setPaymentMethod] = useState(''); // Estado para el método de pago

  const IVA_RATE = 0.16; // 16% de IVA

  const products = [
    { id: 'p1', name: 'Producto A', price: 100 },
    { id: 'p2', name: 'Producto B', price: 150 },
    { id: 'p3', name: 'Producto C', price: 200 },
    { id: 'p4', name: 'Producto D', price: 250 },
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
    setSearchTerm('');
  };

  const removeProductFromQuotation = (index) => {
    const updatedItems = quotationItems.filter((_, i) => i !== index);
    setQuotationItems(updatedItems);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Cotización de Productos', 10, 10);

    let yOffset = 20;
    quotationItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal.toFixed(2)}`,
        10,
        yOffset
      );
      yOffset += 10;
    });

    const subtotal = quotationItems.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, yOffset + 10);
    doc.text(`IVA (16%): $${iva.toFixed(2)}`, 10, yOffset + 20);
    doc.text(`Total: $${total.toFixed(2)}`, 10, yOffset + 30);

    doc.save('Cotizacion.pdf');
  };

  const generateOrder = () => {
    if (total <= 0) {
      alert('El total debe ser mayor a 0 para generar un pedido');
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
    setPaymentMethod(''); // Reseteamos el método de pago
  };

  const subtotal = quotationItems.reduce((sum, item) => sum + item.subtotal, 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  return (
    <div className="quotation-form main-content">
      <h2 className='txtBlack'>Cotización de Productos</h2>

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
                selectedProduct && selectedProduct.id === product.id ? 'selected' : ''
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
          <h3 className='txtBlack'>Productos Cotizados</h3>
          <ul>
            {quotationItems.map((item, index) => (
              <li className='txtBlack' key={index}>
                {item.name} - Cantidad: {item.quantity} - Subtotal: ${item.subtotal.toFixed(2)}
                <button className="btn-remove" onClick={() => removeProductFromQuotation(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Desglose de Precio */}
      <div className="price-breakdown">
        <p className='txtBlack'>Subtotal: ${subtotal.toFixed(2)}</p>
        <p className='txtBlack'>IVA (16%): ${iva.toFixed(2)}</p>
        <p className='txtBlack'><strong>Total: ${total.toFixed(2)}</strong></p>
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

      <button className="btn-quote" onClick={generatePDF}>Generar Cotización en PDF</button>
      <button className="btn-order" onClick={generateOrder}>Generar Pedido</button>

      {/* Mostramos Pedido solo si showPedido es verdadero */}
      {/* {showPedido && (
        <Pedido items={quotationItems} subtotal={subtotal} iva={iva} total={total} />
      )} */}

      {/* Tabla de Pedidos Confirmados */}
      {confirmedOrders.length > 0 && (
        <div className="confirmed-orders">
          <h3 className='txtBlack'>Pedidos Confirmados</h3>
          <table className='txtBlack'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Método de Pago</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuotationForm;

import React, { useState } from 'react';
import reactLogo from '../assets/favicon.ico'
import Contacto from './Contacto';
import QuotationForm from './QuotationForm';
import Inventory from './Inventory';
import { Link } from 'react-router-dom';

const Menu = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={reactLogo} alt="iappting" className="logo-image" /> {/* Logo */}
      </div>
      <ul className="navbar-links">
        <li><Link to="/Dashboard"><a href="#">Dashboard</a></Link></li>
        <li><a href="#">Integraciones</a></li>
        <li><a href="#">Actualizaciones</a></li>
        {/* Menú desplegable */}
        <li className="dropdown">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            Operaciones
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/QuotationForm"><a href="#">Ventas</a></Link></li>
              <li><a href="#ventassuministro">Cadena de Suministro</a></li>
              <li><Link to="/Inventory"><a href="#">Almacén</a></Link></li>
              <li><a href="#contabilidad">Contabilidad</a></li>
              <li><a href="#recursoshumanos">Recursos Humanos</a></li>
              <li><a href="#importacionexportacion">Importación/Exportación</a></li>
              <li><a href="#creditocobranza">Crédito/Cobranza</a></li>
              <li><a href="#finanzastesoreria">Finanzas/Tesoreria</a></li>
              <li><a href="#asuntosregulatorios">Asuntos Regulatorios</a></li>
            </ul>
          )}
        </li>
        <li><Link to="/Contacto"><a href="#">Reporte</a></Link></li>
      </ul>
    </nav>
  );
};

export default Menu;

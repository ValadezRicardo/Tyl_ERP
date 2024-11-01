import React, { useState } from 'react';
import reactLogo from '../assets/favicon.ico'

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
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#acerca">Acerca</a></li>
        <li><a href="#servicios">Servicios</a></li>
        {/* Menú desplegable */}
        <li className="dropdown">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            Operaciones
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><a href="#ventas">Ventas</a></li>
              <li><a href="#ventassuministro">Cadena de Suministro</a></li>
              <li><a href="#almacen">Almacén</a></li>
              <li><a href="#contabilidad">Contabilidad</a></li>
              <li><a href="#recursoshumanos">Recursos Humanos</a></li>
              <li><a href="#importacionexportacion">Importación/Exportación</a></li>
              <li><a href="#creditocobranza">Crédito/Cobranza</a></li>
              <li><a href="#finanzastesoreria">Finanzas/Tesoreria</a></li>
              <li><a href="#asuntosregulatorios">Asuntos Regulatorios</a></li>
            </ul>
          )}
        </li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  );
};

export default Menu;

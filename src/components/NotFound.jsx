// pages/NotFound.jsx
import React from "react";
import { Link } from 'react-router-dom';
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/" className="not-found-link">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;

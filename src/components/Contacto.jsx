// src/components/Contacto.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './contacto.css';


const Contacto = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [acceso, setAcceso] = useState('');
  const [archivos, setArchivos] = useState([]);

  const onDrop = (acceptedFiles) => {
    setArchivos((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*,video/*', // Acepta solo imágenes y videos
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de envío, como enviar datos a una API
    console.log({
      titulo,
      descripcion,
      acceso,
      archivos,
    });
    // Resetea el formulario si es necesario
    setTitulo('');
    setDescripcion('');
    setAcceso('');
    setArchivos([]);
  };

  return (
    <form className='main-content' onSubmit={handleSubmit}>
      <div>
        <label>Título del Reporte:</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Menú de Acceso:</label>
        <select value={acceso} onChange={(e) => setAcceso(e.target.value)} required>
          <option value="">Seleccionar...</option>
          <option value="ventas">Ventas</option>
          <option value="Cadenasuministro">Cadena de Suministro</option>
          <option value="Almacén">Almacén</option>
          <option value="Contabilidad">Contabilidad</option>
          <option value="Recursoshumanos">Recursos Humanos</option>
          <option value="ImportacionExportacion">Importación/Exportación</option>
          <option value="CréditoCobranza">Crédito/Cobranza</option>
          <option value="FinanzasTesoreria">Finanzas/Tesoreria</option>
          <option value="AsuntosRegulatorios">Asuntos Regulatorios</option>
        </select>
      </div>

      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', margin: '10px 0' }}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</p>
        <em>(Solo imágenes y videos)</em>
      </div>

      <div>
        {archivos.length > 0 && (
          <ul>
            {archivos.map((file, index) => (
              <li className='txtFile' key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <button className='btnSend' type="submit">Enviar Reporte</button>
    </form>
  );
};

export default Contacto;

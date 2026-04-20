import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdBugReport, MdAttachFile, MdSend, MdCheckCircle } from 'react-icons/md';

const MODULES = [
  'Ventas', 'Cadena de Suministro', 'Almacén', 'Contabilidad',
  'Recursos Humanos', 'Importación/Exportación', 'Crédito/Cobranza',
  'Finanzas/Tesorería', 'Asuntos Regulatorios',
];

const PRIORITIES = ['Baja', 'Media', 'Alta', 'Crítica'];

const PRIORITY_COLORS = {
  Baja:    'bg-slate-100 text-slate-600',
  Media:   'bg-amber-100 text-amber-700',
  Alta:    'bg-orange-100 text-orange-700',
  Crítica: 'bg-red-100 text-red-700',
};

export default function Contacto() {
  const [form, setForm]     = useState({ titulo: '', descripcion: '', modulo: '', prioridad: 'Media' });
  const [files, setFiles]   = useState([]);
  const [errors, setErrors] = useState({});
  const [sent, setSent]     = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => setFiles((prev) => [...prev, ...accepted]),
    accept: { 'image/*': [], 'video/*': [] },
  });

  const validate = () => {
    const e = {};
    if (!form.titulo.trim())       e.titulo = 'Requerido';
    if (!form.descripcion.trim())  e.descripcion = 'Requerido';
    if (!form.modulo)              e.modulo = 'Selecciona un módulo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log({ ...form, files });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ titulo: '', descripcion: '', modulo: '', prioridad: 'Media' });
      setFiles([]);
      setErrors({});
    }, 3000);
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  if (sent) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-center space-y-3">
          <MdCheckCircle size={56} className="text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Reporte enviado</h2>
          <p className="text-slate-500 text-sm">El equipo revisará tu reporte a la brevedad.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MdBugReport className="text-primary-600" size={26} />
          Reportar incidencia
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Notifica errores o problemas a tu equipo de soporte</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Título del reporte</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Ej: Error al generar PDF en cotización"
            className={`w-full text-sm border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.titulo ? 'border-red-400' : 'border-slate-200'}`}
          />
          {errors.titulo && <p className="text-xs text-red-500 mt-1">{errors.titulo}</p>}
        </div>

        {/* Módulo + Prioridad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Módulo afectado</label>
            <select
              value={form.modulo}
              onChange={(e) => setForm({ ...form, modulo: e.target.value })}
              className={`w-full text-sm border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.modulo ? 'border-red-400' : 'border-slate-200'}`}
            >
              <option value="">Seleccionar…</option>
              {MODULES.map((m) => <option key={m}>{m}</option>)}
            </select>
            {errors.modulo && <p className="text-xs text-red-500 mt-1">{errors.modulo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Prioridad</label>
            <div className="flex gap-2 flex-wrap">
              {PRIORITIES.map((p) => (
                <button
                  key={p} type="button"
                  onClick={() => setForm({ ...form, prioridad: p })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.prioridad === p ? PRIORITY_COLORS[p] + ' border-current' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
          <textarea
            rows={5}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Describe el problema con detalle: qué hiciste, qué esperabas y qué pasó…"
            className={`w-full text-sm border rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.descripcion ? 'border-red-400' : 'border-slate-200'}`}
          />
          {errors.descripcion && <p className="text-xs text-red-500 mt-1">{errors.descripcion}</p>}
        </div>

        {/* Dropzone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Adjuntos (imágenes / videos)</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}`}
          >
            <input {...getInputProps()} />
            <MdAttachFile size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">
              {isDragActive ? 'Suelta los archivos aquí…' : 'Arrastra archivos o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Solo imágenes y videos</p>
          </div>

          {files.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {files.map((f) => (
                <li key={f.name} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                  <span className="text-slate-600 truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(f.name)} className="text-slate-400 hover:text-red-500 ml-2">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
        >
          <MdSend size={16} /> Enviar reporte
        </button>
      </form>
    </div>
  );
}

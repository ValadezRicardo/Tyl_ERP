import { Link } from 'react-router-dom';
import { MdSearchOff } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <MdSearchOff size={72} className="text-slate-300 mb-4" />
      <h1 className="text-6xl font-bold text-slate-200">404</h1>
      <p className="text-xl font-semibold text-slate-600 mt-2">Página no encontrada</p>
      <p className="text-slate-400 text-sm mt-1 mb-6">La ruta que buscas no existe en este sistema.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
        Volver al Dashboard
      </Link>
    </div>
  );
}

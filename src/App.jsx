import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import MenuManager from './components/menu/MenuManager';
import Inventory from './components/inventory/Inventory';
import Recipes from './components/recipes/Recipes';
import Tables from './components/tables/Tables';
import Ingresos from './components/finance/Ingresos';
import Egresos from './components/finance/Egresos';
import CashClose from './components/cashclose/CashClose';
import Kanban from './components/kanban/Kanban';
import Reports from './components/reports/Reports';
import NotFound from './components/NotFound';
import useStore from './store/useStore';
import { ROLE_ROUTES } from './data/restaurant';

function Guard({ path, element }) {
  const currentUser = useStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  const allowed = ROLE_ROUTES[currentUser.role] ?? [];
  if (!allowed.includes(path)) return <Navigate to="/" replace />;
  return element;
}

export default function App() {
  const currentUser = useStore((s) => s.currentUser);

  if (!currentUser) return <Login />;

  return (
    <Layout>
      <Routes>
        <Route path="/"           element={<Guard path="/"           element={<Dashboard />} />} />
        <Route path="/menu"       element={<Guard path="/menu"       element={<MenuManager />} />} />
        <Route path="/inventario" element={<Guard path="/inventario" element={<Inventory />} />} />
        <Route path="/recetas"    element={<Guard path="/recetas"    element={<Recipes />} />} />
        <Route path="/mesas"      element={<Guard path="/mesas"      element={<Tables />} />} />
        <Route path="/ingresos"   element={<Guard path="/ingresos"   element={<Ingresos />} />} />
        <Route path="/egresos"    element={<Guard path="/egresos"    element={<Egresos />} />} />
        <Route path="/caja"       element={<Guard path="/caja"       element={<CashClose />} />} />
        <Route path="/cocina"     element={<Guard path="/cocina"     element={<Kanban />} />} />
        <Route path="/reportes"   element={<Guard path="/reportes"   element={<Reports />} />} />
        <Route path="/login"      element={<Navigate to="/" replace />} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

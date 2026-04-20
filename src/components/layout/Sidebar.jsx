import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdInventory2, MdChevronLeft, MdChevronRight,
  MdExpandMore, MdExpandLess, MdTableRestaurant, MdRestaurantMenu,
  MdTrendingUp, MdTrendingDown, MdAccountBalance, MdBarChart,
  MdPointOfSale, MdMenuBook, MdLogout,
} from 'react-icons/md';
import { FaUtensils } from 'react-icons/fa';
import useStore from '../../store/useStore';
import { ROLE_ROUTES } from '../../data/restaurant';

const ALL_NAV = [
  { label: 'Dashboard',   to: '/',          icon: MdDashboard,       end: true },
  { label: 'Menú',        to: '/menu',       icon: MdRestaurantMenu },
  { label: 'Inventario',  to: '/inventario', icon: MdInventory2 },
  { label: 'Recetas',     to: '/recetas',    icon: MdMenuBook },
  { label: 'Mesas',       to: '/mesas',      icon: MdTableRestaurant },
  {
    label: 'Finanzas', icon: MdAccountBalance, children: [
      { label: 'Ingresos', to: '/ingresos', icon: MdTrendingUp },
      { label: 'Egresos',  to: '/egresos',  icon: MdTrendingDown },
    ],
  },
  { label: 'Cierre de caja', to: '/caja',     icon: MdPointOfSale },
  { label: 'Cocina (KDS)',   to: '/cocina',   icon: MdTableRestaurant },
  { label: 'Reportes',       to: '/reportes', icon: MdBarChart },
];

const ROLE_COLORS = {
  admin:    'bg-violet-600',
  mesero:   'bg-sky-600',
  cocinero: 'bg-orange-600',
  cajero:   'bg-emerald-600',
};

const linkBase   = 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150';
const linkActive = 'bg-primary-600 text-white';
const linkIdle   = 'text-slate-400 hover:bg-slate-800 hover:text-white';

export default function Sidebar() {
  const currentUser = useStore((s) => s.currentUser);
  const logout      = useStore((s) => s.logout);
  const navigate    = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen]           = useState({ Finanzas: true });

  const allowed = ROLE_ROUTES[currentUser?.role ?? 'mesero'] ?? [];

  const isAllowed = (to) => allowed.includes(to);
  const isGroupAllowed = (children) => children.some((c) => isAllowed(c.to));

  const toggleGroup = (label) => setOpen((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleNav = ALL_NAV.filter((item) =>
    item.children ? isGroupAllowed(item.children) : isAllowed(item.to)
  );

  return (
    <aside className={`flex flex-col h-screen bg-sidebar text-white sticky top-0 z-40 transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 min-h-[72px]">
        <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
          <FaUtensils size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-base leading-tight truncate">TYL ERP</p>
            <p className="text-slate-400 text-xs truncate">Restaurante</p>
          </div>
        )}
      </div>

      {/* User badge */}
      {currentUser && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ROLE_COLORS[currentUser.role]}`}>
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
              <p className="text-slate-400 text-xs capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleNav.map((item) => {
          if (item.children) {
            const visibleChildren = item.children.filter((c) => isAllowed(c.to));
            const isOpen = open[item.label];
            return (
              <div key={item.label}>
                <button onClick={() => toggleGroup(item.label)}
                  className={`w-full ${linkBase} ${linkIdle} justify-between`}
                  title={collapsed ? item.label : undefined}>
                  <span className="flex items-center gap-3">
                    <item.icon size={20} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </span>
                  {!collapsed && (isOpen ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />)}
                </button>
                {!collapsed && isOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l border-slate-700 space-y-1">
                    {visibleChildren.map((child) => (
                      <NavLink key={child.to} to={child.to}
                        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                        <child.icon size={18} className="shrink-0" />
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              title={collapsed ? item.label : undefined}>
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: collapse + logout */}
      <div className="border-t border-slate-800 p-2 space-y-1">
        <button onClick={handleLogout}
          className={`w-full ${linkBase} text-slate-400 hover:bg-red-900/40 hover:text-red-400`}
          title={collapsed ? 'Cerrar sesión' : undefined}>
          <MdLogout size={20} className="shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        <button onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? 'Expandir' : 'Colapsar'}>
          {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
          {!collapsed && <span className="ml-2 text-xs">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}

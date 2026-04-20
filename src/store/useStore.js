import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_MENU, INITIAL_INGREDIENTS, INITIAL_TABLES } from '../data/restaurant';

// ─── Demo data generators ─────────────────────────────────────────────
const DEMO_INCOMES = (() => {
  const now = new Date();
  const methods = ['Efectivo', 'Tarjeta', 'Transferencia'];
  const cats = ['Venta en mesa', 'Para llevar', 'Domicilio'];
  const records = [];
  for (let d = 29; d >= 0; d--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);
    const count = 4 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const amount = 150 + Math.floor(Math.random() * 850);
      records.push({
        id: `ING-${String(records.length + 1).padStart(4, '0')}`,
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10 + i, 0).toISOString(),
        concept: 'Venta de alimentos y bebidas',
        amount,
        paymentMethod: methods[i % methods.length],
        category: cats[i % cats.length],
        notes: '',
      });
    }
  }
  return records;
})();

const DEMO_EXPENSES = (() => {
  const now = new Date();
  const entries = [
    { concept: 'Compra de ingredientes semanales', category: 'Insumos / Ingredientes',     amount: 3800 },
    { concept: 'Nómina semanal',                   category: 'Personal / Nómina',          amount: 6500 },
    { concept: 'Renta del local',                  category: 'Renta',                      amount: 18000 },
    { concept: 'Recibo de luz',                    category: 'Servicios (luz, agua, gas)',  amount: 2200 },
    { concept: 'Gas LP',                           category: 'Servicios (luz, agua, gas)',  amount: 850 },
    { concept: 'Compra de carnes',                 category: 'Insumos / Ingredientes',     amount: 4200 },
    { concept: 'Nómina semanal',                   category: 'Personal / Nómina',          amount: 6500 },
    { concept: 'Mantenimiento equipo cocina',      category: 'Mantenimiento',              amount: 1500 },
    { concept: 'Compra de bebidas y licores',      category: 'Insumos / Ingredientes',     amount: 2800 },
    { concept: 'Nómina semanal',                   category: 'Personal / Nómina',          amount: 6500 },
    { concept: 'Publicidad en redes sociales',     category: 'Marketing',                  amount: 1200 },
    { concept: 'Compra de verduras y frutas',      category: 'Insumos / Ingredientes',     amount: 1600 },
    { concept: 'Nómina semanal',                   category: 'Personal / Nómina',          amount: 6500 },
    { concept: 'Recibo de agua',                   category: 'Servicios (luz, agua, gas)',  amount: 480 },
    { concept: 'Utensilios de cocina',             category: 'Equipo y utensilios',        amount: 750 },
  ];
  return entries.map((e, i) => ({
    ...e,
    id: `EGR-${String(i + 1).padStart(4, '0')}`,
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - Math.floor(i * 2)).toISOString(),
    notes: '',
  }));
})();

const DEMO_TICKETS = (() => {
  const now = Date.now();
  return [
    { id: 'TKT-001', mesa: '3',  items: ['Hamburguesa clásica x2', 'Papas fritas x2', 'Refresco x2'], notes: 'Sin cebolla en ambas', priority: 'normal',  status: 'nuevo',     total: 380, paymentMethod: 'Efectivo',     createdAt: new Date(now - 3 * 60000).toISOString() },
    { id: 'TKT-002', mesa: '7',  items: ['Pizza Margherita x1', 'Agua mineral x2'],                   notes: '',                   priority: 'normal',  status: 'nuevo',     total: 200, paymentMethod: 'Tarjeta',      createdAt: new Date(now - 1 * 60000).toISOString() },
    { id: 'TKT-003', mesa: '1',  items: ['Filete a la plancha x1', 'Ensalada César x1', 'Vino tinto x1'], notes: 'Término 3/4',   priority: 'urgente', status: 'cocina',    total: 475, paymentMethod: 'Tarjeta',      createdAt: new Date(now - 12 * 60000).toISOString() },
    { id: 'TKT-004', mesa: '5',  items: ['Pasta Alfredo x2', 'Pan de ajo x1', 'Jugo natural x2'],     notes: '',                   priority: 'normal',  status: 'cocina',    total: 440, paymentMethod: 'Transferencia',createdAt: new Date(now - 8 * 60000).toISOString() },
    { id: 'TKT-005', mesa: '9',  items: ['Tacos de birria x3', 'Consomé x1'],                         notes: 'Extra cilantro',     priority: 'normal',  status: 'cocina',    total: 310, paymentMethod: 'Efectivo',     createdAt: new Date(now - 5 * 60000).toISOString() },
    { id: 'TKT-006', mesa: '2',  items: ['Club sándwich x1', 'Café americano x1'],                    notes: '',                   priority: 'normal',  status: 'listo',     total: 190, paymentMethod: 'Efectivo',     createdAt: new Date(now - 18 * 60000).toISOString() },
    { id: 'TKT-007', mesa: '11', items: ['Sopa de tortilla x2', 'Queso fundido x1'],                  notes: 'Alérgico a cacahuate', priority: 'urgente', status: 'listo',   total: 300, paymentMethod: 'Tarjeta',      createdAt: new Date(now - 22 * 60000).toISOString() },
    { id: 'TKT-008', mesa: '4',  items: ['Enchiladas verdes x2', 'Agua fresca x2'],                   notes: '',                   priority: 'normal',  status: 'entregado', total: 370, paymentMethod: 'Efectivo',     createdAt: new Date(now - 35 * 60000).toISOString() },
  ];
})();

let ticketCounter    = DEMO_TICKETS.length + 1;
let incomeCounter    = DEMO_INCOMES.length + 1;
let expenseCounter   = DEMO_EXPENSES.length + 1;
let menuCounter      = INITIAL_MENU.length + 1;
let ingredientCounter = INITIAL_INGREDIENTS.length + 1;

// ─── Store ─────────────────────────────────────────────────────────────
const useStore = create(
  persist(
    (set) => ({
      menuItems:     INITIAL_MENU,
      ingredients:   INITIAL_INGREDIENTS,
      incomes:       DEMO_INCOMES,
      expenses:      DEMO_EXPENSES,
      kanbanTickets: DEMO_TICKETS,
      recipes:       [],
      tables:        INITIAL_TABLES,
      cashCloses:    [],
      currentUser:   null,
      shifts: [
        { id: 'matutino',   label: 'Matutino',   start: '06:00', end: '14:00' },
        { id: 'vespertino', label: 'Vespertino', start: '14:00', end: '22:00' },
        { id: 'nocturno',   label: 'Nocturno',   start: '22:00', end: '06:00' },
      ],

      // ── Menu ────────────────────────────────────────────────────────
      addMenuItem: (item) =>
        set((s) => ({ menuItems: [...s.menuItems, { ...item, id: menuCounter++, available: true }] })),
      updateMenuItem: (id, changes) =>
        set((s) => ({ menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, ...changes } : m)) })),
      deleteMenuItem: (id) =>
        set((s) => ({ menuItems: s.menuItems.filter((m) => m.id !== id) })),
      toggleAvailable: (id) =>
        set((s) => ({ menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) })),

      // ── Ingredients ─────────────────────────────────────────────────
      addIngredient: (item) =>
        set((s) => ({ ingredients: [...s.ingredients, { ...item, id: ingredientCounter++ }] })),
      updateIngredient: (id, changes) =>
        set((s) => ({ ingredients: s.ingredients.map((i) => (i.id === id ? { ...i, ...changes } : i)) })),
      deleteIngredient: (id) =>
        set((s) => ({ ingredients: s.ingredients.filter((i) => i.id !== id) })),
      adjustStock: (id, delta) =>
        set((s) => ({
          ingredients: s.ingredients.map((i) =>
            i.id === id ? { ...i, stock: Math.max(0, +(i.stock + delta).toFixed(2)) } : i
          ),
        })),

      // ── Recipes ─────────────────────────────────────────────────────
      saveRecipe: (menuItemId, ingredients) =>
        set((s) => {
          const exists = s.recipes.find((r) => r.menuItemId === menuItemId);
          return exists
            ? { recipes: s.recipes.map((r) => r.menuItemId === menuItemId ? { ...r, ingredients } : r) }
            : { recipes: [...s.recipes, { menuItemId, ingredients }] };
        }),
      deleteRecipe: (menuItemId) =>
        set((s) => ({ recipes: s.recipes.filter((r) => r.menuItemId !== menuItemId) })),

      // ── Tables ──────────────────────────────────────────────────────
      setTableStatus: (tableId, status, ticketId = null) =>
        set((s) => ({
          tables: s.tables.map((t) => t.id === tableId ? { ...t, status, ticketId } : t),
        })),
      addTable: (data) =>
        set((s) => ({
          tables: [...s.tables, { ...data, id: Date.now(), status: 'libre', ticketId: null }],
        })),
      updateTable: (id, changes) =>
        set((s) => ({
          tables: s.tables.map((t) => t.id === id ? { ...t, ...changes } : t),
        })),
      deleteTable: (id) =>
        set((s) => ({ tables: s.tables.filter((t) => t.id !== id) })),

      // ── Income ──────────────────────────────────────────────────────
      addIncome: (income) =>
        set((s) => ({
          incomes: [
            { ...income, id: `ING-${String(incomeCounter++).padStart(4, '0')}`, date: income.date ?? new Date().toISOString() },
            ...s.incomes,
          ],
        })),
      deleteIncome: (id) =>
        set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) })),

      // ── Expenses ────────────────────────────────────────────────────
      addExpense: (expense) =>
        set((s) => ({
          expenses: [
            { ...expense, id: `EGR-${String(expenseCounter++).padStart(4, '0')}`, date: expense.date ?? new Date().toISOString() },
            ...s.expenses,
          ],
        })),
      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      // ── Cash close ──────────────────────────────────────────────────
      saveCashClose: (close) =>
        set((s) => ({
          cashCloses: [{ ...close, id: `CC-${Date.now()}`, createdAt: new Date().toISOString() }, ...s.cashCloses],
        })),

      // ── Shifts ──────────────────────────────────────────────────────
      updateShift: (id, changes) =>
        set((s) => ({ shifts: s.shifts.map((sh) => sh.id === id ? { ...sh, ...changes } : sh) })),
      addShift: (shift) =>
        set((s) => ({ shifts: [...s.shifts, { ...shift, id: Date.now().toString() }] })),
      deleteShift: (id) =>
        set((s) => ({ shifts: s.shifts.filter((sh) => sh.id !== id) })),

      // ── Auth ────────────────────────────────────────────────────────
      login:  (user) => set({ currentUser: user }),
      logout: ()     => set({ currentUser: null }),

      // ── Kanban ──────────────────────────────────────────────────────
      addTicket: (ticket) =>
        set((s) => {
          const newTicket = {
            ...ticket,
            id: `TKT-${String(ticketCounter++).padStart(3, '0')}`,
            status: 'nuevo',
            createdAt: new Date().toISOString(),
          };
          const matchTable = s.tables.find((t) => t.number === ticket.mesa);
          const newTables = matchTable
            ? s.tables.map((t) => t.id === matchTable.id ? { ...t, status: 'ocupada', ticketId: newTicket.id } : t)
            : s.tables;
          return { kanbanTickets: [newTicket, ...s.kanbanTickets], tables: newTables };
        }),

      moveTicket: (id, newStatus) =>
        set((s) => {
          const ticket   = s.kanbanTickets.find((t) => t.id === id);
          const newTickets = s.kanbanTickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t));

          if (newStatus !== 'entregado' || !ticket || ticket.status === 'entregado') {
            return { kanbanTickets: newTickets };
          }

          // Auto-register income
          const newIncome = {
            id: `ING-${String(incomeCounter++).padStart(4, '0')}`,
            date: new Date().toISOString(),
            concept: `Mesa ${ticket.mesa} — ${ticket.id}`,
            amount: ticket.total ?? 0,
            paymentMethod: ticket.paymentMethod ?? 'Efectivo',
            category: 'Venta en mesa',
            notes: ticket.notes ?? '',
          };

          // Deduct inventory via recipes
          let newIngredients = [...s.ingredients];
          if (ticket.orderItems?.length) {
            ticket.orderItems.forEach(({ menuItemId, qty }) => {
              const recipe = s.recipes.find((r) => r.menuItemId === menuItemId);
              if (!recipe) return;
              recipe.ingredients.forEach(({ ingredientId, qty: ingQty }) => {
                newIngredients = newIngredients.map((ing) =>
                  ing.id === ingredientId
                    ? { ...ing, stock: Math.max(0, +(ing.stock - ingQty * qty).toFixed(2)) }
                    : ing
                );
              });
            });
          }

          // Free the table
          const matchTable = s.tables.find((t) => t.ticketId === id || t.number === ticket.mesa);
          const newTables = matchTable
            ? s.tables.map((t) => t.id === matchTable.id ? { ...t, status: 'libre', ticketId: null } : t)
            : s.tables;

          return {
            kanbanTickets: newTickets,
            incomes:       [newIncome, ...s.incomes],
            ingredients:   newIngredients,
            tables:        newTables,
          };
        }),

      setTicketPriority: (id, priority) =>
        set((s) => ({ kanbanTickets: s.kanbanTickets.map((t) => (t.id === id ? { ...t, priority } : t)) })),

      deleteTicket: (id) =>
        set((s) => {
          const ticket = s.kanbanTickets.find((t) => t.id === id);
          const matchTable = ticket ? s.tables.find((t) => t.ticketId === id || t.number === ticket.mesa) : null;
          const newTables = matchTable
            ? s.tables.map((t) => t.id === matchTable.id ? { ...t, status: 'libre', ticketId: null } : t)
            : s.tables;
          return { kanbanTickets: s.kanbanTickets.filter((t) => t.id !== id), tables: newTables };
        }),

      clearDelivered: () =>
        set((s) => ({ kanbanTickets: s.kanbanTickets.filter((t) => t.status !== 'entregado') })),
    }),
    {
      name: 'tyl-restaurant-storage',
      partialize: (s) => ({
        menuItems:     s.menuItems,
        ingredients:   s.ingredients,
        incomes:       s.incomes,
        expenses:      s.expenses,
        kanbanTickets: s.kanbanTickets,
        recipes:       s.recipes,
        tables:        s.tables,
        cashCloses:    s.cashCloses,
        currentUser:   s.currentUser,
        shifts:        s.shifts,
      }),
    }
  )
);

export default useStore;

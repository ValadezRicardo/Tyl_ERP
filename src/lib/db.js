import { supabase } from './supabase';

// ── Helpers ───────────────────────────────────────────────────────────
const toMenuItem = (r) => ({ id: r.id, sku: r.sku, name: r.name, category: r.category, description: r.description ?? '', price: +r.price, cost: +r.cost, available: r.available });
const toIngredient = (r) => ({ id: r.id, name: r.name, unit: r.unit, stock: +r.stock, minStock: +r.min_stock, cost: +r.cost, supplier: r.supplier ?? '' });
const toTable = (r) => ({ id: r.id, number: r.number, capacity: r.capacity, status: r.status, ticketId: r.ticket_id });
const toTicket = (r) => ({ id: r.id, mesa: r.mesa, items: r.items ?? [], orderItems: r.order_items ?? [], notes: r.notes ?? '', priority: r.priority, status: r.status, total: +r.total, paymentMethod: r.payment_method, createdAt: r.created_at });
const toIncome = (r) => ({ id: r.id, date: r.date, concept: r.concept, amount: +r.amount, paymentMethod: r.payment_method, category: r.category, notes: r.notes ?? '' });
const toExpense = (r) => ({ id: r.id, date: r.date, concept: r.concept, amount: +r.amount, category: r.category, notes: r.notes ?? '' });
const toRecipe = (r) => ({ menuItemId: r.menu_item_id, ingredients: r.ingredients ?? [] });
const toCashClose = (r) => ({ id: r.id, shift: r.shift, shiftHours: r.shift_hours ?? '', date: r.date, closedBy: r.closed_by, expectedCash: +r.expected_cash, actualCash: +r.actual_cash, diff: +r.diff, totalSales: +r.total_sales, totalExpenses: +r.total_expenses, netProfit: +r.net_profit, byMethod: r.by_method ?? {}, notes: r.notes ?? '', createdAt: r.created_at });
const toShift = (r) => ({ id: r.id, label: r.label, start: r.start_time, end: r.end_time });

// ── Menu items ────────────────────────────────────────────────────────
export const getMenuItems = async () => {
  const { data, error } = await supabase.from('menu_items').select('*').order('id');
  if (error) throw error;
  return data.map(toMenuItem);
};
export const insertMenuItem = async (item) => {
  const { data, error } = await supabase.from('menu_items')
    .insert({ sku: item.sku, name: item.name, category: item.category, description: item.description ?? '', price: item.price, cost: item.cost, available: item.available ?? true })
    .select().single();
  if (error) throw error;
  return toMenuItem(data);
};
export const patchMenuItem = async (id, changes) => {
  const mapped = {};
  if (changes.name       !== undefined) mapped.name        = changes.name;
  if (changes.sku        !== undefined) mapped.sku         = changes.sku;
  if (changes.category   !== undefined) mapped.category    = changes.category;
  if (changes.description!== undefined) mapped.description = changes.description;
  if (changes.price      !== undefined) mapped.price       = changes.price;
  if (changes.cost       !== undefined) mapped.cost        = changes.cost;
  if (changes.available  !== undefined) mapped.available   = changes.available;
  const { error } = await supabase.from('menu_items').update(mapped).eq('id', id);
  if (error) throw error;
};
export const deleteMenuItem = async (id) => {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
};

// ── Ingredients ───────────────────────────────────────────────────────
export const getIngredients = async () => {
  const { data, error } = await supabase.from('ingredients').select('*').order('id');
  if (error) throw error;
  return data.map(toIngredient);
};
export const insertIngredient = async (item) => {
  const { data, error } = await supabase.from('ingredients')
    .insert({ name: item.name, unit: item.unit, stock: item.stock ?? 0, min_stock: item.minStock ?? 0, cost: item.cost, supplier: item.supplier ?? '' })
    .select().single();
  if (error) throw error;
  return toIngredient(data);
};
export const patchIngredient = async (id, changes) => {
  const mapped = {};
  if (changes.name     !== undefined) mapped.name      = changes.name;
  if (changes.unit     !== undefined) mapped.unit      = changes.unit;
  if (changes.stock    !== undefined) mapped.stock     = changes.stock;
  if (changes.minStock !== undefined) mapped.min_stock = changes.minStock;
  if (changes.cost     !== undefined) mapped.cost      = changes.cost;
  if (changes.supplier !== undefined) mapped.supplier  = changes.supplier;
  const { error } = await supabase.from('ingredients').update(mapped).eq('id', id);
  if (error) throw error;
};
export const deleteIngredient = async (id) => {
  const { error } = await supabase.from('ingredients').delete().eq('id', id);
  if (error) throw error;
};

// ── Recipes ───────────────────────────────────────────────────────────
export const getRecipes = async () => {
  const { data, error } = await supabase.from('recipes').select('*');
  if (error) throw error;
  return data.map(toRecipe);
};
export const upsertRecipe = async (menuItemId, ingredients) => {
  const { error } = await supabase.from('recipes')
    .upsert({ menu_item_id: menuItemId, ingredients }, { onConflict: 'menu_item_id' });
  if (error) throw error;
};
export const removeRecipe = async (menuItemId) => {
  const { error } = await supabase.from('recipes').delete().eq('menu_item_id', menuItemId);
  if (error) throw error;
};

// ── Restaurant tables ─────────────────────────────────────────────────
export const getTables = async () => {
  const { data, error } = await supabase.from('restaurant_tables').select('*').order('id');
  if (error) throw error;
  return data.map(toTable);
};
export const insertTable = async (t) => {
  const { data, error } = await supabase.from('restaurant_tables')
    .insert({ number: t.number, capacity: t.capacity, status: 'libre', ticket_id: null })
    .select().single();
  if (error) throw error;
  return toTable(data);
};
export const patchTable = async (id, changes) => {
  const mapped = {};
  if (changes.number   !== undefined) mapped.number    = changes.number;
  if (changes.capacity !== undefined) mapped.capacity  = changes.capacity;
  if (changes.status   !== undefined) mapped.status    = changes.status;
  if ('ticketId' in changes)          mapped.ticket_id = changes.ticketId;
  const { error } = await supabase.from('restaurant_tables').update(mapped).eq('id', id);
  if (error) throw error;
};
export const deleteTable = async (id) => {
  const { error } = await supabase.from('restaurant_tables').delete().eq('id', id);
  if (error) throw error;
};

// ── Kanban tickets ────────────────────────────────────────────────────
export const getTickets = async () => {
  const { data, error } = await supabase.from('kanban_tickets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(toTicket);
};
export const insertTicket = async (ticket) => {
  const { error } = await supabase.from('kanban_tickets')
    .insert({ id: ticket.id, mesa: ticket.mesa, items: ticket.items, order_items: ticket.orderItems ?? [], notes: ticket.notes ?? '', priority: ticket.priority, status: ticket.status, total: ticket.total ?? 0, payment_method: ticket.paymentMethod ?? 'Efectivo', created_at: ticket.createdAt });
  if (error) throw error;
};
export const patchTicket = async (id, changes) => {
  const mapped = {};
  if (changes.status   !== undefined) mapped.status   = changes.status;
  if (changes.priority !== undefined) mapped.priority = changes.priority;
  const { error } = await supabase.from('kanban_tickets').update(mapped).eq('id', id);
  if (error) throw error;
};
export const removeTicket = async (id) => {
  const { error } = await supabase.from('kanban_tickets').delete().eq('id', id);
  if (error) throw error;
};
export const removeDeliveredTickets = async () => {
  const { error } = await supabase.from('kanban_tickets').delete().eq('status', 'entregado');
  if (error) throw error;
};

// ── Incomes ───────────────────────────────────────────────────────────
export const getIncomes = async () => {
  const { data, error } = await supabase.from('incomes').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data.map(toIncome);
};
export const insertIncome = async (income) => {
  const { error } = await supabase.from('incomes')
    .insert({ id: income.id, date: income.date, concept: income.concept, amount: income.amount, payment_method: income.paymentMethod, category: income.category, notes: income.notes ?? '' });
  if (error) throw error;
};
export const removeIncome = async (id) => {
  const { error } = await supabase.from('incomes').delete().eq('id', id);
  if (error) throw error;
};

// ── Expenses ──────────────────────────────────────────────────────────
export const getExpenses = async () => {
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data.map(toExpense);
};
export const insertExpense = async (expense) => {
  const { error } = await supabase.from('expenses')
    .insert({ id: expense.id, date: expense.date, concept: expense.concept, amount: expense.amount, category: expense.category, notes: expense.notes ?? '' });
  if (error) throw error;
};
export const removeExpense = async (id) => {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
};

// ── Cash closes ───────────────────────────────────────────────────────
export const getCashCloses = async () => {
  const { data, error } = await supabase.from('cash_closes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(toCashClose);
};
export const insertCashClose = async (c) => {
  const { error } = await supabase.from('cash_closes')
    .insert({ id: c.id, shift: c.shift, shift_hours: c.shiftHours ?? '', date: c.date, closed_by: c.closedBy ?? '', expected_cash: c.expectedCash, actual_cash: c.actualCash, diff: c.diff, total_sales: c.totalSales, total_expenses: c.totalExpenses, net_profit: c.netProfit, by_method: c.byMethod ?? {}, notes: c.notes ?? '' });
  if (error) throw error;
};

// ── Shifts ────────────────────────────────────────────────────────────
export const getShifts = async () => {
  const { data, error } = await supabase.from('shifts').select('*').order('id');
  if (error) throw error;
  return data.map(toShift);
};
export const upsertShift = async (shift) => {
  const { error } = await supabase.from('shifts')
    .upsert({ id: shift.id, label: shift.label, start_time: shift.start, end_time: shift.end }, { onConflict: 'id' });
  if (error) throw error;
};
export const removeShift = async (id) => {
  const { error } = await supabase.from('shifts').delete().eq('id', id);
  if (error) throw error;
};

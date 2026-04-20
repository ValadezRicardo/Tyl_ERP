// ─── Menu categories ───────────────────────────────────────────────────
export const MENU_CATEGORIES = [
  'Entradas', 'Sopas', 'Platos fuertes', 'Mariscos',
  'Pastas', 'Hamburguesas', 'Postres', 'Bebidas', 'Bebidas alcohólicas',
];

// ─── Menu items (dishes / drinks) ─────────────────────────────────────
export const INITIAL_MENU = [
  // Entradas
  { id: 1,  sku: 'ENT-001', name: 'Guacamole',              category: 'Entradas',          price: 95,  cost: 28,  available: true,  description: 'Aguacate, jitomate, cebolla, cilantro' },
  { id: 2,  sku: 'ENT-002', name: 'Queso fundido',          category: 'Entradas',          price: 110, cost: 35,  available: true,  description: 'Queso Oaxaca, chorizo, pimientos' },
  { id: 3,  sku: 'ENT-003', name: 'Totopos con salsa',      category: 'Entradas',          price: 65,  cost: 15,  available: true,  description: 'Totopos artesanales, salsa verde y roja' },
  // Sopas
  { id: 4,  sku: 'SOP-001', name: 'Sopa de tortilla',       category: 'Sopas',             price: 95,  cost: 22,  available: true,  description: 'Caldo de chile pasilla, tortillas, crema, queso' },
  { id: 5,  sku: 'SOP-002', name: 'Caldo tlalpeño',         category: 'Sopas',             price: 110, cost: 30,  available: true,  description: 'Pollo, garbanzos, chipotle, epazote' },
  // Platos fuertes
  { id: 6,  sku: 'PLF-001', name: 'Filete a la plancha',    category: 'Platos fuertes',    price: 285, cost: 95,  available: true,  description: 'Filete res 250g, guarnición de temporada' },
  { id: 7,  sku: 'PLF-002', name: 'Tacos de birria (3)',    category: 'Platos fuertes',    price: 135, cost: 42,  available: true,  description: 'Birria de res, consomé, cebolla, cilantro' },
  { id: 8,  sku: 'PLF-003', name: 'Enchiladas verdes',      category: 'Platos fuertes',    price: 145, cost: 38,  available: true,  description: 'Salsa verde, pollo, crema, queso, cebolla' },
  { id: 9,  sku: 'PLF-004', name: 'Arrachera a la parrilla',category: 'Platos fuertes',    price: 320, cost: 105, available: true,  description: 'Arrachera 280g, nopales, cebolla cambray' },
  { id: 10, sku: 'PLF-005', name: 'Pollo a la plancha',     category: 'Platos fuertes',    price: 195, cost: 60,  available: true,  description: 'Pechuga de pollo, arroz, frijoles' },
  // Mariscos
  { id: 11, sku: 'MAR-001', name: 'Camarones al ajillo',    category: 'Mariscos',          price: 275, cost: 95,  available: true,  description: 'Camarones jumbo, ajo, mantequilla, chile guajillo' },
  { id: 12, sku: 'MAR-002', name: 'Ceviche de camarón',     category: 'Mariscos',          price: 195, cost: 68,  available: false, description: 'Camarón, jitomate, pepino, cilantro, limón' },
  // Pastas
  { id: 13, sku: 'PAS-001', name: 'Pasta Alfredo',          category: 'Pastas',            price: 165, cost: 45,  available: true,  description: 'Fettuccine, salsa Alfredo, champiñones' },
  { id: 14, sku: 'PAS-002', name: 'Espagueti bolognesa',    category: 'Pastas',            price: 155, cost: 50,  available: true,  description: 'Espagueti, carne molida, salsa de tomate' },
  // Hamburguesas
  { id: 15, sku: 'HAM-001', name: 'Hamburguesa clásica',    category: 'Hamburguesas',      price: 155, cost: 52,  available: true,  description: 'Carne 180g, queso americano, lechuga, jitomate' },
  { id: 16, sku: 'HAM-002', name: 'Hamburguesa BBQ',        category: 'Hamburguesas',      price: 175, cost: 58,  available: true,  description: 'Carne 200g, tocino, BBQ, cebolla caramelizada' },
  { id: 17, sku: 'HAM-003', name: 'Club sándwich',          category: 'Hamburguesas',      price: 145, cost: 45,  available: true,  description: 'Pavo, tocino, lechuga, jitomate, mayonesa' },
  // Postres
  { id: 18, sku: 'POS-001', name: 'Flan napolitano',        category: 'Postres',           price: 75,  cost: 18,  available: true,  description: 'Flan casero con cajeta y nuez' },
  { id: 19, sku: 'POS-002', name: 'Churros con cajeta',     category: 'Postres',           price: 85,  cost: 20,  available: true,  description: 'Churros fritos, cajeta, canela' },
  // Bebidas
  { id: 20, sku: 'BEB-001', name: 'Agua mineral',           category: 'Bebidas',           price: 35,  cost: 12,  available: true,  description: 'Agua mineral 500ml' },
  { id: 21, sku: 'BEB-002', name: 'Refresco',               category: 'Bebidas',           price: 35,  cost: 10,  available: true,  description: 'Coca Cola, Sprite, Naranjada 355ml' },
  { id: 22, sku: 'BEB-003', name: 'Jugo natural',           category: 'Bebidas',           price: 55,  cost: 18,  available: true,  description: 'Naranja, zanahoria, limón, betabel' },
  { id: 23, sku: 'BEB-004', name: 'Café americano',         category: 'Bebidas',           price: 45,  cost: 8,   available: true,  description: 'Café de grano, americano o espresso' },
  { id: 24, sku: 'BEB-005', name: 'Agua fresca',            category: 'Bebidas',           price: 40,  cost: 10,  available: true,  description: 'Jamaica, horchata, tamarindo' },
  // Bebidas alcohólicas
  { id: 25, sku: 'ALC-001', name: 'Cerveza nacional',       category: 'Bebidas alcohólicas', price: 55, cost: 22, available: true,  description: 'Corona, Modelo, Pacífico 355ml' },
  { id: 26, sku: 'ALC-002', name: 'Vino tinto copa',        category: 'Bebidas alcohólicas', price: 95, cost: 35, available: true,  description: 'Copa de vino tinto de la casa' },
  { id: 27, sku: 'ALC-003', name: 'Margarita',              category: 'Bebidas alcohólicas', price: 115, cost: 38, available: true, description: 'Tequila, triple sec, limón, sal' },
];

// ─── Ingredients ──────────────────────────────────────────────────────
export const INGREDIENT_UNITS = ['kg', 'g', 'litros', 'ml', 'piezas', 'cajas', 'bolsas', 'latas'];

export const INITIAL_INGREDIENTS = [
  { id: 1,  name: 'Carne de res',        unit: 'kg',     stock: 15,   minStock: 5,  cost: 185, supplier: 'Carnicería Hernández' },
  { id: 2,  name: 'Pechuga de pollo',    unit: 'kg',     stock: 12,   minStock: 4,  cost: 85,  supplier: 'Pollo Fresco SA' },
  { id: 3,  name: 'Camarones jumbo',     unit: 'kg',     stock: 4,    minStock: 3,  cost: 320, supplier: 'Mariscos del Golfo' },
  { id: 4,  name: 'Aguacate',            unit: 'piezas', stock: 30,   minStock: 10, cost: 18,  supplier: 'Frutas y Verduras García' },
  { id: 5,  name: 'Jitomate',            unit: 'kg',     stock: 8,    minStock: 3,  cost: 25,  supplier: 'Frutas y Verduras García' },
  { id: 6,  name: 'Cebolla',             unit: 'kg',     stock: 10,   minStock: 3,  cost: 18,  supplier: 'Frutas y Verduras García' },
  { id: 7,  name: 'Queso Oaxaca',        unit: 'kg',     stock: 5,    minStock: 2,  cost: 145, supplier: 'Lácteos del Sur' },
  { id: 8,  name: 'Crema',               unit: 'litros', stock: 4,    minStock: 2,  cost: 65,  supplier: 'Lácteos del Sur' },
  { id: 9,  name: 'Fettuccine',          unit: 'kg',     stock: 6,    minStock: 2,  cost: 42,  supplier: 'Distribuidora Italiana' },
  { id: 10, name: 'Pan para hamburguesa',unit: 'piezas', stock: 40,   minStock: 15, cost: 6,   supplier: 'Panadería San Luis' },
  { id: 11, name: 'Cerveza Corona',      unit: 'cajas',  stock: 8,    minStock: 3,  cost: 320, supplier: 'Distribuidora FEMSA' },
  { id: 12, name: 'Vino tinto',          unit: 'litros', stock: 6,    minStock: 2,  cost: 185, supplier: 'Vinícola Casa Real' },
  { id: 13, name: 'Tequila',             unit: 'litros', stock: 3,    minStock: 1,  cost: 420, supplier: 'Licores del Centro' },
  { id: 14, name: 'Gas LP',              unit: 'kg',     stock: 20,   minStock: 10, cost: 25,  supplier: 'Gas Express' },
  { id: 15, name: 'Aceite vegetal',      unit: 'litros', stock: 12,   minStock: 4,  cost: 48,  supplier: 'Mayorista Central' },
  { id: 16, name: 'Arroz',               unit: 'kg',     stock: 20,   minStock: 5,  cost: 22,  supplier: 'Mayorista Central' },
  { id: 17, name: 'Frijoles negros',     unit: 'kg',     stock: 15,   minStock: 4,  cost: 28,  supplier: 'Mayorista Central' },
  { id: 18, name: 'Tortillas de maíz',   unit: 'kg',     stock: 2,    minStock: 3,  cost: 18,  supplier: 'Tortillería La Palma' },
];

// ─── Expense categories ───────────────────────────────────────────────
export const EXPENSE_CATEGORIES = [
  'Insumos / Ingredientes', 'Personal / Nómina', 'Renta', 'Servicios (luz, agua, gas)',
  'Mantenimiento', 'Marketing', 'Equipo y utensilios', 'Otros',
];

// ─── Income categories ────────────────────────────────────────────────
export const INCOME_CATEGORIES = ['Venta en mesa', 'Para llevar', 'Domicilio', 'Evento privado', 'Otro'];

// ─── Restaurant tables ────────────────────────────────────────────────
export const INITIAL_TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: String(i + 1),
  capacity: i < 4 ? 2 : i < 10 ? 4 : 6,
  status: 'libre',
  ticketId: null,
}));

// ─── Users & roles ────────────────────────────────────────────────────
export const USERS = [
  { id: 1, name: 'Admin General', role: 'admin',    pin: '1234', initials: 'AG' },
  { id: 2, name: 'Mesero',        role: 'mesero',   pin: '2222', initials: 'ME' },
  { id: 3, name: 'Cocinero',      role: 'cocinero', pin: '3333', initials: 'CO' },
  { id: 4, name: 'Cajero',        role: 'cajero',   pin: '4444', initials: 'CA' },
];

export const ROLE_ROUTES = {
  admin:    ['/', '/menu', '/inventario', '/recetas', '/mesas', '/cocina', '/ingresos', '/egresos', '/caja', '/reportes'],
  mesero:   ['/', '/mesas', '/cocina'],
  cocinero: ['/cocina'],
  cajero:   ['/', '/ingresos', '/egresos', '/caja', '/reportes'],
};

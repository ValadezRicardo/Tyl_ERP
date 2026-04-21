-- ============================================================
--  TYL ERP — Supabase Schema
--  Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Menu items ────────────────────────────────────────────
create table if not exists menu_items (
  id          bigserial primary key,
  sku         text not null,
  name        text not null,
  category    text not null,
  description text default '',
  price       numeric(10,2) not null,
  cost        numeric(10,2) not null,
  available   boolean default true,
  created_at  timestamptz default now()
);
alter table menu_items enable row level security;
create policy "anon full access" on menu_items for all to anon using (true) with check (true);

-- ── Ingredients ───────────────────────────────────────────
create table if not exists ingredients (
  id          bigserial primary key,
  name        text not null,
  unit        text not null,
  stock       numeric(10,3) default 0,
  min_stock   numeric(10,3) default 0,
  cost        numeric(10,2) not null,
  supplier    text default '',
  created_at  timestamptz default now()
);
alter table ingredients enable row level security;
create policy "anon full access" on ingredients for all to anon using (true) with check (true);

-- ── Recipes ───────────────────────────────────────────────
create table if not exists recipes (
  menu_item_id bigint primary key references menu_items(id) on delete cascade,
  ingredients  jsonb default '[]'
);
alter table recipes enable row level security;
create policy "anon full access" on recipes for all to anon using (true) with check (true);

-- ── Restaurant tables ─────────────────────────────────────
create table if not exists restaurant_tables (
  id         bigserial primary key,
  number     text not null unique,
  capacity   int not null default 4,
  status     text default 'libre',
  ticket_id  text,
  created_at timestamptz default now()
);
alter table restaurant_tables enable row level security;
create policy "anon full access" on restaurant_tables for all to anon using (true) with check (true);

-- ── Kanban tickets ────────────────────────────────────────
create table if not exists kanban_tickets (
  id             text primary key,
  mesa           text not null,
  items          text[] default '{}',
  order_items    jsonb default '[]',
  notes          text default '',
  priority       text default 'normal',
  status         text default 'nuevo',
  total          numeric(10,2) default 0,
  payment_method text default 'Efectivo',
  created_at     timestamptz default now()
);
alter table kanban_tickets enable row level security;
create policy "anon full access" on kanban_tickets for all to anon using (true) with check (true);

-- ── Incomes ───────────────────────────────────────────────
create table if not exists incomes (
  id             text primary key,
  date           timestamptz default now(),
  concept        text not null,
  amount         numeric(10,2) not null,
  payment_method text default 'Efectivo',
  category       text not null,
  notes          text default '',
  created_at     timestamptz default now()
);
alter table incomes enable row level security;
create policy "anon full access" on incomes for all to anon using (true) with check (true);

-- ── Expenses ──────────────────────────────────────────────
create table if not exists expenses (
  id         text primary key,
  date       timestamptz default now(),
  concept    text not null,
  amount     numeric(10,2) not null,
  category   text not null,
  notes      text default '',
  created_at timestamptz default now()
);
alter table expenses enable row level security;
create policy "anon full access" on expenses for all to anon using (true) with check (true);

-- ── Cash closes ───────────────────────────────────────────
create table if not exists cash_closes (
  id              text primary key,
  shift           text not null,
  shift_hours     text default '',
  date            timestamptz default now(),
  closed_by       text default '',
  expected_cash   numeric(10,2) default 0,
  actual_cash     numeric(10,2) default 0,
  diff            numeric(10,2) default 0,
  total_sales     numeric(10,2) default 0,
  total_expenses  numeric(10,2) default 0,
  net_profit      numeric(10,2) default 0,
  by_method       jsonb default '{}',
  notes           text default '',
  created_at      timestamptz default now()
);
alter table cash_closes enable row level security;
create policy "anon full access" on cash_closes for all to anon using (true) with check (true);

-- ── Shifts ────────────────────────────────────────────────
create table if not exists shifts (
  id         text primary key,
  label      text not null,
  start_time text not null,
  end_time   text not null
);
alter table shifts enable row level security;
create policy "anon full access" on shifts for all to anon using (true) with check (true);

-- ============================================================
--  SEED DATA — Datos iniciales
-- ============================================================

insert into shifts (id, label, start_time, end_time) values
  ('matutino',   'Matutino',   '06:00', '14:00'),
  ('vespertino', 'Vespertino', '14:00', '22:00'),
  ('nocturno',   'Nocturno',   '22:00', '06:00')
on conflict (id) do nothing;

insert into restaurant_tables (number, capacity) values
  ('1',2),('2',2),('3',2),('4',2),
  ('5',4),('6',4),('7',4),('8',4),('9',4),('10',4),
  ('11',6),('12',6)
on conflict (number) do nothing;

insert into menu_items (sku, name, category, description, price, cost, available) values
  ('ENT-001','Guacamole','Entradas','Aguacate, jitomate, cebolla, cilantro',95,28,true),
  ('ENT-002','Queso fundido','Entradas','Queso Oaxaca, chorizo, pimientos',110,35,true),
  ('ENT-003','Totopos con salsa','Entradas','Totopos artesanales, salsa verde y roja',65,15,true),
  ('SOP-001','Sopa de tortilla','Sopas','Caldo de chile pasilla, tortillas, crema, queso',95,22,true),
  ('SOP-002','Caldo tlalpeño','Sopas','Pollo, garbanzos, chipotle, epazote',110,30,true),
  ('PLF-001','Filete a la plancha','Platos fuertes','Filete res 250g, guarnición de temporada',285,95,true),
  ('PLF-002','Tacos de birria (3)','Platos fuertes','Birria de res, consomé, cebolla, cilantro',135,42,true),
  ('PLF-003','Enchiladas verdes','Platos fuertes','Salsa verde, pollo, crema, queso, cebolla',145,38,true),
  ('PLF-004','Arrachera a la parrilla','Platos fuertes','Arrachera 280g, nopales, cebolla cambray',320,105,true),
  ('PLF-005','Pollo a la plancha','Platos fuertes','Pechuga de pollo, arroz, frijoles',195,60,true),
  ('MAR-001','Camarones al ajillo','Mariscos','Camarones jumbo, ajo, mantequilla, chile guajillo',275,95,true),
  ('MAR-002','Ceviche de camarón','Mariscos','Camarón, jitomate, pepino, cilantro, limón',195,68,false),
  ('PAS-001','Pasta Alfredo','Pastas','Fettuccine, salsa Alfredo, champiñones',165,45,true),
  ('PAS-002','Espagueti bolognesa','Pastas','Espagueti, carne molida, salsa de tomate',155,50,true),
  ('HAM-001','Hamburguesa clásica','Hamburguesas','Carne 180g, queso americano, lechuga, jitomate',155,52,true),
  ('HAM-002','Hamburguesa BBQ','Hamburguesas','Carne 200g, tocino, BBQ, cebolla caramelizada',175,58,true),
  ('HAM-003','Club sándwich','Hamburguesas','Pavo, tocino, lechuga, jitomate, mayonesa',145,45,true),
  ('POS-001','Flan napolitano','Postres','Flan casero con cajeta y nuez',75,18,true),
  ('POS-002','Churros con cajeta','Postres','Churros fritos, cajeta, canela',85,20,true),
  ('BEB-001','Agua mineral','Bebidas','Agua mineral 500ml',35,12,true),
  ('BEB-002','Refresco','Bebidas','Coca Cola, Sprite, Naranjada 355ml',35,10,true),
  ('BEB-003','Jugo natural','Bebidas','Naranja, zanahoria, limón, betabel',55,18,true),
  ('BEB-004','Café americano','Bebidas','Café de grano, americano o espresso',45,8,true),
  ('BEB-005','Agua fresca','Bebidas','Jamaica, horchata, tamarindo',40,10,true),
  ('ALC-001','Cerveza nacional','Bebidas alcohólicas','Corona, Modelo, Pacífico 355ml',55,22,true),
  ('ALC-002','Vino tinto copa','Bebidas alcohólicas','Copa de vino tinto de la casa',95,35,true),
  ('ALC-003','Margarita','Bebidas alcohólicas','Tequila, triple sec, limón, sal',115,38,true)
on conflict do nothing;

insert into ingredients (name, unit, stock, min_stock, cost, supplier) values
  ('Carne de res','kg',15,5,185,'Carnicería Hernández'),
  ('Pechuga de pollo','kg',12,4,85,'Pollo Fresco SA'),
  ('Camarones jumbo','kg',4,3,320,'Mariscos del Golfo'),
  ('Aguacate','piezas',30,10,18,'Frutas y Verduras García'),
  ('Jitomate','kg',8,3,25,'Frutas y Verduras García'),
  ('Cebolla','kg',10,3,18,'Frutas y Verduras García'),
  ('Queso Oaxaca','kg',5,2,145,'Lácteos del Sur'),
  ('Crema','litros',4,2,65,'Lácteos del Sur'),
  ('Fettuccine','kg',6,2,42,'Distribuidora Italiana'),
  ('Pan para hamburguesa','piezas',40,15,6,'Panadería San Luis'),
  ('Cerveza Corona','cajas',8,3,320,'Distribuidora FEMSA'),
  ('Vino tinto','litros',6,2,185,'Vinícola Casa Real'),
  ('Tequila','litros',3,1,420,'Licores del Centro'),
  ('Gas LP','kg',20,10,25,'Gas Express'),
  ('Aceite vegetal','litros',12,4,48,'Mayorista Central'),
  ('Arroz','kg',20,5,22,'Mayorista Central'),
  ('Frijoles negros','kg',15,4,28,'Mayorista Central'),
  ('Tortillas de maíz','kg',2,3,18,'Tortillería La Palma')
on conflict do nothing;

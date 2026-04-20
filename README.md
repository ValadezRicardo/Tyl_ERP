# TYL ERP — Sistema de gestión para restaurante

Sistema ERP completo orientado a la operación diaria de un restaurante. Cubre desde la toma de órdenes en cocina hasta el cierre de caja, pasando por control de inventario, finanzas y reportes.

## Módulos

| Módulo | Descripción |
|---|---|
| **Dashboard** | KPIs en tiempo real: ingresos, egresos, utilidad neta, alertas de stock y tickets activos |
| **Menú** | Alta, edición y disponibilidad de platillos con cálculo de food cost |
| **Recetas** | Vincula ingredientes a platillos; descuenta inventario al entregar una orden |
| **Inventario** | Control de insumos con alertas de stock mínimo y exportación a Excel |
| **Mesas** | Plano visual del restaurante con estados: libre / ocupada / esperando cuenta |
| **Cocina (KDS)** | Tablero Kanban estilo Kitchen Display System con temporizadores y prioridad urgente |
| **Ingresos** | Registro manual y automático (desde KDS) con filtros por período y método de pago |
| **Egresos** | Registro de gastos por categoría con desglose porcentual |
| **Cierre de caja** | Resumen diario por turno, efectivo esperado vs contado, historial de cierres |
| **Reportes** | P&L 6 meses, ventas por hora, food cost por platillo, métodos de pago |
| **Usuarios** | Acceso por PIN con 4 roles: Admin, Mesero, Cocinero, Cajero |

## Stack tecnológico

- **React 18** + **Vite 5**
- **Tailwind CSS v4** (CSS-first config)
- **Zustand v5** con persistencia en `localStorage`
- **Recharts** para gráficas
- **React Router v6**
- **xlsx** para exportación a Excel

## Instalación local

```bash
git clone https://github.com/ValadezRicardo/Tyl_ERP.git
cd tyl-erp-pro
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Credenciales de acceso (demo)

| Usuario | Rol | PIN | Acceso |
|---|---|---|---|
| Admin General | admin | `1234` | Todo el sistema |
| Mesero | mesero | `2222` | Mesas y Cocina |
| Cocinero | cocinero | `3333` | Solo Cocina (KDS) |
| Cajero | cajero | `4444` | Finanzas, Caja y Reportes |

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

O conecta el repositorio desde [vercel.com](https://vercel.com) — el archivo `vercel.json` ya está configurado para manejar el routing de SPA.

### Netlify

Conecta el repositorio desde [netlify.com](https://netlify.com). El archivo `netlify.toml` configura automáticamente el build y los redirects.

```
Build command : npm run build
Publish dir   : dist
```

## Flujo principal

```
Nueva orden (Cocina)
  → Selecciona mesa libre
  → Agrega platillos del menú con precios
  → Elige método de pago
  → Ticket entra al KDS como "Nuevo"

Cocina prepara
  → Ticket pasa a "En cocina" → "Listo"

Mesero entrega
  → Ticket pasa a "Entregado"
  → Se registra el ingreso automáticamente
  → Se descuenta el inventario según la receta
  → La mesa se libera en el plano
```

## Estructura del proyecto

```
src/
├── components/
│   ├── auth/         # Login con PIN
│   ├── cashclose/    # Cierre de caja
│   ├── dashboard/    # Dashboard principal
│   ├── finance/      # Ingresos y Egresos
│   ├── inventory/    # Inventario de insumos
│   ├── kanban/       # KDS / Cocina
│   ├── layout/       # Sidebar y Layout
│   ├── menu/         # Gestión del menú
│   ├── recipes/      # Recetas
│   ├── reports/      # Reportes y analytics
│   └── tables/       # Gestión de mesas
├── data/
│   └── restaurant.js # Datos iniciales y constantes
└── store/
    └── useStore.js   # Estado global (Zustand)
```

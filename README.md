# Barba Negra Drugstore — Frontend

Aplicacion web de una farmacia/drugstore online con catalogo de productos, carrito de compras, checkout con MercadoPago, panel de administracion y gestion de pedidos.

## Tech Stack

| Tecnologia | Proposito |
|------------|-----------|
| React 19 + TypeScript 6 | UI y tipado estatico |
| Vite 8 | Build tool y dev server |
| Tailwind CSS 4 | Estilos utility-first |
| React Router 7 | Routing del lado del cliente |
| Axios | Cliente HTTP con interceptores |
| Lucide React | Iconos |
| Context API | Estado global (Auth + Cart + Toast) |

## Estructura del Proyecto

```
src/
├── context/
│   ├── AuthContext.tsx      # Autenticacion y sesion de usuario
│   └── CartContext.tsx      # Carrito de compras global
├── components/
│   ├── Layout.tsx           # Layout admin (Navbar + contenido)
│   ├── Navbar.tsx           # Barra de navegacion
│   ├── Toast.tsx            # Sistema de notificaciones toast
│   └── store/
│       ├── StoreHeader.tsx  # Header de la tienda
│       ├── QuickSearch.tsx  # Buscador con autocomplete
│       ├── CategoryTabs.tsx # Filtro por categorias
│       ├── ProductGrid.tsx  # Grilla de productos
│       ├── ProductCard.tsx  # Tarjeta de producto individual
│       ├── ProductSkeleton.tsx # Skeleton de carga
│       ├── CombosSection.tsx # Seccion de combos
│       ├── PromoBanner.tsx  # Banner rotativo de promos
│       ├── CheckoutSheet.tsx # Bottom-sheet de carrito y checkout
│       ├── LocationMap.tsx  # Mapa de ubicacion
│       ├── PaymentMethods.tsx # Metodos de pago
│       └── WhatsAppButton.tsx # Boton de WhatsApp
├── pages/
│   ├── Store.tsx            # Tienda principal (publica)
│   ├── Login.tsx            # Inicio de sesion
│   ├── Register.tsx         # Registro de usuario
│   ├── Dashboard.tsx        # Panel admin de productos
│   ├── ProductForm.tsx      # Crear/editar producto
│   ├── CategoryList.tsx     # Lista de categorias (admin)
│   ├── CategoryForm.tsx     # Crear/editar categoria
│   ├── Promotions.tsx       # Pagina de promos (publica)
│   ├── PromotionList.tsx    # Lista de promos (admin)
│   ├── PromotionForm.tsx    # Crear/editar promo
│   ├── MyOrders.tsx         # Historial de pedidos del usuario
│   ├── OrderManagement.tsx  # Gestion de pedidos (admin)
│   ├── PaymentSuccess.tsx   # Pago exitoso
│   └── PaymentFailure.tsx   # Pago rechazado
├── hooks/
│   └── useDebounce.ts       # Hook de debounce
├── services/
│   └── api.ts               # Instancia Axios con interceptores
├── types/
│   └── index.ts             # Interfaces compartidas
├── utils/
│   ├── categoryEmojis.ts    # Emojis por categoria
│   └── imageUrl.ts          # Helper de URLs de imagenes
├── App.tsx                  # Rutas y providers
├── main.tsx                 # Entry point
└── index.css                # Estilos globales y animaciones
```

## Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
VITE_API_URL="http://localhost:3000"
```

En produccion, reemplazar con la URL del backend deployado.

## Instalacion

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev
```

La app corre en `http://localhost:5173`.

## Funcionalidades

### Tienda (Publica)
- Catalogo de productos con busqueda y filtro por categoria
- Seccion de combos y banner de promociones
- Carrito de compras persistente (localStorage)
- Checkout con retiro en local o envio a domicilio
- Pago con MercadoPago
- Consulta por WhatsApp con mensaje pre-armado
- Mapa de ubicacion y metodos de pago

### Autenticacion
- Registro con validacion de contraseña (8+ chars, mayuscula, numero)
- Login con JWT
- Rutas protegidas y rutas de admin
- Manejo automatico de sesion expirada (401)

### Panel de Administracion
- CRUD completo de productos (con upload de imagenes)
- CRUD completo de categorias
- CRUD completo de promociones
- Gestion de pedidos (confirmar, entregar, cancelar)
- Toggle de seguimiento de inventario

### Pedidos
- Creacion de pedidos con tipo de entrega (retiro/delivery)
- Historial de pedidos con estado y estado de pago
- Descuento automatico de stock al crear pedido
- Notificacion por email al cliente y al admin

## Accesibilidad

- `lang="es"` en HTML
- Skip navigation link
- `aria-live` en notificaciones toast
- `aria-label` en botones interactivos
- Respeto a `prefers-reduced-motion`
- HTML semantico (`nav`, `main`, `section`, `footer`)
- Labels asociados a todos los inputs de formulario
- `loading="lazy"` en imagenes

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build |
| `npm run lint` | Linting con ESLint |

## Backend

Esta aplicacion consume la API de [mi-drugstore-back](https://github.com/enzokippes/mi-drugstore-back).

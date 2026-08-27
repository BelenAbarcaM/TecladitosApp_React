# TecladitosApp

Aplicación web para gestionar un inventario de teclados mecánicos: permite registrar, consultar, filtrar, editar y eliminar teclados, con autenticación de usuarios mediante JWT.

## Descripción

TecladitosApp es un sistema CRUD pensado para llevar el control de un inventario de teclados mecánicos. Cada usuario debe iniciar sesión para acceder al sistema. Una vez autenticado, puede:

- Registrar nuevos teclados con marca, modelo, tipo de switch, tamaño, idioma, tipo de conexión, estado (disponible/agotado/reservado), precio, iluminación RGB y una foto del producto.
- Consultar el inventario completo en formato de tarjetas.
- Filtrar el inventario por tipo de switch y buscar por marca.
- Editar y eliminar teclados existentes.
- Ver los datos de su perfil de usuario en la página de inicio.

El backend está construido con Node.js, Express y MongoDB, y expone una API REST protegida con tokens JWT. El frontend es HTML, CSS y JavaScript, consumiendo la API mediante `fetch`.

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- Una base de datos [MongoDB](https://www.mongodb.com/) accesible (local o en la nube, por ejemplo MongoDB Atlas)

## Instalación

1. Clonar el repositorio:

```bash
git clone (https://github.com/BelenAbarcaM/TecladitosApp.git)
cd teclados
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias:

```env
PORT=3000
MONGODB_URI=<tu-cadena-de-conexión-a-mongodb>
JWT_SECRET=<una-clave-secreta-para-firmar-los-tokens>
```

> Ajustar los nombres de variable según lo que espere realmente `config/db.js` y `middleware/authMiddleware.js` en tu proyecto.

## Cómo ejecutar el proyecto

Para iniciar el servidor:

```bash
node server.js
```

O, si el `package.json` define el script correspondiente:

```bash
npm start
```

Por defecto el servidor queda escuchando en `http://localhost:3000` (o el puerto definido en `PORT`).

Una vez levantado el servidor, abrí el navegador en:

```
http://localhost:3000/login.html
```

para iniciar sesión o registrar un nuevo usuario.

## Ejemplos de uso

### Registro de usuario

```
POST /api/registro
Content-Type: application/json

{
  "nombre": "Ana Pérez",
  "correo": "ana@example.com",
  "contraseña": "********"
}
```

### Login

```
POST /api/login
Content-Type: application/json

{
  "correo": "ana@example.com",
  "contraseña": "********"
}
```

La respuesta incluye un token JWT que el frontend guarda en `localStorage` y envía en cada petición posterior como:

```
Authorization: Bearer <token>
```

### Registrar un teclado

```
POST /api/teclados
Authorization: Bearer <token>
Content-Type: application/json

{
  "marca": "Logitech",
  "modelo": "G Pro X",
  "tipoSwitch": "Rojo",
  "tamaño": "TKL",
  "idioma": "Español (Latino)",
  "conexion": "USB-C",
  "estado": "Disponible",
  "precio": 65000,
  "iluminacion": true,
  "imagen": "data:image/jpeg;base64,..."
}
```

### Consultar teclados con filtros

```
GET /api/teclados?tipoSwitch=Rojo&marca=logitech
Authorization: Bearer <token>
```

### Editar o eliminar un teclado

```
PUT /api/teclados/:id
DELETE /api/teclados/:id
Authorization: Bearer <token>
```

## Estructura de archivos

```
teclados/
├── server.js                     # Punto de entrada del servidor Express
├── config/
│   └── db.js                     # Conexión a MongoDB
├── controllers/
│   ├── authController.js         # Lógica de registro, login y perfil de usuario
│   └── entidadController.js      # Lógica CRUD de teclados
├── middleware/
│   └── authMiddleware.js         # Verificación de token JWT
├── models/
│   └── EntidadPrincipal.js       # Esquema de Mongoose para Teclado
│   └── Usuario.js                # Esquema de Mongoose para Usuario
├── routes/
│   ├── authRoutes.js             # Rutas de autenticación (/api/registro, /api/login, etc.)
│   └── entidadRoutes.js          # Rutas del CRUD de teclados (/api/teclados)
└── public/
    ├── login.html                # Página de inicio de sesión
    ├── index.html                # Página de bienvenida con datos del usuario
    ├── teclados.html             # Página principal de administración de teclados
    └── registro.html             # Página de registro
    └── css/
        └── estilos.css           # Estilos generales de la aplicación
    └── js/
        └── login.js              # Página de inicio de sesión
        └── index.js              # Página de bienvenida con datos del usuario
        └── entidad.js            # Página principal de administración de teclados
        └── registro.js           # Página de registro

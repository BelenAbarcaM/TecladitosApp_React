# TecladitosApp — Backend (Node/Express) + Frontend (React)

Este proyecto contiene las dos partes de la aplicación en una sola carpeta:

```text
TecladitosApp/
  backend/    -> API original de Node.js/Express (con CORS habilitado)
  frontend/   -> Nuevo frontend en React (Vite) que consume esa API
```

No se modificó la lógica ni las rutas del backend original, solo se habilitó
CORS en `backend/server.js` (agregando `app.use(cors())`, ya que la dependencia
`cors` ya venía instalada en el `package.json` original).

## 1. Ejecutar el backend (puerto 3000)

```bash
cd backend
npm install
node server.js
```

Recuerde tener su archivo `.env` con `MONGO` y `SECRETO`, igual que en el
proyecto original.

Debe quedar disponible en:

```text
http://localhost:3000
```

## 2. Ejecutar el frontend en React (puerto 5173)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra:

```text
http://localhost:5173
```

## 3. Estructura del frontend

```text
frontend/src/
  components/
    Navbar.jsx
    RutaProtegida.jsx
    TecladoCard.jsx
    TextField.jsx
    SelectField.jsx
  pages/
    Login.jsx
    Registro.jsx
    Inicio.jsx
    Teclados.jsx   -> CRUD completo (crear, listar, editar, eliminar)
    Filtros.jsx    -> página extra para filtrar por switch/marca
  services/
    api.js
  App.jsx
  main.jsx
  index.css
```

## 4. API utilizadas

- POST `/api/registro`
- POST `/api/login`
- GET `/api/usuario-logueado`
- GET `/api/teclados` (admite filtros `?tipoSwitch=` y `?marca=`)
- GET `/api/teclados/:id`
- POST `/api/teclados`
- PUT `/api/teclados/:id`
- DELETE `/api/teclados/:id`

Todas las rutas de teclados y `usuario-logueado` envían el JWT así:

```text
Authorization: Bearer TOKEN
```

El backend original usa los campos `correo` y `clave` (no `email`/`password`)
tanto en el registro como en el login, y así se respetó en `frontend/src/services/api.js`.

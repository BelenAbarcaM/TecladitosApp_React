# TecladitosApp — Backend (Node/Express) + Frontend (React)

Este proyecto contiene las dos partes de la aplicación en una sola carpeta:

```text
TecladitosApp/
  backend/    -> API original de Node.js
  frontend/   -> Nuevo frontend en React
```

## 1. Ejecutar el backend (puerto 3000)

```bash
cd backend
npm install
node server.js
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

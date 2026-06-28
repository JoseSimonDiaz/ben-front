# Ben FR

Frontend para la plataforma de orientación vocacional y test psicométrico Ben.
Modo oscuro completo, panel admin con login por API key, y asistente IA integrado.

## Stack

- **Vite 6** + **React 19**
- **Tailwind CSS v4** con `@tailwindcss/vite`
- **react-router-dom v7**

## Dev

```bash
npm run dev      # Servidor de desarrollo (default http://localhost:5173)
npm run build    # Build producción a dist/
npm run preview  # Preview del build producción
npm run lint     # oxlint
```

## Arquitectura

```
src/
├── api/              # Cliente HTTP + métodos de endpoint
├── config.js         # Variables de entorno centralizadas
├── constants/        # ROUTES, DOMAIN enums
├── context/          # AdminContext, QuizContext
├── hooks/            # useApi, useForm
├── components/       # Componentes compartidos
│   └── ui/           # Primitivas base (Input)
├── layouts/          # PublicLayout, AdminLayout
└── pages/            # 9 páginas
```

### Convenciones

- Sin `map`, `filter`, `forEach`, `for`, `while` — solo recursión
- Sin `if` anidados — guard clauses y early returns
- Todas las rutas via `ROUTES.*` desde `constants/routes.js`
- Todas las llamadas API via `src/api/index.js`
- Sin datos mock ni hardcodeados en páginas

## Variables de Entorno

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:3000/api/v1` | URL base del backend |

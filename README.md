# FinPay

FinPay es una aplicacion web mobile-first construida como SPA con React, TypeScript, Vite, Tailwind CSS y componentes estilo shadcn. El producto representa una billetera digital enfocada en autenticacion rapida, consulta de saldo, historial de movimientos y multiples flujos de pago y transferencia.

El proyecto funciona como una experiencia fintech autocontenida para demostracion de producto, validacion UX y evolucion funcional. La aplicacion opera con datos locales centralizados en el cliente y expone de forma clara los principales recorridos de usuario.

## Resumen Ejecutivo

- Tipo de aplicacion: SPA frontend.
- Dominio: fintech / billetera digital.
- Enfoque de interfaz: mobile-first, con layout centrado y navegacion inferior fija.
- Modelo operativo: frontend autocontenido con datos locales.
- Fuente de datos: `src/data/mock.ts`.
- Estado global actual: autenticacion en `src/store/auth.ts` con Zustand.
- Router: `BrowserRouter` en `src/App.tsx`.
- Build de salida: estatico en `dist/`.

## Alcance Funcional

La aplicacion incluye las siguientes capacidades funcionales:

- Inicio de sesion por huella simulada.
- Inicio de sesion por PIN de 6 digitos.
- Bloqueo temporal por intentos fallidos.
- Dashboard principal con saldo, accesos rapidos y movimientos recientes.
- Historial de transacciones con busqueda y filtros.
- Vista de detalle de transaccion con copiar, compartir y descargar.
- Flujo de recuperacion de acceso por correo simulado.
- Centro de ayuda con FAQ y acciones de contacto.
- Perfil y cierre de sesion.
- Pantalla de seguridad con accesos a proteccion de cuenta.
- Pantalla de configuracion con preferencias generales.
- Pago por celular.
- Pago por QR.
- Pago de servicios.
- Pago a universidades.
- Transferencia a bancos nacionales.
- Transferencia internacional con calculo de tipo de cambio y comision.

## Credenciales y Comportamiento Demo

- PIN valido de acceso: `123456`.
- La verificacion biometrica es simulada por interfaz; no usa APIs biometricas reales.
- Tras 5 intentos fallidos, la cuenta queda bloqueada por 5 minutos.
- El estado de autenticacion es en memoria. Si se recarga la pagina, el estado se reinicia.

## Mapa de Rutas

| Ruta | Acceso | Descripcion |
| --- | --- | --- |
| `/` | Publica | Login con huella simulada o PIN. |
| `/recovery` | Publica | Recuperacion de acceso por correo. |
| `/help` | Publica | Centro de ayuda y soporte. |
| `/home` | Protegida | Inicio, saldo, acciones rapidas y movimientos recientes. |
| `/history` | Protegida | Historial con busqueda y filtros. |
| `/history/:id` | Protegida | Detalle de transaccion. |
| `/pay/phone` | Protegida | Pago o envio por numero de celular. |
| `/pay/qr` | Protegida | Pago por QR con escaneo simulado. |
| `/pay/services` | Protegida | Pago de servicios y empresas. |
| `/pay/universities` | Protegida | Pago a universidades por concepto. |
| `/pay/banks` | Protegida | Transferencia bancaria nacional. |
| `/pay/international` | Protegida | Transferencia internacional. |
| `/profile` | Protegida | Perfil del usuario. |
| `/security` | Protegida | Seguridad y proteccion de cuenta. |
| `/settings` | Protegida | Configuracion general. |
| `*` | Publica | Pantalla 404. |

Las rutas protegidas se controlan desde `ProtectedRoute` dentro de `src/App.tsx` y dependen de `useAuthStore()`.

## Flujos de Pago y Reglas de Negocio Actuales

Todos los flujos locales siguen una estructura de pasos basada en estado local de pantalla:

- `form`
- `summary`
- `biometric`
- `processing`
- `receipt`

La pantalla internacional usa una maquina de estados propia mas amplia:

- `entry`
- `countries`
- `banks`
- `details`
- `summary`
- `biometric`
- `processing`
- `receipt`

### Reglas por flujo

| Flujo | Regla principal | Verificacion adicional | Comision |
| --- | --- | --- | --- |
| Pago por celular | Numero de 9 digitos, monto mayor a 0, saldo suficiente, maximo `S/ 5,000.00` | Huella si el monto es `>= S/ 500.00` | Gratis |
| Pago por QR | Escaneo simulado, monto mayor a 0, saldo suficiente, maximo `S/ 5,000.00` | Huella si el monto es `>= S/ 500.00` | Gratis |
| Pago de servicios | Servicio + empresa + referencia + monto valido + saldo suficiente | Huella si el monto es `>= S/ 500.00` | Gratis |
| Pago a universidades | Universidad + concepto + codigo de alumno + saldo suficiente, maximo `S/ 5,000.00` | No exige huella en el flujo actual | Gratis |
| Bancos nacionales | Banco + destinatario + numero de cuenta + saldo suficiente, maximo `S/ 5,000.00` | Huella si el monto es `>= S/ 1,000.00` | `S/ 3.50` desde `S/ 1,000.00` |
| Transferencia internacional | Pais + banco + destinatario + cuenta/IBAN + monto valido + saldo suficiente | Siempre exige huella antes de enviar | Variable por banco destino |

### Transferencia internacional

El flujo internacional es el mas completo del proyecto actual y contempla:

- Seleccion de pais destino.
- Seleccion de banco segun pais.
- Visualizacion de moneda destino, SWIFT y tipo de cambio.
- Calculo bidireccional entre monto enviado en `PEN` y monto recibido en moneda extranjera.
- Comision del banco destino aplicada sobre el monto recibido.
- Actualizacion simulada de cotizacion.
- Estado final de comprobante con operacion registrada y abono pendiente de confirmacion externa.

Paises disponibles hoy:

- Estados Unidos (`USD`)
- Espana (`EUR`)
- Mexico (`MXN`)
- Reino Unido (`GBP`)

## Arquitectura Tecnica

## Frontend

- React 18.
- TypeScript.
- Vite 5 con `@vitejs/plugin-react-swc`.
- React Router DOM 6.
- Zustand para autenticacion.
- Tailwind CSS 3.
- shadcn/Radix para primitivas UI.
- Lucide React para iconografia.

## Organizacion de la aplicacion

- Entrada principal: `src/main.tsx`.
- Router y proteccion de rutas: `src/App.tsx`.
- Layout compartido: `src/components/layout/AppLayout.tsx`.
- Navegacion inferior: `src/components/layout/BottomNav.tsx`.
- Componentes fintech: `src/components/fintech/*`.
- Componentes UI base: `src/components/ui/*`.
- Datos mock: `src/data/mock.ts`.
- Tipos de dominio: `src/types/index.ts`.
- Estado de autenticacion: `src/store/auth.ts`.
- Helpers de formato: `src/lib/format.ts` y `src/lib/utils.ts`.

## Patrones actuales

- Estado global acotado: autenticacion en Zustand.
- Estado de negocio por pantalla: cada flujo de pago controla su propio `step` localmente.
- Datos de experiencia: se importan directamente desde `src/data/mock.ts`.
- Navegacion, validaciones y reglas de interfaz resueltas desde el cliente.
- Componentes reutilizables para resumen, verificacion biometrica y comprobantes.

## Estructura del Proyecto

```text
finpay/
|-- public/
|   |-- favicon.png
|   `-- robots.txt
|-- src/
|   |-- components/
|   |   |-- fintech/
|   |   |-- layout/
|   |   `-- ui/
|   |-- data/
|   |-- hooks/
|   |-- lib/
|   |-- pages/
|   |-- store/
|   |-- test/
|   |-- types/
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- components.json
|-- eslint.config.js
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
|-- tsconfig.app.json
|-- vite.config.ts
`-- vitest.config.ts
```

## UI, Layout y Design System

- La aplicacion esta optimizada primero para movil.
- `AppLayout` centra el contenido y anade una navegacion inferior fija cuando `showNav` es `true`.
- Los tokens visuales viven en `src/index.css` y `tailwind.config.ts`.
- El proyecto ya define las utilidades reutilizables:
  - `fintech-gradient`
  - `fintech-gradient-light`
  - `fintech-shadow`
  - `fintech-shadow-lg`
  - `safe-top`
  - `safe-bottom`
- La tipografia principal es `Inter`, cargada desde Google Fonts en `src/index.css`.
- El sistema de estilos contempla soporte de tema oscuro mediante la clase `.dark`.

## Fuente de Datos y Tipos

La fuente de verdad de negocio actual es `src/data/mock.ts`. Desde ahi se alimentan:

- Cuenta principal del usuario.
- Historial de transacciones.
- Contactos frecuentes.
- Catalogo de servicios.
- Empresas por servicio.
- Universidades y conceptos.
- Bancos nacionales.
- Paises y bancos internacionales con tasas y comisiones.

Los tipos de dominio estan centralizados en `src/types/index.ts`:

- `Account`
- `Transaction`
- `PaymentRecipient`
- `Service`
- `Company`
- `University`
- `InternationalTransferBank`
- `InternationalTransferCountry`
- `PaymentStep`
- `PaymentData`

## Autenticacion y Seguridad

El flujo de acceso se gestiona desde `src/store/auth.ts` y `src/pages/Login.tsx`, con estas reglas de interfaz:

- Autenticacion por PIN o huella simulada.
- PIN de acceso para la demo: `123456`.
- Bloqueo temporal tras 5 intentos fallidos.
- Duracion de bloqueo: 5 minutos.
- Logout mediante limpieza de `isAuthenticated`.
- Estado de sesion administrado en memoria durante la experiencia local.

Pantallas relacionadas:

- `src/pages/Login.tsx`
- `src/pages/Recovery.tsx`
- `src/pages/Security.tsx`

## Requisitos Locales

- Node.js instalado.
- npm disponible.
- `package-lock.json` es la fuente de verdad para dependencias.

La ejecucion local no requiere variables de entorno.

## Instalacion

```bash
npm install
```

## Ejecucion en Desarrollo

```bash
npm run dev
```

Configuracion actual del servidor Vite:

- Host: `::`
- Puerto: `8080`
- Overlay HMR: desactivado

## Scripts Disponibles

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la build de produccion en `dist/`. |
| `npm run build:dev` | Genera build usando modo development. |
| `npm run preview` | Sirve localmente la build generada. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |
| `npm run test` | Ejecuta Vitest en modo run. |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo. |
| `npx tsc -p tsconfig.app.json --noEmit` | Verificacion de tipos sin emitir archivos. |

## Testing y Calidad

Configuracion actual de pruebas:

- Framework: Vitest.
- Entorno: `jsdom`.
- Archivo de setup: `src/test/setup.ts`.
- Patron de tests: `src/**/*.{test,spec}.{ts,tsx}`.

Suite incluida en el repositorio:

- `src/test/auth.test.ts`

Los tests cubren:

- Login exitoso con PIN valido.
- Bloqueo de cuenta tras 5 intentos fallidos.
- Desbloqueo despues de expirar el tiempo de bloqueo.

El setup de test mockea `window.matchMedia`, lo cual es importante para componentes y comportamiento UI en `jsdom`.

## TypeScript, Alias y Lint

- Alias disponible: `@` apunta a `src`.
- Configuracion de app: `tsconfig.app.json`.
- Configuracion de Vite: `vite.config.ts`.
- Configuracion de ESLint: `eslint.config.js`.
- ESLint ignora `.agents` y `dist`.
- El proyecto usa `strict: false` en `tsconfig.app.json`.

## Build y Despliegue

Build de produccion:

```bash
npm run build
```

Vista previa local de build:

```bash
npm run preview
```

El resultado de build queda en `dist/` y puede desplegarse en cualquier hosting estatico compatible con SPA, por ejemplo:

- Vercel
- Netlify
- Cloudflare Pages
- Nginx
- S3 + CDN

### Requisito importante de despliegue

La aplicacion usa `BrowserRouter`, por lo que el servidor debe reescribir todas las rutas no estaticas hacia `index.html`. Sin esta regla, rutas como `/history/1` o `/pay/international` fallaran al refrescar la pagina.

## Checklist Recomendado Antes de Desplegar

```bash
npm run lint
npm run test
npx tsc -p tsconfig.app.json --noEmit
npm run build
```

## Referencia Rapida de Archivos Clave

| Archivo | Responsabilidad |
| --- | --- |
| `src/main.tsx` | Bootstrap de React. |
| `src/App.tsx` | Definicion de rutas y proteccion por autenticacion. |
| `src/store/auth.ts` | Estado de login, intentos fallidos y bloqueo temporal. |
| `src/data/mock.ts` | Datos de demo de toda la app. |
| `src/pages/PayInternational.tsx` | Flujo mas avanzado de transferencias. |
| `src/components/fintech/PaymentSummary.tsx` | Resumen transversal antes de confirmar pagos. |
| `src/components/fintech/ReceiptScreen.tsx` | Comprobante reutilizable. |
| `src/components/layout/AppLayout.tsx` | Shell principal y navegacion inferior. |
| `src/index.css` | Tokens visuales, utilidades fintech y estilos base. |
| `tailwind.config.ts` | Extensiones de tema y animaciones. |

## Licencia y Uso

Revise el esquema de licencia y politicas de uso que corresponda antes de distribuir el proyecto fuera del equipo.

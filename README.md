# FinPay

Aplicación web mobile-first de billetera digital construida con `Vite`, `React 18`, `TypeScript`, `Tailwind CSS`, `Radix UI` y `Zustand`.

FinPay simula una experiencia de pagos y transferencias desde una sola app: inicio de sesión, home con saldo, historial, pagos por celular, QR, servicios, universidades, bancos nacionales e internacionales, además de perfil, seguridad, configuración y ayuda.

## Demo funcional del proyecto

El proyecto funciona completamente en frontend y actualmente usa datos mock para representar:

- saldo y cuenta principal
- contactos frecuentes
- historial de movimientos
- empresas y servicios
- universidades y conceptos de pago
- bancos nacionales
- países, bancos y tipo de cambio para transferencias internacionales

No hay backend real ni integración con APIs externas.

## Stack

- `React 18`
- `TypeScript`
- `Vite 5`
- `Tailwind CSS 3`
- `Radix UI Toast`
- `Zustand`
- `Vitest`
- `ESLint`

## Principales funcionalidades

- login con PIN mock y acceso biométrico simulado
- bloqueo temporal por intentos fallidos
- pantalla principal con saldo, acciones rápidas y movimientos recientes
- historial agrupado por fecha con filtros y búsqueda
- detalle de movimiento con compartir y descargar
- pagos por celular
- pagos por QR
- pagos de servicios
- pagos a universidades
- transferencias a bancos nacionales
- transferencias internacionales con conversión bidireccional
- perfil, seguridad, configuración y centro de ayuda

## Autenticación mock

La autenticación es local y vive en `src/store/auth.ts`.

- PIN válido: `123456`
- verificación biométrica: simulada
- bloqueo: después de `5` intentos fallidos
- duración del bloqueo: `5` minutos

Las rutas internas principales están protegidas desde `src/App.tsx`.

## Rutas principales

Definidas en `src/App.tsx`.

- `/` login
- `/recovery` recuperación de acceso
- `/help` centro de ayuda
- `/home` inicio
- `/history` historial
- `/history/:id` detalle de movimiento
- `/pay/phone` pago por celular
- `/pay/qr` pago por QR
- `/pay/services` pago de servicios
- `/pay/universities` pago a universidades
- `/pay/banks` transferencia a bancos nacionales
- `/pay/international` transferencia internacional
- `/profile` perfil
- `/security` seguridad
- `/settings` configuración

## Estructura del proyecto

```text
src/
  components/
    fintech/      componentes de producto como resúmenes, recibos y tarjetas
    layout/       layout compartido, header y navegación inferior
    ui/           primitivas reutilizables
  data/           datos mock de cuenta, movimientos y catálogos
  hooks/          hooks compartidos
  lib/            utilidades generales
  pages/          pantallas y flujos principales
  store/          estado global con Zustand
  test/           pruebas con Vitest
  types/          tipos TypeScript compartidos
```

## Convenciones importantes

- El proyecto usa `npm` como flujo principal.
- `package-lock.json` es la fuente de verdad para instalaciones.
- El alias `@` apunta a `src`.
- La UI está pensada primero para mobile.
- La mayoría de flujos de pago siguen el patrón:
  - `form`
  - `summary`
  - `biometric` o `processing`
  - `receipt`

## Fuente de datos

Los datos mock se encuentran en `src/data/mock.ts`.

Desde ahí se alimentan:

- `mockAccount`
- `mockTransactions`
- `mockRecipients`
- `mockServices`
- `mockCompanies`
- `mockUniversities`
- `mockBanks`
- `mockInternationalTransferCountries`

Si necesitas cambiar comportamiento visible del producto, lo más probable es que ese archivo sea el primer lugar a revisar.

## Transferencia internacional

La pantalla internacional está en `src/pages/PayInternational.tsx`.

Características actuales:

- selección de país y banco destino
- tipo de cambio visible
- actualización de tipo de cambio simulada
- dos campos editables:
  - `Tú envías`
  - `Destinatario recibe`
- conversión bidireccional en tiempo real
- validación inline
- resumen persistente del débito
- estados visibles: pendiente, cargando, error y éxito

## Ayuda y UX

El proyecto incorpora mejoras orientadas a heurísticas de Nielsen:

- visibilidad del estado del sistema
- control y libertad del usuario
- consistencia de navegación y formato monetario
- prevención de errores en formularios principales
- ayuda contextual mediante `HelpCenter`

La auditoría aplicada está documentada en:

- `docs/nielsen-audit.md`

## Scripts disponibles

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
npm run preview
```

### Descripción rápida

- `npm run dev`: inicia Vite en desarrollo
- `npm run lint`: ejecuta ESLint sobre el proyecto
- `npm run test`: ejecuta Vitest una vez
- `npm run build`: genera la build de producción
- `npm run preview`: sirve la build localmente

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor:

```bash
npm run dev
```

3. Abre la URL local que muestre Vite.

## Verificación recomendada antes de cerrar cambios

```bash
npm run lint
npm run test
npm run build
```

## Testing

El proyecto usa `Vitest` con entorno `jsdom`.

Archivo importante:

- `src/test/setup.ts`

Pruebas actuales destacadas:

- `src/test/auth.test.ts`

Estas cubren el store de autenticación mock:

- login exitoso con PIN correcto
- bloqueo luego de 5 intentos fallidos
- desbloqueo tras vencer la ventana de bloqueo

## Componentes clave

- `AppLayout`: layout base de pantallas
- `PageHeader`: encabezado compartido con back y ayuda
- `BottomNav`: navegación inferior principal
- `BalanceCard`: saldo principal en home
- `PaymentSummary`: resumen previo a confirmar
- `BiometricVerify`: verificación biométrica simulada
- `ReceiptScreen`: comprobante reutilizable

## Formato monetario

La utilidad compartida está en:

- `src/lib/format.ts`

Ahí vive el formateo consistente de montos y símbolos de moneda.

## Estado global

Actualmente el único store global relevante es:

- `src/store/auth.ts`

Se usa para:

- autenticación
- intentos fallidos
- bloqueo temporal

## Notas de mantenimiento

- La app no persiste datos de negocio entre sesiones.
- La lógica de pagos está distribuida por pantalla, no centralizada en un único módulo.
- Si agregas una nueva pantalla, recuerda registrarla también en `src/App.tsx`.
- Si cambias el comportamiento base de la UI, revisa primero los componentes de `src/components/layout` y `src/components/fintech`.

## Estado actual del repositorio

Después de la limpieza reciente del proyecto:

- se eliminó soporte residual de Bun
- se simplificó la configuración de Vite
- se limpiaron tipos y mocks sin uso
- se endureció ESLint para detectar variables no usadas
- se dejó el proyecto validado con `lint`, `test` y `build`

## Licencia

No se ha definido una licencia específica en este repositorio.

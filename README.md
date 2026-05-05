# Data Plus

UI demo en React + Vite para una plataforma B2B de matchmaking entre empresas.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalacion

```bash
npm install
```

## Levantar el proyecto en local

Usá este comando:

```bash
npm run start
```

Tambien funciona:

```bash
npm run dev
```

Ambos scripts levantan Data Plus en `0.0.0.0:5173`, para que puedas abrirlo:

- en tu propia compu: [http://localhost:5173](http://localhost:5173)
- desde otros dispositivos de la misma red: `http://TU_IP_LOCAL:5173`

Cuando el servidor inicia, la consola muestra:

- la URL local
- una o mas URLs de red para abrirlo desde el celular, tablet u otra notebook

## Como entrar desde el celular

1. Asegurate de que la compu y el celular esten en la misma red Wi‑Fi.
2. Corré:

```bash
npm run start
```

3. Copiá la URL de red local que aparezca en la terminal. Ejemplo:

```text
http://192.168.0.24:5173
```

4. Abrila desde el navegador del celular.

Si no abre:

- verificá que ambos dispositivos esten en la misma red
- permití `Node.js` en el firewall de Windows para redes privadas
- revisá que el puerto `5173` no este bloqueado por antivirus o firewall

## Errores claros al iniciar

El script de arranque ahora muestra mensajes mas claros si algo falla.

### Puerto ocupado

Si el puerto `5173` ya esta en uso, vas a ver un mensaje indicando que el servidor no pudo iniciar.

Podés levantarlo en otro puerto asi:

```bash
PORT=4173 npm run start
```

En PowerShell, si lo necesitás para la sesion actual:

```powershell
$env:PORT=4173
npm run start
```

### Dependencias faltantes

Si falta `node_modules`, el script te va a indicar que primero tenés que correr:

```bash
npm install
```

## Desarrollo alternativo

Si querés correr Vite sin el wrapper de arranque:

```bash
npm run dev:vite
```

## Build de produccion

```bash
npm run build
```

## Preview de produccion

```bash
npm run preview
```

Por defecto el preview corre en:

```text
http://localhost:4173
```

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const host = '0.0.0.0';
const port = Number(process.env.PORT || 5173);
const viteBin = resolve(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

function getNetworkUrls() {
  const interfaces = networkInterfaces();

  return Object.values(interfaces)
    .flat()
    .filter(Boolean)
    .filter((entry) => entry.family === 'IPv4' && !entry.internal)
    .map((entry) => `http://${entry.address}:${port}`);
}

function checkPortAvailability(targetPort) {
  return new Promise((resolvePromise, rejectPromise) => {
    const server = net.createServer();

    server.once('error', (error) => {
      rejectPromise(error);
    });

    server.once('listening', () => {
      server.close(() => resolvePromise());
    });

    server.listen(targetPort, host);
  });
}

function printBootMessage() {
  console.log('');
  console.log('Data Plus se esta iniciando en modo local.');
  console.log(`Local: http://localhost:${port}`);

  const urls = getNetworkUrls();

  if (urls.length) {
    console.log('Red local:');
    urls.forEach((url) => console.log(`- ${url}`));
  } else {
    console.log('Red local: no se detecto una IP privada disponible en este equipo.');
  }

  console.log('');
}

function printFriendlyError(error) {
  console.error('');
  console.error('No se pudo iniciar el servidor de Data Plus.');

  if (error?.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya esta en uso.`);
    console.error(
      `Cerrá el proceso que lo esta usando o iniciá con otro puerto, por ejemplo: PORT=4173 npm run start`
    );
    return;
  }

  if (error?.code === 'EACCES') {
    console.error(`No hay permisos suficientes para usar el puerto ${port}.`);
    console.error('Probá con otro puerto: PORT=4173 npm run start');
    return;
  }

  console.error(error?.message || 'Ocurrio un error inesperado al levantar Vite.');
}

async function main() {
  if (!existsSync(viteBin)) {
    console.error('');
    console.error('No se encontro Vite en node_modules.');
    console.error('Ejecutá `npm install` antes de iniciar el proyecto.');
    process.exit(1);
  }

  try {
    await checkPortAvailability(port);
  } catch (error) {
    printFriendlyError(error);
    process.exit(1);
  }

  printBootMessage();

  const child = spawn(
    process.execPath,
    [viteBin, '--host', host, '--port', String(port), '--strictPort'],
    {
      cwd: projectRoot,
      stdio: 'inherit'
    }
  );

  const shutdown = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  child.on('error', (error) => {
    printFriendlyError(error);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(0);
    }

    if (code !== 0) {
      console.error('');
      console.error(`El servidor se cerro con codigo ${code}. Revisá el error mostrado arriba.`);
    }

    process.exit(code ?? 0);
  });
}

main();

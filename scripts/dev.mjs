import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startPreview } from './preview.mjs';

// Angular's dev server serves one locale at a time. Watch both static builds so
// the language switch works on one local origin, just as it will when hosted.
const root = fileURLToPath(new URL('../', import.meta.url));
const cli = fileURLToPath(new URL('../node_modules/@angular/cli/bin/ng.js', import.meta.url));
const builder = spawn(
  process.execPath,
  [cli, 'build', '--configuration', 'development', '--localize', '--watch'],
  { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] },
);
let server;
builder.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  if (!server && chunk.toString().includes('Application bundle generation complete')) {
    server = startPreview(Number(process.env.PORT || 4200));
    console.log('Both languages rebuild on changes. Refresh the browser after each rebuild.');
  }
});
const stop = () => {
  builder.kill();
  server?.close();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
builder.on('exit', (code) => {
  server?.close();
  process.exitCode = code ?? 0;
});

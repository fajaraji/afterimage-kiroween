import { spawn } from 'node:child_process';

const jobs = [
  ['api', ['run', 'dev', '-w', '@afterimage/api']],
  ['web', ['run', 'dev', '-w', '@afterimage/web']],
];
const processes = jobs.map(([name, args]) => {
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
  child.on('error', (err) => console.error(`[${name}] spawn error:`, err.message));
  return child;
});
function shutdown() {
  for (const child of processes) if (!child.killed) child.kill('SIGTERM');
}
process.on('SIGINT', () => { shutdown(); process.exit(0); });
process.on('SIGTERM', () => { shutdown(); process.exit(0); });

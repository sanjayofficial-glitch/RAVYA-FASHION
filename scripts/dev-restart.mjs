/**
 * Safe dev-server restart: kills any process on ports 3000-3002,
 * wipes .next (the source of "reading 'call'" chunk corruption when
 * two servers collide), and starts exactly one dev server on :3000.
 */
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const PORTS = [3000, 3001, 3002];
const isWin = process.platform === 'win32';

for (const port of PORTS) {
  try {
    const out = execSync(`netstat -ano | grep ":${port}" | grep LISTENING`, { encoding: 'utf8' });
    const pids = [...new Set(out.trim().split('\n').map((l) => l.trim().split(/\s+/).pop()).filter(Boolean))];
    for (const pid of pids) {
      try {
        execSync(isWin ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`);
        console.log(`killed stale server on :${port} (pid ${pid})`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* port free */
  }
}

rmSync('.next', { recursive: true, force: true });
console.log('.next cleaned');
console.log('starting dev server on http://localhost:3000 ...');
execSync('pnpm exec next dev --turbopack -p 3000', { stdio: 'inherit' });

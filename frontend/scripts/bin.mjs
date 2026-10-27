#!/usr/bin/env node
/**
 * Runs a dev-tool's JS entry point directly with Node.
 *
 * Why: on Windows, npm's `.cmd` shims break when the project path contains
 * characters such as `&` (e.g. "D:\Loom & Layer"). Resolving the package's
 * `bin` and spawning `node <entry>` works on every OS and path.
 *
 *   node scripts/bin.mjs vite build
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const PACKAGE_FOR_BIN = { tsc: 'typescript' };
const [bin, ...args] = process.argv.slice(2);
if (!bin) {
  console.error('Usage: node scripts/bin.mjs <bin> [...args]');
  process.exit(1);
}
const pkgName = PACKAGE_FOR_BIN[bin] ?? bin;

function findPackageDir(name) {
  let dir = process.cwd();
  while (true) {
    const candidate = path.join(dir, 'node_modules', name);
    if (existsSync(path.join(candidate, 'package.json'))) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const pkgDir = findPackageDir(pkgName);
if (!pkgDir) {
  console.error(`Cannot find package "${pkgName}". Run \`npm install\` first.`);
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
const rel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[bin];
if (!rel) {
  console.error(`Package "${pkgName}" has no bin named "${bin}".`);
  process.exit(1);
}

const child = spawn(process.execPath, [path.join(pkgDir, rel), ...args], { stdio: 'inherit' });
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));

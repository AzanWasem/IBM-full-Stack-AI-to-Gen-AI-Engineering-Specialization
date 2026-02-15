import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await copyFile('index.js', 'dist/index.js');

console.log('Build complete: dist/index.html');

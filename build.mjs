import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

for (const file of ['index.html', 'styles.css', 'script.js']) {
  cpSync(file, `dist/${file}`);
}

for (const directory of ['public', 'images']) {
  cpSync(directory, `dist/${directory}`, { recursive: true });
}
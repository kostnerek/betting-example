import * as fs from 'fs';
import * as path from 'path';

const typesDir = path.join(__dirname, '..', 'libs/common/src', 'types');
const indexPath = path.join(typesDir, 'index.ts');

const files = fs
  .readdirSync(typesDir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
  .map((file) => file.replace('.ts', ''));

const exportsPaths = files
  .map((file) => `export * from './${file}';`)
  .join('\n');

fs.writeFileSync(indexPath, exportsPaths + '\n');

console.log(`Generated index.ts with ${files.length} exports`);

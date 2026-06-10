const fs = require('fs');
const path = require('path');

const dir = './src/environments';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const content = `export const environment = {
  production: true,
  anthropicApiKey: '${process.env.ANTHROPIC_API_KEY || ''}'
};`;

fs.writeFileSync(path.join(dir, 'environment.ts'), content);
console.log('environment.ts généré avec succès');
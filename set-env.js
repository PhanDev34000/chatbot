const fs = require('fs');
const content = `export const environment = {
  production: true,
  anthropicApiKey: '${process.env.ANTHROPIC_API_KEY || ''}'
};`;
fs.writeFileSync('./src/environments/environment.ts', content);
const fs = require('fs');

const envProdFileContent = `export const environment = {
  production: true,
  googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}'
};`;

fs.writeFileSync('./src/environments/environment.prod.ts', envProdFileContent);
console.log('✅ environment.prod.ts generated successfully!');

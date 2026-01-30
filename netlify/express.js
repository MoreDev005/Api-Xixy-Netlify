// netlify/apiserverless.js
const serverless = require('serverless-http');
const app = require('../index.js'); // Mengimpor aplikasi Express
module.exports.handler = serverless(app); // Ekspor fungsi serverless

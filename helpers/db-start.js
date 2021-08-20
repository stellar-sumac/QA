const { loadSchema } = require('../database/index');

console.log('Initializing Database...');
const start = performance.now();
loadSchema();
const stop = performance.now();

console.log(`Database Initialized at: ${stop - start}`);

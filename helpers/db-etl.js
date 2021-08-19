const etl = require('../data/etl/index');

console.log('Loading Database From CSV...');
const start = performance.now();
etl();
const stop = performance.now();

console.log(`Database Loaded At: ${stop - start}`);

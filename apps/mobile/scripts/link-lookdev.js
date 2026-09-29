const fs = require('fs');
const path = require('path');

const link = path.join(__dirname, '..', 'lookdev');
const target = path.resolve(__dirname, '../../../docs/reference/ui/lookdev');

if (!fs.existsSync(target)) {
  console.error('Lookdev folder not found:', target);
  process.exit(1);
}

if (fs.existsSync(link)) {
  process.exit(0);
}

fs.symlinkSync(target, link, 'junction');
console.log('Linked', link, '->', target);

const { executeQuery } = require('./src/lib/db');

async function checkInvoiceTable() {
  try {
    const [rows] = await executeQuery('DESCRIBE invoice');
    console.log('Invoice table structure:');
    rows.forEach(row => {
      console.log(`${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : ''} ${row.Default ? `DEFAULT ${row.Default}` : ''}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkInvoiceTable();

const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/invoices', express.static(path.join(__dirname, '../public/invoices')));

const invoiceRoutes = require('./routes/invoice');
app.use('/api', invoiceRoutes);

app.get('/', (req, res) => {
  res.send('Factura API est en ligne 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Factura tourne sur http://localhost:${PORT}`);
});

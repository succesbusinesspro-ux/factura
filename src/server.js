const express = require('express');
const path = require('path');

const app = express();

// Pour lire le JSON envoyé dans les requêtes
app.use(express.json());

// Rendre le dossier public accessible
app.use('/invoices', express.static(path.join(__dirname, '../public/invoices')));

// Route de test
app.get('/', (req, res) => {
  res.send('Factura API est en ligne 🚀');
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Factura tourne sur http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const { generateInvoicePdf } = require('../services/pdfService');

router.post('/invoice', async (req, res) => {
  try {
    const { company, customer, document, items } = req.body;

    if (!company || !customer || !document || !items) {
      return res.status(400).json({
        success: false,
        error: 'Champs manquants : company, customer, document, items'
      });
    }

    const url = await generateInvoicePdf(company, customer, document, items);

    res.json({
      success: true,
      pdf_url: url
    });

  } catch (error) {
    console.error('Erreur génération PDF :', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne lors de la génération du PDF'
    });
  }
});

module.exports = router;

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');

async function generateInvoicePdf(company, customer, document, items) {
  // Calcul des lignes
  const itemsWithTotal = items.map(i => ({
    ...i,
    line_total: i.quantity * i.unit_price
  }));

  const subtotal = itemsWithTotal.reduce((sum, i) => sum + i.line_total, 0);
  const discount = document.discountPercent ? subtotal * (document.discountPercent / 100) : 0;
  const total = subtotal - discount;

  // Charger le template HTML
  const templateName = document.type.toLowerCase() === "devis" ? "quote" : "invoice";
const templatePath = path.join(__dirname, `../../templates/${templateName}.hbs`);
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateHtml);

  const html = template({
    company,
    customer,
    document,
    items: itemsWithTotal,
    subtotal,
    total
  });

  // Lancer Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBytes = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
  });

  await browser.close();

  // Sauvegarde du PDF
  const filename = `invoice-${document.reference}.pdf`;
  const dir = path.join(__dirname, '../../public/invoices');
  const filePath = path.join(dir, filename);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, pdfBytes);

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/invoices/${filename}`;
}

module.exports = { generateInvoicePdf };

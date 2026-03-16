const axios = require("axios");

async function sendWhatsAppMessage(pdfUrl, customerPhone) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  const payload = {
    messaging_product: "whatsapp",
    to: customerPhone,
    type: "text",
    text: {
      body: `Bonjour 👋\n\nVoici votre document : ${pdfUrl}\n\nMerci pour votre confiance.`
    }
  };

  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
}

module.exports = { sendWhatsAppMessage };

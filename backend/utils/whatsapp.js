const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'; // Twilio sandbox number

const isTwilioConfigured = accountSid && authToken && !accountSid.includes('your_account_sid');

let client;
if (isTwilioConfigured) {
  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.error('Error initializing Twilio client:', error);
  }
}

/**
 * Sends a WhatsApp invoice for a given order
 * @param {Object} order - The order object
 */
async function sendWhatsAppInvoice(order) {
  if (!order || !order.customer_phone) return;

  // Format the phone number to E.164. Assuming India (+91) if 10 digits.
  let phone = order.customer_phone.replace(/\D/g, '');
  if (phone.length === 10) {
    phone = `+91${phone}`;
  } else if (!phone.startsWith('+')) {
    phone = `+${phone}`;
  }

  // Construct message
  let itemsList = order.items.map(i => `• ${i.name} x${i.qty} - ₹${i.price * i.qty}`).join('\n');
  
  const messageBody = `
🧾 *Goret's Café - Order Invoice*
Order ID: ${order.id}
Status: *${order.status.toUpperCase()}*

*Items:*
${itemsList}

Subtotal: ₹${order.subtotal}
GST (5%): ₹${order.tax}
*Total Paid: ₹${order.total}*

Mode: ${order.dining_mode === 'dine-in' ? `Dine In (Table ${order.table_number || 'N/A'})` : 'Takeaway'}
Payment: ${order.payment_method.toUpperCase()}

Thank you for choosing Goret's Café!
  `.trim();

  if (!isTwilioConfigured || !client) {
    console.log('\n--- MOCK WHATSAPP MESSAGE ---');
    console.log(`To: whatsapp:${phone}`);
    console.log(messageBody);
    console.log('-----------------------------\n');
    console.log('⚠️ Twilio is not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env to send real messages.');
    return;
  }

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${phone}`
    });
    console.log(`WhatsApp message sent! SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
  }
}

module.exports = {
  sendWhatsAppInvoice
};

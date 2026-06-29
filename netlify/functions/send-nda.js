const nodemailer = require('nodemailer');

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  var user = process.env.GMAIL_USER;
  var pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured: GMAIL_USER / GMAIL_APP_PASSWORD missing.' }) };
  }

  var payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) }; }

  var to = (payload.to || '').trim();
  var name = (payload.name || '').trim();
  var date = (payload.date || '').trim();
  var filename = (payload.filename || 'REVEL-NDA.pdf').trim();
  var pdfBase64 = payload.pdfBase64;

  if (!pdfBase64) return { statusCode: 400, body: JSON.stringify({ error: 'Missing PDF data.' }) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid recipient email.' }) };

  var from = process.env.MAIL_FROM || ('REVEL NDA <' + user + '>');
  var companyCopy = (process.env.COMPANY_COPY_EMAIL || '').trim();
  var ccList = (companyCopy && companyCopy.toLowerCase() !== to.toLowerCase()) ? [companyCopy] : [];

  var html =
    '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a">' +
    '<p>Thank you — your signed Non-Disclosure Agreement is attached.</p>' +
    '<table style="border-collapse:collapse">' +
    '<tr><td style="padding:2px 12px 2px 0;color:#666">Name</td><td><b>' + esc(name) + '</b></td></tr>' +
    '<tr><td style="padding:2px 12px 2px 0;color:#666">Email</td><td>' + esc(to) + '</td></tr>' +
    '<tr><td style="padding:2px 12px 2px 0;color:#666">Date</td><td>' + esc(date) + '</td></tr>' +
    '</table>' +
    '<p>The signed PDF is attached for your records.</p>' +
    '<p style="color:#888;font-size:12px">REVEL Studios, Inc. &amp; REVEL Robotics s.r.o.</p>' +
    '</div>';

  try {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: user, pass: pass }
    });

    var info = await transporter.sendMail({
      from: from,
      to: to,
      cc: ccList,
      subject: 'Signed NDA — ' + (name || 'Recipient'),
      html: html,
      attachments: [{ filename: filename, content: pdfBase64, encoding: 'base64', contentType: 'application/pdf' }]
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, id: info.messageId }) };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: e.message || 'Failed to send email.' }) };
  }
};

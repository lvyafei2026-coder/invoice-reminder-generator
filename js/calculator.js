function t() { return (window.__i18n && window.__i18n.t) || {}; }

function getData() {
  return {
    clientName: document.getElementById('clientName').value.trim() || 'Client',
    yourName: document.getElementById('yourName').value.trim() || 'Your Name',
    invoiceNumber: document.getElementById('invoiceNumber').value.trim() || 'INV-000',
    amount: document.getElementById('amount').value.trim() || '0.00',
    currency: document.getElementById('currency').value.trim() || 'USD',
    dueDate: document.getElementById('dueDate').value,
    tone: document.getElementById('tone').value,
    projectDesc: document.getElementById('projectDesc').value.trim(),
    paymentLink: document.getElementById('paymentLink').value.trim()
  };
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  const lang = (window.__i18n && window.__i18n.lang) || 'en';
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

function buildSubject(d) {
  const subj = t();
  const amountStr = d.currency + ' ' + d.amount;
  if (d.tone === 'friendly') {
    return (subj.subjFriendly || 'Quick check-in on invoice {inv}')
      .replace('{inv}', d.invoiceNumber);
  }
  if (d.tone === 'firm') {
    return (subj.subjFirm || 'Payment reminder: invoice {inv} ({amt} overdue)')
      .replace('{inv}', d.invoiceNumber)
      .replace('{amt}', amountStr);
  }
  if (d.tone === 'formal') {
    return (subj.subjFormal || 'Overdue invoice {inv} — action required')
      .replace('{inv}', d.invoiceNumber);
  }
  return (subj.subjFinal || 'Final notice: invoice {inv} ({amt})')
    .replace('{inv}', d.invoiceNumber)
    .replace('{amt}', amountStr);
}

function buildBody(d) {
  const tr = t();
  const amountStr = d.currency + ' ' + d.amount;
  const dueStr = formatDate(d.dueDate);
  const lines = [];

  // Greeting
  lines.push((tr.greetHi || 'Hi {name},').replace('{name}', d.clientName));
  lines.push('');

  if (d.tone === 'friendly') {
    lines.push((tr.bodyFriendly1 || 'I hope you are doing well. I wanted to gently check in on invoice {inv} for {amt}, which was due on {date}.').replace('{inv}', d.invoiceNumber).replace('{amt}', amountStr).replace('{date}', dueStr));
    lines.push('');
    lines.push((tr.bodyFriendly2 || 'If it has already been processed, please disregard this message — and thanks! If it slipped through, no worries at all; here is a fresh copy for your convenience.'));
    lines.push('');
    if (d.projectDesc) {
      lines.push((tr.bodyProject || 'For reference, this invoice covers: {desc}.').replace('{desc}', d.projectDesc));
      lines.push('');
    }
    if (d.paymentLink) {
      lines.push((tr.bodyPayLink || 'You can pay directly here: {link}').replace('{link}', d.paymentLink));
      lines.push('');
    }
    lines.push((tr.bodyFriendlyClose || 'Let me know if you need anything else from my end.'));
  } else if (d.tone === 'firm') {
    lines.push((tr.bodyFirm1 || 'I am following up on invoice {inv} for {amt}, which was due on {date} and is now overdue.').replace('{inv}', d.invoiceNumber).replace('{amt}', amountStr).replace('{date}', dueStr));
    lines.push('');
    lines.push((tr.bodyFirm2 || 'Could you confirm whether the invoice has been received and when we can expect payment? If there is an issue with the invoice itself, please let me know and I will address it right away.'));
    lines.push('');
    if (d.projectDesc) {
      lines.push((tr.bodyProject || 'For reference, this invoice covers: {desc}.').replace('{desc}', d.projectDesc));
      lines.push('');
    }
    if (d.paymentLink) {
      lines.push((tr.bodyPayLink || 'You can pay directly here: {link}').replace('{link}', d.paymentLink));
      lines.push('');
    }
    lines.push((tr.bodyFirmClose || 'A quick reply with an expected payment date would be much appreciated.'));
  } else if (d.tone === 'formal') {
    lines.push((tr.bodyFormal1 || 'This is a formal reminder that invoice {inv} for {amt} remains unpaid. The original due date was {date}, and it is now significantly overdue.').replace('{inv}', d.invoiceNumber).replace('{amt}', amountStr).replace('{date}', dueStr));
    lines.push('');
    lines.push((tr.bodyFormal2 || 'Per our agreement, payment terms are NET 30, and late payments may incur a fee of 1.5% per month as outlined in our contract. To avoid additional charges, please arrange payment within the next 7 business days.'));
    lines.push('');
    if (d.projectDesc) {
      lines.push((tr.bodyProject || 'For reference, this invoice covers: {desc}.').replace('{desc}', d.projectDesc));
      lines.push('');
    }
    if (d.paymentLink) {
      lines.push((tr.bodyPayLink || 'You can pay directly here: {link}').replace('{link}', d.paymentLink));
      lines.push('');
    }
    lines.push((tr.bodyFormalClose || 'If there is a dispute or any reason for the delay that I am not aware of, please contact me directly so we can resolve it.'));
  } else {
    lines.push((tr.bodyFinal1 || 'This is a final notice regarding invoice {inv} for {amt}, originally due on {date}.').replace('{inv}', d.invoiceNumber).replace('{amt}', amountStr).replace('{date}', dueStr));
    lines.push('');
    lines.push((tr.bodyFinal2 || 'Despite multiple reminders, payment has not been received. If payment is not arranged within 5 business days, I will have to suspend all ongoing work and may refer this invoice to a collections service.'));
    lines.push('');
    lines.push((tr.bodyFinal3 || 'I would much prefer to resolve this directly. Please contact me as soon as possible to confirm a payment date, or to discuss any issue preventing payment.'));
    lines.push('');
    if (d.paymentLink) {
      lines.push((tr.bodyPayLink || 'You can pay directly here: {link}').replace('{link}', d.paymentLink));
      lines.push('');
    }
  }

  lines.push((tr.bodyRegards || 'Best regards,'));
  lines.push(d.yourName);

  return lines.join('\n');
}

function generate() {
  const d = getData();
  const tr = t();

  const subject = buildSubject(d);
  const body = buildBody(d);

  document.getElementById('emailSubject').textContent = subject;
  document.getElementById('emailBody').textContent = body;
  document.getElementById('emailMeta').textContent = (tr.metaPrefix || 'To:') + ' ' + d.clientName + ' · ' + (tr.metaTone || 'Tone:') + ' ' + (tr['tone' + d.tone.charAt(0).toUpperCase() + d.tone.slice(1)] || d.tone);

  document.getElementById('result').classList.add('show');
}

function copyEmail() {
  const subject = document.getElementById('emailSubject').textContent;
  const body = document.getElementById('emailBody').textContent;
  const full = 'Subject: ' + subject + '\n\n' + body;
  navigator.clipboard.writeText(full).then(() => {
    const el = document.getElementById('copyCopied');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1800);
  }).catch(() => { prompt('Copy:', full); });
}

function buildShareUrl() {
  const params = new URLSearchParams();
  const d = getData();
  params.set('client', d.clientName);
  params.set('name', d.yourName);
  params.set('inv', d.invoiceNumber);
  params.set('amt', d.amount);
  params.set('cur', d.currency);
  if (d.dueDate) params.set('due', d.dueDate);
  if (d.tone !== 'friendly') params.set('tone', d.tone);
  if (d.projectDesc) params.set('proj', d.projectDesc);
  if (d.paymentLink) params.set('link', d.paymentLink);
  const base = window.location.origin + window.location.pathname;
  return base + '?' + params.toString();
}

function copyShareLink() {
  const url = buildShareUrl();
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareCopied');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1800);
  }).catch(() => { prompt('Copy:', url); });
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const map = { client:'clientName', name:'yourName', inv:'invoiceNumber', amt:'amount', cur:'currency', due:'dueDate', tone:'tone', proj:'projectDesc', link:'paymentLink' };
  for (const [k, id] of Object.entries(map)) {
    if (params.has(k)) {
      const el = document.getElementById(id);
      if (el) el.value = params.get(k);
    }
  }
}

window.generate = generate;
window.copyEmail = copyEmail;
window.copyShareLink = copyShareLink;
window.readUrlParams = readUrlParams;

document.addEventListener('DOMContentLoaded', function() {
  ['clientName','yourName','invoiceNumber','amount','currency','dueDate','tone','projectDesc','paymentLink'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', generate);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', generate);
  });
  readUrlParams();
  generate();
});
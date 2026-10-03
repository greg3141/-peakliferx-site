'use strict';
const companies = {
  gmac: {company:'GMAC Ventures', title:'Founder / CEO', email:'gregmccranie@gmail.com', phone:'727-385-3271', website:'', color:'#30343c', width:100, height:100},
  peakliferx: {company:'PeakLifeRx', title:'CEO / Owner', email:'greg@peakliferx.com', phone:'727-424-2221', website:'https://peakliferx.com', color:'#123e63', width:100, height:100},
  salesflo: {company:'SalesFlo', title:'CTO / Owner', email:'', phone:'727-424-2221', website:'https://salesflo.io', color:'#006b78', width:176, height:99, tagline:'AI Enabled Sales Velocity Platform'}
};
const drafts = Object.fromEntries(Object.entries(companies).map(([key,c]) => [key, {...c, name:'Greg McCranie'}]));
const fields = ['name','title','email','phone','website'];
let active = 'gmac';
let downloadUrl;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function safeWebsite(value) {
  if (!value.trim()) return '';
  try { const url = new URL(value); return ['http:','https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}
function signatureHtml(c,key) {
  const e = escapeHtml;
  const website = safeWebsite(c.website);
  const logo = `<img src="https://peakliferx.com/assets/signatures/${key}-v1.jpg" alt="${e(c.company)}" width="${c.width}" height="${c.height}" style="display:block;border:0;width:${c.width}px;height:${c.height}px;">`;
  const row = content => `<tr><td style="padding:0 0 5px;font:13px/18px Arial,Helvetica,sans-serif;color:#34465a;">${content}</td></tr>`;
  const link = (href,text) => `<a href="${e(href)}" style="color:${c.color};text-decoration:none;">${e(text)}</a>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;background-color:#ffffff;color:#152b42;"><tr><td style="vertical-align:top;padding:0 18px 0 0;border-right:2px solid ${c.color};">${website ? `<a href="${e(website)}">${logo}</a>` : logo}</td><td style="vertical-align:top;padding:0 0 0 18px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${row(`<strong style="font-size:19px;line-height:24px;color:#152b42;">${e(c.name)}</strong>`)}${row(`${e(c.title)}${c.title ? ' · ' : ''}<strong>${e(c.company)}</strong>`)}${c.tagline ? row(`<span style="font-size:11px;color:#53677b;">${e(c.tagline)}</span>`) : ''}${c.phone ? row(link('tel:'+c.phone.replace(/[^+\d]/g,''),c.phone)) : ''}${c.email ? row(link('mailto:'+c.email,c.email)) : ''}${website ? row(link(website,new URL(website).hostname.replace(/^www\./,''))) : ''}</table></td></tr></table>`;
}
function render() {
  const c = drafts[active];
  document.getElementById('preview').innerHTML = signatureHtml(c,active);
  document.getElementById('email-note').textContent = !c.email ? 'Add your SalesFlo email address above before copying, or leave it blank to omit email.' : active === 'peakliferx' ? 'PeakLifeRx email is carried over from your previous signature. Edit it above if needed.' : '';
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = URL.createObjectURL(new Blob([`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(c.company)} signature</title></head><body>${signatureHtml(c,active)}</body></html>`],{type:'text/html'}));
  const download = document.getElementById('download'); download.href = downloadUrl; download.download = active+'-signature.html';
  document.getElementById('status').textContent = '';
}
function choose(key) {
  active = key;
  fields.forEach(field => { document.getElementById(field).value = drafts[key][field]; });
  document.querySelectorAll('[data-company]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.company === key)));
  render();
}
document.querySelectorAll('[data-company]').forEach(button => button.addEventListener('click',() => choose(button.dataset.company)));
fields.forEach(field => document.getElementById(field).addEventListener('input',event => { drafts[active][field] = event.target.value; render(); }));
function selectSignature() {
  const range = document.createRange(); range.selectNodeContents(document.getElementById('preview'));
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
}
document.getElementById('select').addEventListener('click',() => { selectSignature(); document.getElementById('status').textContent = 'Press ⌘C on Mac or Ctrl+C on Windows, then paste into Gmail.'; });
document.getElementById('copy').addEventListener('click',async () => {
  const preview = document.getElementById('preview');
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('Rich clipboard unavailable');
    await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([signatureHtml(drafts[active],active)],{type:'text/html'}),'text/plain':new Blob([preview.innerText],{type:'text/plain'})})]);
    document.getElementById('status').textContent = 'Copied. Paste into the Gmail signature editor.';
  } catch {
    selectSignature();
    document.getElementById('status').textContent = 'Signature selected. Press ⌘C on Mac or Ctrl+C on Windows, then paste into Gmail.';
  }
});
choose('gmac');

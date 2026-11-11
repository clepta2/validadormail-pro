/**
 * worker.js
 * Cloudflare Worker Anycast para ValidadorMail Pro API (clepta3.workers.dev)
 */

import { ValidadorMailPro } from './validadormail-pro.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '');
    const wantsJson = url.searchParams.get('format') === 'json' || (request.headers.get('Accept') && request.headers.get('Accept').includes('application/json'));

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    if (pathname === '/health' || pathname === '/status') {
      return new Response(JSON.stringify({
        ok: true,
        service: 'ValidadorMail Pro API',
        version: '1.0.0',
        cluster: 'Cloudflare Edge Anycast (clepta3.workers.dev)',
        status: 'online',
        github: 'https://github.com/clepta2/validadormail-pro'
      }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Landing / Playground visual no navegador
    if (pathname === '' || pathname === '/' || pathname === '/demo' || pathname === '/index.html') {
      if (wantsJson) {
        return new Response(JSON.stringify({
          ok: true,
          service: 'ValidadorMail Pro API',
          version: '1.0.0',
          cluster: 'Cloudflare Edge Anycast (clepta3.workers.dev)',
          status: 'online',
          github: 'https://github.com/clepta2/validadormail-pro'
        }, null, 2), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
        });
      }
      return new Response(getHtmlDemo(), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (pathname === '/api/validar-email' || pathname === '/api/email/validar' || pathname === '/api/validar' || pathname === '/api/email') {
      let emailInput = url.searchParams.get('email') || url.searchParams.get('e') || url.searchParams.get('mail') || '';

      if (!emailInput && request.method === 'POST') {
        try {
          const body = await request.json();
          emailInput = body.email || body.mail || '';
        } catch (_) {}
      }

      if (!emailInput) {
        return new Response(JSON.stringify({
          ok: false,
          valido: false,
          erro: 'Informe o par?metro ?email=usuario@dominio.com',
          exemploVerdadeiro: '/api/validar-email?email=contato@google.com',
          exemploTroll: '/api/validar-email?email=suamaeaquelaursa@gmail.com',
          exemploDescartavel: '/api/validar-email?email=teste@yopmail.com'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
        });
      }

      const res = await ValidadorMailPro.validarCompleto(emailInput);
      return new Response(JSON.stringify({
        ok: res.valido,
        ...res,
        edge: 'clepta3.workers.dev'
      }, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    return new Response(JSON.stringify({
      ok: false,
      error: 'Endpoint n?o encontrado. Use /api/validar-email?email=...'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

function getHtmlDemo() {
  return "<!DOCTYPE html>\r\n<html lang=\"pt-BR\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>ValidadorMail Pro — Playground &amp; Demonstração</title>\r\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n  <link href=\"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap\" rel=\"stylesheet\">\r\n  <style>\r\n    :root {\r\n      --bg: #090d16;\r\n      --card: #111827;\r\n      --accent: #10b981;\r\n      --accent-glow: rgba(16, 185, 129, 0.25);\r\n      --text: #f9fafb;\r\n      --text-muted: #94a3b8;\r\n      --border: rgba(255,255,255,0.08);\r\n      --error: #ef4444;\r\n      --warning: #f59e0b;\r\n    }\r\n    * { box-sizing: border-box; margin: 0; padding: 0; }\r\n    body {\r\n      background: var(--bg);\r\n      color: var(--text);\r\n      font-family: 'Plus Jakarta Sans', sans-serif;\r\n      padding: 30px 20px;\r\n      display: flex;\r\n      flex-direction: column;\r\n      align-items: center;\r\n      min-height: 100vh;\r\n    }\r\n    .container { max-width: 820px; width: 100%; }\r\n    .badge {\r\n      display: inline-flex;\r\n      align-items: center;\r\n      gap: 6px;\r\n      padding: 6px 14px;\r\n      border-radius: 99px;\r\n      background: rgba(16,185,129,0.12);\r\n      border: 1px solid rgba(16,185,129,0.3);\r\n      color: var(--accent);\r\n      font-size: 12px;\r\n      font-weight: 700;\r\n      margin-bottom: 16px;\r\n    }\r\n    h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }\r\n    p.lead { color: var(--text-muted); font-size: 15px; margin-bottom: 28px; line-height: 1.6; }\r\n    .card {\r\n      background: var(--card);\r\n      border: 1px solid var(--border);\r\n      border-radius: 16px;\r\n      padding: 24px;\r\n      margin-bottom: 24px;\r\n      box-shadow: 0 10px 30px rgba(0,0,0,0.4);\r\n    }\r\n    .input-group { display: flex; gap: 12px; margin-bottom: 16px; }\r\n    input {\r\n      flex: 1;\r\n      background: #040711;\r\n      border: 1px solid var(--border);\r\n      border-radius: 10px;\r\n      padding: 14px 18px;\r\n      color: #fff;\r\n      font-size: 15px;\r\n      font-family: 'JetBrains Mono', monospace;\r\n      outline: none;\r\n      transition: border-color 0.2s;\r\n    }\r\n    input:focus { border-color: var(--accent); }\r\n    button {\r\n      background: var(--accent);\r\n      color: #040711;\r\n      font-weight: 700;\r\n      border: none;\r\n      border-radius: 10px;\r\n      padding: 0 24px;\r\n      font-size: 14px;\r\n      cursor: pointer;\r\n      transition: transform 0.1s, opacity 0.2s;\r\n    }\r\n    button:hover { opacity: 0.9; }\r\n    button:active { transform: scale(0.98); }\r\n    .quick-examples {\r\n      display: flex;\r\n      flex-wrap: wrap;\r\n      gap: 8px;\r\n      margin-bottom: 20px;\r\n    }\r\n    .quick-btn {\r\n      background: rgba(255,255,255,0.04);\r\n      border: 1px solid var(--border);\r\n      color: var(--text-muted);\r\n      border-radius: 8px;\r\n      padding: 6px 12px;\r\n      font-size: 12px;\r\n      font-weight: 600;\r\n      cursor: pointer;\r\n    }\r\n    .quick-btn:hover { color: #fff; border-color: var(--accent); }\r\n    .output-box {\r\n      background: #040711;\r\n      border: 1px solid var(--border);\r\n      border-radius: 12px;\r\n      padding: 18px;\r\n      font-family: 'JetBrains Mono', monospace;\r\n      font-size: 13px;\r\n      color: #38bdf8;\r\n      max-height: 420px;\r\n      overflow-y: auto;\r\n      white-space: pre-wrap;\r\n      line-height: 1.5;\r\n    }\r\n    footer {\r\n      color: var(--text-muted);\r\n      font-size: 13px;\r\n      margin-top: 20px;\r\n      text-align: center;\r\n    }\r\n    footer a { color: var(--accent); text-decoration: none; }\r\n  </style>\r\n</head>\r\n<body>\r\n  <div class=\"container\">\r\n    <div class=\"badge\">🛡️ RFC 5322 &bull; DNS MX 1.1.1.1 &bull; 10k Descartáveis &bull; Edge &lt;15ms</div>\r\n    <h1>ValidadorMail Pro</h1>\r\n    <p class=\"lead\">Auditoria profunda de e-mails em tempo real: checagem de servidores MX no DNS Anycast da Cloudflare, bloqueio de 10.180+ domínios descartáveis e detecção de e-mails trolls e zombeteiros.</p>\r\n\r\n    <div class=\"card\">\r\n      <div class=\"quick-examples\">\r\n        <button class=\"quick-btn\" onclick=\"testar('contato@google.com')\">🟢 Corporativo (Google)</button>\r\n        <button class=\"quick-btn\" onclick=\"testar('joao.silva@gmail.com')\">🟢 Gmail Real</button>\r\n        <button class=\"quick-btn\" onclick=\"testar('suamaeaquelaursa@gmail.com')\" style=\"color:var(--error)\">🔴 Troll / Fake</button>\r\n        <button class=\"quick-btn\" onclick=\"testar('pedro@yopmail.com')\" style=\"color:var(--warning)\">🟠 Descartável (Yopmail)</button>\r\n        <button class=\"quick-btn\" onclick=\"testar('marcos@gmai.com')\" style=\"color:#38bdf8\">🟡 Erro de Digitação (@gmai.com)</button>\r\n        <button class=\"quick-btn\" onclick=\"testar('teste@naoexiste99881122.com')\" style=\"color:var(--error)\">❌ Inexistente (NXDOMAIN)</button>\r\n      </div>\r\n\r\n      <div class=\"input-group\">\r\n        <input type=\"text\" id=\"emailInput\" placeholder=\"Digite o e-mail para auditar...\" value=\"suamaeaquelaursa@gmail.com\">\r\n        <button onclick=\"validar()\">Validar Agora</button>\r\n      </div>\r\n\r\n      <div class=\"output-box\" id=\"resultOutput\">Pronto para auditar. Digite um e-mail ou clique nos exemplos acima.</div>\r\n    </div>\r\n\r\n    <footer>\r\n      Código aberto no <a href=\"https://github.com/clepta2/validadormail-pro\" target=\"_blank\">GitHub (clepta2/validadormail-pro)</a>\r\n    </footer>\r\n  </div>\r\n\r\n  <script>\r\n    async function validar() {\r\n      const val = document.getElementById('emailInput').value.trim();\r\n      const out = document.getElementById('resultOutput');\r\n      out.innerText = 'Consultando servidores MX e blocklists na borda da Cloudflare...';\r\n      try {\r\n        const res = await fetch('/api/validar-email?email=' + encodeURIComponent(val));\r\n        const data = await res.json();\r\n        out.innerText = JSON.stringify(data, null, 2);\r\n      } catch (e) {\r\n        out.innerText = 'Erro: ' + e.message;\r\n      }\r\n    }\r\n\r\n    function testar(email) {\r\n      document.getElementById('emailInput').value = email;\r\n      validar();\r\n    }\r\n\r\n    validar();\r\n  </script>\r\n</body>\r\n</html>\r\n";
}

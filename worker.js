/**
 * worker.js
 * Cloudflare Worker Anycast para ValidadorMail Pro API (clepta3.workers.dev)
 */

import { ValidadorMailPro } from './validadormail-pro.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '');

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

    if (pathname === '/health' || pathname === '/status' || pathname === '') {
      return new Response(JSON.stringify({
        ok: true,
        service: 'ValidadorMail Pro API',
        version: '1.0.0',
        cluster: 'Cloudflare Edge Anycast (clepta3.workers.dev)',
        status: 'online',
        github: 'https://github.com/clepta2/validadormail-pro',
        docs: 'https://ponte.ozpro.com.br'
      }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
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
          erro: 'Informe o parâmetro ?email=usuario@dominio.com',
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
      error: 'Endpoint não encontrado. Use /api/validar-email?email=...'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

# 🛡️ ValidadorMail Pro

> **Documentação Oficial da API & SDK de Auditoria Profunda de E-mails.**  
> 🔒 **Atenção:** Este repositório destina-se exclusivamente à visualização de documentação técnica e integração do cliente SDK. O serviço de API em nuvem é operado através do nosso **Site de APIs (em breve)**. O acesso aos endpoints na borda requer obrigatoriamente uma **Chave de API (`x-api-key`)** ativa.

[![Status](https://img.shields.io/badge/Status-Cloudflare%20Edge%20API-success.svg)](#)
[![CI/CD Tests](https://github.com/clepta2/validadormail-pro/actions/workflows/test.yml/badge.svg)](https://github.com/clepta2/validadormail-pro/actions)
[![Padrão](https://img.shields.io/badge/Padrão-RFC%205322%20%26%20DNS%20MX-blue.svg)](#)
[![Autenticação](https://img.shields.io/badge/Autenticação-x--api--key%20Obrigatória-orange.svg)](#)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietária%20%2F%20Portal%20de%20APIs-red.svg)](LICENSE)

---

## 🔒 Acesso à API e Chaves

Para consumir esta API nos seus sistemas, cadastre-se no nosso **Site de APIs** para obter sua chave de acesso (`x-api-key`).

Todas as requisições aos endpoints em nuvem devem incluir a chave no cabeçalho:
```http
GET /api/validar-email?email=contato@google.com HTTP/1.1
Host: validadormail-pro-api.clepta3.workers.dev
x-api-key: SUA_CHAVE_DO_PORTAL
```

---

## 🚀 Instalação (NPM)

```bash
npm install validadormail-pro
```

---

## ⚡ Uso com o SDK Oficial

```javascript
import { ValidadorMailPro } from 'validadormail-pro';

// 1. Validação Instantânea em Memória RAM (0ms de latência)
const res = ValidadorMailPro.validarLocal('suamaeaquelaursa@gmail.com');

console.log(res.classificacao); // "suspeito"
console.log(res.score);         // 55
console.log(res.ehTrollOuFake); // true
console.log(res.motivos);       // ["Contém termo suspeito ou de teste ('suamae')"]

// 2. Validação Completa com Consulta DNS MX em Tempo Real (<15ms)
const resCompleto = await ValidadorMailPro.validarCompleto('contato@google.com');

console.log(resCompleto.classificacao);  // "verdadeiro"
console.log(resCompleto.score);          // 85
console.log(resCompleto.possuiMxValido); // true
console.log(resCompleto.servidoresMx);   // ["smtp.google.com"]
```

---

## 🌐 Endpoint Anycast Edge (Requer x-api-key)

* **Endpoint Cloudflare:** `GET https://validadormail-pro-api.clepta3.workers.dev/api/validar-email?email=...`
* **Cluster:** Cloudflare Anycast (`clepta3.workers.dev`)
* **Autenticação:** Header `x-api-key` ou `Authorization: Bearer <key>`
* **Latência:** `<15ms`

### Exemplo via cURL:
```bash
curl -X GET "https://validadormail-pro-api.clepta3.workers.dev/api/validar-email?email=contato@google.com" \
  -H "x-api-key: SUA_CHAVE_DO_PORTAL"
```

### Exemplo via cURL:
```bash
curl -X GET "https://validadormail-pro-api.clepta3.workers.dev/api/validar-email?email=suamaeaquelaursa@gmail.com"

# Validação em lote (Batch) — até 50 e-mails Pro ou 5 gratuitos
curl -X POST "https://validadormail-pro-api.clepta3.workers.dev/api/email/lote" \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_CHAVE_DO_PORTAL" \
  -d '{"emails": ["contato@google.com", "financeiro@empresa.com.br", "teste@tempmail.com"]}'
```

---

## 🛡️ Rate Limiting & Proteção de Cotas

- **Plano Gratuito:** até 60 req/min por isolate de borda.
- **Plano Pro / Enterprise (`x-api-key`):** até 300 req/min.
- Para higienização de bases e formulários massivos, utilize a rota de lote (`/api/email/lote`) para processar até 50 e-mails por chamada.
- O contador em memória do Worker é local por isolate e não representa uma cota diária global centralizada.

### Exemplo de Resposta JSON:
```json
{
  "ok": true,
  "valido": true,
  "entregavel": true,
  "score": 55,
  "classificacao": "suspeito",
  "email": "suamaeaquelaursa@gmail.com",
  "user": "suamaeaquelaursa",
  "dominio": "gmail.com",
  "tipoProvedor": "gratuito_popular",
  "servidoresMx": ["gmail-smtp-in.l.google.com"],
  "possuiMxValido": true,
  "ehDescartavel": false,
  "ehRoleBased": false,
  "ehTrollOuFake": true,
  "detalhesTroll": "Contém termo suspeito ou de teste ('suamae')",
  "motivos": [
    "Contém termo suspeito ou de teste ('suamae')"
  ],
  "edge": "clepta3.workers.dev"
}
```

---

## 📄 Licença

Distribuído sob licença MIT. Veja `LICENSE` para mais detalhes.

Copyright (c) 2026 clepta2

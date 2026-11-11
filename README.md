# 🛡️ ValidadorMail Pro

> **SDK & API Oficial de Auditoria Profunda de E-mails.**  
> Validação RFC 5322, consulta MX em tempo real via Cloudflare DoH (1.1.1.1 Anycast), detecção de mais de **10.180 provedores descartáveis** (Yopmail, TempMail) e detecção de e-mails **trolls e zombeteiros** (ex: `suamaeaquelaursa`).

[![npm version](https://img.shields.io/npm/v/validadormail-pro.svg)](https://www.npmjs.com/package/validadormail-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Edge Ready](https://img.shields.io/badge/Edge-Cloudflare%20Workers-orange.svg)](https://workers.cloudflare.com/)

---

## 🚀 Instalação (NPM)

```bash
npm install validadormail-pro
```

---

## ⚡ Uso Rápido (SDK em JavaScript / TypeScript)

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

## 🌐 Endpoint Público Anycast Edge

* **Endpoint Cloudflare:** `GET https://validadormail-pro-api.clepta3.workers.dev/api/validar-email?email=...`
* **Cluster:** Cloudflare Anycast (`clepta3.workers.dev`)
* **Latência:** `<15ms`
* **Formatos Aceitos:** `GET` ou `POST` (JSON)

### Exemplo via cURL:
```bash
curl -X GET "https://validadormail-pro-api.clepta3.workers.dev/api/validar-email?email=suamaeaquelaursa@gmail.com"
```

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

/**
 * test.js
 * Suíte de testes automatizados do ValidadorMail Pro
 */

import { ValidadorMailPro } from './validadormail-pro.js';

async function runTests() {
  console.log('=== TESTES DO VALIDADORMAIL PRO ===\n');

  const tests = [
    { email: 'contato@google.com', expectedClass: 'verdadeiro', shouldBeTroll: false },
    { email: 'joao.silva@gmail.com', expectedClass: 'verdadeiro', shouldBeTroll: false },
    { email: 'suamaeaquelaursa@gmail.com', expectedClass: 'suspeito', shouldBeTroll: true },
    { email: 'suamaeaquelaursa@tempmail.com', expectedClass: 'descartavel', shouldBeTroll: true },
    { email: 'pedro@yopmail.com', expectedClass: 'descartavel', shouldBeTroll: false },
    { email: 'marcos@gmai.com', expectedClass: 'verdadeiro', hasTypo: true },
    { email: 'teste123@hotmail.com', expectedClass: 'suspeito', shouldBeTroll: true },
    { email: 'asdfghjkl@yahoo.com', expectedClass: 'suspeito', shouldBeTroll: true }
  ];

  let passed = 0;

  for (const t of tests) {
    const res = await ValidadorMailPro.validarCompleto(t.email);
    console.log(`[TESTE] ${t.email}`);
    console.log(` -> Classificação: ${res.classificacao.toUpperCase()} (Score: ${res.score}/100)`);
    console.log(` -> Troll/Fake: ${res.ehTrollOuFake} ${res.detalhesTroll ? '(' + res.detalhesTroll + ')' : ''}`);
    console.log(` -> Descartável: ${res.ehDescartavel}`);
    if (res.sugestao) console.log(` -> Sugestão: ${res.sugestao}`);
    console.log(` -> Motivos: ${res.motivos.join(', ')}\n`);

    if (t.shouldBeTroll !== undefined && res.ehTrollOuFake !== t.shouldBeTroll) {
      console.error(`ERRO: Esperado troll=${t.shouldBeTroll}, recebido ${res.ehTrollOuFake}`);
    } else {
      passed++;
    }
  }

  console.log(`Todos os ${passed} testes executados com sucesso!`);

  // Testes de Lote do Worker
  console.log('\n--- Teste de Validação em Lote (Worker) ---');
  const { default: worker } = await import('./worker.js');
  const resLote = await worker.fetch(new Request('https://api.test/api/email/lote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails: ['contato@google.com', 'invalido@@email', 'suamaeaquelaursa@tempmail.com'] })
  }), {});
  const bodyLote = await resLote.json();
  console.assert(resLote.status === 200, 'Status do lote deve ser 200');
  console.assert(bodyLote.totalSolicitado === 3, 'Deve processar 3 e-mails');
  console.assert(bodyLote.totalValidos === 1, '1 e-mail válido');
  console.assert(bodyLote.totalInvalidos === 2, '2 e-mails inválidos ou de descarte');
  console.log('✅ Rota de lote de e-mails processou corretamente a rodada');

  const resExcesso = await worker.fetch(new Request('https://api.test/api/email/lote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails: Array(6).fill('teste@exemplo.com') })
  }), {});
  console.assert(resExcesso.status === 413, 'Excesso gratuito deve retornar 413');
  console.log('✅ Limite de tamanho de lote gratuito respeitado (413)');

  const resMetodo = await worker.fetch(new Request('https://api.test/api/email/lote'), {});
  console.assert(resMetodo.status === 405, 'GET em /api/email/lote deve retornar 405');
  console.log('✅ Método incorreto rejeitado');
}

runTests().catch(console.error);

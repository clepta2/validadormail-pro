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
}

runTests().catch(console.error);

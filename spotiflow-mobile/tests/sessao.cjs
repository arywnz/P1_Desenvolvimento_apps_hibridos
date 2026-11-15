const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./persistence.cjs');
test('sessao: restaura, rejeita token ausente, limpa logout e separa credencial', async () => {
  let saved = null, token = null;
  const storage = {
    get: async () => saved,
    set: async (_, v) => { saved = v; },
    remove: async () => { saved = null; },
  };
  const seguro = {
    salvar: async (_, v) => { token = v; },
    ler: async () => token,
    apagar: async () => { token = null; },
  };
  const s = load('src/services/sessao.ts', { './storage': { storage }, './seguro': seguro });
  const user = { id: '1', name: 'Teste', email: 'teste@example.com', plan: 'Gratuito', avatarUrl: '', token: 'nao-serializar' };
  await s.salvarSessao(user, 'segredo');
  assert.equal(JSON.stringify(saved).includes('segredo'), false);
  assert.equal(JSON.stringify(saved).includes('nao-serializar'), false);
  assert.equal((await s.restaurarSessao()).token, 'segredo');
  token = null;
  assert.equal(await s.restaurarSessao(), null);
  await s.salvarSessao(user, null);
  assert.equal((await s.restaurarSessao()).user.id, '1');
  await s.limparSessao();
  assert.equal(saved, null);
  assert.equal(token, null);
  seguro.salvar = async () => { throw Error('keychain'); };
  await assert.rejects(s.salvarSessao(user, 'segredo'));
  assert.equal(saved, null);
});

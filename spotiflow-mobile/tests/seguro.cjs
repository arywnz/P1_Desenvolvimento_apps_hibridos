const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./persistence.cjs');

test('credenciais usam SecureStore nativo e memoria na web', async () => {
  const calls = [];
  const native = {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1,
    setItemAsync: async (...args) => { calls.push(args); },
    getItemAsync: async () => 'token',
    deleteItemAsync: async (...args) => { calls.push(args); },
  };
  const platform = { OS: 'android' };
  const s = load('src/services/seguro.ts', {
    'expo-secure-store': native, 'react-native': { Platform: platform },
  });
  await s.salvar('access', 'token');
  assert.equal(await s.ler('access'), 'token');
  await s.apagar('access');
  assert.equal(calls.length, 2);
  platform.OS = 'web';
  await s.salvar('access', 'web-token');
  assert.equal(await s.ler('access'), 'web-token');
  await s.apagar('access');
  assert.equal(await s.ler('access'), null);
  assert.equal(calls.length, 2);
});

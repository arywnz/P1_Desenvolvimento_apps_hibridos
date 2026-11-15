const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

function load(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => {
    if (!(name in mocks)) throw new Error(name);
    return mocks[name];
  }, console, Date, Promise, Map, Set });
  return exports;
}
module.exports = { load };

test('storage: JSON, ausencia, corrupcao e falhas', async () => {
  const values = new Map();
  const backend = {
    getItem: async k => values.get(k) ?? null,
    setItem: async (k, v) => { values.set(k, v); },
    removeItem: async k => { values.delete(k); },
  };
  const s = load('src/services/storage.ts', { '@react-native-async-storage/async-storage': backend });
  await s.set('tema', { mode: 'dark' });
  assert.equal((await s.get('tema')).mode, 'dark');
  values.set('tema', '{');
  assert.equal(await s.get('tema'), null);
  await s.remove('tema');
  assert.equal(await s.get('tema'), null);
  backend.setItem = async () => { throw new Error('disk'); };
  await assert.rejects(s.set('tema', 'light'));
});

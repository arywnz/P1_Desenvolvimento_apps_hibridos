const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { load } = require('./persistence.cjs');
test('SQLite: isolamento, filtro literal, ordenacao e reabertura', async () => {
  const db = new DatabaseSync(':memory:');
  const adapter = {
    execAsync: async sql => db.exec(sql),
    runAsync: async (sql, ...args) => db.prepare(sql).run(...args),
    getAllAsync: async (sql, ...args) => db.prepare(sql).all(...args),
  };
  const mocks = { 'expo-sqlite': { openDatabaseAsync: async () => adapter } };
  const s = load('src/db/banco.ts', mocks);
  await s.salvarPlaylist('a', { id: '1', title: "Rock ' OR 1=1 --" });
  await s.salvarPlaylist('b', { id: '2', title: 'Outro' });
  assert.equal((await s.listarPlaylists('a')).length, 1);
  assert.equal((await s.listarPlaylists('a', "' OR 1=1 --")).length, 1);
  assert.equal((await s.listarPlaylists('a', 'inexistente')).length, 0);
  await s.registrarFaixa('a', { id: '1', title: 'Z', artist: 'Banda' });
  await s.registrarFaixa('a', { id: '2', title: 'A', artist: 'Banda' });
  assert.equal((await s.listarHistorico('a', '', 'titulo'))[0].title, 'A');
  assert.equal((await s.listarHistorico('b')).length, 0);
  const reopened = load('src/db/banco.ts', mocks);
  assert.equal((await reopened.listarPlaylists('a')).length, 1);
  db.close();
});

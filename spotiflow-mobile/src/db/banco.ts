import * as SQLite from 'expo-sqlite';
import type { Playlist, Track } from '../types/music';

let database: Promise<SQLite.SQLiteDatabase> | undefined;
async function banco() {
  if (!database) {
    database = (async () => {
      const db = await SQLite.openDatabaseAsync('spotiflow.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS playlists (
          user_id TEXT NOT NULL, id TEXT NOT NULL, title TEXT NOT NULL,
          payload TEXT NOT NULL, created_at INTEGER NOT NULL,
          PRIMARY KEY (user_id, id)
        );
        CREATE TABLE IF NOT EXISTS historico (
          user_id TEXT NOT NULL, id TEXT NOT NULL, title TEXT NOT NULL,
          artist TEXT NOT NULL, payload TEXT NOT NULL, played_at INTEGER NOT NULL,
          PRIMARY KEY (user_id, id)
        );
      `);
      return db;
    })().catch(error => { database = undefined; throw error; });
  }
  return database;
}

export async function salvarPlaylist(userId: string, playlist: Playlist) {
  const db = await banco();
  const { coverSource: _asset, ...data } = playlist;
  await db.runAsync(
    'INSERT OR REPLACE INTO playlists (user_id,id,title,payload,created_at) VALUES (?,?,?,?,?)',
    userId, playlist.id, playlist.title, JSON.stringify(data), Date.now(),
  );
}

export async function listarPlaylists(userId: string, filtro = '', ordem: 'recentes' | 'titulo' = 'recentes'): Promise<Playlist[]> {
  const db = await banco();
  const order = ordem === 'titulo' ? 'title COLLATE NOCASE ASC' : 'created_at DESC, id DESC';
  const rows = await db.getAllAsync<{ payload: string }>(
    'SELECT payload FROM playlists WHERE user_id = ? AND instr(lower(title), lower(?)) > 0 ORDER BY ' + order,
    userId, filtro,
  );
  return rows.map(row => JSON.parse(row.payload) as Playlist);
}

export async function registrarFaixa(userId: string, track: Track) {
  const db = await banco();
  await db.runAsync(
    'INSERT OR REPLACE INTO historico (user_id,id,title,artist,payload,played_at) VALUES (?,?,?,?,?,?)',
    userId, track.id, track.title, track.artist, JSON.stringify(track), Date.now(),
  );
}

export async function listarHistorico(userId: string, filtro = '', ordem: 'recentes' | 'titulo' = 'recentes'): Promise<Track[]> {
  const db = await banco();
  const order = ordem === 'titulo' ? 'title COLLATE NOCASE ASC' : 'played_at DESC, id DESC';
  const rows = await db.getAllAsync<{ payload: string }>(
    'SELECT payload FROM historico WHERE user_id = ? AND (instr(lower(title),lower(?)) > 0 OR instr(lower(artist),lower(?)) > 0) ORDER BY ' + order + ' LIMIT 100',
    userId, filtro, filtro,
  );
  return rows.map(row => JSON.parse(row.payload) as Track);
}

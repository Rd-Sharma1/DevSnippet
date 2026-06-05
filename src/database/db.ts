import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('devsnippets.db');

export default db;
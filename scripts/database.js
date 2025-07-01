import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS zonas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tienda TEXT,
      zona_colonia TEXT,
      ciudad_estado TEXT,
      giro_negocio TEXT,
      fecha_actualizacion TEXT
    );

    CREATE TABLE IF NOT EXISTS campañas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zona_id INTEGER,
      colores TEXT,
      cta TEXT,
      resultado_clicks INTEGER,
      resultado_conversion REAL,
      fecha_inicio TEXT,
      fecha_fin TEXT
    );
  `);
  await db.close();
}

// Ejecutar desde CLI: node scripts/database.js init
if (process.argv[2] === 'init') {
  initDb()
    .then(() => console.log('✅ Base de datos inicializada.'))
    .catch(err => {
      console.error('❌ Error al inicializar base de datos:', err);
      process.exit(1);
    });
}

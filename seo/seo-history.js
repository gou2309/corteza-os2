import { openDb } from '../scripts/database.js';

// Guarda el rendimiento SEO de una campaña
export async function registrarSEO({ zona, giro, keywords, ctr, conversion }) {
  const db = await openDb();

  await db.run(`
    INSERT INTO campañas (zona_id, colores, cta, resultado_clicks, resultado_conversion, fecha_inicio)
    VALUES (
      (SELECT id FROM zonas WHERE zona_colonia = ? AND giro_negocio = ? LIMIT 1),
      ?, ?, ?, ?, DATE('now')
    )
  `, [zona, giro, keywords.join(','), 'auto', ctr, conversion]);

  await db.close();
}

// Consulta campañas anteriores por zona y giro
export async function obtenerHistorial({ zona, giro }) {
  const db = await openDb();

  const rows = await db.all(`
    SELECT resultado_clicks, resultado_conversion
    FROM campañas
    WHERE zona_id IN (
      SELECT id FROM zonas
      WHERE zona_colonia = ? AND giro_negocio = ?
    )
    ORDER BY fecha_inicio DESC
    LIMIT 10
  `, [zona, giro]);

  await db.close();
  return rows;
}

// Recomendador visual predictivo basado en historial de campañas
import { openDb } from '../scripts/database.js';

export async function recomendarVisuales({ zona, giro, colores = [], cta = '' }) {
  const db = await openDb();

  const historial = await db.all(`
    SELECT colores, cta, resultado_conversion
    FROM campañas
    WHERE zona_id IN (
      SELECT id FROM zonas
      WHERE zona_colonia = ? AND giro_negocio = ?
    )
  `, [zona, giro]);

  await db.close();

  const similares = historial.map(c => {
    const matchColores = colores.filter(color => c.colores?.includes(color)).length;
    const ctaCoincide = c.cta === cta ? 1 : 0;
    const score = (matchColores * 2 + ctaCoincide) * (parseFloat(c.resultado_conversion) || 1);
    return { ...c, score };
  });

  const top = similares.sort((a, b) => b.score - a.score).slice(0, 3);
  return top;
}

// Ejemplo de uso CLI
if (require.main === module) {
  recomendarVisuales({
    zona: 'Guadalajara',
    giro: 'ropa deportiva',
    colores: ['rojo', 'negro'],
    cta: 'compra ahora'
  }).then(sugerencias => {
    console.log('📊 Visuales sugeridos:\n', sugerencias);
  });
}

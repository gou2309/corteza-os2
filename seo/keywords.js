// keywords.js — Generador de palabras clave basado en historial de campañas

export function sugerirKeywords({ giro, zona, historial = [] }) {
  const base = [giro, zona];

  const populares = historial
    .filter(c => c.zona === zona && c.giro === giro)
    .flatMap(c => c.keywords || [])
    .reduce((acc, kw) => {
      acc[kw] = (acc[kw] || 0) + 1;
      return acc;
    }, {});

  const top = Object.entries(populares)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kw]) => kw);

  return [...new Set([...base, ...top])];
}

// Ejemplo de uso:
if (require.main === module) {
  const ejemplo = sugerirKeywords({
    giro: 'cosmética natural',
    zona: 'Guadalajara',
    historial: [
      { zona: 'Guadalajara', giro: 'cosmética natural', keywords: ['vegano', 'orgánico', 'piel sensible'] },
      { zona: 'Guadalajara', giro: 'cosmética natural', keywords: ['vegano', 'sin parabenos'] },
      { zona: 'CDMX', giro: 'cosmética natural', keywords: ['natural', 'ecológico'] }
    ]
  });

  console.log('🔍 Palabras clave sugeridas:', ejemplo);
}

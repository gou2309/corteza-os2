export function generarRecomendacionesSEO({ giro, zona, colores, cta }) {
  const keywords = [giro, zona, ...colores, cta].filter(Boolean);
  const baseDescription = `Descubre lo mejor en ${giro} disponible en ${zona}. Productos seleccionados pensando en ti.`;

  return {
    title: `${giro} en ${zona} | Compra online`,
    description: baseDescription,
    keywords: keywords.join(', ')
  };
}

// Ejemplo de uso:
if (require.main === module) {
  const ejemplo = generarRecomendacionesSEO({
    giro: 'cosmética natural',
    zona: 'Guadalajara',
    colores: ['verde', 'blanco'],
    cta: 'descubre'
  });

  console.log('🧠 Recomendación SEO generada:\n', ejemplo);
}

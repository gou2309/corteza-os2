// server/api.mjs
import express from 'express';
const router = express.Router();

// Mock: tiendas conectadas
router.get('/stores', (req, res) => {
  res.json([
    {
      shop: 'corteza-os2.myshopify.com',
      accessToken: 'abc123xyz456',
      installedAt: new Date().toISOString()
    }
  ]);
});

// Mock: zonas registradas (giro actualizado)
router.get('/zonas', (req, res) => {
  res.json([
    {
      tienda: 'Corteza OS2',
      zona_colonia: 'Centro',
      ciudad_estado: 'Guadalajara, Jalisco',
      giro_negocio: 'Apps de Marketing',
      fecha_actualizacion: '2025-07-08 19:45'
    }
  ]);
});

export default router;

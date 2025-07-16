import express from 'express';
import { openDb } from '../scripts/database.js';

const router = express.Router();

// 🛍️ Ruta para tiendas conectadas (simulada por ahora)
router.get('/api/stores', async (req, res) => {
  // Aquí podrías conectar a tu base de datos si guardas tiendas
  res.json([
    {
      shop: 'corteza-os2.myshopify.com',
      accessToken: 'atkn_062d...1057904',
      installedAt: new Date().toISOString()
    }
  ]);
});

// 📍 Ruta para zonas registradas (SQLite real)
router.get('/api/zonas', async (req, res) => {
  try {
    const db = await openDb();
    const zonas = await db.all('SELECT * FROM zonas');
    await db.close();
    res.json(zonas);
  } catch (error) {
    console.error('❌ Error al consultar zonas:', error.message);
    res.status(500).json({ error: 'Error al obtener zonas' });
  }
});

export default router;

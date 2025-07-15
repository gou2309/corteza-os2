import express from 'express';
import { listRegisteredStores } from './services/storeRegistry.mjs';

const router = express.Router();

router.get('/api/stores', (req, res) => {
  try {
    const stores = listRegisteredStores();
    res.status(200).json(stores);
  } catch (error) {
    console.error('❌ Error al listar tiendas:', error.message);
    res.status(500).json({ error: 'Error al recuperar tiendas instaladas.' });
  }
});

export default router;

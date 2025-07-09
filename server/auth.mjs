// server/auth.mjs
import express from 'express';
const router = express.Router();

// Ruta mínima de prueba
router.get('/auth', (req, res) => {
  res.send('✅ Ruta /auth activa');
});

export default router;

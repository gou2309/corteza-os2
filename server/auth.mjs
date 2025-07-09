import express from 'express';
const router = express.Router();

router.get('/auth', (req, res) => {
  res.send('✅ Ruta /auth activa');
});

export default router;

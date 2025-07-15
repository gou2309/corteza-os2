import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.get('/auth/callback', async (req, res) => {
  const { shop, hmac, code, state } = req.query;

  if (!shop || !hmac || !code || !state) {
    return res.status(400).send('❌ Parámetros faltantes en el callback.');
  }

  // Validación HMAC
  const map = Object.assign({}, req.query);
  delete map['signature'];
  delete map['hmac'];
  const message = Object.keys(map)
    .sort()
    .map((key) => `${key}=${map[key]}`)
    .join('&');

  const generatedHash = crypto
    .createHmac('sha256', process.env.CLIENT_SECRET)
    .update(message)
    .digest('hex');

  if (generatedHash !== hmac) {
    return res.status(400).send('🚫 HMAC inválido. Petición manipulada.');
  }

  // Solicitar token de acceso
  const tokenUrl = `https://${shop}/admin/oauth/access_token`;
  try {
    const response = await axios.post(tokenUrl, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    });

    const accessToken = response.data.access_token;
    // Aquí puedes guardar el token en tu base de datos
    console.log(`🔐 Token recibido: ${accessToken}`);

    res.redirect('/dashboard'); // o muestra mensaje de instalación exitosa
  } catch (error) {
    console.error('❌ Error al obtener token:', error.message);
    res.status(500).send('Error al completar la autenticación.');
  }
});

export default router;

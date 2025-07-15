import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { registerStore } from './services/storeRegistry.mjs'; // ✅ Registro de tiendas

dotenv.config();
const router = express.Router();

router.get('/auth/callback', async (req, res) => {
  const { shop, hmac, code, state } = req.query;

  // 🚧 Validación de parámetros
  if (!shop || !hmac || !code || !state) {
    return res.status(400).send('❌ Parámetros faltantes en el callback.');
  }

  // 🔐 Validación de integridad con HMAC
  const map = { ...req.query };
  delete map.signature;
  delete map.hmac;

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

  // 🚀 Solicitud del token OAuth
  const tokenUrl = `https://${shop}/admin/oauth/access_token`;

  try {
    const response = await axios.post(tokenUrl, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    });

    const accessToken = response.data.access_token;
    console.log(`🔐 Token recibido: ${accessToken}`);

    // 📦 Registrar tienda con su token
    registerStore(shop, accessToken);

    // ✅ Redirigir al dashboard o página postinstalación
    res.redirect('/dashboard');
  } catch (error) {
    console.error('❌ Error al obtener token:', error.response?.data || error.message);
    res.status(500).send('Error al completar la autenticación.');
  }
});

export default router;

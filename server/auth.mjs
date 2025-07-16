// server/auth.mjs
import express from 'express';
import axios from 'axios';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const router = express.Router();
router.use(cookieParser());

const {
  CLIENT_ID,
  CLIENT_SECRET,
  SCOPES,
  HOST
} = process.env;

// Paso 1: Redirigir a Shopify para pedir permisos
router.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send('❌ Falta el parámetro "shop"');

  const redirectUri = `${HOST}/auth/callback`;
  const state = crypto.randomBytes(8).toString('hex');
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${redirectUri}&state=${state}`;

  res.cookie('state', state, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.redirect(installUrl);
});

// Paso 2: Callback de Shopify
router.get('/auth/callback', async (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = req.cookies?.state;

  if (!shop || !hmac || !code || !state || state !== stateCookie) {
    return res.status(400).send('❌ Parámetros inválidos o estado no coincide');
  }

  // Verificar HMAC
  const params = { ...req.query };
  delete params['hmac'];
  const message = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const generatedHash = crypto.createHmac('sha256', CLIENT_SECRET).update(message).digest('hex');

  if (generatedHash !== hmac) {
    return res.status(400).send('❌ HMAC inválido');
  }

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    });

    const accessToken = tokenResponse.data.access_token;

    // 👉 Aquí podrías guardar el token en memoria o base de datos
    console.log(`🔐 Token recibido: ${accessToken}`);

    res.redirect('/postinstall');
  } catch (error) {
    console.error('Error al obtener el token:', error.response?.data || error.message);
    res.status(500).send('❌ Error al autenticar con Shopify');
  }
});

export default router;

// server/auth.mjs
import express from 'express';
import axios from 'axios';
import crypto from 'node:crypto'; // 👈 asegúrate de usar el prefijo 'node:' para compatibilidad
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SCOPES,
  HOST
} = process.env;

// Paso 1: Redirigir a Shopify para pedir permisos
router.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send('Falta el parámetro "shop"');

  const redirectUri = `${HOST}/auth/callback`;
  const state = crypto.randomBytes(8).toString('hex');
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&redirect_uri=${redirectUri}&state=${state}`;

  res.cookie('state', state, { httpOnly: true, secure: true });
  res.redirect(installUrl);
});

// Paso 2: Callback de Shopify
router.get('/auth/callback', async (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = req.cookies?.state;

  if (!shop || !hmac || !code || !state || state !== stateCookie) {
    return res.status(400).send('Parámetros inválidos o estado no coincide');
  }

  // Verificar HMAC
  const params = { ...req.query };
  delete params['hmac'];
  const message = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const generatedHash = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(message).digest('hex');

  if (generatedHash !== hmac) {
    return res.status(400).send('HMAC inválido');
  }

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code
    });

    const accessToken = tokenResponse.data.access_token;

    // Aquí podrías guardar el token en una base de datos si lo deseas

    res.redirect('/postinstall');
  } catch (error) {
    console.error('Error al obtener el token:', error.response?.data || error.message);
    res.status(500).send('Error al autenticar con Shopify');
  }
});

export default router;

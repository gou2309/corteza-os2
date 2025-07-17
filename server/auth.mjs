// server/auth.mjs
import express from 'express';
import axios from 'axios';
import crypto from 'node:crypto';
import cookieParser from 'cookie-parser';

const { CLIENT_ID, CLIENT_SECRET, SCOPES, HOST } = process.env;

// Fallback manual si CLIENT_ID no fue inyectado
const resolvedClientId = CLIENT_ID || '42437fd30ccf583ae3dfaea9ebec0842';

console.log('🏷️ CLIENT_ID =', resolvedClientId);
console.log('🌐 HOST      =', HOST);
console.log('🛠️ ENV VARS   =', { resolvedClientId, CLIENT_SECRET, SCOPES, HOST });

const router = express.Router();
router.use(cookieParser());

// Paso 1: Redirigir a Shopify para pedir permisos
router.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send('❌ Falta el parámetro \"shop\"');

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${HOST}/auth/callback`;
  const installUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  installUrl.searchParams.set('client_id', resolvedClientId);
  installUrl.searchParams.set('scope', SCOPES);
  installUrl.searchParams.set('redirect_uri', redirectUri);
  installUrl.searchParams.set('state', state);

  res.cookie('state', state, {
    httpOnly: true,
    secure: HOST.startsWith('https'),
    sameSite: 'strict'
  });

  console.log('✔️ SCOPES =', SCOPES);
  console.log('🔗 installUrl =', installUrl.toString());

  res.redirect(installUrl.toString());
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
  delete params.hmac;
  const message = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const generatedHash = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(message)
    .digest('hex');

  if (generatedHash !== hmac) {
    return res.status(400).send('❌ HMAC inválido');
  }

  try {
    const tokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: resolvedClientId,
        client_secret: CLIENT_SECRET,
        code
      }
    );

    console.log(`🔐 Token recibido: ${tokenResponse.data.access_token}`);
    res.redirect('/postinstall');
  } catch (err) {
    console.error('❌ Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('❌ Error al autenticar con Shopify');
  }
});

export default router;

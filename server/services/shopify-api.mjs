import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Ruta protegida que usa el token para llamar a Shopify
router.get('/api/products', async (req, res) => {
  const shop = req.query.shop;

  if (!shop) {
    return res.status(400).send('❌ Falta el parámetro "shop".');
  }

  const accessToken = process.env.ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(401).send('🚫 No se encontró el token de acceso. Verifica tu .env o persistencia.');
  }

  const url = `https://${shop}/admin/api/2024-01/products.json`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    console.log('🧾 Productos recuperados:', response.data.products);
    res.status(200).json(response.data.products);
  } catch (error) {
    console.error('❌ Error al consultar productos:', error.message);
    res.status(500).send('Error al acceder a los productos de la tienda.');
  }
});

export default router;

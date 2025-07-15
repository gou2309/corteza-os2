import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/meta', (req, res) => {
  const { country, industry } = req.query;

  if (!country || !industry) {
    return res.status(400).json({ error: 'Faltan parámetros: country e industry' });
  }

  const filename = `${country}-${industry}.json`;
  const filepath = path.join(__dirname, '../seo/data', filename); // Ajusta si tu carpeta seo está en otro nivel

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: `No se encontró metadata para ${country}-${industry}` });
  }

  try {
    const rawData = fs.readFileSync(filepath);
    const metadata = JSON.parse(rawData);
    res.status(200).json(metadata);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer metadata', details: err.message });
  }
});

export default router;

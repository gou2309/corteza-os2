import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './auth.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', authRoutes);

// Ruta: /postinstall
app.get('/postinstall', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/postinstall.html'));
});

// Ruta: /dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Fallback
app.get('*', (req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// server/index.mjs

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './auth.mjs';
import callbackRoutes from './callback.mjs';
import apiRoutes from './api.mjs';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/api', apiRoutes);

// Rutas
app.use('/', authRoutes);
app.use('/', callbackRoutes);

// Archivos estáticos y vistas
app.get('/',           (req, res) => res.sendFile(path.join(__dirname, '../public/welcome.html')));
app.get('/welcome',    (req, res) => res.sendFile(path.join(__dirname, '../public/welcome.html')));
app.get('/postinstall',(req, res) => res.sendFile(path.join(__dirname, '../public/postinstall.html')));
app.get('/dashboard',  (req, res) => res.sendFile(path.join(__dirname, '../public/dashboard.html')));
app.get('/error',      (req, res) => res.sendFile(path.join(__dirname, '../public/error.html')));

// Error 500
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err);
  res.status(500).send('Error del servidor');
});

// Fallback 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Arranca el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor escuchando en http://0.0.0.0:${PORT}`);
});

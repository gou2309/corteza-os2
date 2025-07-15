import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// Carga variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares básicos
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Rutas personalizadas
import authRoutes from './auth.mjs';
import callbackRoutes from './callback.mjs';
app.use('/', authRoutes);
app.use('/', callbackRoutes);

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas adicionales
app.get('/postinstall', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/postinstall.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err.message);
  res.status(500).send('Error del servidor');
});

// Fallback para rutas inexistentes
app.get('*', (req, res) => {
  res.status(404).send('Página no encontrada');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor escuchando en http://0.0.0.0:${PORT}`);
});


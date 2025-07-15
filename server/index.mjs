import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// ✅ Cargar variables de entorno
dotenv.config();

// 🔧 Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛡️ Middlewares base
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// 🔗 Importar rutas personalizadas
import authRoutes from './auth.mjs';
import callbackRoutes from './callback.mjs';
import shopifyApiRoutes from './shopify-api.mjs';
import metadataRoutes from './metadata.mjs';
import storeListRoutes from './store-list.mjs'; // ✅ Nueva ruta agregada

// 🧭 Montar rutas en la app
app.use('/', authRoutes);
app.use('/', callbackRoutes);
app.use('/', shopifyApiRoutes);
app.use('/', metadataRoutes);
app.use('/', storeListRoutes); // ✅ Ruta para listar tiendas

// 📁 Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, '../public')));

// 🖼️ Rutas visuales
app.get('/postinstall', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/postinstall.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/welcome.html'));
});

// ❌ Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err.message);
  res.status(500).send('Error del servidor');
});

// 🔍 Ruta Fallback 404
app.get('*', (req, res) => {
  res.status(404).send('Página no encontrada');
});

// 🚀 Activar servidor en Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor escuchando en http://0.0.0.0:${PORT}`);
});

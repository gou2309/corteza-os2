import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, '../public')));

// Ruta raíz que sirve welcome.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/welcome.html'));
});

// Ruta para el dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Ruta post-instalación
app.get('/postinstall', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/postinstall.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

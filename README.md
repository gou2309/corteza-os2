# 🧠 Corteza OS2 — Sistema Inteligente de Visibilidad para Shopify

Corteza OS2 es una combinación única de tema visual + app inteligente que potencia la visibilidad, segmentación por zonas y campañas adaptadas para tiendas Shopify.

## 🎯 Funcionalidades principales

- Optimiza SEO dinámicamente
- Aprende de campañas previas
- Sugiere combinaciones exitosas
- Se integra visualmente como App Blocks

## 🚀 ¿Qué incluye?

| Componente               | Descripción                                                |
|-------------------------|------------------------------------------------------------|
| 📁 Estructura modular    | `theme/`, `scripts/`, `seo/`, `blocks/`                    |
| ✅ Flujo CI/CD           | Pruebas y validación con `.github/workflows`               |
| 📦 Setup limpio          | Configuración con `package.json`, ESLint y Prettier        |
| 🔍 Metadatos dinámicos   | Segmentación por zona, giro comercial y CTA                |
| 📈 Historial de campañas | Métricas de CTR, conversión y rendimiento                  |
| 🧠 Recomendaciones       | Visuales y de palabras clave según campañas anteriores      |

## 🔧 Instalación local

```bash
git clone https://github.com/gou2309/corteza-os2.git
cd corteza-os2
npm install
npm run init-db
npm test
## 🔐 Resumen técnico: Integración OAuth

La aplicación Corteza OS2 implementa un flujo de autenticación OAuth 2.0 para conectar tiendas Shopify con el backend de forma segura y estructurada.

### 🔁 Flujo general

1. El merchant accede a `/auth`
2. El servidor redirige al sistema de autorización de Shopify
3. Shopify responde con un código a `/auth/callback`
4. La app solicita el token de acceso y lo guarda de forma segura
5. Se utilizan permisos específicos (scopes) autorizados por el usuario

### 🔗 Endpoint `/auth`

- **Ruta activa:** `/auth`
- **Método:** `GET`
- **Parámetro esperado:** `shop={nombre}.myshopify.com`
- **Proceso:** Redirección a `https://{shop}.myshopify.com/admin/oauth/authorize` con:
  - `client_id`
  - `scope`
  - `redirect_uri`
  - `state` (nonce de seguridad)

**Ejemplo de URL:**
https://example-shop.myshopify.com/admin/oauth/authorize?? client_id=your-client-id& scope=read_orders,write_products& redirect_uri=https://yourapp.com/auth/callback& state=secure-nonce-token
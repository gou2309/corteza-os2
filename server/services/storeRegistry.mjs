// 📁 server/services/storeRegistry.mjs

const stores = new Map();

/**
 * Registra una tienda en memoria con su token OAuth
 * @param {string} shop - Dominio de la tienda Shopify
 * @param {string} token - Token de acceso OAuth recibido
 */
export function registerStore(shop, token) {
  stores.set(shop, {
    accessToken: token,
    installedAt: new Date(),
  });

  console.log(`📦 Tienda registrada: ${shop}`);
}

/**
 * Recupera el token de una tienda específica
 * @param {string} shop - Dominio de la tienda Shopify
 * @returns {string|null} Token o null si no está registrada
 */
export function getStoreToken(shop) {
  return stores.get(shop)?.accessToken || null;
}

/**
 * Devuelve todas las tiendas registradas (útil para debugging o estadísticas)
 * @returns {object[]} Lista de tiendas instaladas
 */
export function listRegisteredStores() {
  return Array.from(stores.entries()).map(([shop, data]) => ({
    shop,
    accessToken: data.accessToken,
    installedAt: data.installedAt,
  }));
}

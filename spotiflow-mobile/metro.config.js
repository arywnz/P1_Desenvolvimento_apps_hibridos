const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes('wasm')) config.resolver.assetExts.push('wasm');
const previous = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const handler = previous ? previous(middleware, server) : middleware;
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    return handler(req, res, next);
  };
};
module.exports = config;

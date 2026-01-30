function isValidRouter(router) {
  return typeof router === "function" && Array.isArray(router.stack);
}

function validatePlugin(plugin) {
  if (!plugin) return "Plugin kosong";

  if (typeof plugin.basePath !== "string")
    return "basePath harus string";

  if (!plugin.router || !isValidRouter(plugin.router))
    return "router bukan express.Router";

  if (plugin.routes && !Array.isArray(plugin.routes))
    return "routes harus array";

  return null; // VALID
}

module.exports = validatePlugin;

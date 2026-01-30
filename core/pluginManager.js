const fs = require("fs");
const path = require("path");

const createProxyRouter = require("./createProxyRouter");
const validatePlugin = require("./pluginValidator");

const plugins = new Map();

function loadPluginSafe(filePath) {
  try {
    delete require.cache[require.resolve(filePath)];
    const plugin = require(filePath);

    const error = validatePlugin(plugin);
    if (error) {
      console.warn(`⛔ Skip plugin ${path.basename(filePath)}: ${error}`);
      return null;
    }

    return plugin;
  } catch (err) {
    console.error(`❌ Error load ${path.basename(filePath)}:`, err.message);
    return null;
  }
}

function createDisabledRouter(name) {
  return (req, res) => {
    res.status(410).json({
      status: false,
      message: `Plugin "${name}" dinonaktifkan`
    });
  };
}

function initPlugins(app, pluginsDir) {
  const files = fs.readdirSync(pluginsDir)
    .filter(f => f.endsWith(".plugin.js"));

  for (const file of files) {
    const fullPath = path.join(pluginsDir, file);
    const plugin = loadPluginSafe(fullPath);
    if (!plugin) continue;

    const proxy = createProxyRouter();
    proxy.setRouter(plugin.router);

    app.use(plugin.basePath, proxy);

    plugins.set(fullPath, {
      proxy,
      meta: plugin
    });

    console.log(`✅ Plugin loaded: ${plugin.name}`);
  }
}

function watchPlugins(app, pluginsDir) {
  fs.watch(pluginsDir, (event, filename) => {
    if (!filename || !filename.endsWith(".plugin.js")) return;

    const fullPath = path.join(pluginsDir, filename);
    const exists = fs.existsSync(fullPath);

    // 🆕 plugin baru
    if (exists && !plugins.has(fullPath)) {
      const plugin = loadPluginSafe(fullPath);
      if (!plugin) return;

      const proxy = createProxyRouter();
      proxy.setRouter(plugin.router);
      app.use(plugin.basePath, proxy);

      plugins.set(fullPath, {
        proxy,
        meta: plugin
      });

      console.log(`🆕 Plugin ditambahkan: ${plugin.name}`);
      return;
    }

    // ♻️ reload plugin
    if (exists && plugins.has(fullPath)) {
      const plugin = loadPluginSafe(fullPath);
      if (!plugin) return;

      const data = plugins.get(fullPath);
      data.proxy.setRouter(plugin.router);
      data.meta = plugin;

      console.log(`♻️ Plugin di-reload: ${plugin.name}`);
      return;
    }

    // 🗑️ plugin dihapus
    if (!exists && plugins.has(fullPath)) {
      const data = plugins.get(fullPath);
      data.proxy.setRouter(
        createDisabledRouter(data.meta.name)
      );

      plugins.delete(fullPath);
      console.log(`🗑️ Plugin dinonaktifkan`);
    }
  });
}

function getPluginsMeta() {
  return [...plugins.values()].map(p => p.meta);
}

module.exports = {
  initPlugins,
  watchPlugins,
  getPluginsMeta
};

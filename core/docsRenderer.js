function renderDocs(plugins) {
  let html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xixy Api | Documentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #020617;
      --card-bg: #0f172a;
      --text-main: #f8fafc;
      --text-dim: #94a3b8;
      --primary: #10b981;
      --primary-glow: rgba(16, 185, 129, 0.2);
      --border: rgba(255,255,255,0.08);
      --whatsapp: #25d366;
    }
    
    * { box-sizing: border-box; } /* Memastikan semua elemen patuh pada lebar container */

    body { 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      background-color: var(--bg); 
      color: var(--text-main); 
      margin: 0; 
      display: flex; 
      flex-direction: column; 
      min-height: 100vh; 
      line-height: 1.6; 
      overflow-x: hidden; /* Mencegah scroll horizontal */
    }

    header { 
      background: rgba(15, 23, 42, 0.8); 
      backdrop-filter: blur(12px); 
      border-bottom: 1px solid var(--border); 
      padding: 1rem 2rem; 
      position: sticky; 
      top: 0; 
      z-index: 100; 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
    }
    
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-logo { width: 35px; height: 35px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; box-shadow: 0 0 15px var(--primary-glow); }
    .brand-name { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(to right, #fff, var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .header-status { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; background: rgba(16, 185, 129, 0.1); color: var(--primary); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); }
    .pulse { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse-animation 2s infinite; }
    @keyframes pulse-animation { 0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.7); } 100% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); } }

    /* --- Search Container Fixed --- */
    .search-container { 
      width: 100%; 
      max-width: 600px; 
      margin: 2.5rem auto 1rem auto; 
      padding: 0 1.5rem; 
    }
    
    .search-wrapper { 
      position: relative; 
      width: 100%; 
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
      pointer-events: none;
    }

    .search-input { 
      width: 100%; 
      background: var(--card-bg); 
      border: 1px solid var(--border); 
      border-radius: 12px; 
      padding: 14px 20px 14px 45px; 
      color: white; 
      outline: none; 
      transition: 0.3s; 
      font-size: 1rem;
    }
    
    .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }

    .container { flex: 1; max-width: 1200px; margin: 1rem auto 3rem; padding: 0 1.5rem; width: 100%; }
    main { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    
    .plugin-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; transition: 0.3s; display: flex; flex-direction: column; }
    .plugin-card:hover { transform: translateY(-5px); border-color: var(--primary); }
    .plugin-card.hidden { display: none; }
    .plugin-name { color: var(--primary); font-size: 1.2rem; margin: 0 0 0.5rem 0; }
    .plugin-desc { color: var(--text-dim); font-size: 0.85rem; margin-bottom: 1.2rem; flex-grow: 1; }

    .route-item { background: rgba(2, 6, 23, 0.4); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
    .method-badge { font-size: 0.6rem; font-weight: 800; padding: 3px 6px; border-radius: 4px; min-width: 42px; text-align: center; }
    .GET { background: #10b98120; color: #10b981; }
    .POST { background: #3b82f620; color: #3b82f6; }
    .path-text { font-family: 'Fira Code', monospace; font-size: 0.75rem; flex: 1; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .btn-test { background: var(--primary); color: #000; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.75rem; transition: 0.2s; }
    .btn-test:hover { opacity: 0.85; transform: scale(1.02); }

    /* --- Mobile Responsive Adjustment --- */
    @media (max-width: 640px) {
      header { padding: 1rem; }
      .brand-name { font-size: 1.1rem; }
      .header-status { font-size: 0.65rem; padding: 4px 10px; }
      .search-container { margin-top: 1.5rem; }
      main { grid-template-columns: 1fr; }
    }

    /* --- Floating WA Button --- */
    .wa-float { position: fixed; bottom: 20px; right: 20px; background-color: var(--whatsapp); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 1000; text-decoration: none; transition: 0.3s; }
    .wa-float:hover { transform: scale(1.1); }

    /* --- Modal --- */
    #popup { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 1000; padding: 15px; }
    .modal-content { background: var(--card-bg); max-width: 700px; margin: 1rem auto; border-radius: 20px; border: 1px solid var(--border); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
    .modal-header { padding: 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    .response-container { background: #020617; border-radius: 12px; border: 1px solid var(--border); overflow: auto; margin-top: 10px; }
    pre { margin: 0; padding: 1.25rem; font-family: 'Fira Code', monospace; font-size: 0.8rem; white-space: pre-wrap; word-break: break-all; color: #e2e8f0; }
    .status-ok { color: #10b981; }
    .status-err { color: #f43f5e; }

    footer { border-top: 1px solid var(--border); padding: 2rem; text-align: center; }
    .footer-content { color: var(--text-dim); font-size: 0.8rem; display: flex; flex-direction: column; gap: 8px; }
    .footer-contact { color: var(--primary); text-decoration: none; font-weight: 600; }
    
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-logo">X</div>
      <div class="brand-name">Xixy Api</div>
    </div>
    <div class="header-status">
      <div class="pulse"></div>
      System Online
    </div>
  </header>

  <a href="https://wa.me/6281347421165" class="wa-float" target="_blank">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>

  <div class="search-container">
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input type="text" id="apiSearch" class="search-input" placeholder="Cari endpoint..." onkeyup="filterPlugins()">
    </div>
  </div>

  <div class="container">
    <main id="pluginList">
`;

  for (const p of plugins) {
    html += `
    <div class="plugin-card" data-name="${p.name.toLowerCase()}" data-desc="${p.description.toLowerCase()}">
      <h2 class="plugin-name">${p.name}</h2>
      <p class="plugin-desc">${p.description}</p>
      <div class="route-list">
    `;
    for (const r of p.routes || []) {
      const fullPath = `${p.basePath}${r.path}${r.test || ''}`;
      html += `
        <div class="route-item">
          <span class="method-badge ${r.method}">${r.method}</span>
          <code class="path-text">${r.path}</code>
          <button class="btn-test" onclick='openTester("${fullPath}", "${r.method}")'>Test</button>
        </div>
      `;
    }
    html += `</div></div>`;
  }

  html += `
    </main>
  </div>

  <footer>
    <div class="footer-content">
      <span>© 2025 <b>Xixy Project</b>. All rights reserved.</span>
      <span>Need help? <a href="https://wa.me/6281347421165" class="footer-contact" target="_blank">Contact WhatsApp</a></span>
    </div>
  </footer>

  <div id="popup">
    <div class="modal-content">
      <div class="modal-header">
        <div style="display:flex; gap:12px; align-items:center;">
          <span id="modalMethod" class="method-badge">GET</span>
          <span id="modalUrl" style="font-size:0.75rem; color:var(--text-dim); font-family:'Fira Code';"></span>
        </div>
        <button onclick="closePopup()" style="background:none; border:none; color:var(--text-dim); font-size:24px; cursor:pointer;">&times;</button>
      </div>
      <div class="modal-body">
        
        <div id="uploadArea" style="display:none; flex-direction:column; gap:15px; margin-bottom:20px;">
          <div class="file-drop-zone" style="border: 2px dashed var(--border); border-radius:15px; padding:30px; text-align:center; position:relative;">
            <p style="margin:0; font-size:0.9rem;">Klik untuk <b>pilih gambar</b></p>
            <input type="file" id="fileInput" accept="image/*" onchange="handleFileSelect()" style="position:absolute; inset:0; opacity:0; cursor:pointer;">
            <div id="fileNamePreview" style="margin-top:10px; font-size:0.8rem; color:var(--primary); display:none;"></div>
          </div>
          <button class="btn-test" style="width:100%; padding:12px;" onclick="executePost()">Upload & Execute</button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; color:var(--primary); font-size:0.9rem;">Response Body</span>
          <span id="responseTime" style="color:var(--text-dim); font-size:0.8rem;"></span>
        </div>
        <div class="response-container">
          <pre id="result">Menunggu eksekusi...</pre>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentPath = '';
    let currentMethod = '';

    function filterPlugins() {
      const input = document.getElementById('apiSearch').value.toLowerCase();
      const cards = document.querySelectorAll('.plugin-card');
      cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const desc = card.getAttribute('data-desc');
        card.classList.toggle('hidden', !name.includes(input) && !desc.includes(input));
      });
    }

    function handleFileSelect() {
      const input = document.getElementById('fileInput');
      const preview = document.getElementById('fileNamePreview');
      if (input.files.length > 0) {
        preview.textContent = "📄 " + input.files[0].name;
        preview.style.display = 'block';
      }
    }

    function openTester(path, method) {
      currentPath = path;
      currentMethod = method;
      const modal = document.getElementById('popup');
      const uploadArea = document.getElementById('uploadArea');
      
      document.getElementById('modalUrl').textContent = path;
      document.getElementById('modalMethod').textContent = method;
      document.getElementById('modalMethod').className = 'method-badge ' + method;
      document.getElementById('result').textContent = 'Siap dieksekusi.';
      document.getElementById('fileNamePreview').style.display = 'none';
      document.getElementById('fileInput').value = '';

      if (method === 'POST') {
        uploadArea.style.display = 'flex';
        document.getElementById('result').textContent = 'Silahkan pilih gambar.';
      } else {
        uploadArea.style.display = 'none';
        executeGet();
      }
      
      modal.style.display = 'block';
    }

    async function executeGet() {
      renderResponse('// Menghubungkan...');
      try {
        const start = performance.now();
        const res = await fetch(currentPath);
        const text = await res.text();
        const end = performance.now();
        showResult(text, res.ok, end - start);
      } catch (e) {
        showResult(e.message, false);
      }
    }

    async function executePost() {
      const fileInput = document.getElementById('fileInput');
      if (!fileInput.files[0]) return alert('Pilih gambar dulu!');

      renderResponse('// Sedang mengupload...');
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);

      try {
        const start = performance.now();
        const res = await fetch(currentPath, { method: 'POST', body: formData });
        const text = await res.text();
        const end = performance.now();
        showResult(text, res.ok, end - start);
      } catch (e) {
        showResult(e.message, false);
      }
    }

    function renderResponse(msg) { document.getElementById('result').textContent = msg; }

    function showResult(text, ok, time) {
      const out = document.getElementById('result');
      if (time) document.getElementById('responseTime').textContent = time.toFixed(0) + 'ms';
      try {
        const json = JSON.parse(text);
        out.textContent = JSON.stringify(json, null, 2);
      } catch {
        out.textContent = text;
      }
      out.className = ok ? 'status-ok' : 'status-err';
    }

    function closePopup() { document.getElementById('popup').style.display = 'none'; }
    window.onclick = (e) => { if(e.target.id === 'popup') closePopup(); }
  </script>
</body>
</html>
`;
  return html;
}

module.exports = renderDocs;
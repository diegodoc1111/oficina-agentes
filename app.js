(function(){
  var D = window.OFICINA, E = D.estados, A = D.agentes;
  var IMG_W = 2560, IMG_H = 1440, ZMIN = 1, ZMAX = 5, ZFOCO = 2.5;
  var visor = document.getElementById('visor'), lienzo = document.getElementById('lienzo'),
      zonasEl = document.getElementById('zonas'), panel = document.getElementById('panel'),
      velo = document.getElementById('velo'), nivel = document.getElementById('nivel');
  var seleccionado = null, nodos = {};
  var params = new URLSearchParams(location.search);
  document.getElementById('titulo').title = D.titulo;
  if (params.get('debug') === '1') document.body.classList.add('debug');

  /* ---------- Vista: contain + zoom/paneo ---------- */
  var base = { w: 0, h: 0 }, vista = { z: 1, x: 0, y: 0 };
  function tamVisor(){ return { w: visor.clientWidth, h: visor.clientHeight }; }
  function medir(){
    var v = tamVisor(), s = Math.min(v.w / IMG_W, v.h / IMG_H);
    base.w = IMG_W * s; base.h = IMG_H * s;
    lienzo.style.width = base.w + 'px'; lienzo.style.height = base.h + 'px';
    lienzo.style.setProperty('--u', (base.w / 100).toFixed(3) + 'px');
  }
  function limitar(){
    var v = tamVisor(), w = base.w * vista.z, h = base.h * vista.z;
    vista.x = w <= v.w ? (v.w - w) / 2 : Math.min(0, Math.max(v.w - w, vista.x));
    vista.y = h <= v.h ? (v.h - h) / 2 : Math.min(0, Math.max(v.h - h, vista.y));
  }
  function aplicar(suave){
    limitar();
    lienzo.classList.toggle('suave', !!suave);
    lienzo.style.transform = 'translate(' + vista.x + 'px,' + vista.y + 'px) scale(' + vista.z + ')';
    lienzo.style.setProperty('--inv', (1 / vista.z).toFixed(4));
    lienzo.classList.toggle('nitido', vista.z * base.w > IMG_W * 1.1);
    nivel.textContent = vista.z.toFixed(1) + 'x';
  }
  function zoomEn(nz, cx, cy, suave){
    nz = Math.max(ZMIN, Math.min(ZMAX, nz));
    vista.x = cx - (cx - vista.x) * (nz / vista.z);
    vista.y = cy - (cy - vista.y) * (nz / vista.z);
    vista.z = nz; aplicar(suave);
  }
  function centro(){ var v = tamVisor(); return [v.w / 2, v.h / 2]; }
  function reset(){ vista = { z: 1, x: 0, y: 0 }; aplicar(true); }
  function enfocar(a, z){
    z = z || ZFOCO;
    var v = tamVisor(), panelAbierto = !panel.hidden && v.w > 820;
    var libreW = panelAbierto ? v.w - 390 : v.w;
    var cx = (a.zona.x + a.zona.w / 2) / 100 * base.w, cy = (a.zona.y + a.zona.h / 2) / 100 * base.h;
    var libreH = (v.w <= 820 && !panel.hidden) ? v.h * 0.3 : v.h;
    vista.z = z; vista.x = libreW / 2 - cx * z; vista.y = (libreH / 2 + (v.w <= 820 ? 30 : 20)) - cy * z;
    aplicar(true);
  }
  window.addEventListener('resize', function(){
    var oldW = base.w; medir();
    if (oldW) { var k = base.w / oldW; vista.x *= k; vista.y *= k; }
    aplicar(false);
  });

  // Rueda: zoom hacia el cursor
  visor.addEventListener('wheel', function(ev){
    ev.preventDefault();
    var r = visor.getBoundingClientRect();
    var d = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
    zoomEn(vista.z * Math.exp(-d * 0.0015), ev.clientX - r.left, ev.clientY - r.top, false);
  }, { passive: false });

  // Arrastre y pellizco con Pointer Events
  var punteros = new Map(), inicio = null, movido = false, ultimoArrastre = 0;
  visor.addEventListener('pointerdown', function(ev){
    if (ev.button !== undefined && ev.button > 0) return;
    punteros.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    movido = false; empezarGesto();
  });
  function empezarGesto(){
    var p = Array.from(punteros.values());
    if (p.length === 1) inicio = { tipo: 'pan', x: p[0].x, y: p[0].y, vx: vista.x, vy: vista.y };
    else if (p.length >= 2) {
      var r = visor.getBoundingClientRect();
      inicio = { tipo: 'pinch', d: dist(p[0], p[1]), z: vista.z,
        mx: (p[0].x + p[1].x) / 2 - r.left, my: (p[0].y + p[1].y) / 2 - r.top, vx: vista.x, vy: vista.y };
    }
  }
  function dist(a, b){ return Math.hypot(a.x - b.x, a.y - b.y) || 1; }
  visor.addEventListener('pointermove', function(ev){
    if (!punteros.has(ev.pointerId) || !inicio) return;
    punteros.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    var p = Array.from(punteros.values());
    if (inicio.tipo === 'pan' && p.length === 1) {
      var dx = p[0].x - inicio.x, dy = p[0].y - inicio.y;
      if (!movido && Math.hypot(dx, dy) < 6) return;
      if (!movido) { try { visor.setPointerCapture(ev.pointerId); } catch(e){} }
      movido = true; visor.classList.add('arrastrando');
      vista.x = inicio.vx + dx; vista.y = inicio.vy + dy; aplicar(false);
    } else if (inicio.tipo === 'pinch' && p.length >= 2) {
      if (!movido) { try { visor.setPointerCapture(ev.pointerId); } catch(e){} }
      movido = true;
      var r = visor.getBoundingClientRect();
      var nz = Math.max(ZMIN, Math.min(ZMAX, inicio.z * dist(p[0], p[1]) / inicio.d));
      var mx = (p[0].x + p[1].x) / 2 - r.left, my = (p[0].y + p[1].y) / 2 - r.top;
      vista.x = mx - (inicio.mx - inicio.vx) * (nz / inicio.z);
      vista.y = my - (inicio.my - inicio.vy) * (nz / inicio.z);
      vista.z = nz; aplicar(false);
    }
  });
  function soltar(ev){
    if (!punteros.has(ev.pointerId)) return;
    punteros.delete(ev.pointerId);
    if (movido) ultimoArrastre = Date.now();
    visor.classList.remove('arrastrando');
    if (punteros.size) empezarGesto(); else inicio = null;
  }
  visor.addEventListener('pointerup', soltar);
  visor.addEventListener('pointercancel', soltar);
  // Bloquea el clic que llega justo después de arrastrar
  visor.addEventListener('click', function(ev){
    if (Date.now() - ultimoArrastre < 250) { ev.stopPropagation(); ev.preventDefault(); }
  }, true);
  // Doble clic en zona vacía: acercar ahí
  visor.addEventListener('dblclick', function(ev){
    if (ev.target.closest('.zona')) return;
    var r = visor.getBoundingClientRect();
    zoomEn(vista.z < 2 ? ZFOCO : 1, ev.clientX - r.left, ev.clientY - r.top, true);
  });

  /* ---------- Zonas de los agentes ---------- */
  function est(a){ return E[a.estado] || E.trabajando; }
  function textoEstado(a){ var e = est(a); return e.emoji + ' ' + e.texto; }

  A.forEach(function(a){
    var z = document.createElement('button');
    z.className = 'zona'; z.type = 'button';
    z.style.left = a.zona.x + '%'; z.style.top = a.zona.y + '%';
    z.style.width = a.zona.w + '%'; z.style.height = a.zona.h + '%';
    z.setAttribute('aria-label', a.nombre);
    z.dataset.id = a.id;
    var partes = a.nombre.split(' · ');
    z.innerHTML = '<span class="placa"><b></b><small></small></span><span class="punto"></span><span class="globo"></span>';
    var placa = z.querySelector('.placa');
    if (a.placa === 'abajo') placa.classList.add('abajo');
    if (a.lider || a.id === 'lider-trafico') placa.classList.add('jefe');
    placa.querySelector('b').textContent = (a.lider ? '👑 ' : '') + partes[0];
    placa.querySelector('small').textContent = partes.length > 1 ? partes.slice(1).join(' · ') : a.rol;
    var t = null;
    z.addEventListener('click', function(){
      clearTimeout(t); t = setTimeout(function(){ abrir(a.id); }, 220); // espera por si es doble clic
    });
    z.addEventListener('dblclick', function(ev){
      ev.stopPropagation(); clearTimeout(t); abrir(a.id); enfocar(a);
    });
    z.addEventListener('pointerdown', function(ev){ if (ev.pointerType === 'touch') marcarActiva(z); });
    zonasEl.appendChild(z);
    nodos[a.id] = z;
  });
  function marcarActiva(z){
    Object.keys(nodos).forEach(function(k){ nodos[k].classList.remove('activa'); });
    z.classList.add('activa');
  }
  function pintar(a, animar){
    var z = nodos[a.id], e = est(a);
    z.style.setProperty('--c', e.color);
    z.querySelector('.globo').textContent = textoEstado(a);
    z.title = a.nombre + ' · ' + e.texto;
    if (animar){ z.classList.remove('cambio'); void z.offsetWidth; z.classList.add('cambio'); }
    if (seleccionado === a.id) llenarTarjeta(a);
  }
  function contador(){
    var n = A.filter(function(a){ return est(a).activo; }).length;
    document.getElementById('contador').textContent = n + '/' + A.length + ' trabajando';
  }

  /* ---------- Ficha ---------- */
  function buscar(id){ return A.find(function(x){ return x.id === id; }); }
  function llenarTarjeta(a){
    var e = est(a);
    document.getElementById('tNombre').textContent = (a.lider ? '👑 ' : '') + a.nombre;
    document.getElementById('tRol').textContent = a.rol;
    document.getElementById('tDepto').textContent = a.departamento || '—';
    var te = document.getElementById('tEstado');
    te.textContent = 'Estado: ' + textoEstado(a); te.style.setProperty('--c', e.color);
    document.getElementById('tHace').textContent = a.hace;
    document.getElementById('tReporta').textContent = a.reporta;
    var equipo = A.filter(function(b){ return b.reporta === a.nombre; }).map(function(b){ return b.nombre; });
    var dd = document.getElementById('tEquipo');
    dd.textContent = equipo.length ? equipo.join(', ') : '—';
    dd.previousElementSibling.hidden = dd.hidden = !equipo.length;
  }
  function abrir(id){
    var a = buscar(id); if (!a) return;
    seleccionado = id;
    Object.keys(nodos).forEach(function(k){ nodos[k].classList.toggle('seleccionada', k === id); });
    llenarTarjeta(a);
    panel.hidden = false; velo.classList.add('on');
    if (history.replaceState) history.replaceState(null, '', location.search + '#' + id);
  }
  function cerrar(){
    seleccionado = null; panel.hidden = true; velo.classList.remove('on');
    Object.keys(nodos).forEach(function(k){ nodos[k].classList.remove('seleccionada', 'activa'); });
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }
  document.getElementById('cerrar').addEventListener('click', cerrar);
  velo.addEventListener('click', cerrar);
  document.getElementById('btnEnfocar').addEventListener('click', function(){
    var a = buscar(seleccionado); if (a) enfocar(a);
  });

  /* ---------- Botones y teclado ---------- */
  document.getElementById('btnMas').addEventListener('click', function(){ var c = centro(); zoomEn(vista.z * 1.4, c[0], c[1], true); });
  document.getElementById('btnMenos').addEventListener('click', function(){ var c = centro(); zoomEn(vista.z / 1.4, c[0], c[1], true); });
  document.getElementById('btnReset').addEventListener('click', reset);
  function pantallaCompleta(){
    var d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else if (el.requestFullscreen) el.requestFullscreen().catch(function(){});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }
  document.getElementById('btnFull').addEventListener('click', pantallaCompleta);
  document.addEventListener('keydown', function(ev){
    if (ev.target.tagName === 'INPUT' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var c = centro();
    if (ev.key === 'Escape') { cerrar(); toggleAyuda(false); }
    else if (ev.key === '?') toggleAyuda();
    else if (ev.key === '+' || ev.key === '=') zoomEn(vista.z * 1.4, c[0], c[1], true);
    else if (ev.key === '-' || ev.key === '_') zoomEn(vista.z / 1.4, c[0], c[1], true);
    else if (ev.key === '0') reset();
    else if (ev.key === 'f' || ev.key === 'F') pantallaCompleta();
  });

  /* ---------- Leyenda ---------- */
  ['leyenda', 'leyenda2'].forEach(function(idL){
  var ley = document.getElementById(idL);
  Object.keys(E).forEach(function(k){
    var li = document.createElement('li');
    li.innerHTML = '<i></i><span></span>';
    li.querySelector('i').style.background = E[k].color;
    li.querySelector('span').textContent = E[k].emoji + ' ' + E[k].texto;
    ley.appendChild(li);
  });
  });
  var ayuda = document.getElementById('ayuda'), btnAyuda = document.getElementById('btnAyuda');
  function toggleAyuda(abrirla){
    ayuda.hidden = !(abrirla === undefined ? ayuda.hidden : abrirla);
    btnAyuda.setAttribute('aria-expanded', String(!ayuda.hidden));
  }
  btnAyuda.addEventListener('click', function(ev){ ev.stopPropagation(); toggleAyuda(); });
  document.addEventListener('click', function(ev){ if (!ayuda.hidden && !ayuda.contains(ev.target)) toggleAyuda(false); });

  var pista = document.getElementById('pista'), tp = setTimeout(ocultarPista, 7000);
  function ocultarPista(){ pista.classList.add('oculta'); }
  visor.addEventListener('pointerdown', function(){ clearTimeout(tp); tp = setTimeout(ocultarPista, 1500); });

  /* ---------- Arranque ---------- */
  medir(); aplicar(false);
  A.forEach(function(a){ pintar(a, false); });
  contador();

  // Modo "día en la oficina": rota estados al azar cada pocos segundos
  var claves = Object.keys(E), timer = null;
  var pesos = { trabajando: 4, revisando: 2, pensando: 2, esperando: 1, pausa: 1 };
  function azar(){
    var bolsa = []; claves.forEach(function(k){ for (var i = 0; i < (pesos[k] || 1); i++) bolsa.push(k); });
    return bolsa[Math.floor(Math.random() * bolsa.length)];
  }
  function tick(){
    var veces = 1 + Math.floor(Math.random() * 2);
    for (var i = 0; i < veces; i++){
      var a = A[Math.floor(Math.random() * A.length)], nuevo = azar();
      if (nuevo === a.estado) continue;
      a.estado = nuevo; pintar(a, true);
    }
    contador();
  }
  var chk = document.getElementById('modoDia');
  function modo(){ clearInterval(timer); if (chk.checked) timer = setInterval(tick, 3500); }
  chk.addEventListener('change', modo);
  if (params.get('dia') === '0') chk.checked = false;
  modo();

  if (location.hash.length > 1) abrir(location.hash.slice(1));
  // ?enfoque=<id> acerca la vista a ese escritorio al cargar (útil para compartir o probar)
  var foco = buscar(params.get('enfoque'));
  if (foco) enfocar(foco, parseFloat(params.get('zoom')) || ZFOCO);
})();

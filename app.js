(function(){
  var D = window.OFICINA, E = D.estados, A = D.agentes;
  var zonasEl = document.getElementById('zonas');
  var panel = document.getElementById('panel'), tarjeta = document.getElementById('tarjeta'),
      vacio = document.getElementById('panelVacio'), velo = document.getElementById('velo');
  var seleccionado = null, nodos = {};
  document.getElementById('titulo').textContent = D.titulo;

  function est(a){ return E[a.estado] || E.trabajando; }
  function textoEstado(a){ var e = est(a); return e.emoji + ' ' + e.texto; }

  A.forEach(function(a){
    var z = document.createElement('button');
    z.className = 'zona' + (a.zona.y < 15 ? ' globo-abajo' : '');
    z.type = 'button';
    z.style.left = a.zona.x + '%'; z.style.top = a.zona.y + '%';
    z.style.width = a.zona.w + '%'; z.style.height = a.zona.h + '%';
    z.setAttribute('aria-label', a.nombre);
    z.dataset.id = a.id;
    z.innerHTML = '<span class="punto"></span><span class="globo"></span>';
    z.addEventListener('click', function(){ abrir(a.id); });
    z.addEventListener('touchstart', function(){ marcarActiva(z); }, {passive:true});
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
    document.getElementById('contador').textContent = A.length + ' agentes · ' + n + ' trabajando ahora';
  }

  function llenarTarjeta(a){
    var e = est(a);
    document.getElementById('tNombre').textContent = (a.lider ? '👑 ' : '') + a.nombre;
    document.getElementById('tRol').textContent = a.rol;
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
    var a = A.find(function(x){ return x.id === id; }); if(!a) return;
    seleccionado = id;
    Object.keys(nodos).forEach(function(k){ nodos[k].classList.toggle('seleccionada', k === id); });
    llenarTarjeta(a);
    tarjeta.hidden = false; vacio.hidden = window.innerWidth > 820;
    panel.classList.add('abierto'); velo.classList.add('on');
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  }
  function cerrar(){
    seleccionado = null; tarjeta.hidden = true; vacio.hidden = false;
    panel.classList.remove('abierto'); velo.classList.remove('on');
    Object.keys(nodos).forEach(function(k){ nodos[k].classList.remove('seleccionada','activa'); });
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }
  document.getElementById('cerrar').addEventListener('click', cerrar);
  velo.addEventListener('click', cerrar);
  document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape') cerrar(); });

  // Leyenda
  var ley = document.getElementById('leyenda');
  Object.keys(E).forEach(function(k){
    var li = document.createElement('li');
    li.innerHTML = '<i></i><span></span>';
    li.querySelector('i').style.background = E[k].color;
    li.querySelector('span').textContent = E[k].emoji + ' ' + E[k].texto;
    ley.appendChild(li);
  });

  A.forEach(function(a){ pintar(a, false); });
  contador();

  // Modo "día en la oficina": rota estados al azar cada pocos segundos
  var claves = Object.keys(E), timer = null;
  var pesos = { trabajando: 4, revisando: 2, pensando: 2, esperando: 1, pausa: 1 };
  function azar(){
    var bolsa = []; claves.forEach(function(k){ for (var i=0;i<(pesos[k]||1);i++) bolsa.push(k); });
    return bolsa[Math.floor(Math.random()*bolsa.length)];
  }
  function tick(){
    var veces = 1 + Math.floor(Math.random()*2);
    for (var i=0;i<veces;i++){
      var a = A[Math.floor(Math.random()*A.length)];
      var nuevo = azar(); if (nuevo === a.estado) continue;
      a.estado = nuevo; pintar(a, true);
    }
    contador();
  }
  var chk = document.getElementById('modoDia');
  function modo(){ clearInterval(timer); if (chk.checked) timer = setInterval(tick, 3500); }
  chk.addEventListener('change', modo);
  var params = new URLSearchParams(location.search);
  if (params.get('dia') === '0') chk.checked = false;
  if (params.get('debug') === '1') document.body.classList.add('debug');
  modo();

  if (location.hash.length > 1) abrir(location.hash.slice(1));
})();

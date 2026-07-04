import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore, doc, documentId, getDoc, setDoc, updateDoc, collection, getDocs,
  onSnapshot, query, orderBy, enableIndexedDbPersistence, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
try { enableIndexedDbPersistence(db); } catch (e) { /* multi-tab open or unsupported browser: seguimos sin cache offline */ }

let EQUIPOS = [];
let byLast4 = {};
let state = { fecha: todayStr(), operador: '', salida: [], entrada: [], cerrado: false };
let unsubscribeDia = null;

function todayStr(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
}

async function cargarCatalogo(){
  const snap = await getDocs(query(collection(db, 'equipos'), orderBy('last4')));
  EQUIPOS = [];
  snap.forEach(d => EQUIPOS.push(d.data()));
  byLast4 = Object.fromEntries(EQUIPOS.map(e => [e.last4, e]));
  if(EQUIPOS.length === 0){
    document.getElementById('selectEquipo').innerHTML =
      '<option value="">Sin equipos cargados. Ve a Admin y carga el catálogo.</option>';
  }
  populateSelect();
}

function regRef(fecha){ return doc(db, 'registros', fecha); }

function suscribirDia(fecha){
  if(unsubscribeDia) unsubscribeDia();
  document.getElementById('syncMsg').textContent = 'Conectando…';
  unsubscribeDia = onSnapshot(regRef(fecha), (snap)=>{
    if(snap.exists()){
      const data = snap.data();
      state = { fecha, operador: data.operador || '', salida: data.salida || [], entrada: data.entrada || [], cerrado: !!data.cerrado, cerradoConPendientes: data.cerradoConPendientes || 0 };
    } else {
      state = { fecha, operador: '', salida: [], entrada: [], cerrado: false };
    }
    document.getElementById('operador').value = state.operador || '';
    document.getElementById('syncMsg').textContent = 'Sincronizado en tiempo real';
    setTimeout(()=>{ if(document.getElementById('syncMsg').textContent==='Sincronizado en tiempo real') document.getElementById('syncMsg').textContent=''; }, 1500);
    render();
  }, (err)=>{
    document.getElementById('syncMsg').textContent = 'Sin conexión — mostrando última copia local';
  });
}

async function guardarOperador(nombre){
  state.operador = nombre;
  await setDoc(regRef(state.fecha), { operador: nombre }, { merge: true });
}

function populateSelect(){
  const sel = document.getElementById('selectEquipo');
  if(EQUIPOS.length===0) return;
  sel.innerHTML = '<option value="">Selecciona el número de pechera (últimos 4 dígitos)…</option>';
  const sorted = [...EQUIPOS].sort((a,b)=> a.last4.localeCompare(b.last4));
  sorted.forEach(e=>{
    const yaAfuera = state.salida.find(s=>s.equipo===e.equipo);
    const opt = document.createElement('option');
    opt.value = e.last4;
    opt.textContent = e.last4 + '  →  ' + e.equipo + (yaAfuera ? '  (ya en uso)' : '');
    sel.appendChild(opt);
  });
}

async function agregarSalida(){
  const sel = document.getElementById('selectEquipo');
  const last4 = sel.value;
  if(!last4) return;
  const eq = byLast4[last4];
  if(state.salida.find(s=>s.equipo===eq.equipo)){
    toast(eq.equipo + ' ya está registrado en la salida de hoy.');
    return;
  }
  const entrada = { equipo: eq.equipo, last4: eq.last4, hora: new Date().toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'}) };
  await setDoc(regRef(state.fecha), { salida: arrayUnion(entrada) }, { merge: true });
  toast('Equipo ' + eq.equipo + ' (' + eq.last4 + ') registrado en salida.');
}

async function quitarSalida(equipo){
  if(state.entrada.find(e=>e.equipo===equipo)){
    toast('Ese equipo ya tiene entrada registrada, no se puede quitar.');
    return;
  }
  const item = state.salida.find(s=>s.equipo===equipo);
  await setDoc(regRef(state.fecha), { salida: arrayRemove(item) }, { merge: true });
}

async function marcarEntrada(equipo){
  if(state.entrada.find(e=>e.equipo===equipo)) return;
  const item = { equipo, hora: new Date().toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'}) };
  await setDoc(regRef(state.fecha), { entrada: arrayUnion(item) }, { merge: true });
  toast('Equipo ' + equipo + ' marcado como devuelto.');
}

async function desmarcarEntrada(equipo){
  const item = state.entrada.find(e=>e.equipo===equipo);
  await setDoc(regRef(state.fecha), { entrada: arrayRemove(item) }, { merge: true });
}

async function cerrarDia(){
  const pendientes = state.salida.filter(s=>!state.entrada.find(e=>e.equipo===s.equipo));
  if(pendientes.length>0){
    const nombres = pendientes.map(p=>p.equipo+' ('+p.last4+')').join(', ');
    const ok = confirm('Faltan '+pendientes.length+' equipo(s) por entrar: '+nombres+'.\n¿Cerrar el día de todas formas? Quedará marcado como pendiente en el historial.');
    if(!ok) return;
  }
  await setDoc(regRef(state.fecha), { cerrado: true, cerradoConPendientes: pendientes.length }, { merge: true });
  toast('Día cerrado y guardado en el historial.');
  switchTab('historial');
}

function render(){
  populateSelect();

  const fuera = state.salida.filter(s=>!state.entrada.find(e=>e.equipo===s.equipo));
  const dentro = state.salida.filter(s=>state.entrada.find(e=>e.equipo===s.equipo));
  document.getElementById('stFuera').textContent = fuera.length;
  document.getElementById('stDentro').textContent = dentro.length;
  document.getElementById('stPend').textContent = fuera.length;

  const badge = document.getElementById('badgePend');
  if(fuera.length>0){ badge.style.display='inline-block'; badge.textContent = fuera.length; }
  else { badge.style.display='none'; }

  const listaSalida = document.getElementById('listaSalida');
  if(state.salida.length===0){
    listaSalida.innerHTML = '<div class="empty">Todavía no se ha registrado ningún equipo.</div>';
  } else {
    listaSalida.innerHTML = state.salida.slice().reverse().map(s=>{
      const dev = state.entrada.find(e=>e.equipo===s.equipo);
      return `<div class="equipo-row">
        <span class="equipo-id">${s.equipo}</span>
        <div class="equipo-meta"><div class="p4">Pechera ${s.last4} · salió ${s.hora}</div></div>
        <span class="estado ${dev?'dentro':'fuera'}">${dev?'Devuelto':'En uso'}</span>
        ${dev?'':`<button class="btn-ghost btn-small" data-quitar="${s.equipo}">Quitar</button>`}
      </div>`;
    }).join('');
    listaSalida.querySelectorAll('[data-quitar]').forEach(b=>b.addEventListener('click', ()=>quitarSalida(b.dataset.quitar)));
  }

  const listaPend = document.getElementById('listaPendientes');
  if(fuera.length===0){
    listaPend.innerHTML = '<div class="empty">No hay equipo pendiente por entrar.</div>';
  } else {
    listaPend.innerHTML = fuera.map(s=>`
      <div class="equipo-row">
        <span class="equipo-id">${s.equipo}</span>
        <div class="equipo-meta"><div class="p4">Pechera ${s.last4} · salió ${s.hora}</div></div>
        <button class="btn-primary btn-small" style="width:auto" data-entrar="${s.equipo}">Marcar entrada</button>
      </div>`).join('');
    listaPend.querySelectorAll('[data-entrar]').forEach(b=>b.addEventListener('click', ()=>marcarEntrada(b.dataset.entrar)));
  }

  const listaDev = document.getElementById('listaDevueltos');
  if(dentro.length===0){
    listaDev.innerHTML = '<div class="empty">Ningún equipo devuelto todavía.</div>';
  } else {
    listaDev.innerHTML = dentro.map(s=>{
      const e = state.entrada.find(x=>x.equipo===s.equipo);
      return `<div class="equipo-row">
        <span class="equipo-id">${s.equipo}</span>
        <div class="equipo-meta"><div class="p4">Pechera ${s.last4} · entró ${e.hora}</div></div>
        <button class="btn-ghost btn-small" data-deshacer="${s.equipo}">Deshacer</button>
      </div>`;
    }).join('');
    listaDev.querySelectorAll('[data-deshacer]').forEach(b=>b.addEventListener('click', ()=>desmarcarEntrada(b.dataset.deshacer)));
  }
}

function switchTab(tab){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===tab));
  document.getElementById('panel-salida').style.display = tab==='salida' ? '' : 'none';
  document.getElementById('panel-entrada').style.display = tab==='entrada' ? '' : 'none';
  document.getElementById('panel-historial').style.display = tab==='historial' ? '' : 'none';
  if(tab==='historial') cargarHistorial();
}

let historialCache = [];

async function cargarHistorial(){
  const cont = document.getElementById('listaHistorial');
  cont.innerHTML = '<div class="empty">Cargando historial…</div>';
  try{

    const snap = await getDocs(collection(db, 'registros'));
    historialCache = [];
    snap.forEach(d => historialCache.push({
        fecha: d.id,
        ...d.data()
    }));
    historialCache.sort((a, b) => b.fecha.localeCompare(a.fecha));
    if(historialCache.length===0){ cont.innerHTML = '<div class="empty">Aún no hay días registrados.</div>'; return; }
    cont.innerHTML = historialCache.map(d=>{
      const fuera = (d.salida||[]).filter(s=>!(d.entrada||[]).find(e=>e.equipo===s.equipo));
      const chip = d.cerrado
        ? (fuera.length>0 ? `<span class="chip abierto">Cerrado con ${fuera.length} pend.</span>` : `<span class="chip cerrado">Completo</span>`)
        : `<span class="chip abierto">En curso</span>`;
      return `<div class="hist-item">
        <div class="row1"><span class="fecha">${d.fecha}</span>${chip}</div>
        <div class="op">${d.operador ? 'Encargado: '+d.operador : 'Sin encargado registrado'} · ${(d.salida||[]).length} equipo(s) usados</div>
      </div>`;
    }).join('');
  }catch(e){
      console.error("Error cargando historial:", e);
      console.error("Código:", e.code);
      console.error("Mensaje:", e.message);
      cont.innerHTML = '<div class="empty">No se pudo cargar el historial.</div>';
  }
}

function exportarExcel(){
  if(historialCache.length===0){ toast('No hay historial para exportar todavía.'); return; }
  const filas = [];
  historialCache.forEach(d=>{
    (d.salida||[]).forEach(s=>{
      const e = (d.entrada||[]).find(x=>x.equipo===s.equipo);
      filas.push({
        Fecha: d.fecha,
        Encargado: d.operador || '',
        Equipo: s.equipo,
        'Pechera (4 díg.)': s.last4,
        'Hora salida': s.hora,
        'Hora entrada': e ? e.hora : '',
        Estado: e ? 'Devuelto' : 'Pendiente',
        'Día cerrado': d.cerrado ? 'Sí' : 'No'
      });
    });
  });
  const ws = XLSX.utils.json_to_sheet(filas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Historial');
  XLSX.writeFile(wb, 'historial_equipos_' + todayStr() + '.xlsx');
}

document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click', ()=>switchTab(t.dataset.tab)));
document.getElementById('btnAgregar').addEventListener('click', agregarSalida);
document.getElementById('btnCerrarDia').addEventListener('click', cerrarDia);
document.getElementById('btnExportar').addEventListener('click', exportarExcel);
document.getElementById('fecha').addEventListener('change', e=> suscribirDia(e.target.value));
document.getElementById('operador').addEventListener('change', e=> guardarOperador(e.target.value));

document.getElementById('fecha').value = todayStr();
cargarCatalogo().then(()=> suscribirDia(todayStr()));

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

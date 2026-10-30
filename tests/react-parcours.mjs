// Exécuter uniquement avec un profil Chrome temporaire : le parcours réinitialise les données locales de test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tabs=await(await fetch(`${process.env.CHROME_URL ?? 'http://127.0.0.1:9224'}/json/list`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map(), errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const call=(method,params={})=>new Promise(r=>{const n=++id;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const m=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(m.error)return false;assert(!m.result.exceptionDetails,JSON.stringify(m));return m.result.result.value};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=async(e,label)=>{for(let n=0;n<60;n++){if(await run(e))return;await sleep(50)}assert.fail(label)};
const go=async p=>{await call('Page.navigate',{url:(process.env.PREVIEW_URL ?? 'http://127.0.0.1:4174')+p});await sleep(200)};
const click=async s=>{await run(`document.querySelector(${JSON.stringify(s)}).click()`);await sleep(100)};
const fill=async(s,v)=>{await run(`document.querySelector(${JSON.stringify(s)}).focus()`);await call('Input.insertText',{text:v})};
await call('Page.enable');await call('Runtime.enable');
await go('/ateliers');await run('localStorage.clear()');await go('/ateliers');await ok(`document.querySelectorAll('article').length===12`,'12 ateliers');
await fill('input[type=search]','joseph');await ok(`document.querySelectorAll('article').length===5`,'recherche formateur');await click('button[type=reset]');
await click('article button[aria-label^="S’inscrire"]');await ok(`location.pathname==='/connexion' && location.search.includes('html')`,'connexion requise');await click('a[href^="/inscription?"]');
await click('form button');await ok(`document.activeElement.id==='nom'`,'erreur focus');
await fill('#nom','Élève React');await fill('#email','react@example.test');await fill('#motDePasse','motdepasse123');await fill('#confirmation','motdepasse123');await click('form button');await ok(`location.pathname==='/connexion'`,'creation');
await fill('#email','react@example.test');await fill('#motDePasse','incorrect');await click('form button');await ok(`document.body.textContent.includes('incorrect')`,'mauvais login');
await run(`document.querySelector('#motDePasse').value=''`);await fill('#motDePasse','motdepasse123');await click('form button');await ok(`location.pathname==='/ateliers/html'`,'retour atelier');await click('aside button[aria-label^="Réserver"]');await click('dialog[open] button[aria-label^="S’inscrire"]');await ok(`document.body.textContent.includes('Déjà inscrit')`,'inscription');
await click('dialog[open] button[aria-label^="Déjà inscrit"]');assert.equal(await run(`JSON.parse(localStorage.skillhub_inscriptions).length`),1);
await go('/profil');await ok(`document.body.textContent.includes('Découvrir le HTML')`,'persistance profil');await click('li button');await ok(`document.querySelector('dialog').open`,'confirmation annulation');await click('dialog button');assert.equal(await run(`JSON.parse(localStorage.skillhub_inscriptions).length`),1);await click('li button');await click('dialog button:last-child');await ok(`JSON.parse(localStorage.skillhub_inscriptions).length===0`,'annulation');
await go('/ateliers/react');await ok(`document.querySelector('aside button').getAttribute('aria-disabled')==='true'`,'complet');
await click('header > div button');await go('/profil');await ok(`location.pathname==='/connexion'`,'profil protege');
for(const p of ['/','/ateliers','/ateliers/html','/connexion','/inscription','/absent','/cours-html.html']){await go(p);await ok(`Boolean(document.querySelector('h1'))`,'route '+p)}
for(const width of [375,800,1280]){await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await go('/');await ok(`document.documentElement.scrollWidth<=innerWidth`,'responsive '+width);assert(await run(`Array.from(document.images).filter(i=>i.loading!=='lazy').every(i=>i.complete&&i.naturalWidth>0)`));}
await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});await go('/');const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/skillhub-react-accueil.png',Buffer.from(shot.result.data,'base64'));
assert.equal(errors.length,0,JSON.stringify(errors));console.log('OK: 12 ateliers, recherche, création, erreurs, login, retour atelier, inscription unique, persistance, désinscription, complet, logout, protection, URLs et responsive. Aucune exception JS.');ws.close();

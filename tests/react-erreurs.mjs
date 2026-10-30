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

await call('Page.enable');await call('Runtime.enable');await call('Network.enable');
const key=async(key,code)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,text:key==='Enter'?'\r':undefined,windowsVirtualKeyCode:code});await call('Input.dispatchKeyEvent',{type:'keyUp',key,windowsVirtualKeyCode:code});await sleep(40)};
await call('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
await go('/');await run(`document.querySelector('nav button').focus()`);await key('Enter',13);await ok(`document.querySelector('nav button').getAttribute('aria-expanded')==='true'`,'menu clavier');await key('Tab',9);await key('Escape',27);await ok(`document.activeElement===document.querySelector('nav button') && document.querySelector('nav button').getAttribute('aria-expanded')==='false'`,'escape menu');
await go('/ateliers');await run(`document.querySelector('article button').focus()`);await key('Enter',13);await ok(`document.querySelector('dialog[open]')?.contains(document.activeElement)`,'focus fiche');await key('Escape',27);await ok(`document.activeElement===document.querySelector('article button')`,'retour focus fiche');await key('Enter',13);await run(`document.querySelector('dialog[open] a').focus()`);await key('Enter',13);await ok(`location.pathname.startsWith('/ateliers/')`,'lien clavier');await ok(`document.activeElement.id==='contenu'`,'focus route');
await go('/');await click('#inscription form button');await ok(`document.activeElement.id==='contact-nom'`,'contact invalide');await fill('#contact-nom','Test');await fill('#contact-email','test@example.test');await fill('#contact-message','Question');await click('#inscription form button');await ok(`document.activeElement.getAttribute('role')==='status' && document.activeElement.textContent.includes('Aucune donnée')`,'contact demo');
for (const [nom,body,code] of [['HTTP','',404],['JSON','{',200],['schema','{}',200],['doublons','[{"id":"html"},{"id":"html"}]',200]]) {
 let paused;const listener=e=>{const m=JSON.parse(e.data);if(m.method==='Fetch.requestPaused')paused=m.params.requestId};ws.addEventListener('message',listener);
 await call('Fetch.enable',{patterns:[{urlPattern:'*ateliers*.json*',requestStage:'Request'}]});await go('/ateliers');for(let n=0;n<60&&!paused;n++)await sleep(50);assert(paused,nom);await ok(`document.body.textContent.includes('Chargement des ateliers')`,'chargement');await call('Fetch.fulfillRequest',{requestId:paused,responseCode:code,body:Buffer.from(body).toString('base64')});await ok(`Boolean(document.querySelector('[role=alert]'))`,'erreur '+nom);await call('Fetch.disable');ws.removeEventListener('message',listener);await click('[role=alert] button');await ok(`document.querySelectorAll('#ateliers article').length===12`,'retry '+nom);
}
await go('/inscription');await fill('#nom','Autre');await fill('#email','autre@example.test');await fill('#motDePasse','motdepasse123');await fill('#confirmation','motdepasse123');await run(`window.original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('bloqué')}`);await click('form button');await ok(`document.body.textContent.includes('stockage local est indisponible')`,'erreur stockage');await run(`Storage.prototype.setItem=window.original`);
await call('Page.navigate',{url:`${process.env.DEV_URL ?? 'http://127.0.0.1:5176'}/ateliers/html`});await ok(`document.querySelector('h1')?.textContent==='Découvrir le HTML'`,'dev url directe');await call('Page.navigate',{url:`${process.env.DEV_URL ?? 'http://127.0.0.1:5176'}/`});await ok(`document.querySelectorAll('#ateliers article').length===12`,'dev json');await ok(`document.images[0]?.complete && document.images[0]?.naturalWidth>0`,'dev image');
assert.equal(errors.length,0,JSON.stringify(errors));console.log('OK: menu et liens au clavier, focus, contact, erreurs HTTP/JSON/schema, réessai, stockage bloqué, URLs directes dev, JSON et images dev.');ws.close();

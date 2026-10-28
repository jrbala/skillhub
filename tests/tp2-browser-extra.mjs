import assert from 'node:assert/strict';
import fs from 'node:fs';
const tabs=await(await fetch('http://127.0.0.1:9223/json/list')).json();
const ws=new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map(),errors=[],results=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown'||m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params);});
const call=(method,params={})=>new Promise(r=>{const n=++id;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}));});
const run=async expression=>{const m=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});assert(!m.result.exceptionDetails,JSON.stringify(m));return m.result.result.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=async(e,label)=>{for(let n=0;n<30;n++){if(await run(e))return;await sleep(100);}assert.fail(label);};
const log=t=>{console.log(t);results.push(t);};
const key=async(key,shift=false)=>{const code={Tab:9,Enter:13,' ':32,Escape:27}[key];await call('Input.dispatchKeyEvent',{type:'keyDown',text:key==='Enter'?'\r':key===' '?' ':undefined,key,code:key===' '?'Space':key,windowsVirtualKeyCode:code,modifiers:shift?8:0});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code:key===' '?'Space':key,windowsVirtualKeyCode:code,modifiers:shift?8:0});await sleep(35);};
const tabTo=async selector=>{for(let i=0;i<100;i++){if(await run(`document.activeElement.matches(${JSON.stringify(selector)})`))return;await key('Tab');}throw Error('Tab inaccessible: '+selector);};
const type=async text=>{await call('Input.insertText',{text});await sleep(30);};
const go=async path=>{await call('Page.navigate',{url:'http://127.0.0.1:8000/'+path});await sleep(220);};
const fill=async(sel,text)=>{await tabTo(sel);await type(text);};
await call('Page.enable');await call('Runtime.enable');
await go('profil.html');
await tabTo('[data-desinscrire]');await key('Enter');await ok(`document.querySelector('#dialog-desinscription').open`,'dialog desinscription');await key('Escape');await ok(`document.activeElement.matches('[data-desinscrire]')`,'retour annulation');await key(' ');await tabTo('#confirmer-desinscription');await key('Enter');await ok(`!document.querySelector('#dialog-desinscription').open && document.activeElement.id==='message-profil' && SkillHub.inscriptions().length===1`,'desinscription');log('Profil : annulation et confirmation de désinscription au clavier, focus et stockage OK.');
await go('');await run('localStorage.clear()');
for(const path of ['index.html','connexion.html','inscription.html','cours-html.html','cours-css.html','cours-javascript.html','cours-react.html','cours-ux.html','cours-a11y.html']){
 await call('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});await go(path);await tabTo('.menu-toggle');await key('Enter');await ok(`!document.querySelector('#liens-navigation').hidden`,'menu '+path);await key('Escape');
}
log('Menu partagé : ouverture et fermeture clavier sur les neuf pages publiques OK.');
await go('');
const seen=new Set();for(let n=0;n<55;n++){await key('Tab');const item=await run(`({tag:document.activeElement.tagName,id:document.activeElement.id,html:document.activeElement.outerHTML.slice(0,150),visible:document.activeElement.tagName==='BODY'||!!document.activeElement.getClientRects().length})`);assert(item.visible,item.html);seen.add(item.html);}
for(let n=0;n<55;n++){await key('Tab',true);await ok(`document.activeElement.tagName==='BODY'||!!document.activeElement.getClientRects().length`,'retour visible');}
log('Accueil : 55 Tab et 55 Maj+Tab, aucun élément masqué recevant le focus ; '+seen.size+' cibles observées.');
assert.equal(errors.length,0,JSON.stringify(errors));
fs.writeFileSync('/tmp/tp2-extra-results.json',JSON.stringify(results,null,2));await call('Browser.close');ws.close();

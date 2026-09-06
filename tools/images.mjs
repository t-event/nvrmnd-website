// Lager WebP- og JPEG-varianter av bildene i assets/, via Chrome sitt canvas.
// Maskinen har ingen WebP-verktøy, men Chrome har.
//
// Bruk:
//   1. Start lokal server:   python3 -m http.server 8765
//   2. Start Chrome:  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//        --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/nvrmnd-chrome
//   3. Kjør:  node tools/images.mjs "$PWD"
//
// Jobbene står i lista under. Legg til nye linjer for et nytt cover.
//
// Coveret vises i rundt 610 px på desktop, og trinnene 640, 1100 og 1400 er
// valgt slik at hver skjermtetthet henter riktig fil og ikke mer:
//
//   vanlig 1x   ber om  607 px  ->  640   (54 KiB)
//   telefon 3x  ber om 1163 px  -> 1100  (128 KiB)
//   retina 2x   ber om 1215 px  -> 1400  (171 KiB)
//
// Endrer du `sizes` i HTML-en, flytter grensene seg og trinnene må vurderes
// på nytt. Mål det med skjermbilde-verktøyet, og husk å tømme hurtiglageret:
// Chrome gjenbruker en større variant den allerede har lastet ned.
//
// JPEG stopper på 1100. Den varianten hentes bare av nettlesere uten
// WebP-støtte, og de er så godt som borte i 2026.
//
// Liggende bilder: 700 og 1178 px. WebP rundt 0.80 i kvalitet er usynlig fra
// JPEG på denne siden, som uansett har skannelinjer over bildene.
import fs from 'node:fs';
const list=await (await fetch('http://127.0.0.1:9333/json/list')).json();
const page=list.find(t=>t.type==='page');
const ws=new WebSocket(page.webSocketDebuggerUrl);
let id=0;const p=new Map();
const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}))});
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id)}});
await new Promise(r=>ws.addEventListener('open',r));
await send('Runtime.enable');await send('Page.enable');
await send('Page.navigate',{url:'http://localhost:8765/'});
await new Promise(r=>setTimeout(r,1500));
// [kilde, bredde, format, kvalitet, utfil]
const jobs=[
  ['assets/need-me.jpg',1400,'image/webp',0.78,'assets/need-me-1400.webp'],
  ['assets/need-me.jpg',1100,'image/webp',0.80,'assets/need-me-1100.webp'],
  ['assets/need-me.jpg',1100,'image/jpeg',0.80,'assets/need-me-1100.jpg'],
  ['assets/need-me.jpg', 640,'image/webp',0.82,'assets/need-me-640.webp'],
  ['assets/need-me.jpg', 640,'image/jpeg',0.82,'assets/need-me-640.jpg'],
  ['assets/press.jpg',  1178,'image/webp',0.78,'assets/press-1178.webp'],
  ['assets/press.jpg',  1178,'image/jpeg',0.80,'assets/press-1178.jpg'],
  ['assets/press.jpg',   700,'image/webp',0.80,'assets/press-700.webp'],
  ['assets/press.jpg',   700,'image/jpeg',0.82,'assets/press-700.jpg'],
];
for (const [src,w,type,q,out] of jobs){
  const r=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`
    new Promise(res=>{const im=new Image();im.onload=()=>{const h=Math.round(im.naturalHeight*${w}/im.naturalWidth);
      const c=document.createElement('canvas');c.width=${w};c.height=h;const x=c.getContext('2d');
      x.imageSmoothingQuality='high';x.drawImage(im,0,0,${w},h);res(c.toDataURL('${type}',${q}));};im.src='/${src}?x='+Math.random();})`});
  const b64=r.result.value.split(',')[1];
  fs.writeFileSync(process.argv[2]+'/'+out,Buffer.from(b64,'base64'));
  console.log(out.padEnd(28), Math.round(Buffer.byteLength(b64,'base64')/1024)+' KiB');
}
ws.close();process.exit(0);

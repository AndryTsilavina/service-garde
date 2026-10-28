const C='sg-v2';
const PRE=['./','index.html','manifest.json','logo-app.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(PRE)).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||!(u.origin===location.origin||u.hostname==='www.gstatic.com'))return;
  const same=u.origin===location.origin;
  e.respondWith(
    fetch(same?r.url:r,same?{cache:'no-cache'}:undefined)
      .then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  );
});

// Shared motion preference: respect the OS and remember the page toggle.
(() => {
 const system=matchMedia('(prefers-reduced-motion: reduce)');
 const events=new EventTarget();
 let paused=false;
 try{paused=localStorage.getItem('gof-motion-paused')==='true';}catch{}
 function notify(){document.documentElement.classList.toggle('motion-paused',paused||system.matches);events.dispatchEvent(new Event('change'));}
 window.siteMotion={
  get matches(){return paused||system.matches;},
  get systemReduced(){return system.matches;},
  get paused(){return paused;},
  addEventListener:(...args)=>events.addEventListener(...args),
  setPaused(value){paused=value;try{localStorage.setItem('gof-motion-paused',String(value));}catch{}notify();}
 };
 system.addEventListener('change',notify);notify();
})();

// Set restoration before layout so a refresh always opens the 3D entrance.
(() => {
 const navigation=performance.getEntriesByType('navigation')[0];
 const fromReload=navigation?.type==='reload';
 history.scrollRestoration='manual';
 if(fromReload&&location.hash)history.replaceState(history.state,'',location.pathname+location.search);
 const startAtTop=fromReload||!location.hash||location.hash==='#world';
 if(!startAtTop)return;
 const reset=()=>window.scrollTo({top:0,left:0,behavior:'instant'});
 reset();
 window.addEventListener('pageshow',event=>{
  if(event.persisted)return;
  reset();requestAnimationFrame(reset);
 },{once:true});
})();

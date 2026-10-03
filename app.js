'use strict';
const reduceMotion = window.siteMotion;
function syncMotion(){document.body.classList.toggle('motion', !reduceMotion.matches);}
syncMotion();reduceMotion.addEventListener('change',syncMotion);
const motionToggle=document.querySelector('#motion-toggle');
function syncMotionToggle(){
 motionToggle.disabled=reduceMotion.systemReduced;
 motionToggle.textContent=reduceMotion.systemReduced?'시스템 모션 감소':reduceMotion.paused?'모션 켜기':'모션 끄기';
 motionToggle.setAttribute('aria-pressed',String(reduceMotion.matches));
}
motionToggle.addEventListener('click',()=>reduceMotion.setPaused(!reduceMotion.paused));
reduceMotion.addEventListener('change',syncMotionToggle);syncMotionToggle();
const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','메뉴 열기');}
menuButton.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',e=>{if(!mobileNav.hidden&&!mobileNav.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
window.matchMedia('(min-width: 601px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const sentenceObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('read');});},{threshold:.8,rootMargin:'0px 0px -12% 0px'});
document.querySelectorAll('.manifesto>span').forEach(el=>sentenceObserver.observe(el));
const productImage=document.querySelector('#product-image');
const productWindow=document.querySelector('.product-window');
const detailButton=document.querySelector('#detail-toggle');
const products={
 essential:{id:'essential-logo-tee',name:'ESSENTIAL LOGO',label:'Essential Logo',prefix:'product-essential',category:'BASIC',description:'ESSENTIAL 로고 그래픽 · 블랙',side:'back'},
 golden:{id:'golden-youth-art-tee',name:'GOLDEN YOUTH',label:'Golden Youth',prefix:'youth',category:'ARTWORK',description:'시그니처 캐릭터 그래픽 · 베이지',side:'back'},
 pure:{id:'pure-youth-art-tee',name:'PURE YOUTH',label:'Pure Youth',prefix:'product-pure-youth',category:'ARTWORK',description:'시그니처 캐릭터 그래픽 · 화이트',side:'back'},
 spirit:{id:'spirit-art-tee',name:'SPIRIT',label:'Spirit',prefix:'product-spirit',category:'ARTWORK',description:'레드 포인트와 SPIRIT 그래픽 · 화이트',side:'front'}
};
let selectedProduct='essential';
const sideButtons=[...document.querySelectorAll('[data-side]')];
function showProductSide(side){
 const product=products[selectedProduct];
 sideButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.side===side)));
 productImage.src=`assets/${product.prefix}-${side}.webp`;
 productImage.alt=`${product.label} 티셔츠 ${side==='back'?'뒷면':'앞면'}`;
}
function selectProduct(key){
 const product=products[key];
 if(!product)return;
 selectedProduct=key;
 document.querySelectorAll('[data-product]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.product===key)));
 productWindow.classList.remove('detail');
 detailButton.setAttribute('aria-pressed','false');detailButton.textContent='디테일 보기 +';
 document.querySelector('.product-tag').textContent=`${product.category} COLLECTION / ${String(Object.keys(products).indexOf(key)+1).padStart(2,'0')}`;
 document.querySelector('.product-caption strong').textContent=product.name;
 document.querySelector('.product-caption span').textContent=product.description;
 const link=document.querySelector('.product-copy .text-link');
 link.href=`https://graphicsoverfit.co.kr/Shop/Shop.html?p=${product.id}`;
 link.replaceChildren(document.createTextNode(`${product.label} 살펴보기 `));
 const arrow=document.createElement('span');arrow.textContent='↗';link.append(arrow);
 showProductSide(product.side);
}
sideButtons.forEach(button=>button.addEventListener('click',()=>showProductSide(button.dataset.side)));
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>selectProduct(button.dataset.product)));
selectProduct(selectedProduct);
detailButton.addEventListener('click',()=>{const expanded=productWindow.classList.toggle('detail');detailButton.setAttribute('aria-pressed',String(expanded));detailButton.textContent=expanded?'전체 보기 −':'디테일 보기 +';});
let ticking=false;
function updateScroll(){const rect=productWindow.getBoundingClientRect();if(!reduceMotion.matches&&rect.top<innerHeight&&rect.bottom>0){const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight*.75)));productWindow.style.setProperty('--product-scale',String(1.65-progress*.65));}else if(reduceMotion.matches){productWindow.style.setProperty('--product-scale','1');}ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});updateScroll();
const gallery=document.querySelector('.lookbook');
const shots=[...gallery.querySelectorAll('figure')];
const galleryDesktop=matchMedia('(min-width: 901px) and (pointer: fine)');
const prev=document.querySelector('#gallery-prev'),next=document.querySelector('#gallery-next');
function galleryState(){prev.disabled=gallery.scrollLeft<=2;next.disabled=gallery.scrollLeft>=gallery.scrollWidth-gallery.clientWidth-2;}
function shotPosition(index){return shots[index].offsetLeft-shots[0].offsetLeft;}
function currentShot(){
 let closest=0;
 shots.forEach((shot,index)=>{if(Math.abs(shotPosition(index)-gallery.scrollLeft)<Math.abs(shotPosition(closest)-gallery.scrollLeft))closest=index;});
 return closest;
}
function moveGallery(direction){setGalleryPosition(shotPosition(Math.max(0,Math.min(shots.length-1,currentShot()+direction))),true);}
prev.addEventListener('click',()=>moveGallery(-1));next.addEventListener('click',()=>moveGallery(1));
gallery.addEventListener('scroll',galleryState,{passive:true});window.addEventListener('resize',galleryState);galleryState();
gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1);}});
const dialog=document.querySelector('#art-dialog');
document.querySelectorAll('[data-image]').forEach(card=>card.addEventListener('click',()=>{document.querySelector('#dialog-image').src=card.dataset.image;document.querySelector('#dialog-image').alt=card.querySelector('img').alt;document.querySelector('#dialog-title').textContent=card.dataset.title;document.querySelector('#dialog-description').textContent=card.dataset.description;dialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.querySelector('#year').textContent=new Date().getFullYear();
let dragStart=null;
gallery.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;dragStart={x:e.clientX,left:gallery.scrollLeft};gallery.setPointerCapture(e.pointerId);gallery.classList.add('dragging');});
gallery.addEventListener('pointermove',e=>{if(dragStart)setGalleryPosition(dragStart.left-(e.clientX-dragStart.x));});
function stopDrag(){dragStart=null;gallery.classList.remove('dragging');galleryState();}
gallery.addEventListener('pointerup',stopDrag);gallery.addEventListener('pointercancel',stopDrag);gallery.addEventListener('lostpointercapture',stopDrag);
const heroPhoto=document.querySelector('.hero-photo');
// A native vertical scroll range drives the sticky horizontal gallery.
const peopleSection=document.querySelector('.people');
const peopleTrack=document.createElement('div');
peopleTrack.className='people-track';
peopleTrack.id=peopleSection.id;
peopleSection.removeAttribute('id');
peopleSection.before(peopleTrack);
peopleTrack.append(peopleSection);
let galleryDistance=0;
let galleryFrame=0;
function galleryStart(){return peopleTrack.getBoundingClientRect().top+window.scrollY;}
function setGalleryPosition(position,smooth=false){
  const target=Math.max(0,Math.min(gallery.scrollWidth-gallery.clientWidth,position));
  if(peopleTrack.classList.contains('scroll-driven')){
    window.scrollTo({top:galleryStart()+target,behavior:smooth?'smooth':'instant'});
  }else{gallery.scrollTo({left:target,behavior:smooth&&!reduceMotion.matches?'smooth':'instant'});}
}
function renderGalleryScroll(){
  galleryFrame=0;
  if(!peopleTrack.classList.contains('scroll-driven'))return;
  const position=Math.max(0,Math.min(galleryDistance,-peopleTrack.getBoundingClientRect().top));
  gallery.scrollLeft=position;
  peopleSection.style.setProperty('--gallery-progress',String(galleryDistance?position/galleryDistance:0));
  galleryState();
}
function measureGalleryScroll(){
  // Short landscape windows and reduced-motion preferences retain manual browsing.
  const enabled=!reduceMotion.matches&&window.innerHeight>=620&&galleryDesktop.matches;
  const width=gallery.clientWidth*(innerWidth<=600?.78:innerWidth<=900?.42:.31);
  gallery.style.setProperty('--shot-width',`${width}px`);
  gallery.style.setProperty('--gallery-edge',`${Math.max(0,(gallery.clientWidth-width)/2)}px`);
  peopleTrack.classList.toggle('scroll-driven',enabled);
  galleryDistance=Math.max(0,gallery.scrollWidth-gallery.clientWidth);
  peopleTrack.style.height=enabled?`${peopleSection.offsetHeight+galleryDistance}px`:'';
  document.querySelector('.gallery-bottom span:last-child').textContent=enabled?'SCROLL DOWN TO EXPLORE →':'DRAG / SWIPE TO EXPLORE ↔';
  gallery.setAttribute('aria-label',enabled?'착용 사진 갤러리. 세로 스크롤 또는 번호 버튼으로 탐색하세요.':'착용 사진 갤러리. 좌우로 쓸어 넘기거나 방향키와 번호 버튼으로 탐색하세요.');
  renderGalleryScroll();
  galleryState();
}
window.addEventListener('scroll',()=>{if(!galleryFrame)galleryFrame=requestAnimationFrame(renderGalleryScroll);},{passive:true});
window.addEventListener('resize',measureGalleryScroll);
reduceMotion.addEventListener('change',measureGalleryScroll);
galleryDesktop.addEventListener('change',measureGalleryScroll);
new ResizeObserver(measureGalleryScroll).observe(gallery);
measureGalleryScroll();

// Play with the palette: a small, tangible way to make the page your own.
const palette=document.createElement('div');
palette.className='palette';palette.setAttribute('role','group');palette.setAttribute('aria-label','페이지 포인트 컬러 선택');
palette.innerHTML='<span>MAKE IT YOUR COLOR</span><button aria-label="라임 컬러" aria-pressed="true" data-color="lime" style="--swatch:#d3ef7a"></button><button aria-label="라일락 컬러" aria-pressed="false" data-color="lilac" style="--swatch:#c8b8f3"></button><button aria-label="코랄 컬러" aria-pressed="false" data-color="coral" style="--swatch:#ffa889"></button>';
document.querySelector('.hero-copy').append(palette);
palette.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  document.body.dataset.palette=button.dataset.color;
  palette.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{
  if(reduceMotion.matches||e.pointerType!=='mouse')return;
  const bounds=hero.getBoundingClientRect();
  hero.style.setProperty('--pointer-x',`${(e.clientX-bounds.left-bounds.width/2)*.025}px`);
  hero.style.setProperty('--pointer-y',`${(e.clientY-bounds.top-bounds.height/2)*.025}px`);
});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--pointer-x','0px');hero.style.setProperty('--pointer-y','0px');});
document.querySelectorAll('.art-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(reduceMotion.matches||e.pointerType!=='mouse')return;
    const rect=card.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;
    card.style.setProperty('--tilt-x',`${-y*9}deg`);card.style.setProperty('--tilt-y',`${x*9}deg`);
  });
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
});
shots.forEach(shot=>{const frame=document.createElement('div');frame.className='look-frame';const img=shot.querySelector('img');img.before(frame);frame.append(img);});
const shotNav=document.createElement('div');shotNav.className='shot-nav';shotNav.setAttribute('role','group');shotNav.setAttribute('aria-label','착용 사진 장면 선택');
shots.forEach((shot,index)=>{const button=document.createElement('button');button.textContent=String(index+1).padStart(2,'0');button.setAttribute('aria-label',`착용 사진 ${index+1}번으로 이동`);button.addEventListener('click',()=>setGalleryPosition(shotPosition(index),true));shotNav.append(button);});
document.querySelector('.gallery-controls').prepend(shotNav);
const shotStatus=document.createElement('span');shotStatus.className='shot-status';document.querySelector('.gallery-bottom span:first-child').replaceWith(shotStatus);
let lastGalleryPosition=gallery.scrollLeft,lastGalleryTime=performance.now(),settleGallery;
function animateGallery(){
    const active=currentShot();
  shotStatus.textContent=`${String(active+1).padStart(2,'0')} / ${String(shots.length).padStart(2,'0')} — ${shots[active].querySelector('figcaption').childNodes[0].textContent.split('/')[1].trim()}`;
  shotNav.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
  const now=performance.now(),speed=(gallery.scrollLeft-lastGalleryPosition)/Math.max(16,now-lastGalleryTime);
  lastGalleryPosition=gallery.scrollLeft;lastGalleryTime=now;
  shots.forEach((shot,index)=>shot.classList.toggle('current-shot',index===active));
  if(!reduceMotion.matches){
    const bounds=gallery.getBoundingClientRect();
    shots.forEach(shot=>{const rect=shot.getBoundingClientRect(),offset=(rect.left+rect.width/2-bounds.left)/bounds.width-.5;
      shot.style.setProperty('--image-shift',`${Math.max(-1,Math.min(1,offset))*-18}px`);
    });
    gallery.style.setProperty('--scroll-skew',`${Math.max(-2.5,Math.min(2.5,speed*-.8))}deg`);
    clearTimeout(settleGallery);settleGallery=setTimeout(()=>gallery.style.setProperty('--scroll-skew','0deg'),110);
  }
}
gallery.addEventListener('scroll',animateGallery,{passive:true});
window.addEventListener('resize',animateGallery);reduceMotion.addEventListener('change',()=>{animateGallery();updateScroll();});
animateGallery();measureGalleryScroll();
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.classList.toggle('in-view',entry.isIntersecting);}),{threshold:.15});
document.querySelectorAll('.archive .section-heading,.art-card,.closing-link').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});

// Scroll-driven still-photo adaptation; no video runtime is required.
const takeoverTrack=document.querySelector('.takeover-track');
const takeoverStage=document.querySelector('.takeover-stage');
let takeoverFrame=0;
const takeoverClamp=value=>Math.max(0,Math.min(1,value));
function renderTakeover(){
  takeoverFrame=0;
  const enabled=takeoverTrack.classList.contains('is-scroll-driven');
  const range=takeoverTrack.offsetHeight-takeoverStage.offsetHeight;
  const progress=enabled?takeoverClamp(-takeoverTrack.getBoundingClientRect().top/Math.max(1,range)):1;
  const punch=takeoverClamp((progress-.04)/.19);
  const settle=takeoverClamp((progress-.23)/.09);
  const scale=punch<1?.67+.365*(1-Math.pow(1-punch,4)):1.035-.035*settle;
  const support=takeoverClamp((progress-.61)/.12);
  takeoverStage.style.setProperty('--takeover-scale',enabled?scale:1);
  takeoverStage.style.setProperty('--takeover-title-opacity',enabled?takeoverClamp(progress/.07):1);
  takeoverStage.style.setProperty('--takeover-model-scale',enabled?1+.045*takeoverClamp(progress/.56):1);
  takeoverStage.style.setProperty('--takeover-model-opacity',enabled?(progress<.56?1:0):.72);
  takeoverStage.style.setProperty('--takeover-support-opacity',enabled?support:1);
  takeoverStage.style.setProperty('--takeover-support-clip',`${enabled?(1-support)*100:0}%`);
}
function measureTakeover(){
  takeoverTrack.classList.toggle('is-scroll-driven',!reduceMotion.matches&&innerHeight>=620);
  renderTakeover();
}
window.addEventListener('scroll',()=>{if(!takeoverFrame)takeoverFrame=requestAnimationFrame(renderTakeover);},{passive:true});
window.addEventListener('resize',measureTakeover);
reduceMotion.addEventListener('change',measureTakeover);
measureTakeover();

// Pause the decorative rainbow when the collage is outside the viewport.
const colorpopObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>entry.target.classList.toggle('colorpop-paused',!entry.isIntersecting));
});
colorpopObserver.observe(heroPhoto);

// Cursor proximity repulsion, adapted for the existing scroll-scaled title.
(() => {
 const title=document.querySelector('#hero-title');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const letters=[];
 title.setAttribute('aria-label','WEAR YOUR GRAPHICS.');
 [...title.children].forEach(line=>{
  line.setAttribute('aria-hidden','true');
  const nodes=[...line.childNodes];
  nodes.forEach(node=>{
   const dot=node.nodeType===1&&node.classList.contains('title-dot');
   const fragment=document.createDocumentFragment();
   for(const character of node.textContent){
    const anchor=document.createElement('span');anchor.className='repel-anchor';
    const glyph=document.createElement('span');glyph.className='repel-glyph'+(dot?' title-dot':'');glyph.textContent=character===' '?'\u00a0':character;
    anchor.append(glyph);fragment.append(anchor);
    if(character!==' ')letters.push({anchor,glyph,x:0,y:0,vx:0,vy:0});
   }
   node.replaceWith(fragment);
  });
 });
 let pointer=null,visible=false,frame=0,last=0;
 const enabled=()=>visible&&!document.hidden&&!reduceMotion.matches&&finePointer.matches;
 function reset(){
  pointer=null;cancelAnimationFrame(frame);frame=0;last=0;
  letters.forEach(letter=>{letter.x=letter.y=letter.vx=letter.vy=0;letter.glyph.style.transform='';});
 }
 function start(){if(enabled()&&!frame){last=0;frame=requestAnimationFrame(tick);}}
 function tick(now){
  frame=0;if(!enabled()){reset();return;}
  const dt=Math.min((now-(last||now-16.67))/1000,1/30);last=now;
  const scale=title.getBoundingClientRect().width/Math.max(1,title.offsetWidth);
  const radius=Math.min(180,Math.max(100,innerWidth*.09));
  let moving=false;
  letters.forEach(letter=>{
   const rect=letter.anchor.getBoundingClientRect();
   let tx=0,ty=0;
   if(pointer){
    const dx=rect.left+rect.width/2-pointer.x,dy=rect.top+rect.height/2-pointer.y;
    const distance=Math.hypot(dx,dy);
    if(distance<radius){const force=45*Math.pow(1-distance/radius,2)/scale;tx=(distance?dx/distance:0)*force;ty=(distance?dy/distance:-1)*force;}
   }
   // Small integration steps keep the spring stable after a slow frame.
   for(let i=0;i<3;i++){
    const step=dt/3;
    letter.vx+=((tx-letter.x)*180-letter.vx*14)/.4*step;
    letter.vy+=((ty-letter.y)*180-letter.vy*14)/.4*step;
    letter.x+=letter.vx*step;letter.y+=letter.vy*step;
   }
   const settled=Math.abs(tx-letter.x)+Math.abs(ty-letter.y)+Math.abs(letter.vx)+Math.abs(letter.vy)<.05;
   if(settled){letter.x=tx;letter.y=ty;letter.vx=letter.vy=0;}else moving=true;
   letter.glyph.style.transform=`translate(${letter.x.toFixed(3)}px,${letter.y.toFixed(3)}px)`;
  });
  if(moving)frame=requestAnimationFrame(tick);else last=0;
 }
 takeoverStage.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!enabled())return;
  pointer={x:event.clientX,y:event.clientY};start();
 });
 takeoverStage.addEventListener('pointerleave',()=>{pointer=null;start();});
 window.addEventListener('scroll',()=>{pointer=null;start();},{passive:true});
 window.addEventListener('blur',reset);
 window.addEventListener('resize',reset);
 document.addEventListener('visibilitychange',reset);
 reduceMotion.addEventListener('change',reset);finePointer.addEventListener('change',reset);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)reset();},{threshold:0}).observe(takeoverStage);
})();

// Physically integrated spring presets; each letter runs on its own staggered clock.
(() => {
 const heading=document.querySelector('.manifesto');
 const lines=[...heading.children];
 const presets=[
  {mode:'center',stiffness:220,damping:16,staggerDuration:.04,staggerFrom:'center'},
  {mode:'bouncy',stiffness:220,damping:8,staggerDuration:.04,staggerFrom:'first'},
  {mode:'snappy',stiffness:500,damping:22,staggerDuration:.02,staggerFrom:'first'}
 ];
 heading.setAttribute('aria-label',lines.map(line=>line.textContent).join(' '));
 lines.forEach((line,lineIndex)=>{
  const preset=presets[lineIndex],chars=[...line.textContent],letters=[];
  line.textContent='';line.classList.add('manifesto-cascade',`cascade-${preset.mode}`);
  line.setAttribute('aria-hidden','true');
  chars.forEach((char,index)=>{
   const origin=preset.staggerFrom==='center'?(chars.length-1)/2:0;
   const cell=document.createElement('span');cell.className='cascade-letter';
   const front=document.createElement('span');front.className='cascade-front';front.textContent=char===' '?'\u00a0':char;
   const echo=front.cloneNode(true);echo.className='cascade-echo';cell.append(front,echo);line.append(cell);
   letters.push({front,echo,delay:Math.abs(index-origin)*preset.staggerDuration,x:0,v:0});
  });
  let frame=0,start=0,last=0;
  function reset(){
   cancelAnimationFrame(frame);frame=0;start=last=0;
   letters.forEach(letter=>{letter.x=letter.v=0;letter.front.style.cssText='';letter.echo.style.cssText='';});
  }
  function tick(now){
   frame=0;if(reduceMotion.matches||document.hidden){reset();return;}
   if(!start)start=last=now;
   const elapsed=(now-start)/1000,previous=(last-start)/1000;last=now;
   let finished=true;
   letters.forEach(letter=>{
    if(elapsed<letter.delay){finished=false;return;}
    const dt=Math.min(.05,Math.max(0,elapsed-Math.max(previous,letter.delay)));
    const steps=Math.max(1,Math.ceil(dt/(1/240))),step=dt/steps;
    for(let i=0;i<steps;i++){
     letter.v+=(preset.stiffness*(1-letter.x)-preset.damping*letter.v)*step;
     letter.x+=letter.v*step;
    }
    const settled=Math.abs(1-letter.x)<.001&&Math.abs(letter.v)<.005;
    if(!settled)finished=false;
    const progress=letter.x;
    letter.front.style.transform=`translateY(${-70*progress}%) rotateX(${85*progress}deg)`;
    letter.front.style.opacity=String(Math.max(0,1-progress*2));
    letter.echo.style.transform=`translateY(${75*(1-progress)}%) rotateX(${-85*(1-progress)}deg)`;
    letter.echo.style.opacity=String(Math.max(0,Math.min(1,progress*3)));
   });
   if(finished){reset();return;}
   frame=requestAnimationFrame(tick);
  }
  function play(){if(reduceMotion.matches||document.hidden||frame)return;frame=requestAnimationFrame(tick);}
  line.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')play();});
  line.addEventListener('click',play);
  reduceMotion.addEventListener('change',reset);
  document.addEventListener('visibilitychange',reset);
  window.addEventListener('blur',reset);
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)reset();}).observe(line);
 });
})();

// Click-triggered cascade retains the closing link's normal navigation.
(() => {
 const link=document.querySelector('.closing-link');
 const arrow=link.querySelector('.closing-arrow');
 link.setAttribute('aria-label','MAKE IT YOUR OWN. 스토어 보기');
 link.replaceChildren();let index=0;
 ['MAKE IT','YOUR OWN.'].forEach((text,row)=>{
  const line=document.createElement('span');line.className='closing-cascade-line'+(row?' closing-outline':'');line.setAttribute('aria-hidden','true');
  for(const char of text){
   const cell=document.createElement('span');cell.className='cascade-letter';cell.style.setProperty('--cascade-delay',`${index++*.025}s`);
   const front=document.createElement('span');front.className='cascade-front';front.textContent=char===' '?'\u00a0':char;
   const echo=front.cloneNode(true);echo.className='cascade-echo';cell.append(front,echo);line.append(cell);
  }
  if(row)line.append(arrow);link.append(line);
 });
 let running=false,animations=[],generation=0;
 // Sample the same mass-1 spring as the default preset (220 / 16).
 const frontFrames=[],echoFrames=[];
 let x=0,v=0,time=0;
 for(let sample=0;sample<360;sample++){
  frontFrames.push({transform:`translateY(${-70*x}%) rotateX(${85*x}deg)`,opacity:Math.max(0,1-x*2)});
  echoFrames.push({transform:`translateY(${75*(1-x)}%) rotateX(${-85*(1-x)}deg)`,opacity:Math.max(0,Math.min(1,x*3))});
  if(sample>1&&Math.abs(1-x)<.001&&Math.abs(v)<.005)break;
  for(let step=0;step<4;step++){v+=(220*(1-x)-16*v)/240;x+=v/240;}
  time+=1000/60;
 }
 const stop=()=>{generation++;animations.forEach(animation=>animation.cancel());animations=[];running=false;link.removeAttribute('aria-busy');};
 link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0||reduceMotion.matches)return;
  event.preventDefault();if(running)return;
  running=true;link.setAttribute('aria-busy','true');const run=++generation;
  [...link.querySelectorAll('.cascade-letter')].forEach((cell,index)=>{
   const options={duration:time,delay:index*40,fill:'both',easing:'linear'};
   animations.push(cell.querySelector('.cascade-front').animate(frontFrames,options),cell.querySelector('.cascade-echo').animate(echoFrames,options));
  });
  Promise.all(animations.map(animation=>animation.finished)).then(()=>{
   if(run!==generation)return;
   stop();window.location.assign(link.href);
  }).catch(()=>{});
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape')stop();});
 window.addEventListener('pagehide',stop);
 reduceMotion.addEventListener('change',stop);
})();

// Section-scoped Collection Surfer: a finite track leading into the lookbook.
(() => {
 const section=document.querySelector('.archive'),grid=section.querySelector('.art-grid');
 const cards=[...grid.querySelectorAll('.art-card')];
 const desktop=matchMedia('(min-width: 901px) and (min-height: 680px) and (pointer: fine)');
 const track=document.createElement('div');track.className='archive-track';
 track.id=section.id;section.removeAttribute('id');section.before(track);track.append(section);
 const controls=document.createElement('div');controls.className='surfer-controls';controls.hidden=true;
 const status=document.createElement('span');status.className='surfer-status';
 const navigation=document.createElement('div');navigation.setAttribute('role','group');navigation.setAttribute('aria-label','아트워크 선택');
 const hint=document.createElement('span');hint.textContent='SCROLL TO EXPLORE ↓';
 controls.append(status,navigation,hint);section.append(controls);
 let enabled=false,frame=0,step=0;
 const buttons=cards.map((card,index)=>{
  const button=document.createElement('button');button.type='button';button.textContent=String(index+1).padStart(2,'0');
  button.setAttribute('aria-label',`${card.querySelector('.card-caption span').textContent} 작품으로 이동`);
  button.addEventListener('click',()=>go(index));navigation.append(button);
  card.addEventListener('focus',()=>{if(enabled)go(index,false);});
  return button;
 });
 function go(index,smooth=true){
  if(!enabled)return;
  const top=track.getBoundingClientRect().top+window.scrollY;
  window.scrollTo({top:top+index*step,behavior:smooth?'smooth':'instant'});
 }
 function render(){
  frame=0;if(!enabled)return;
  const bounds=track.getBoundingClientRect();
  const position=Math.max(0,Math.min(cards.length-1,-bounds.top/step));
  const current=Math.round(position);
  cards.forEach((card,index)=>{
   const offset=index-position,depth=Math.abs(offset);
   card.style.setProperty('--surf-x',`${offset*Math.min(innerWidth*.19,290)}px`);
   card.style.setProperty('--surf-y',`${-offset*Math.min(innerHeight*.18,165)}px`);
   card.style.setProperty('--surf-z',`${-depth*150}px`);
   card.style.setProperty('--surf-angle',`-18deg`);
   card.style.opacity=String(Math.max(0,1-Math.max(0,depth-1)*.6));
   card.style.zIndex=String(20-Math.round(depth*3));
   card.style.visibility=depth>2.6?'hidden':'visible';
   card.classList.toggle('surfer-current',index===current);
   buttons[index].setAttribute('aria-pressed',String(index===current));
  });
  status.textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')} — ${cards[current].querySelector('.card-caption span').textContent}`;
 }
 function measure(){
  enabled=desktop.matches&&!reduceMotion.matches;
  track.classList.toggle('surfer-enabled',enabled);controls.hidden=!enabled;
  step=Math.max(400,innerHeight*.7);
  track.style.height=enabled?`${innerHeight+step*(cards.length-1)}px`:'';
  if(enabled){render();return;}
  cards.forEach(card=>{['--surf-x','--surf-y','--surf-z','--surf-angle','opacity','z-index','visibility'].forEach(name=>card.style.removeProperty(name));card.classList.remove('surfer-current');});
 }
 window.addEventListener('scroll',()=>{if(enabled&&!frame)frame=requestAnimationFrame(render);},{passive:true});
 window.addEventListener('resize',measure);desktop.addEventListener('change',measure);reduceMotion.addEventListener('change',measure);
 measure();
})();

'use strict';
(() => {
 const track=document.querySelector('.world-track'),stage=document.querySelector('.world-stage');
 const camera=document.querySelector('.world-camera'),cards=[...document.querySelectorAll('.world-art')];
 const detail=document.querySelector('.world-detail'),returnButton=document.querySelector('.world-return');
 const motion=window.siteMotion;
 const works=[['RETRO STARS','오렌지와 크림 컬러, 별 모티프가 만난 빈티지 레터링.'],['GOF STARS','자유로운 붓 자국과 별빛으로 표현한 GOF.'],['GRAFFITI LOGO','왕관을 얹은 오렌지 레터링. 벽에서 튀어나온 그래픽스 오버핏.'],['CUT & PASTE','서로 다른 조각이 만나 하나의 이름이 되는 순간.']];
 let selected=-1,opener=null,px=0,py=0,frame=0,visible=true;
 function render(){
  frame=0;
  if(!visible)return;
  const rect=track.getBoundingClientRect(),range=Math.max(1,track.offsetHeight-stage.offsetHeight);
  const progress=motion.matches?0:Math.max(0,Math.min(1,-rect.top/range));
  stage.style.setProperty('--world-progress',progress);
  stage.style.setProperty('--world-title-y',`${progress*-65}px`);
  const focus=selected>=0;
  camera.style.transform=motion.matches?'none':`translateZ(${focus?0:progress*75}px) rotateX(${focus?0:py*-5+progress*3}deg) rotateY(${focus?0:px*9-progress*7}deg)`;
  document.querySelector('.world-depth').textContent=`DEPTH / ${String(Math.round(progress*100)).padStart(3,'0')}`;
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 function select(index,source){
  finishIntro();
  if(selected===index){close();return;}
  selected=index;opener=source;stage.classList.add('art-selected');
  cards.forEach((card,i)=>{card.classList.toggle('is-selected',i===index);card.setAttribute('aria-pressed',String(i===index));});
  document.querySelectorAll('[data-pick]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  detail.querySelector('.world-detail-number').textContent=`0${index+1} / ORIGINAL ARTWORK`;
  detail.querySelector('h3').textContent=works[index][0];detail.querySelector('p').textContent=works[index][1];detail.hidden=false;returnButton.focus({preventScroll:true});
  schedule();
 }
 function close(){selected=-1;stage.classList.remove('art-selected');detail.hidden=true;cards.forEach(card=>{card.classList.remove('is-selected');card.setAttribute('aria-pressed','false');});document.querySelectorAll('[data-pick]').forEach(button=>button.setAttribute('aria-pressed','false'));schedule();if(opener)opener.focus({preventScroll:true});}
 cards.forEach((card,i)=>card.addEventListener('click',()=>select(i,card)));
 document.querySelectorAll('[data-pick]').forEach((button,i)=>button.addEventListener('click',()=>select(i,button)));
 returnButton.addEventListener('click',close);
 // 선택 상태에서 카드·설명 패널·버튼·링크 바깥(빈 공간)을 누르면 닫는다.
 stage.addEventListener('click',event=>{if(selected>=0&&!event.target.closest('.world-art,.world-detail,[data-pick],a,button'))close();});
 stage.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected>=0){event.preventDefault();close();}});
 stage.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||motion.matches)return;const rect=stage.getBoundingClientRect();px=(event.clientX-rect.left)/rect.width-.5;py=(event.clientY-rect.top)/rect.height-.5;schedule();});
 stage.addEventListener('pointerleave',()=>{px=0;py=0;schedule();});
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);motion.addEventListener('change',schedule);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();}).observe(track);
 // Play the original swirling entrance once, then keep the settled layout.
 const orbits=cards.map((card,index)=>{
  const orbit=document.createElement('div');orbit.className='world-vortex';
  orbit.style.setProperty('--vortex-duration',`${2.7+index*.22}s`);
  orbit.style.setProperty('--vortex-start',`${-760-index*65}deg`);
  card.before(orbit);orbit.append(card);return orbit;
 });
 const fromReload=performance.getEntriesByType('navigation')[0]?.type==='reload';
 let introPlayed=fromReload;
 function finishIntro(){stage.classList.remove('vortex-entering','vortex-pending');}
 if(!motion.matches&&!fromReload)stage.classList.add('vortex-pending');
 // 이미지 디코드가 끝난 뒤(최대 600ms 대기) 회오리를 시작해 첫 프레임이 끊기지 않게 한다.
 const decoded=Promise.race([Promise.all(cards.map(card=>card.querySelector('img').decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,600))]);
 const introObserver=new IntersectionObserver(entries=>{
  if(!entries[0].isIntersecting||introPlayed)return;
  introPlayed=true;introObserver.disconnect();
  if(motion.matches){finishIntro();return;}
  decoded.then(()=>{if(motion.matches){finishIntro();return;}stage.classList.remove('vortex-pending');stage.classList.add('vortex-entering');});
 },{threshold:.2});
 if(!fromReload)introObserver.observe(stage);
 orbits[orbits.length-1].addEventListener('animationend',event=>{if(event.animationName==='world-vortex-arrival')finishIntro();});
 motion.addEventListener('change',()=>{if(motion.matches){introPlayed=true;introObserver.disconnect();finishIntro();}});
 render();
})();

// Letter Cascade: staggered split-flap motion for the entrance heading.
(() => {
 const title=document.querySelector('#world-title');
 const stage=document.querySelector('.world-stage');
 const motion=window.siteMotion;
 const hover=matchMedia('(hover: hover) and (pointer: fine)');
 title.setAttribute('aria-label','STEP INSIDE YOUR WORLD.');
 title.replaceChildren();
 let index=0;
 for(const [lineIndex,text] of ['STEP INSIDE','YOUR WORLD.'].entries()){
  const line=document.createElement(lineIndex?'i':'span');
  line.classList.add('cascade-line');line.setAttribute('aria-hidden','true');
  for(const char of text){
   const cell=document.createElement('span');cell.className='cascade-letter';
   cell.style.setProperty('--cascade-delay',`${index*.04}s`);
   const front=document.createElement('span');front.className='cascade-front';front.textContent=char===' '?'\u00a0':char;
   const echo=front.cloneNode(true);echo.className='cascade-echo';
   cell.append(front,echo);line.append(cell);index++;
  }
  title.append(line);
 }
 let inside=false,timer=0;
 function reset(){clearTimeout(timer);timer=0;inside=false;title.classList.remove('cascade-playing');}
 function play(){
  if(motion.matches||document.hidden||stage.classList.contains('art-selected')||timer)return;
  title.classList.add('cascade-playing');
  timer=setTimeout(()=>{title.classList.remove('cascade-playing');timer=0;},(index-1)*40+900);
 }
 stage.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!hover.matches)return;
  const r=title.getBoundingClientRect();
  const over=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
  if(over&&!inside)play();inside=over;
 });
 stage.addEventListener('pointerleave',()=>{inside=false;});
 // 터치에는 호버가 없으므로 제목 영역을 누르면 한 번 재생한다.
 stage.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse')return;
  const r=title.getBoundingClientRect();
  if(event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom)play();
 });
 motion.addEventListener('change',reset);
 document.addEventListener('visibilitychange',reset);
 window.addEventListener('blur',reset);
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)reset();}).observe(stage);
})();

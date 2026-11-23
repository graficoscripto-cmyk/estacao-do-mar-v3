/* Estação do Mar v3 — motion (GSAP só em transform/opacity) — multipáginas */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var html=document.documentElement;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasG=typeof window.gsap!=='undefined';
var anim=hasG&&!reduce;
html.classList.remove('js-off');
if(anim){gsap.registerPlugin(ScrollTrigger);html.classList.add('anim');}
var WA='5513997692440';
function waUrl(t){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(t)}

/* ---------- bolhas ---------- */
$$('[data-bubbles]').forEach(function(c){
  var n=+c.getAttribute('data-bubbles')||12;
  for(var i=0;i<n;i++){
    var b=document.createElement('i');b.className='bub';
    var d=8+Math.random()*9;
    b.style.setProperty('--x',(Math.random()*96).toFixed(1)+'%');
    b.style.setProperty('--s',(6+Math.random()*18).toFixed(0)+'px');
    b.style.setProperty('--d',d.toFixed(1)+'s');
    b.style.setProperty('--w',(-Math.random()*d).toFixed(1)+'s');
    b.style.setProperty('--dx',((Math.random()*60)-30).toFixed(0)+'px');
    c.appendChild(b);
  }
});

/* ---------- navbar com auto-hide ---------- */
var nav=$('#nav'),menu=$('#menu'),menuBtn=$('#menuBtn'),menuOpen=false,lastY=window.pageYOffset,tick=false;
window.addEventListener('scroll',function(){
  if(tick)return;tick=true;
  requestAnimationFrame(function(){
    var y=window.pageYOffset,dy=y-lastY;
    if(Math.abs(dy)>6){nav.classList.toggle('is-hidden',dy>0&&y>140&&!menuOpen);lastY=y}
    tick=false;
  });
},{passive:true});

/* ---------- menu completo ---------- */
function openMenu(){
  menuOpen=true;menu.classList.add('is-open');menuBtn.setAttribute('aria-expanded','true');
  html.style.overflow='hidden';
  if(anim){gsap.fromTo(menu,{opacity:0,y:'-3%'},{opacity:1,y:0,duration:.45,ease:'power3.out',overwrite:true});
    gsap.fromTo('.menu__g,.menu__foot',{opacity:0,y:24},{opacity:1,y:0,duration:.6,stagger:.05,delay:.12,ease:'power3.out',overwrite:true});}
  else{menu.style.opacity=1;menu.style.transform='none'}
  setTimeout(function(){$('#menuX').focus()},50);
}
function closeMenu(instant){
  if(!menuOpen)return;menuOpen=false;menuBtn.setAttribute('aria-expanded','false');html.style.overflow='';
  var done=function(){menu.classList.remove('is-open');menu.style.opacity='';menu.style.transform=''};
  if(anim&&!instant)gsap.to(menu,{opacity:0,y:'-3%',duration:.3,ease:'power2.in',overwrite:true,onComplete:done});else done();
}
menuBtn.addEventListener('click',openMenu);
$('#menuX').addEventListener('click',function(){closeMenu();menuBtn.focus()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menuOpen){closeMenu();menuBtn.focus()}});
$$('[data-m]').forEach(function(a){a.addEventListener('click',function(){closeMenu(true)})});

/* ---------- hero (só na home) ---------- */
var slides=$$('.slide'),dots=$$('[data-dot]'),cur=0,busy=false,auto=null,expanded=false;
function heroIn(i){
  if(!anim||!slides.length)return;
  var s=slides[i];
  gsap.fromTo($('.slide__media img',s),{scale:1.16},{scale:1.02,duration:9,ease:'power1.out',overwrite:true});
  gsap.fromTo($$('.hero__h1,.slide__eyebrow,.slide__title,.slide__p,.linkbtn,.slide__row',s),{opacity:0,y:26},{opacity:1,y:0,duration:.8,stagger:.08,ease:'power3.out',overwrite:true});
}
function setDot(n){dots.forEach(function(d,i){if(i===n)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')})}
function go(n){
  n=(n+slides.length)%slides.length;if(n===cur||busy)return;
  var a=slides[cur],b=slides[n];busy=true;
  b.classList.add('is-active');
  if(anim){
    gsap.fromTo(b,{opacity:0},{opacity:1,duration:.8,ease:'power2.inOut',overwrite:true});
    gsap.to(a,{opacity:0,duration:.8,ease:'power2.inOut',overwrite:true,onComplete:function(){a.classList.remove('is-active');gsap.set(a,{clearProps:'opacity'});gsap.set(b,{clearProps:'opacity'});busy=false}});
    heroIn(n);
  }else{a.classList.remove('is-active');busy=false}
  cur=n;setDot(n);
}
function play(){stop();if(reduce||expanded||!slides.length)return;auto=setInterval(function(){if(!document.hidden)go(cur+1)},7500)}
function stop(){if(auto){clearInterval(auto);auto=null}}
var stg=$('#stage');
if(stg){
  $('[data-next]').addEventListener('click',function(){go(cur+1);play()});
  $('[data-prev]').addEventListener('click',function(){go(cur-1);play()});
  dots.forEach(function(d,i){d.addEventListener('click',function(){go(i);play()})});
  $$('[data-more]').forEach(function(b){b.addEventListener('click',function(){
    var more=b.previousElementSibling,open=more.hasAttribute('hidden');
    if(open)more.removeAttribute('hidden');else more.setAttribute('hidden','');
    b.setAttribute('aria-expanded',open);b.textContent=open?'Ver menos':'Ver mais';
    if(open&&anim)gsap.fromTo(more,{opacity:0,y:10},{opacity:1,y:0,duration:.4});
    expanded=$$('.slide__more').some(function(m){return !m.hasAttribute('hidden')});
    if(expanded)stop();else play();
  })});
  var sx=null;
  stg.addEventListener('pointerdown',function(e){sx=e.clientX});
  stg.addEventListener('pointerup',function(e){if(sx===null)return;var dx=e.clientX-sx;sx=null;if(Math.abs(dx)>60){go(cur+(dx<0?1:-1));play()}});
  stg.addEventListener('pointercancel',function(){sx=null});
  stg.addEventListener('mouseenter',stop);stg.addEventListener('mouseleave',play);
}

/* ---------- simulador ---------- */
var sel={};
$$('.q [data-q]').forEach(function(g){
  var key=g.getAttribute('data-q');
  $$('.opt',g).forEach(function(o){o.addEventListener('click',function(){
    var was=o.getAttribute('aria-pressed')==='true';
    $$('.opt',g).forEach(function(x){x.setAttribute('aria-pressed','false')});
    if(!was){o.setAttribute('aria-pressed','true');sel[key]=o.textContent}else delete sel[key];
    buildMsg();
  })});
});
function buildMsg(){
  var msg,parts=[];
  if(sel.quero)parts.push(sel.quero);
  if(sel.pessoas)parts.push('somos '+sel.pessoas.toLowerCase());
  if(sel.quando)parts.push('para '+sel.quando.toLowerCase());
  msg=parts.length?'Olá, Estação do Mar! Quero montar minha aventura: '+parts.join(', ')+'. Podem me passar as próximas datas?':'';
  var m=$('#simMsg'),g=$('#simGo');if(!m||!g)return;
  m.textContent=msg||'Escolha acima para montar sua mensagem.';
  g.setAttribute('href',waUrl(msg||'Ola Estacao do Mar, quero aventura!'));
}

/* ---------- sonar ---------- */
function selectNode(k){
  var el=$('.cp[data-k="'+k+'"]')||$('.node[data-k="'+k+'"]');if(!el)return;
  $$('.node,.cp').forEach(function(n){n.setAttribute('aria-pressed',n.getAttribute('data-k')===k?'true':'false')});
  var box=$('#info');if(!box)return;
  var g=el.getAttribute('data-g'),n=el.getAttribute('data-n'),h=el.getAttribute('data-h');
  box.innerHTML='';
  var e=document.createElement('p');e.className='eyebrow';e.textContent=g;
  var t=document.createElement('h4');t.textContent=n;
  var p=document.createElement('p');p.textContent='SITE EM RECONSTRUÇÃO, EM BREVE ESTAREMOS TOTALMENTE PRONTOS PARA ATENDÊ-LO! POR ENQUANTO, ENTRE EM CONTATO ATRAVÉS DE NOSSAS REDES:';
  var row=document.createElement('div');row.className='cta-row';
  var a=document.createElement('a');a.className='btn btn--sun btn--sm';a.target='_blank';a.rel='noopener';a.href=waUrl('Ola Estacao do Mar, quero saber mais sobre: '+n);a.textContent='(13) 99769-2440';
  var b=document.createElement('a');b.className='btn btn--ghost btn--sm';b.href=h;b.textContent='Abrir página';
  row.appendChild(a);row.appendChild(b);
  box.appendChild(e);box.appendChild(t);box.appendChild(p);box.appendChild(row);
  if(anim)gsap.fromTo(box.children,{opacity:0,y:12},{opacity:1,y:0,duration:.45,stagger:.06,ease:'power2.out'});
}
$$('.node,.cp').forEach(function(n){n.addEventListener('click',function(){selectNode(n.getAttribute('data-k'))})});

/* ---------- animações de scroll ---------- */
function splitWords(el){
  var txt=el.textContent.trim();el.setAttribute('aria-label',txt);el.textContent='';
  txt.split(/\s+/).forEach(function(w,i,arr){
    var o=document.createElement('span');o.className='w';o.setAttribute('aria-hidden','true');
    var s=document.createElement('span');s.textContent=w;o.appendChild(s);el.appendChild(o);
    if(i<arr.length-1)el.appendChild(document.createTextNode(' '));
  });
}
function scrollFx(){
  if(!anim)return;
  if($('.rv'))ScrollTrigger.batch('.rv',{start:'top 92%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.08,overwrite:true})}});
  $$('[data-split]').forEach(function(h){
    splitWords(h);
    ScrollTrigger.create({trigger:h,start:'top 92%',once:true,onEnter:function(){gsap.to($$('.w>span',h),{y:0,duration:.95,ease:'power4.out',stagger:.05})}});
  });
  if($('.card')){
    gsap.set('.card',{opacity:0,y:40,scale:.96});
    ScrollTrigger.batch('.card',{start:'top 94%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,scale:1,duration:.8,ease:'power3.out',stagger:.09,overwrite:true})}});
    if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      $$('.card').forEach(function(c){
        c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(c,{rotationY:x*9,rotationX:-y*9,transformPerspective:800,duration:.4,ease:'power2.out',overwrite:'auto'})});
        c.addEventListener('pointerleave',function(){gsap.to(c,{rotationY:0,rotationX:0,duration:.6,ease:'power3.out',overwrite:'auto'})});
      });
    }
  }
  if($('.tile')){
    gsap.set('.tile',{opacity:0,y:30});
    ScrollTrigger.batch('.tile',{start:'top 94%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:.8,ease:'power3.out',stagger:.08,overwrite:true})}});
  }
  $$('[data-par]').forEach(function(p){
    var im=$('img',p);if(!im)return;
    gsap.fromTo(im,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:p.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
  });
  if($('.globe')){
    gsap.set('.gwater',{y:140});
    gsap.fromTo('.gw1',{x:-200},{x:0,duration:5,ease:'none',repeat:-1});
    gsap.fromTo('.gw2',{x:0},{x:-200,duration:7.5,ease:'none',repeat:-1});
    ScrollTrigger.create({trigger:'.globe',start:'top 85%',once:true,onEnter:function(){gsap.to('.gwater',{y:0,duration:2.4,ease:'power2.out'})}});
    gsap.fromTo('.globe',{scale:.8,opacity:0},{scale:1,opacity:1,duration:1.1,ease:'back.out(1.4)',scrollTrigger:{trigger:'.globe',start:'top 90%',once:true}});
  }
  if($('#sonar')){
    gsap.from('.node',{scale:0,opacity:0,duration:.6,stagger:.08,ease:'back.out(2)',scrollTrigger:{trigger:'#sonar',start:'top 80%',once:true}});
    gsap.from('.sonar',{scale:.86,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#sonar',start:'top 88%',once:true}});
  }
  var vw=function(){return window.innerWidth};
  if($('.turtle'))gsap.fromTo('.turtle',{x:0,rotation:-6},{x:function(){return -(vw()+420)},rotation:4,ease:'none',scrollTrigger:{trigger:'.turtle',start:'top bottom',end:'+=1600',scrub:1}});
  if($('.shark')){
    gsap.fromTo('.shark',{x:0},{x:function(){return -(vw()+640)},duration:26,ease:'none',repeat:-1,delay:.5});
    gsap.to('.shark',{y:14,duration:3.2,ease:'sine.inOut',yoyo:true,repeat:-1});
  }
  var g=$('.gauge'),d=$('.gauge__d');
  if(g&&d){
    var setY=gsap.quickSetter(d,'y','px'),H=0;
    var meas=function(){H=g.clientHeight-14};meas();window.addEventListener('resize',meas);
    var upd=function(){var max=document.documentElement.scrollHeight-window.innerHeight;var p=max>0?Math.min(1,Math.max(0,window.pageYOffset/max)):0;setY(p*H)};
    window.addEventListener('scroll',upd,{passive:true});upd();
  }
}

/* ---------- abertura (home, 1ª visita da sessão) / entrada das páginas internas ---------- */
function pageIn(){
  if(!anim)return;
  gsap.from('.nav__in',{y:-40,opacity:0,duration:.7,ease:'power3.out'});
  gsap.from($$('.phero__in > *'),{opacity:0,y:30,duration:.8,stagger:.09,ease:'power3.out',delay:.1});
}
function intro(){
  var el=$('#intro'),seen=false;
  try{seen=sessionStorage.getItem('emi')==='1'}catch(e){}
  if(!el){pageIn();return}
  if(!anim||seen){el.remove();heroIn(0);return}
  try{sessionStorage.setItem('emi','1')}catch(e){}
  document.body.style.overflow='hidden';
  var tl=gsap.timeline({onComplete:function(){el.remove();document.body.style.overflow=''}});
  tl.fromTo('#intro img',{scale:.55,opacity:0},{scale:1,opacity:1,duration:.45,ease:'back.out(1.7)'},0)
    .fromTo('#intro .ring',{scale:.6,opacity:.9},{scale:2.8,opacity:0,duration:.9,ease:'power2.out',stagger:.14},.08)
    .to('#intro .word',{opacity:1,duration:.3},.2)
    .to('#intro .core',{opacity:0,scale:1.08,duration:.25,ease:'power1.in'},.6)
    .to('#intro .half--t',{yPercent:-101,duration:.5,ease:'power3.inOut'},.6)
    .to('#intro .half--b',{yPercent:101,duration:.5,ease:'power3.inOut'},.6)
    .add(function(){heroIn(0)},.7);
}

scrollFx();
intro();
window.addEventListener('load',function(){if(anim)ScrollTrigger.refresh()});
play();
})();

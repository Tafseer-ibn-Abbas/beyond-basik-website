
// LOADER
window.addEventListener('load',()=>{setTimeout(()=>{document.getElementById('loader').classList.add('hidden');},1600);});

// NAV scroll
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
  document.getElementById('stBtn').classList.toggle('on',window.scrollY>400);
});

// MOBILE MENU
function setMenuState(isOpen){
  const menu=document.getElementById('mobileMenu');
  const toggle=document.getElementById('menuToggle');
  if(!menu) return;
  menu.classList.toggle('open',isOpen);
  menu.setAttribute('aria-hidden',String(!isOpen));
  document.body.classList.toggle('mobile-menu-active',isOpen);
  if(toggle){
    toggle.classList.toggle('active',isOpen);
    toggle.setAttribute('aria-expanded',String(isOpen));
    toggle.setAttribute('aria-label',isOpen?'Close navigation menu':'Open navigation menu');
  }
}

function toggleMenu(){
  const menu=document.getElementById('mobileMenu');
  if(!menu) return;
  setMenuState(!menu.classList.contains('open'));
}

const mobileMenu=document.getElementById('mobileMenu');
if(mobileMenu){
  mobileMenu.addEventListener('click',e=>{
    if(e.target!==mobileMenu) return;
    const panelWidth=parseFloat(getComputedStyle(mobileMenu,'::before').width)||0;
    if(e.clientX<window.innerWidth-panelWidth) setMenuState(false);
  });
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&mobileMenu?.classList.contains('open')) setMenuState(false);
});

window.addEventListener('resize',()=>{
  if(window.innerWidth>1060&&mobileMenu?.classList.contains('open')) setMenuState(false);
});


// Keep floating controls clear of the footer.
const footer=document.querySelector('footer');
if(footer){
  const footerObs=new IntersectionObserver(entries=>{
    document.body.classList.toggle('footer-visible',entries.some(entry=>entry.isIntersecting));
  },{threshold:.08});
  footerObs.observe(footer);
}

// REVEAL
const revObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revObs.observe(el));

// POPUPS
function closeP(id){document.getElementById(id).classList.remove('on');}
setTimeout(()=>document.getElementById('wPop').classList.add('on'),2000);
let exitDone=false;
document.addEventListener('mouseleave',e=>{if(e.clientY<8&&!exitDone){exitDone=true;document.getElementById('ePop').classList.add('on');}});

// TOAST
setTimeout(()=>{const t=document.getElementById('toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),5000);},7000);

// RIPPLE
document.addEventListener('click',e=>{
  const btn=e.target.closest('.ripple');
  if(!btn)return;
  const r=document.createElement('span');r.className='rpl';
  const rect=btn.getBoundingClientRect(),sz=Math.max(rect.width,rect.height);
  r.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;
  btn.appendChild(r);setTimeout(()=>r.remove(),600);
});

// PAGE TRANSITION
const pageLoader = document.getElementById('pageLoader');
const plLabel    = document.getElementById('plLabel');
const sectionNames = {
  '#hero':     'Home',
  '#services': 'Services',
  '#process':  'How It Works',
  '#why':      'Why Us',
  '#reviews':  'Reviews',  // Leave a Review section
  '#contact':  'Contact'
};

function triggerPageLoad(targetHash, callback) {
  // reset bar animation
  const fill = document.getElementById('plFill');
  fill.style.animation = 'none';
  fill.offsetHeight; // reflow
  fill.style.animation = 'plFill .55s cubic-bezier(.4,0,.2,1) forwards';

  plLabel.textContent = 'Loading ' + (sectionNames[targetHash] || 'page') + '…';
  pageLoader.classList.add('active');

  setTimeout(() => {
    callback();
    setTimeout(() => {
      pageLoader.classList.remove('active');
    }, 250);
  }, 580);
}

// Attach to ALL nav links (desktop, mobile, footer)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.length < 2) return;
  link.addEventListener('click', function(e) {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    // close mobile menu if open
    setMenuState(false);
    triggerPageLoad(href, () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// STAR PICKER — guarded for pages that use only the Google Review CTA
let picked=5;
const starSpans=document.querySelectorAll('#starRow span');
function paintStars(n){
  starSpans.forEach((s,i)=>{s.classList.toggle('lit',i<n);});
}
if(starSpans.length){
  paintStars(5);
  starSpans.forEach((s,i)=>{
    s.addEventListener('mouseover',()=>paintStars(i+1));
    s.addEventListener('mouseleave',()=>paintStars(picked));
    s.addEventListener('click',()=>{picked=i+1;paintStars(picked);});
  });
}

// POST REVIEW — guarded for pages that use only the Google Review CTA
function postReview(){
  const nameEl=document.getElementById('rName');
  const textEl=document.getElementById('rText');
  const reviewTrack=document.getElementById('revTrack');
  if(!nameEl || !textEl || !reviewTrack) return;
  const name=nameEl.value.trim();
  const text=textEl.value.trim();
  if(!name||!text){alert('Please enter your name and review.');return;}
  const initials=name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const stars='★'.repeat(picked)+'☆'.repeat(5-picked);
  const card=document.createElement('div');card.className='rev-card';
  card.style.opacity='0';card.style.transform='scale(.9)';card.style.transition='all .4s ease';
  card.innerHTML=`<div class="rev-stars">${stars}</div><p class="rev-text">"${text.replace(/</g,'&lt;')}"</p><div class="rev-author"><div class="rev-avatar">${initials}</div><div><div class="rev-name">${name.replace(/</g,'&lt;')}</div><div class="rev-tag">Just now</div></div></div>`;
  reviewTrack.prepend(card);
  setTimeout(()=>{card.style.opacity='1';card.style.transform='scale(1)';},20);
  nameEl.value='';textEl.value='';
  picked=5;paintStars(5);
  const ok=document.getElementById('formOk');
  if(ok){
    ok.style.display='block';
    setTimeout(()=>ok.style.display='none',4000);
  }
  buildDots();revPos=0;applySlide();
}

// REVIEW SLIDER — guarded for pages that use only the Google Review CTA
let revPos=0;
const track=document.getElementById('revTrack');
function getCards(){return track ? track.querySelectorAll('.rev-card') : [];}
function getVisible(){return Math.min(window.innerWidth<640?1:window.innerWidth<900?2:3,getCards().length || 1);}
function maxPos(){return Math.max(0,getCards().length-getVisible());}
function applySlide(){
  if(!track) return;
  const w=track.parentElement.clientWidth;
  const cardW=(w/getVisible());
  track.style.transform=`translateX(-${revPos*cardW}px)`;
  updateDots();
}
function slideRev(dir){
  revPos=Math.max(0,Math.min(maxPos(),revPos+dir));
  applySlide();
}
function buildDots(){
  const d=document.getElementById('revDots');
  if(!d || !track) return;
  d.innerHTML='';
  for(let i=0;i<=maxPos();i++){
    const dot=document.createElement('div');
    dot.className='rnav-dot'+(i===0?' active':'');
    dot.onclick=()=>{revPos=i;applySlide();};
    d.appendChild(dot);
  }
}
function updateDots(){
  document.querySelectorAll('.rnav-dot').forEach((d,i)=>d.classList.toggle('active',i===revPos));
}
if(track && document.getElementById('revDots')){
  buildDots();
  window.addEventListener('resize',()=>{buildDots();revPos=0;applySlide();});
}

// COUNTER ANIMATION
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.querySelectorAll('[data-target]').forEach(el=>{
      const target=+el.dataset.target,prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'+';
      let start=null;
      const step=ts=>{if(!start)start=ts;const p=Math.min((ts-start)/1600,1);el.textContent=prefix+Math.floor(p*target)+suffix;if(p<1)requestAnimationFrame(step);};
      requestAnimationFrame(step);
    });
    cntObs.disconnect();
  });
},{threshold:.4});
const whySec=document.getElementById('why');if(whySec)cntObs.observe(whySec);

/**
 * The brand intro's controller. It runs inline in <head>, before React and
 * before first paint, so the intro never waits on hydration.
 *
 * Phase "run"  — BYTES. is on screen and the progress count climbs. It eases
 *                toward 90 and then creeps, until the page has really loaded
 *                (load event + fonts, at least MIN ms; never longer than CAP).
 * Then         — the count eases to exactly 100.
 * Phase "play" — set once the count reads 100: the word tilts and closes into
 *                its dot and the page opens through it (CSS, PageIntro.module.css).
 * Phase "done" — the overlay is removed.
 *
 * Skipped with reduced motion and on back / forward navigation. Only the count
 * element and the bar are touched per frame, so each frame restyles just them.
 */
const MIN_MS = 550;
const CAP_MS = 4000;
/** Length of the "play" phase; must cover the CSS timeline */
export const PLAY_MS = 950;

export const introScript = `(function(){try{
var h=document.documentElement,nav=performance.getEntriesByType('navigation')[0];
if(matchMedia('(prefers-reduced-motion: reduce)').matches||(nav&&nav.type==='back_forward'))return;
h.setAttribute('data-intro','run');
var t0=performance.now(),loaded=false,fonts=!document.fonts,count=null,bar=null,tr=null,v0=0,played=false;
addEventListener('load',function(){loaded=true});
if(document.fonts)document.fonts.ready.then(function(){fonts=true});
function ease(x){return 1-Math.pow(1-x,3)}
function measure(){var d=document.querySelector('[data-intro-dot]');if(!d)return;var r=d.getBoundingClientRect();h.style.setProperty('--intro-x',r.left+r.width/2+'px');h.style.setProperty('--intro-y',r.top+r.height/2+'px')}
function frame(now){
var t=Math.max(0,now-t0),v;
if(!count){count=document.querySelector('[data-intro-count]');bar=document.querySelector('[data-intro-bar]')}
if(tr===null){
v=t<750?90*(1-Math.pow(1-t/750,2)):90+6*(1-Math.exp(-(t-750)/1400));
if((loaded&&fonts&&t>=${MIN_MS})||t>=${CAP_MS}){tr=now;v0=v}
}
if(tr!==null){
var p=Math.min(1,(now-tr)/Math.max(240,(100-v0)*14));
v=v0+(100-v0)*ease(p);
if(p>=1&&!played){played=true;v=100;measure();h.setAttribute('data-intro','play');setTimeout(function(){h.setAttribute('data-intro','done')},${PLAY_MS})}
}
if(count)count.setAttribute('data-n',('00'+Math.round(v)).slice(-3));
if(bar)bar.style.transform='scaleX('+(v/100).toFixed(3)+')';
if(!played)requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
}catch(e){document.documentElement.removeAttribute('data-intro')}})();`;

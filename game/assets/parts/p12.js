r`,`shade`],Tx={sentinel:[5,4,2],stormcaller:[2,5,3],shade:[3,3,5]},Ex=[`Wigor`,`Siła`,`Zwinność`],Dx=`
#class-select {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
  background:
    radial-gradient(ellipse at 50% 32%, rgba(46, 16, 101, 0.4), rgba(5, 2, 8, 0.97) 68%),
    #050208;
  font-family: Georgia, 'Palatino', 'Times New Roman', serif;
  color: #d6d3d1;
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 0.3s ease;
}
#class-select.leaving {
  opacity: 0;
  pointer-events: none;
}
#class-select h1 {
  font-weight: normal;
  font-size: clamp(24px, 4.5vw, 42px);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #a855f7;
  text-shadow: 0 0 36px #6b21a8, 0 2px 6px #000;
  text-align: center;
}
#class-select .wt-sub {
  margin-top: -12px;
  font-size: 15px;
  letter-spacing: 0.06em;
  color: #b9b3c9;
  font-style: italic;
  text-align: center;
}
.wt-cards {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
}
.wt-card {
  position: relative;
  width: 252px;
  padding: 20px 18px 14px;
  border: 1px solid rgba(168, 85, 247, 0.22);
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(21, 14, 32, 0.94), rgba(9, 5, 15, 0.96));
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.wt-card:hover {
  border-color: rgba(168, 85, 247, 0.65);
  box-shadow: 0 0 24px rgba(168, 85, 247, 0.2);
  transform: translateY(-3px);
}
.wt-card.selected {
  border-color: #a855f7;
  box-shadow: 0 0 32px rgba(168, 85, 247, 0.38), inset 0 0 20px rgba(107, 33, 168, 0.16);
}
.wt-card .wt-keycap {
  position: absolute;
  top: 10px;
  right: 12px;
  font-family: monospace;
  font-size: 12px;
  color: #71717a;
  border: 1px solid #3a3151;
  border-radius: 4px;
  padding: 1px 6px;
}
.wt-card.selected .wt-keycap {
  color: #c4b5fd;
  border-color: #a855f7;
}
.wt-card h2 {
  font-weight: normal;
  font-size: 21px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e7e4f0;
  margin-bottom: 8px;
}
.wt-card.selected h2 {
  color: #c4b5fd;
  text-shadow: 0 0 14px rgba(168, 85, 247, 0.5);
}
.wt-fantasy {
  min-height: 60px;
  font-size: 13px;
  font-style: italic;
  line-height: 1.5;
  color: #b9b3c9;
  margin-bottom: 12px;
}
.wt-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8f8aa3;
}
.wt-pips .wt-pip {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 4px;
  border-radius: 50%;
  background: #241e38;
  border: 1px solid #3a3151;
}
.wt-pips .wt-pip.fill {
  background: #a855f7;
  border-color: #a855f7;
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.7);
}
.wt-skills {
  list-style: none;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(168, 85, 247, 0.15);
}
.wt-skills li {
  padding: 2px 0;
  font-size: 13px;
  color: #cfcadd;
}
.wt-skills .wt-glyph {
  display: inline-block;
  width: 22px;
  color: #a855f7;
}
#wt-class-confirm {
  padding: 12px 36px;
  font-family: inherit;
  font-size: 15px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #f59e0b;
  background: rgba(28, 20, 8, 0.6);
  border: 1px solid #7c5a2b;
  border-radius: 4px;
  cursor: pointer;
  transition: box-shadow 0.18s, opacity 0.18s;
}
#wt-class-confirm:disabled {
  opacity: 0.35;
  cursor: default;
}
#wt-class-confirm:not(:disabled):hover {
  box-shadow: 0 0 18px rgba(245, 158, 11, 0.3);
}
.wt-hint {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #71717a;
}
`;function Ox(e){return e===`sentinel`||e===`stormcaller`||e===`shade`}function kx(e,t){let n=``;for(let e=0;e<5;e++)n+=`<i class="wt-pip${e<t?` fill`:``}"></i>`;return`<div class="wt-stat-row"><span>${e}</span><span class="wt-pips">${n}</span></div>`}function Ax(e,t){let n=Tx[e.id],r=Ex.map((e,t)=>kx(e,n[t])).join(``),i=e.skills.map(e=>`<li><span class="wt-glyph">${e.icon}</span>${e.name}</li>`).join(``);return`
    <div class="wt-card" data-class="${e.id}">
      <span class="wt-keycap">${t+1}</span>
      <h2>${e.name}</h2>
      <p class="wt-fantasy">${e.blurb}</p>
      ${r}
      <ul class="wt-skills">${i}</ul>
    </div>`}function jx(){return new Promise(e=>{let t=localStorage.getItem(Cx),n=Ox(t)?t:null,r=document.createElement(`div`);r.id=`class-select`;let i=document.createElement(`style`);i.textContent=Dx,r.appendChild(i);let a=document.createElement(`div`);a.style.cssText=`display:flex;flex-direction:column;align-items:center;gap:24px;`,a.innerHTML=`
      <h1>Wybierz swój Zakon</h1>
      <p class="wt-sub">Każdy Tropiciel przysięga jednemu z nich. Bagna nie obchodzi, któremu.</p>
      <div class="wt-cards">${wx.map((e,t)=>Ax(Sx[e],t)).join(``)}</div>
      <button id="wt-class-confirm" disabled>Rozpocznij Łowy</button>
      <p class="wt-hint">1 / 2 / 3 — wybór &middot; Enter — początek</p>`,r.appendChild(a),document.body.appendChild(r);let o=a.querySelector(`#wt-class-confirm`),s=new Map;for(let e of a.querySelectorAll(`.wt-card`))s.set(e.dataset.class,e);let c=e=>{n=e;for(let[t,n]of s)n.classList.toggle(`selected`,t===e);o.disabled=!1},l=()=>{if(!n)return;let t=n;localStorage.setItem(Cx,t),z_.unlock(),window.removeEventListener(`keydown`,u),r.classList.add(`leaving`),window.setTimeout(()=>r.remove(),320),e(t)},u=e=>{e.code===`Digit1`||e.code===`Numpad1`?c(`sentinel`):e.code===`Digit2`||e.code===`Numpad2`?c(`stormcaller`):e.code===`Digit3`||e.code===`Numpad3`?c(`shade`):(e.code===`Enter`||e.code===`NumpadEnter`)&&n&&l()};window.addEventListener(`keydown`,u);for(let[e,t]of s)t.addEventListener(`click`,()=>{n===e?l():c(e)});o.addEventListener(`click`,l),n&&c(n)})}var Mx=[1,3,5],Nx=8,Px=.5,Fx=3,Ix=3.2,Lx=2.2,Rx=.8,zx=1.6,Bx=4.2,Vx=.27,Hx=2.6,Ux=.6,Wx=5.5,Gx=.7,Kx=2,qx=16,Jx=14,Yx=.35,Xx=1.4,Zx=1.2,Qx=.7,$x=.04,eS=1.1,tS=6,nS=.45,rS=.8,iS=1.8,aS=.4,oS=9,sS=.15,cS=5,lS=50*Math.PI/180,uS=20,dS=10,fS=.3,pS=.8,mS=2,hS=7,gS=4,_S=.8,vS=.9,yS=6,bS=.08,xS=6,SS=.22,CS=1.5,wS=.9,TS=14,ES=16096779,DS=16436245,OS=10265519,kS=11032055,AS=12616956,jS=2282478,MS=14870768,NS=9741240,PS=new Rc(1,10,8),FS=new la({color:AS,transparent:!0,opacity:.95,blending:2,depthWrite:!1}),IS=new la({color:MS,transparent:!0,opacity:.9,blending:2,depthWrite:!1}),LS=new as(.025,.025,1,6),RS=new la({color:jS,transparent:!0,opacity:.85,blending:2,depthWrite:!1}),zS=new V(0,0,1),BS=new V(0,1,0),VS=new V,HS=new V;function US(e,t){return Math.hypot(e.x-t.x,e.z-t.z)}var WS=class{scene;hero;getTargets;applyHits;aim;defs;casters;cds=[0,0,0];unlockedSlots=[!0,!1,!1];lastAimDir=new V(-1,0,-1).normalize();delayed=[];projectiles=[];traps=[];trapPool=[];beams=[];beamPool=[];bursts=[];spinActive=!1;spinT=0;spinTicks=0;spinTorus=null;dashActive=!1;dashHit=new Set;constructor(e){this.scene=e.scene,this.hero=e.hero,this.getTargets=e.getTargets,this.applyHits=e.applyHits,this.aim=e.aim,this.defs=Sx[e.classId].skills;let t={sentinel:[()=>this.castSunder(),()=>this.castSteelstorm(),()=>this.castWarcall()],stormcaller:[()=>this.castWarpBolt(),()=>this.castStormburst(),()=>this.castRiftstep()],shade:[()=>this.castFanOfBlades(),()=>this.castStingTrap(),()=>this.castPhaseStrike()]};this.casters=t[e.classId]}unlock(e){this.unlockedSlots[e]=!0}slotState(e){let t=this.defs[e];return{cdRemaining:this.cds[e],cdMax:t.cooldown,manaOk:this.hero.mana>=t.manaCost,unlocked:this.unlockedSlots[e]}}cast(e){!this.unlockedSlots[e]||this.cds[e]>0||!this.hero.alive||this.casters[e]()&&(this.cds[e]=this.defs[e].cooldown)}update(e){for(let e=1;e<=2;e++)!this.unlockedSlots[e]&&this.hero.level>=Mx[e]&&(this.unlockedSlots[e]=!0);for(let t=0;t<3;t++)this.cds[t]=Math.max(0,this.cds[t]-e);if(this.delayed.length){for(let t of this.delayed)t.t-=e;let t=this.delayed.filter(e=>e.t<=0);if(t.length){this.delayed=this.delayed.filter(e=>e.t>0);for(let e of t)e.fn()}}if(e<=0)return;let t=this.getTargets();this.updateSpin(e),this.updateDash(t),this.updateProjectiles(e,t),this.updateBursts(e,t),this.updateTraps(e,t),this.updateBeams(e)}pay(e){return this.hero.spendMana(this.defs[e].manaCost)}canAfford(e){return this.hero.mana>=this.defs[e].manaCost?!0:(this.hero.spendMana(this.defs[e].manaCost),!1)}aimDir(e){let t=this.aim();return t&&(e.copy(t).sub(this.hero.position),e.y=0,e.lengthSq()>.04)?(e.normalize(),this.lastAimDir.copy(e),e):e.copy(this.lastAimDir)}aimPointClamped(e,t){let n=this.aim();if(n){t.copy(n).sub(this.hero.position),t.y=0;let r=t.length();if(r>.2)return this.lastAimDir.copy(t).divideScalar(r),r>e&&t.multiplyScalar(e/r),t.add(this.hero.position),t.y=0,t}return t.copy(this.lastAimDir).multiplyScalar(e).add(this.hero.position),t.y=0,t}collectRadial(e,t,n,r){let i=[],a=Math.round(this.hero.damage*n);for(let n of this.getTargets())n.alive&&US(e,n.position)<=t+n.radius&&i.push({target:n,amount:a,stagger:r});return i}castSunder(){if(!this.canAfford(0))return!1;let e=this.hero.position.clone(),t=this.aimPointClamped(Nx,new V),n=new V,r=0;return this.hero.overrideMotion({duration:Px,invulnerable:!0,anim:`Sword_Heavy_Combo`,tick:(i,a)=>{let o=e=>Fx*4*e*(1-e);return n.copy(t).sub(e).multiplyScalar(a-r),n.y=o(a)-o(r),r=a,n},onEnd:()=>this.sunderLand()})?(this.hero.spendMana(this.defs[0].manaCost),ev(this.scene,t,ES,.3,Ix,.35),Q(160,.35,`sine`,.06,500),!0):!1}sunderLand(){this.hero.position.y=0;let e=this.hero.position;this.applyHits(this.collectRadial(e,Ix,Lx,Rx),{hitstop:.06,shake:.35}),tv(this.scene,e,OS,6,{speed:3.2,up:2.4,size:.16,life:.5}),Q(60,.25,`sawtooth`,.12,35)}castSteelstorm(){if(this.spinActive||!this.canAfford(1))return!1;let e=new V;return this.hero.overrideMotion({duration:zx,anim:`Sword_Attack`,tick:t=>(this.aimDir(HS),e.copy(HS).multiplyScalar(Bx*t)),onEnd:()=>this.endSpin()})?(this.hero.spendMana(this.defs[1].manaCost),this.spinActive=!0,this.spinT=0,this.spinTicks=0,this.spinTorus||(this.spinTorus=new J(new Bc(1.9,.05,8,40),new la({color:16777215,transparent:!0,opacity:.35,blending:2,depthWrite:!1})),this.spinTorus.rotation.x=Math.PI/2),this.scene.add(this.spinTorus),this.spinTick(),!0):!1}spinTick(){this.hero.alive&&this.applyHits(this.collectRadial(this.hero.position,Hx,Ux)),Q(120+this.spinTicks*15,.06,`square`,.04,80),this.spinTicks++}updateSpin(e){if(this.spinActive){if(this.spinT+=e,this.spinTorus){let e=this.hero.position;this.spinTorus.position.set(e.x,1.1,e.z)}for(;this.spinActive&&this.spinT>=this.spinTicks*Vx;)this.spinTick()}}endSpin(){this.spinActive=!1,this.spinTorus&&this.scene.remove(this.spinTorus)}castWarcall(){if(!this.pay(2))return!1;let e=this.hero.position.clone();return this.applyHits(this.collectRadial(e,Wx,Gx,Kx),{shake:.3}),ev(this.scene,e,DS,0,Wx,.4,{opacity:.7}),this.delayed.push({t:.12,fn:()=>ev(this.scene,e,DS,0,Wx,.4,{opacity:.7})}),Q(90,.5,`square`,.12,70),Q(135,.5,`square`,.08,100,.02),!0}castWarpBolt(){if(!this.pay(0))return!1;this.aimDir(HS);let e=Math.round(this.hero.damage*Xx),t=Math.round(this.hero.damage*Qx),n=this.acquireProjectile(`bolt`);return n.mesh.position.copy(this.hero.position).addScaledVector(HS,.6),n.mesh.position.y=eS,n.vel.copy(HS).multiplyScalar(qx),n.range=Jx,n.hitRadius=Yx,n.damage=e,n.splashDamage=t,Q(760,.12,`sine`,.06,240),!0}castStormburst(){if(!this.pay(1))return!1;let e=this.hero.position.clone().setY(0);return this.bursts.push({center:e,t:0,hit:new Set}),ev(this.scene,e,jS,0,tS,nS,{opacity:.6}),Q(900,.35,`sawtooth`,.07,140),!0}updateBursts(e,t){if(!this.bursts.length)return;let n=Math.round(this.hero.damage*iS),r=[];for(let i of this.bursts){i.t+=e;let a=tS*Math.min(1,i.t/nS);for(let e of t){if(!e.alive||i.hit.has(e))continue;let t=US(i.center,e.position);t<=a+e.radius&&t>=a-rS-e.radius&&(i.hit.add(e),r.push({target:e,amount:n,stagger:aS}))}}r.length&&this.applyHits(r),this.bursts=this.bursts.filter(e=>e.t<nS)}castRiftstep(){if(!this.canAfford(2))return!1;let e=this.hero.position.clone(),t=C_(e,this.aimPointClamped(oS,new V));if(!this.hero.overrideMotion({duration:sS,invulnerable:!0,anim:`blink`,teleportTo:t}))return!1;this.hero.spendMana(this.defs[2].manaCost);for(let n of[e,t])ev(this.scene,n,kS,.2,1.1,.3,{opacity:.6}),tv(this.scene,n,AS,5,{speed:.4,up:2.6,gravity:0,size:.11,life:.3});return Q(500,.1,`sine`,.05,1200),Q(1200,.12,`sine`,.05,400,.08),!0}castFanOfBlades(){if(!this.pay(0))return!1;this.aimDir(HS);let e=Math.atan2(HS.x,HS.z),t=lS/(cS-1),n=Math.round(this.hero.damage*pS);for(let r=0;r<cS;r++){let i=e+(r-(cS-1)/2)*t;VS.set(Math.sin(i),0,Math.cos(i));let a=this.acquireProjectile(`blade`);a.mesh.position.copy(this.hero.position).addScaledVector(VS,.7),a.mesh.position.y=1,a.mesh.quaternion.setFromUnitVectors(zS,VS),a.vel.copy(VS).multiplyScalar(uS),a.range=dS,a.hitRadius=fS,a.damage=n,a.splashDamage=0}for(let e=0;e<3;e++)Q(880,.05,`square`,.035,660,e*.03);return!0}castStingTrap(){if(!this.pay(1))return!1;let e=this.aimPointClamped(hS,new V);this.traps.length>=mS&&this.removeTrap(0);let{group:t,tip:n}=this.trapPool.pop()??this.buildTrap();return t.position.copy(e),this.scene.add(t),this.traps.push({group:t,tip:n,t:0,zapT:0}),Q(220,.1,`triangle`,.06,330),!0}buildTrap(){let e=new _r,t=new J(new os(.18,.5,8),new Y({color:1709348,roughness:.55}));t.position.y=.25,e.add(t);let n=new J(new Rc(.055,8,6),new la({color:15680580}));return n.position.y=.53,e.add(n),{group:e,tip:n}}removeTrap(e){let t=this.traps[e];t&&(this.scene.remove(t.group),this.trapPool.push({group:t.group,tip:t.tip}),this.traps.splice(e,1))}updateTraps(e,t){let n=Math.round(this.hero.damage*vS);for(let r=this.traps.length-1;r>=0;r--){let i=this.traps[r];if(i.t+=e,i.zapT+=e,i.tip.scale.setScalar(1+Math.sin(i.t*6)*.25),i.zapT>=_S){i.zapT-=_S;let e=null,r=gS;for(let n of t){if(!n.alive)continue;let t=US(i.group.position,n.position);t<=r&&(e=n,r=t)}e&&(this.applyHits([{target:e,amount:n}]),this.fireBeam(i.group.position,e.position),Q(1400,.07,`sawtooth`,.045,500))}i.t>=yS&&this.removeTrap(r)}}fireBeam(e,t){let n=this.beamPool.pop()??new J(LS,RS);VS.set(t.x,.9,t.z).sub(HS.set(e.x,.5,e.z));let r=Math.max(.001,VS.length());n.quaternion.setFromUnitVectors(BS,VS.divideScalar(r)),n.scale.set(1,r,1),n.position.set((e.x+t.x)/2,.7,(e.z+t.z)/2),this.scene.add(n),this.beams.push({mesh:n,t:bS})}updateBeams(e){for(let t=this.beams.length-1;t>=0;t--){let n=this.beams[t];n.t-=e,n.t<=0&&(this.scene.remove(n.mesh),this.beamPool.push(n.mesh),this.beams.splice(t,1))}}castPhaseStrike(){if(!this.canAfford(2))return!1;let e=this.aimDir(new V).clone(),t=new V,n=0,r=0;return this.hero.overrideMotion({duration:SS,invulnerable:!0,anim:`Sword_Dash`,tick:(i,a)=>{for(;r<4&&a>=(r+1)*.25-.01;)ev(this.scene,this.hero.position,NS,.25,1,.3,{opacity:.5,y:.9}),r++;return t.copy(e).multiplyScalar(xS*(a-n)),n=a,t},onEnd:()=>{this.dashActive=!1}})?(this.hero.spendMana(this.defs[2].manaCost),this.dashActive=!0,this.dashHit.clear(),Q(340,.18,`sine`,.07,90),!0):!1}updateDash(e){if(!this.dashActive||!this.hero.alive)return;let t=Math.round(this.hero.damage*CS),n=[];for(let r of e)!r.alive||this.dashHit.has(r)||US(this.hero.position,r.position)<=wS+r.radius&&(this.dashHit.add(r),n.push({target:r,amount:t}));n.length&&this.applyHits(n,{hitstop:.05})}acquireProjectile(e){let t=this.projectiles.find(e=>!e.active);return t||(this.projectiles.length<TS?(t={mesh:new J(PS,FS),active:!1,kind:e,vel:new V,traveled:0,range:0,hitRadius:0,damage:0,splashDamage:0,trailT:0},this.projectiles.push(t)):(t=this.projectiles.reduce((e,t)=>e.traveled/e.range>t.traveled/t.range?e:t),this.releaseProjectile(t))),t.active=!0,t.kind=e,t.traveled=0,t.trailT=0,t.mesh.material=e===`bolt`?FS:IS,e===`bolt`?t.mesh.scale.setScalar(.16):t.mesh.scale.set(.072,.072,.264),t.mesh.quaternion.identity(),this.scene.add(t.mesh),t}releaseProjectile(e){e.active=!1,this.scene.remove(e.mesh)}updateProjectiles(e,t){for(let n of this.projectiles){if(!n.active)continue;n.mesh.position.addScaledVector(n.vel,e),n.traveled+=n.vel.length()*e,n.kind===`bolt`&&(n.trailT-=e,n.trailT<=0&&(n.trailT=$x,nv(this.scene,n.mesh.position,AS,.14,.25)));let r=null;for(let e of t)if(e.alive&&US(n.mesh.position,e.position)<=n.hitRadius+e.radius){r=e;break}if(r){this.impactProjectile(n,r,t);continue}n.traveled>=n.range&&this.releaseProjectile(n)}}impactProjectile(e,t,n){let r=[{target:t,amount:e.damage}];if(e.kind===`bolt`){for(let i of n)!i.alive||i===t||US(e.mesh.position,i.position)<=Zx+i.radius&&r.push({target:i,amount:e.splashDamage});VS.set(e.mesh.position.x,0,e.mesh.position.z),ev(this.scene,VS,kS,.1,.8,.2,{opacity:.7}),Q(300,.08,`sawtooth`,.05,90)}this.applyHits(r),this.releaseProjectile(e)}},GS=0,KS=14,qS=.42,JS=13,YS=[{anim:`Sword_Regular_A`,time:.4,hitAt:.18,dmgMult:1,lunge:2},{anim:`Sword_Regular_B`,time:.36,hitAt:.16,dmgMult:1,lunge:2.2},{anim:`Sword_Heavy_Combo`,time:.55,hitAt:.3,dmgMult:1.8,lunge:2.8}],XS=2.9,ZS=.2,QS=.7,$S=new V(1,0,-.9).normalize(),eC=new V(1,.7,0).normalize(),tC=new V(0,.07,0);function nC(e){let t=new Hr().setFromObject(e),n=t.getSize(new V),r=n.x>n.y&&n.x>n.z?`x`:n.y>n.z?`y`:`z`,i=new V;return i[r]=Math.abs(t.max[r])>=Math.abs(t.min[r])?1:-1,i}function rC(e,t){let n=1/e.scale.x,r=r=>{let i=ax(e,...r);if(!i)return;let a=ix(`sword`,1.1),o=nC(a.root);a.root.scale.multiplyScalar(n);let s=r.includes(`l`)?eC:$S;a.root.quaternion.setFromUnitVectors(o,s),a.root.position.copy(tC),t.bladeEmissive!==void 0&&a.root.traverse(e=>{let n=e;if(n.isMesh){let e=n.material.clone();e.emissive.setHex(t.bladeEmissive),e.emissiveIntensity=.7,n.material=e}}),i.add(a.root)};if(r([`hand`,`r`]),t.dualSwords&&r([`hand`,`l`]),t.helmet){let t=ax(e,`head`);if(t){let e=ix(`helmet`,.35);e.root.scale.multiplyScalar(n),e.root.position.y=.1,t.add(e.root)}}}var iC=class{group=new _r;classDef;maxHp;hp;maxMana;mana;level=1;xp=0;state=`idle`;inTown=!1;gear={dmg:0,hp:0,speed:0,mana:0,regen:0};anim;yaw=0;targetYaw=0;combo;runSpeed;comboStage=0;stageT=0;hitDone=!1;queuedNext=!1;comboIdleT=0;attackDir=new V(0,0,1);rollT=0;rollCooldown=0;rollCooldownMax;rollDir=new V(0,0,1);motion=null;sinceDamaged=99;lantern;onStrike;onSwing;onRoll;constructor(e,t){this.classDef=t,this.maxHp=t.maxHp,this.hp=t.maxHp,this.maxMana=t.maxMana,this.mana=t.maxMana,this.runSpeed=t.moveSpeed,this.rollCooldownMax=t.rollCooldown,this.combo=YS.map(e=>({...e,time:e.time/t.attackSpeed,hitAt:e.hitAt/t.attackSpeed}));let{root:n,clips:r}=ix(`hero`,1.85);n.rotation.y=GS,this.group.add(n),this.anim=new ox(n,r),rC(n,t.loadout),this.lantern=new pu(t.lanternColor,32,22,1.5),this.lantern.position.set(0,2.8,0),this.group.add(this.lantern),this.anim.play(`Sword_Idle`),this.group.position.copy(l_).add(new V(0,0,2)),e.add(this.group)}get position(){return this.group.position}get obrażeń(){return Math.round((26+this.level*6)*this.classDef.dmgMult)+this.gear.dmg}applyGear(e){this.maxHp+=e.hp-this.gear.hp,this.hp=Math.min(this.maxHp,this.hp+Math.max(0,e.hp-this.gear.hp)),this.maxMana+=e.mana-this.gear.mana,this.mana=Math.min(this.maxMana,this.mana),this.runSpeed=this.classDef.moveSpeed*(1+e.speed/100),this.gear={...e}}get xpToLevel(){return Math.round(40*this.level**1.4)}get alive(){return this.state!==`dead`}get invulnerable(){return this.state===`roll`||this.state===`skill`&&!!this.motion?.invulnerable}spendMana(e){if(this.mana<e){Q(160,.12,`sine`,.04,110);let e=document.getElementById(`mana-globe`);return e&&(e.classList.remove(`pulse`),e.offsetWidth,e.classList.add(`pulse`)),!1}return this.mana-=e,!0}gainXp(e){this.xp+=e;let t=!1;for(;this.xp>=this.xpToLevel;)this.xp-=this.xpToLevel,this.level++,this.maxHp+=this.classDef.hpPerLevel,this.maxMana+=this.classDef.manaPerLevel,this.hp=this.maxHp,this.mana=this.maxMana,t=!0;return t}restore(e,t){for(e=Math.min(60,Math.max(1,Math.floor(e)));this.level<e;)this.level++,this.maxHp+=this.classDef.hpPerLevel,this.maxMana+=this.classDef.manaPerLevel;this.xp=t,this.hp=this.maxHp,this.mana=this.maxMana}takeDamage(e){!this.alive||this.invulnerable||(this.hp-=e,this.sinceDamaged=0,this.hp<=0&&(this.cancelMotion(),this.state=`dead`,this.anim.play(`Death01`,{loop:!1,fade:.1})))}respawn(){this.hp=this.maxHp,this.mana=this.maxMana,this.group.position.copy(l_).add(new V(0,0,2)),this.state=`idle`,this.comboStage=0,this.rollCooldown=0,this.anim.play(`Sword_Idle`)}overrideMotion(e){if(this.state===`dead`||this.state===`roll`||this.motion)return!1;if(e.teleportTo){let t=C_(this.position,e.teleportTo.clone().setY(0));this.position.copy(t)}return this.state=`skill`,this.motion={...e,t:0},e.anim&&this.anim.has(e.anim)&&this.anim.play(e.anim,{loop:!1,duration:e.duration,fade:.06}),!0}cancelMotion(){let e=this.motion;this.motion=null,e?.onEnd?.()}attack(e){if(!(this.state===`dead`||this.state===`roll`||this.state===`skill`)){if(this.state===`attack`){this.queuedNext=!0;return}this.startSwing(e)}}dodge(e){this.state===`dead`||this.state===`roll`||this.rollCooldown>0||(this.state===`skill`&&this.cancelMotion(),this.rollDir=e&&e.lengthSq()>.01?e.clone().normalize():new V(Math.sin(this.yaw),0,Math.cos(this.yaw)),this.state=`roll`,this.rollT=0,this.rollCooldown=this.rollCooldownMax,this.targetYaw=Math.atan2(this.rollDir.x,this.rollDir.z),this.yaw=this.targetYaw,this.group.rotation.y=this.yaw,this.anim.play(`Roll`,{loop:!1,duration:qS,fade:.05}),this.onRoll?.())}face(e){let t=e.x-this.position.x,n=e.z-this.position.z;t*t+n*n>1e-4&&(this.yaw=Math.atan2(t,n),this.targetYaw=this.yaw,this.group.rotation.y=this.yaw)}startSwing(e){this.comboIdleT>QS&&(this.comboStage=0);let t=this.combo[this.comboStage];if(e){let t=e.clone().sub(this.position);t.y=0,t.lengthSq()>.01&&(this.attackDir=t.normalize())}this.state=`attack`,this.stageT=0,this.hitDone=!1,this.queuedNext=!1,this.targetYaw=Math.atan2(this.attackDir.x,this.attackDir.z),this.yaw=this.targetYaw,this.group.rotation.y=this.yaw,this.anim.play(t.anim,{loop:!1,duration:t.time,fade:.06}),this.onSwing?.()}resolveHits(e,t){let n=[],r=this.comboStage===this.combo.length-1;for(let i of e){if(!i.alive)continue;let e=i.position.clone().sub(this.position);e.y=0;let a=e.length();a>XS+i.radius||a>1.3&&e.normalize().dot(this.attackDir)<ZS||n.push({target:i,amount:Math.round(this.damage*t.dmgMult),finisher:r})}n.length&&this.onStrike?.(n)}update(e,t,n,r,i){if(this.rollCooldown=Math.max(0,this.rollCooldown-e),this.sinceDamaged+=e,this.anim.update(e),this.lantern.intensity=13+Math.sin(performance.now()*.01)*1.5,this.state===`dead`)return;if(this.mana=Math.min(this.maxMana,this.mana+this.classDef.manaRegen*e),this.gear.regen>0&&(this.hp=Math.min(this.maxHp,this.hp+this.gear.regen*e)),this.sinceDamaged>4&&(this.hp=Math.min(this.maxHp,this.hp+e*(this.inTown?12.5:2.5))),this.state===`skill`){let t=this.motion;if(!t)this.state=`idle`,this.anim.play(`Sword_Idle`);else{t.t+=e;let n=t.tick?.(e,Math.min(1,t.t/t.duration));if(n&&n.lengthSq()>0){let e=C_(this.position,this.position.clone().add(n));this.position.copy(e)}t.t>=t.duration&&(this.motion=null,this.state=`idle`,this.anim.play(`Sword_Idle`),t.onEnd?.())}return}if(this.state===`roll`){this.rollT+=e,this.step(this.rollDir,JS*(1-this.rollT/qS*.4),e),this.rollT>=qS&&(this.state=`idle`,this.anim.play(`Sword_Idle`));return}if(this.state===`attack`){let n=this.combo[this.comboStage];if(this.stageT+=e,this.stageT<n.time*.5&&this.step(this.attackDir,n.lunge/(n.time*.5),e,!1),!this.hitDone&&this.stageT>=n.hitAt&&(this.hitDone=!0,this.resolveHits(t,n)),this.stageT>=n.time){let e=(this.queuedNext||i)&&this.comboStage<this.combo.length-1;this.comboStage=e?this.comboStage+1:0,this.comboIdleT=0,e||(this.queuedNext||i)&&this.comboStage===0?this.startSwing(r):(this.state=`idle`,this.anim.play(`Sword_Idle`))}return}this.comboIdleT+=e,n.lengthSq()>.01?(this.state=`run`,this.targetYaw=Math.atan2(n.x,n.z),this.step(n,this.runSpeed,e),this.anim.play(`Jog_Fwd_Loop`)):(this.state=`idle`,this.anim.play(`Sword_Idle`));let a=this.targetYaw-this.yaw;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;this.yaw+=a*Math.min(1,KS*e),this.group.rotation.y=this.yaw}step(e,t,n,r=!0){let i=C_(this.position,this.position.clone().addScaledVector(e,t*n));this.position.copy(i),r&&(this.targetYaw=Math.atan2(e.x,e.z))}},aC=0,oC=16,sC=14,cC={skeleton:{model:`skeleton`,height:1.75,hover:0,radius:.55,elite:!1,hp:e=>26+e*8,dmg:e=>8+e*2,xp:e=>14+e*4,speed:3.1,windup:.55,strikeTime:.32,strikeRange:2.3,recover:.55,attack:`melee`,anims:{idle:`Idle`,move:`Running`,attack:`Attack`,death:`Death`,spawn:`Spawn`}},bat:{model:`bat`,height:.85,hover:1.15,radius:.45,elite:!1,hp:e=>12+e*4,dmg:e=>4+e,xp:e=>9+e*3,speed:4.7,windup:.3,strikeTime:.25,strikeRange:1.7,recover:.7,attack:`melee`,anims:{idle:`Flying`,move:`Flying`,attack:`Attack`,hit:`Hit`,death:`Death`}},ghost:{model:`ghost`,height:1.5,hover:.75,radius:.6,elite:!1,hp:e=>22+e*7,dmg:e=>10+e*2,xp:e=>18+e*5,speed:3.4,windup:.5,strikeTime:.38,strikeRange:6.5,recover:.85,attack:`dash`,anims:{idle:`Flying_Idle`,move:`Fast_Flying`,attack:`Headbutt`,hit:`HitReact`,death:`Death`}},demon:{model:`demon`,height:2.7,hover:0,radius:1,elite:!0,hp:e=>130+e*45,dmg:e=>16+e*4,xp:e=>60+e*12,speed:2.2,windup:.9,strikeTime:.4,strikeRange:3.4,recover:.8,attack:`slam`,anims:{idle:`Idle`,move:`Walk`,attack:`Punch`,hit:`HitReact`,death:`Death`}}},lC=class{group=new _r;kind;kindId;name;hp;maxHp;alive=!0;removed=!1;anim;state=`spawn`;stateT=0;staggerDuration=.32;yaw=0;strikeDir=new V(0,0,1);strikeHitDone=!1;staggerCount=0;scene;tier;flashMats=[];telegraphRing=null;bobSeed=Math.random()*10;anchor;aggroRange;aggroed=!1;returning=!1;novaCd=6;novaMode=!1;onHitHero;onAggro;constructor(e,t,n,r,i={}){this.scene=e,this.tier=n,this.kindId=r,this.kind=cC[r],this.name=i.name,this.anchor=(i.anchor??t).clone(),this.aggroRange=i.aggroRange??9;let a=i.scale??1;this.maxHp=Math.round(this.kind.hp(n)*(i.name?1.8:1)),this.hp=this.maxHp;let{root:o,clips:s}=ix(this.kind.model,this.kind.height*a);o.rotation.y=aC,o.position.y=this.kind.hover,this.group.add(o),this.anim=new ox(o,s),o.traverse(e=>{let t=e;t.isMesh&&t.material.isMeshStandardMaterial&&(t.material=t.material.clone(),this.flashMats.push(t.material))}),this.group.position.copy(t),e.add(this.group),this.kind.anims.spawn?(this.anim.play(this.kind.anims.spawn,{loop:!1,duration:.9}),this.stateT=-.9):(this.group.scale.setScalar(.01),this.anim.play(this.kind.anims.move))}get position(){return this.group.position}get radius(){return this.kind.radius}get elite(){return this.kind.elite}xpValue(){return Math.round(this.kind.xp(this.tier)*(this.name?2.5:1))}takeDamage(e,t){if(this.alive){if(this.hp-=e,this.aggroed=!0,this.hp<=0){this.die();return}if(t){let e=this.position.clone().addScaledVector(t,this.elite?.25:1);this.position.copy(C_(this.position,e))}this.staggerCount++,(!this.elite||this.staggerCount%4==0)&&this.applyStagger(.32)}}applyStagger(e){if(!this.alive)return;let t=this.elite?e*.4:e;if(t<=0)return;this.staggerDuration=t,this.setState(`stagger`),this.clearTelegraph();let n=this.kind.anims.hit;n&&this.anim.play(n,{loop:!1,duration:Math.max(.3,t),fade:.05})}die(){this.alive=!1,this.setState(`dying`),this.clearTelegraph(),this.anim.play(this.kind.anims.death,{loop:!1,duration:.9,fade:.08})}setState(e){this.state=e,this.stateT=0,this.strikeHitDone=!1}setFlash(e,t=16720418){let n=new G(t);for(let t of this.flashMats)t.emissive.setRGB(n.r*e,n.g*e,n.b*e),t.emissiveIntensity=1}clearTelegraph(){this.setFlash(0),this.telegraphRing&&=(this.scene.remove(this.telegraphRing),this.telegraphRing.geometry.dispose(),this.telegraphRing.material.dispose(),null)}update(e,t,n){if(this.anim.update(e),this.stateT+=e,this.state===`dying`){this.stateT>1.1&&(this.group.position.y-=e*1.4,this.stateT>1.9&&(this.scene.remove(this.group),this.removed=!0));return}let r=this.kind.hover>0?this.kind.hover+Math.sin(performance.now()*.003+this.bobSeed)*.15:0,i=this.group.children[0];if(i&&(i.position.y=r),this.name&&this.aggroed&&this.kind.attack===`slam`&&this.state===`chase`&&(this.novaCd-=e,this.novaCd<=0)){this.novaCd=6,this.novaMode=!0,this.setState(`windup`),this.anim.play(this.kind.anims.idle,{fade:.08}),this.spawnTelegraphRing(4.5);return}switch(this.state){case`spawn`:if(this.kind.anims.spawn)this.stateT>=0&&(this.setState(`chase`),this.anim.play(this.kind.anims.move));else{let e=Math.min(1,(this.stateT+.01)/.35);this.group.scale.setScalar(e),e>=1&&this.setState(`chase`)}return;case`chase`:{let r=t.position.clone().sub(this.position);r.y=0;let i=r.length(),a=this.position.distanceTo(this.anchor),o=Math.hypot(t.position.x-l_.x,t.position.z-l_.z)<16;if(!this.aggroed)if(t.alive&&!o&&i<=this.aggroRange)this.aggroed=!0,this.returning=!1,this.onAggro?.(this);else{this.anim.play(this.kind.anims.idle);return}if((o||a>oC)&&(this.returning=!0),this.returning){let t=this.anchor.clone().sub(this.position);if(t.y=0,t.length()>2){let n=t.normalize();this.move(n,this.kind.speed,e),this.face(n),this.anim.play(this.kind.anims.move)}else this.returning=!1,this.aggroed=!1,this.anim.play(this.kind.anims.idle);return}if(!t.alive){this.anim.play(this.kind.anims.idle);return}if(i<=this.kind.strikeRange*.8){this.novaMode=!1,this.setState(`windup`),this.strikeDir=r.normalize(),this.face(this.strikeDir),this.anim.play(this.kind.anims.idle,{fade:.08}),this.kind.attack===`slam`&&this.spawnTelegraphRing(this.kind.strikeRange);return}let s=r.normalize();for(let e of n){if(e===this||!e.alive)continue;let t=this.position.clone().sub(e.position);t.y=0;let n=t.length(),r=this.radius+e.radius+.2;n>.001&&n<r&&s.addScaledVector(t.normalize(),(r-n)*1.8)}s.normalize(),this.move(s,this.kind.speed,e),this.face(s),this.anim.play(this.kind.anims.move);return}case`windup`:{let n=this.novaMode?1:this.kind.windup,r=Math.min(1,this.stateT/n);if(this.setFlash(r*.9),this.telegraphRing&&(this.telegraphRing.scale.setScalar(.2+r*.8),this.telegraphRing.material.opacity=.15+r*.35),t.alive&&this.kind.attack!==`slam`){let n=t.position.clone().sub(this.position);n.y=0,n.lengthSq()>.01&&(this.strikeDir.lerp(n.normalize(),e*3).normalize(),this.face(this.strikeDir))}this.stateT>=n&&(this.setState(`strike`),this.setFlash(.25),this.anim.play(this.kind.anims.attack,{loop:!1,duration:this.kind.strikeTime,fade:.04}));return}case`strike`:{let n=this.stateT/this.kind.strikeTime;if(this.kind.attack===`dash`&&!this.novaMode){if(this.move(this.strikeDir,this.kind.speed*4.2,e),!this.strikeHitDone&&t.alive){let e=t.position.clone().sub(this.position);e.y=0,e.length()<this.radius+.9&&(this.strikeHitDone=!0,this.onHitHero?.(this.kind.dmg(this.tier)))}}else if(!this.strikeHitDone&&n>=.5&&t.alive){this.strikeHitDone=!0;let e=t.position.clone().sub(this.position);e.y=0;let n=e.length();if(this.kind.attack===`slam`||this.novaMode){let e=this.novaMode?4.5:this.kind.strikeRange,t=this.novaMode?14:this.kind.dmg(this.tier);n<e&&this.onHitHero?.(t)}else n<this.kind.strikeRange+.3&&e.normalize().dot(this.strikeDir)>.1&&this.onHitHero?.(this.kind.dmg(this.tier))}this.stateT>=this.kind.strikeTime&&(this.novaMode=!1,this.clearTelegraph(),this.setState(`recover`),this.anim.play(this.kind.anims.idle,{fade:.15}));return}case`recover`:this.stateT>=this.kind.recover&&this.setState(`chase`);return;case`stagger`:this.setFlash(Math.max(0,.7-this.stateT*2.5)),this.stateT>=this.staggerDuration&&(this.setFlash(0),this.setState(`chase`));return}}spawnTelegraphRing(e){let t=new J(new Fc(e-.35,e,40),new la({color:15680580,transparent:!0,opacity:.2,side:2,depthWrite:!1}));t.rotation.x=-Math.PI/2,t.position.copy(this.position).setY(.06),this.scene.add(t),this.telegraphRing=t}move(e,t,n){let r=this.position.clone().addScaledVector(e,t*n);Math.hypot(r.x-l_.x,r.z-l_.z)<sC||this.position.copy(C_(this.position,r))}face(e){this.yaw=Math.atan2(e.x,e.z),this.group.rotation.y=this.yaw}},uC=class{healthFill=document.getElementById(`health-fill`);healthText=document.getElementById(`health-text`);manaFill=document.getElementById(`mana-fill`);manaText=document.getElementById(`mana-text`);xpFill=document.getElementById(`xp-fill`);levelBadge=document.getElementById(`level-badge`);zoneLabel=document.getElementById(`zone-label`);spiresLabel=document.getElementById(`spires-label`);killsLabel=document.getElementById(`kills-label`);banner=document.getElementById(`banner`);deathOverlay=document.getElementById(`death-overlay`);hudRoot=document.getElementById(`hud`);dodgeSlot=document.getElementById(`slot-dodge`);dodgeCd=document.getElementById(`dodge-cd`);skillSlots;bossBar=document.getElementById(`boss-bar`);bossFill=document.getElementById(`boss-fill`);bossName=document.getElementById(`boss-name`);bannerTimer=0;markers=new Map;constructor(){this.skillSlots=[0,1,2].map(e=>document.getElementById(`slot-skill-${e}`))}setHealth(e,t){let n=Math.max(0,Math.min(1,e/t));this.healthFill.style.height=`${n*100}%`,this.healthText.textContent=`${Math.ceil(Math.max(0,e))}`}setMana(e,t){let n=Math.max(0,Math.min(1,e/t));this.manaFill.style.height=`${n*100}%`,this.manaText.textContent=`${Math.floor(Math.max(0,e))}`}setXp(e,t,n){this.xpFill.style.width=`${Math.min(100,e/t*100)}%`,this.levelBadge.textContent=String(n)}setZone(e){this.zoneLabel.textContent!==e&&(this.zoneLabel.textContent=e)}setSpires(e){this.spiresLabel.textContent=`Iglice: ${e}`}setKills(e){this.killsLabel.textContent=`Zabójstwa: ${e}`}showBanner(e,t=2600,n=``){this.banner.textContent=e,this.banner.className=n?`show ${n}`:`show`,window.clearTimeout(this.bannerTimer),this.bannerTimer=window.setTimeout(()=>this.banner.classList.remove(`show`),t)}setDead(e){this.deathOverlay.classList.toggle(`show`,e)}setDodge(e,t){let n=e<=0;this.dodgeSlot.classList.toggle(`ready`,n),this.dodgeCd.style.height=n?`0%`:`${e/t*100}%`}setSkillMeta(e,t,n){let r=this.skillSlots[e],i=r.querySelector(`.icon`);i.textContent=t,r.title=n}setSkillSlot(e,t,n,r,i){let a=this.skillSlots[e];a.classList.toggle(`locked`,!i),a.classList.toggle(`no-mana`,i&&!r);let o=a.querySelector(`.cd`);o.style.height=!i||t<=0?`0%`:`${t/n*100}%`,a.classList.toggle(`ready`,i&&t<=0&&r);let s=a.querySelector(`.key`),c=i?String(e+1):e===0?`1`:e===1?`Pz 3`:`Pz 5`;s.textContent!==c&&(s.textContent=c)}setBoss(e,t=0,n=1){this.bossBar.classList.toggle(`show`,!!e),e&&(this.bossName.textContent=e,this.bossFill.style.width=`${Math.max(0,Math.min(1,t/n))*100}%`)}setMarker(e,t,n=``,r=``){let i=this.markers.get(e);if(!t){i&&(i.el.remove(),this.markers.delete(e));return}if(i)i.pos.copy(t),i.el.textContent!==n&&(i.el.textContent=n),i.el.className=`hud-marker ${r}`;else{let i=document.createElement(`div`);i.className=`hud-marker ${r}`,i.textContent=n,this.hudRoot.appendChild(i),this.markers.set(e,{el:i,pos:t.clone()})}}updateMarkers(e){for(let{el:t,pos:n}of this.markers.values()){let r=n.clone().project(e);if(r.z>1||Math.abs(r.x)>1.1||Math.abs(r.y)>1.1){t.style.display=`none`;continue}t.style.display=``,t.style.left=`${(r.x+1)/2*window.innerWidth}px`,t.style.top=`${Math.min((1-r.y)/2*window.innerHeight,window.innerHeight-160)}px`}}spawnFloatingText(e,t,n,r=``){let i=e.clone().project(t);if(i.z>1)return;let a=document.createElement(`div`);a.className=r?`dmg ${r}`:`dmg`,a.textContent=n,a.style.left=`${(i.x+1)/2*window.innerWidth}px`,a.style.top=`${(1-i.y)/2*window.innerHeight}px`,this.hudRoot.appendChild(a),window.setTimeout(()=>a.remove(),850)}},dC=class{keys=new Set;ndc=new B;hasPointer=!1;raycaster=new kd;groundPlane=new Xa(new V(0,1,0),0);attackHeld=!1;attackPressed=!1;dodgePressed=!1;interactPressed=!1;skillPressed=null;interacted=!1;onZoom;onFirstInteraction;constructor(e){window.addEventListener(`keydown`,e=>{e.repeat||(this.keys.add(e.code),(e.code===`Space`||e.code===`ShiftLeft`||e.code===`ShiftRight`)&&(this.dodgePressed=!0,e.preventDefault()),e.code===`KeyE`&&(this.interactPressed=!0),e.code===`Digit1`&&(this.skillPressed=0),e.code===`Digit2`&&(this.skillPressed=1),e.code===`Digit3`&&(this.skillPressed=2),this.markInteracted())}),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.attackHeld=!1}),e.addEventListener(`pointerdown`,e=>{e.button===0&&(this.attackPressed=!0,this.attackHeld=!0),this.updateNdc(e),this.markInteracted()}),window.addEventListener(`pointerup`,e=>{e.button===0&&(this.attackHeld=!1)}),e.addEventListener(`pointermove`,e=>this.updateNdc(e)),e.addEventListener(`wheel`,e=>this.onZoom?.(Math.sign(e.deltaY)),{passive:!0}),e.addEventListener(`contextmenu`,e=>e.preventDefault())}markInteracted(){this.interacted||(this.interacted=!0,this.onFirstInteraction?.())}updateNdc(e){this.hasPointer=!0,this.ndc.set(e.clientX/window.innerWidth*2-1,-(e.clientY/window.innerHeight)*2+1)}moveInput(){let e=new B(0,0);return(this.keys.has(`KeyW`)||this.keys.has(`ArrowUp`))&&(e.y+=1),(this.keys.has(`KeyS`)||this.keys.has(`ArrowDown`))&&--e.y,(this.keys.has(`KeyA`)||this.keys.has(`ArrowLeft`))&&--e.x,(this.keys.has(`KeyD`)||this.keys.has(`ArrowRight`))&&(e.x+=1),e.lengthSq()>1&&e.normalize(),e}aimPoint(e){if(!this.hasPointer)return null;this.raycaster.setFromCamera(this.ndc,e);let t=new V;return this.raycaster.ray.intersectPlane(this.groundPlane,t)?t:null}takeAttackPressed(){let e=this.attackPressed;return this.attackPressed=!1,e}takeDodgePressed(){let e=this.dodgePressed;return this.dodgePressed=!1,e}takeInteractPressed(){let e=this.interactPressed;return this.interactPressed=!1,e}takeSkillPressed(){let e=this.skillPressed;return this.skillPressed=null,e}},fC=new V(14,18,14),pC=1.4,mC=2.5,hC=class{renderer;scene=new Dr;camera;clock=new Md;hud=new uC;input;hero;enemies=[];spires=[];questLog;npcs;skills;zoneDirector;loot;stats=new Vv;share;ambience;zoneName=`Żarowarta`;kills=0;viewSize=9;respawnT=-1;hitstopT=0;shakeAmp=0;firstZone=!0;boss=null;heart=null;roamers=[];portalsArmed=!0;fadePending=!1;fade=document.getElementById(`fade`);camForward=new V(-1,0,-1).normalize();camRight=new V(1,0,-1).normalize();constructor(e,t){this.renderer=new Jh({antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.7,e.appendChild(this.renderer.domElement);try{let e=localStorage.getItem(`wt.save`);e&&JSON.parse(e).class!==t&&localStorage.removeItem(`wt.save`)}catch{localStorage.removeItem(`wt.save`)}this.camera=new mu(0,0,0,0,.1,400),this.updateCameraFrustum(),S_(this.scene),this.questLog=Xy.load({showBanner:(e,t)=>this.hud.showBanner(e,t),unlockSkill:e=>this.skills?.unlock(e),grantXp:e=>this.grantXp(e),fullHeal:()=>this.fullHeal(),startHunt:e=>this.startHunt(e),onHuntComplete:e=>{this.stats.note(`hunt`),this.share.show(`triumph`,`Łowy ${e} Complete`)}});let n=Sx[t];this.hero=new iC(this.scene,n),this.hero.onSwing=()=>z_.swing(),this.hero.onRoll=()=>z_.dodge(),this.hero.onStrike=e=>{let t=!1,n=!1,r=!1;for(let i of e){let e=this.isWardedSpire(i.target),a=null;i.target instanceof lC&&(a=i.target.position.clone().sub(this.hero.position),a.y=0,a.normalize().multiplyScalar(i.finisher?1.1:.35));let o=this.handleTargetDamage(i.target,i.amount,a);e||(t=!0,n||=o,r||=i.finisher,this.hud.spawnFloatingText(i.target.position.clone().setY(1.8),this.camera,String(i.amount)))}t&&(z_.hit(),this.hitstop(n||r?.09:.045),this.shake(n?.3:r?.22:.1))};let r=this.questLog.savedState;r&&r.class===t&&this.hero.restore(r.level,r.xp),this.questLog.heroState={classId:t,level:this.hero.level,xp:this.hero.xp},this.skills=new WS({scene:this.scene,classId:t,hero:this.hero,getTargets:()=>this.hittables(),applyHits:(e,t)=>this.applySkillHits(e,t),aim:()=>this.input.aimPoint(this.camera)}),this.questLog.chapter>=2&&this.skills.unlock(1),this.questLog.chapter>=3&&this.skills.unlock(2),n.skills.forEach((e,t)=>this.hud.setSkillMeta(t,e.icon,`${e.name} — ${e.describe}`)),this.loot=new Lv({scene:this.scene,floatText:(e,t,n)=>this.hud.spawnFloatingText(e,this.camera,t,n??``),onEquip:(e,t)=>{this.hero.applyGear(e),this.hud.showBanner(t,2600)}}),this.hero.applyGear(this.loot.totals),this.share=new Kv({stats:this.stats,getContext:()=>({className:n.name,level:this.hero.level,zone:this.zoneName})}),this.ambience=new hy(this.scene),this.npcs=new xx({scene:this.scene,questLog:this.questLog,fullHeal:()=>this.fullHeal(!0),setMarker:(e,t,n,r)=>this.hud.setMarker(e,t,n??``,r??``)}),this.zoneDirector=new I_(this.scene,{onZoneChange:(e,t)=>{this.zoneName=t,this.hud.setZone(t),this.firstZone||this.hud.showBanner(t,1800),this.firstZone=!1}}),this.spawnSpires(),this.spawnRoamers(),this.spawnWardensAndPatrol(),this.hud.setSpires(this.aliveSpireCount()),this.input=new dC(this.renderer.domElement),this.input.onFirstInteraction=()=>{z_.unlock(),this.ambience.start()},this.input.onZoom=e=>{this.viewSize=yn.clamp(this.viewSize+e*1.2,6,16),this.updateCameraFrustum()},window.addEventListener(`resize`,()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.updateCameraFrustum()}),this.camera.position.copy(this.hero.position).add(fC),this.camera.lookAt(this.hero.position),this.hud.setHealth(this.hero.hp,this.hero.maxHp),this.hud.setMana(this.hero.mana,this.hero.maxMana),this.hud.setXp(this.hero.xp,this.hero.xpToLevel,this.hero.level),this.renderer.setAnimationLoop(()=>this.tick())}spawnEnemy(e,t,n,r={}){let i=new lC(this.scene,t,n,e,r);return i.onHitHero=e=>this.onHeroHit(e,i),i.onAggro=e=>{e.name&&(this.boss=e,this.hud.showBanner(e.name,3e3,`boss`))},this.enemies.push(i),i}makeSpire(e,t,n,r,i,a){let o=new Iy({scene:this.scene,position:e,hp:t,tier:n,isHeart:i,guards:r,spawnEnemy:(t,r,o,s)=>{let c=s??(i&&t===`demon`?a:void 0);return this.spawnEnemy(t,r,o,{name:c,scale:c?1.6:1,aggroRange:n>=3?9:11,anchor:e})},onSealed:()=>{this.questLog.notify(i?`heart`:`totem`),this.hud.setSpires(this.aliveSpireCount()),this.stats.note(i?`heart`:`spire`),this.loot.maybeDrop(e,n,i?`heart`:`spire`),i&&window.setTimeout(()=>this.share.show(`triumph`,`Pierwsza Wyrwa zapieczętowana`),2400)},onAoE:(e,t,n,r)=>this.aoeEnemies(e,t,n,r),floatText:(e,t,n)=>this.hud.spawnFloatingText(e,this.camera,t,n??``)});return this.spires.push(o),i&&(this.heart=o),o}spawnSpires(){for(let e of Tg)this.makeSpire(e.position,e.spireHp,e.tier,e.guards,!1);for(let e of e_){let t=e.boss?[...e.guards,e.boss.kind]:e.guards;this.makeSpire(e.position,e.hp,e.tier,t,e.isHeart,e.boss?.name)}}spawnRoamers(){for(let e of Og){let t={pack:e,enemies:[],respawnTimer:0};this.spawnPack(t),this.roamers.push(t)}}spawnPack(e){e.enemies=e.pack.kinds.map((t,n)=>this.spawnEnemy(t,e.pack.positions[n]??e.pack.positions[0],e.pack.tier))}spawnWardensAndPatrol(){for(let e of kg)this.spawnEnemy(e.kind,e.position,e.tier);let e=Ag.path[0].clone().lerp(Ag.path[1],.5);this.spawnEnemy(Ag.kind,Ag.path[0],Ag.tier,{anchor:e,aggroRange:11})}startHunt(e){this.spires=this.spires.filter(e=>e.alive),this.heart&&!this.heart.alive&&(this.heart=null);let t=e=>this.spires.some(t=>t.position.distanceTo(e)<2);for(let n of Tg)t(n.position)||this.makeSpire(n.position,110+30*e,n.tier+e,n.guards,!1);let n=e_.find(e=>e.isHeart);if(!t(n.position)){let t=n.boss?[...n.guards,n.boss.kind]:n.guards;this.makeSpire(n.position,320+60*e,n.tier+e,t,!0,n.boss?.name)}this.hud.setSpires(this.aliveSpireCount())}hittables(){let e=[];for(let t of this.enemies)t.alive&&e.push(t);for(let t of this.spires)t.alive&&e.push(t);return e}aliveSpireCount(){return this.spires.filter(e=>e.alive).length}isWardedSpire(e){return e instanceof Iy&&e.warded}handleTargetDamage(e,t,n){let r=this.isWardedSpire(e),i=e.alive;if(e.takeDamage(t,n),r)return!1;let a=i&&!e.alive;return a&&e instanceof lC&&this.onEnemyKilled(e),a&&e instanceof Iy&&(this.hitstop(.12),this.shake(.4)),a}onEnemyKilled(e){this.kills++,z_.kill(),this.hud.setKills(this.kills),this.stats.note(`kill`),this.loot.maybeDrop(e.position,M_(e.position),e.name||e.elite?`elite`:`enemy`);let t=e.xpValue();this.hud.spawnFloatingText(e.position.clone().setY(1.2),this.camera,`+${t} xp`,`xp`),this.grantXp(t),this.questLog.notify(`kill`),this.boss===e&&(this.boss=null,this.hud.setBoss(null))}grantXp(e){let t=this.hero.gainXp(e);t&&(z_.levelUp(),this.hero.level===3?this.hud.showBanner(`Poziom 3 — budzi się nowa umiejętność. Wciśnij 2.`,2600):this.hero.level===5?this.hud.showBanner(`Poziom 5 — budzi się nowa umiejętność. Wciśnij 3.`,2600):this.hud.showBanner(`Poziom ${this.hero.level}`,1800),this.stats.note(`levelup`,this.hero.level)),this.questLog.heroState.level=this.hero.level,this.questLog.heroState.xp=this.hero.xp,t&&this.questLog.save()}fullHeal(e=!1){this.hero.hp=this.hero.maxHp,this.hero.mana=this.hero.maxMana,e&&this.hud.spawnFloatingText(this.hero.position.clone().setY(2.5),this.camera,`+HP`,`xp`)}applySkillHits(e,t){for(let{target:t,amount:n,stagger:r}of e){let e=this.isWardedSpire(t);this.handleTargetDamage(t,n,null),e||(this.hud.spawnFloatingText(t.position.clone().setY(1.8),this.camera,String(n)),r&&t instanceof lC&&t.applyStagger(r))}e.length&&z_.hit(),t?.hitstop&&this.hitstop(t.hitstop),t?.shake&&this.shake(t.shake)}aoeEnemies(e,t,n,r){for(let i of this.enemies){if(!i.alive)continue;let a=i.position.clone().sub(e);if(a.y=0,a.length()>t)continue;let o=a.lengthSq()>.001?a.normalize():new V(1,0,0);this.handleTargetDamage(i,n,o.multiplyScalar(r))||this.hud.spawnFloatingText(i.position.clone().setY(1.8),this.camera,String(n))}}onHeroHit(e,t){let n=this.hero.hp;if(this.hero.takeDamage(e),this.hero.hp!==n&&(z_.hurt(),this.shake(.25),this.hud.spawnFloatingText(this.hero.position.clone().setY(2.5),this.camera,`-${e}`,`hero`),!this.hero.alive&&this.respawnT<0)){z_.death(),this.hud.setDead(!0),this.respawnT=3,this.stats.note(`death`);let e=t?.name??(t?`a warpspawn ${t.kindId}`:`Pomiot Wyrwy`);window.setTimeout(()=>this.share.show(`death`,e),1200)}}teleport(e){this.fade.classList.add(`show`),this.portalsArmed=!1,this.fadePending=!0,window.setTimeout(()=>{this.hero.position.copy(e),this.camera.position.copy(e).add(fC),this.fade.classList.remove(`show`),this.fadePending=!1},250)}updatePortals(){if(this.fadePending)return;let e=this.hero.position,t=e.distanceTo(p_.entry),n=e.distanceTo(p_.exitInside);if(!this.portalsArmed){t>mC&&n>mC&&(this.portalsArmed=!0);return}t<pC?this.teleport(f_.clone().add(new V(0,0,5))):n<pC&&this.teleport(p_.entry.clone())}updateRoamers(e){for(let t of this.roamers){if(t.enemies.some(e=>!e.removed)||(t.respawnTimer+=e,t.respawnTimer<t.pack.respawnSeconds))continue;let n=t.pack.positions[0];this.hero.position.distanceTo(n)<t.pack.minHeroDistanceToRespawn||(t.respawnTimer=0,this.spawnPack(t))}}updateBossBar(){this.boss&&this.boss.alive?this.hud.setBoss(this.boss.name??``,this.boss.hp,this.boss.maxHp):this.heart&&this.heart.alive&&this.hero.position.distanceTo(this.heart.position)<18&&(!this.boss||!this.boss.alive)?this.hud.setBoss(`SERCE WYRWY`,this.heart.hp,this.heart.maxHp):this.hud.setBoss(null)}hitstop(e){this.hitstopT=Math.max(this.hitstopT,e)}shake(e){this.shakeAmp=Math.min(.5,this.shakeAmp+e)}updateCameraFrustum(){let e=window.innerWidth/window.innerHeight;this.camera.left=-this.viewSize*e,this.camera.right=this.viewSize*e,this.camera.top=this.viewSize,this.camera.bottom=-this.viewSize,this.camera.updateProjectionMatrix()}tick(){let e=Math.min(this.clock.getDelta(),.05),t=e;this.hitstopT>0&&(this.hitstopT-=e,t=0);let n=this.input.aimPoint(this.camera),r=this.input.moveInput(),i=new V().addScaledVector(this.camForward,r.y).addScaledVector(this.camRight,r.x);if(i.lengthSq()>1&&i.normalize(),this.fadePending){this.renderer.render(this.scene,this.camera);return}if(t>0&&this.hero.alive){this.input.takeInteractPressed()&&this.npcs.interact(this.hero.position),this.input.takeDodgePressed()&&this.hero.dodge(i);let e=this.input.takeSkillPressed();e!==null&&this.hero.state!==`roll`&&this.skills.cast(e),this.input.takeAttackPressed()&&this.hero.attack(n)}if(t>0){let e=this.hittables();this.hero.inTown=A_(this.hero.position)===`town`,this.hero.update(t,e,i,n,this.input.attackHeld),this.loot.update(t,this.hero.position);for(let e of this.enemies)e.update(t,this.hero,this.enemies);this.enemies=this.enemies.filter(e=>!e.removed);for(let e of this.spires)e.update(t,this.hero.position);this.npcs.update(t,this.hero.position),this.skills.update(t),T_(t,this.hero.position),this.zoneDirector.update(t,this.hero.position),this.ambience.update(t,this.hero.position,A_(this.hero.position)),rv(t),this.updatePortals(),this.updateRoamers(t)}this.respawnT>=0&&(this.respawnT-=e,this.respawnT<0&&(this.hero.respawn(),this.hud.setDead(!1),this.camera.position.copy(this.hero.position).add(fC))),this.hero.position.distanceTo(t_.position)<t_.radius?this.hud.setMarker(`act2`,t_.position.clone().setY(2.2),t_.text,`poi`):this.hud.setMarker(`act2`,null),this.hud.setHealth(this.hero.hp,this.hero.maxHp),this.hud.setMana(this.hero.mana,this.hero.maxMana),this.hud.setXp(this.hero.xp,this.hero.xpToLevel,this.hero.level),this.hud.setDodge(this.hero.rollCooldown,this.hero.rollCooldownMax);for(let e=0;e<3;e++){let t=this.skills.slotState(e);this.hud.setSkillSlot(e,t.cdRemaining,t.cdMax,t.manaOk,t.unlocked)}this.updateBossBar();let a=this.hero.position.clone().add(fC);if(this.camera.position.lerp(a,Math.min(1,e*6)),this.shakeAmp>.005){let t=performance.now()*.05;this.camera.position.x+=Math.sin(t*1.7)*this.shakeAmp,this.camera.position.y+=Math.cos(t*2.3)*this.shakeAmp*.6,this.shakeAmp*=Math.max(0,1-e*7)}let o=this.camera.position.clone().sub(fC);this.camera.lookAt(o),this.hud.updateMarkers(this.camera),this.renderer.render(this.scene,this.camera)}},gC=`modulepreload`,_C=function(e){return`/`+e},vC={},yC=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=_C(t,n),t=s(t),t in vC)return;vC[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:gC,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},bC=document.getElementById(`loading-status`),xC=document.getElementById(`intro-overlay`);xC.classList.add(`show`),document.getElementById(`build-tag`).textContent=`1b696aa · 2026-07-13 20:40`;async function SC(){await rx((e,t)=>{bC.textContent=`przywoływanie… ${e}/${t}`}),xC.classList.remove(`show`);let e=await jx(),t=new hC(document.getElementById(`app`),e);window.__WT=t,yC(()=>Promise.resolve(),[])}SC().catch(e=>{xC.classList.add(`show`),bC.textContent=`nie udało się załadować: ${e.message}`});export{ix as n,Mf as r,ax as t};
;
// ===== Warptracker PL: karta postaci + sakwa — wersja z ikonami SVG =====
;(function () {
  const RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  const GEM = { common: '#8b8b8b', magic: '#60a5fa', rare: '#fbbf24', unique: '#c084fc' }
  const RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  const SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  const STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: 'szybk. ruchu', mana: 'many', regen: 'życia/s' }
  const MAX_INV = 20
  const KEY = 'wt.inv'

  // ---- hand-drawn SVG icons (steel + red cloth, after the uploaded sheets) ----
  const ICONS = {
    weapon: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="st${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e8ee"/><stop offset=".5" stop-color="#a9a9b6"/><stop offset="1" stop-color="#6e6e7c"/></linearGradient></defs>
<path d="M24 3 L27 7 L27 26 L24 30 L21 26 L21 7 Z" fill="url(#st${v.slice(1)})"/>
<path d="M24 3 L27 7 L27 26 L24 30 Z" fill="#00000022"/>
<rect x="11" y="27" width="26" height="4" rx="1.5" fill="#7a2c22"/>
<rect x="11" y="27" width="26" height="2" rx="1" fill="#a53f30"/>
<rect x="22" y="31" width="4" height="9" rx="1.6" fill="#5b3a24"/>
<rect x="20.4" y="39" width="7.2" height="5.2" rx="2" fill="#c9a24a"/>
<circle cx="24" cy="41.5" r="1.7" fill="${v}"/></svg>`,
    armor: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="ar${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcdce4"/><stop offset="1" stop-color="#75757f"/></linearGradient></defs>
<path d="M10 12 L17 8 L24 11 L31 8 L38 12 L38 22 C38 32 32 39 24 42 C16 39 10 32 10 22 Z" fill="url(#ar${v.slice(1)})"/>
<path d="M24 11 L24 42 C32 39 38 32 38 22 L38 12 L31 8 Z" fill="#00000026"/>
<path d="M14 14 L14 22 C14 29 17 34 21 37 L21 14 Z" fill="#ffffff2e"/>
<path d="M10 12 L17 8 L18.5 12.5 L12 17 L10 22 Z" fill="#7a2c22"/>
<path d="M38 12 L31 8 L29.5 12.5 L36 17 L38 22 Z" fill="#7a2c22"/>
<rect x="20" y="10" width="8" height="3" rx="1.4" fill="#c9a24a"/>
<circle cx="24" cy="24" r="3.2" fill="${v}"/><circle cx="24" cy="24" r="1.6" fill="#ffffffcc"/></svg>`,
    charm: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<path d="M12 22 C12 12 18 7 24 7 C30 7 36 12 36 22" fill="none" stroke="#c9a24a" stroke-width="3"/>
<path d="M12 22 C12 12 18 7 24 7" fill="none" stroke="#e8d18a" stroke-width="1.4"/>
<path d="M24 36 L16 24 L24 19 L32 24 Z" fill="#8a8a94"/>
<path d="M24 36 L32 24 L24 19 Z" fill="#00000022"/>
<circle cx="24" cy="26" r="4.6" fill="${v}"/>
<circle cx="22.6" cy="24.6" r="1.5" fill="#ffffffb8"/></svg>`,
    potion: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<rect x="19" y="4" width="10" height="6" rx="2" fill="#8a5a30"/>
<rect x="18" y="9" width="12" height="3" rx="1.4" fill="#9aa0aa"/>
<path d="M20 11 L20 17 C14 21 12 27 12 32 C12 40 17 44 24 44 C31 44 36 40 36 32 C36 27 34 21 28 17 L28 11 Z" fill="#cfe2ee" opacity=".45"/>
<path d="M14.5 30 C14 36 18 41 24 41 C30 41 34 36 33.5 30 C30 32 26 29 24 26 C21 30 17 31.5 14.5 30 Z" fill="${v}"/>
<path d="M20 11 L20 17 C14 21 12 27 12 32" fill="none" stroke="#ffffff70" stroke-width="1.6"/></svg>`,
    ring: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<circle cx="24" cy="29" r="12" fill="none" stroke="#c9a24a" stroke-width="4.5"/>
<circle cx="24" cy="29" r="12" fill="none" stroke="#e8d18a" stroke-width="1.4"/>
<path d="M24 4 L30 10 L27 16 L21 16 L18 10 Z" fill="#c9a24a"/>
<path d="M21 16 L27 16 L26.2 19.5 L21.8 19.5 Z" fill="#a8863a"/>
<circle cx="24" cy="13.5" r="3.4" fill="${v}"/>
<circle cx="22.9" cy="12.4" r="1.1" fill="#ffffffcc"/></svg>`,
    helmet: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="he${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0e0e8"/><stop offset="1" stop-color="#70707c"/></linearGradient></defs>
<path d="M11 26 C11 14 16 8 24 8 C32 8 37 14 37 26 L37 34 L31 34 L31 26 L28 26 L28 34 L20 34 L20 26 L17 26 L17 34 L11 34 Z" fill="url(#he${v.slice(1)})"/>
<path d="M24 8 C32 8 37 14 37 26 L37 34 L31 34 L31 26 L28 26 L28 34 L24 34 Z" fill="#00000026"/>
<path d="M11 34 L17 34 L17 30 L11 30 Z" fill="#7a2c22"/>
<path d="M37 34 L31 34 L31 30 L37 30 Z" fill="#7a2c22"/>
<rect x="22.5" y="12" width="3" height="6" rx="1.4" fill="${v}"/></svg>`,
    shield: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="sh${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcdce4"/><stop offset="1" stop-color="#75757f"/></linearGradient></defs>
<path d="M24 4 L40 8 L40 24 C40 34 33 41 24 44 C15 41 8 34 8 24 L8 8 Z" fill="url(#sh${v.slice(1)})"/>
<path d="M24 4 L40 8 L40 24 C40 34 33 41 24 44 Z" fill="#00000026"/>
<path d="M22 4 L26 4 L26 44 L22 44 Z" fill="#7a2c22" opacity=".85"/>
<circle cx="24" cy="22" r="5.4" fill="#c9a24a"/><circle cx="24" cy="22" r="3" fill="${v}"/></svg>`,
  }

  function loadInv() {
    try {
      const a = JSON.parse(localStorage.getItem(KEY) || '[]')
      return Array.isArray(a) ? a.slice(0, MAX_INV) : []
    } catch {
      return []
    }
  }
  function saveInv(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)) } catch {}
  }
  function saveGear(L) {
    try { localStorage.setItem('wt.gear', JSON.stringify(L.equipped)) } catch {}
  }
  function loot() { return window.__WT && window.__WT.loot }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

  window.__wtInvAdd = function (item) {
    if (!item) return false
    const inv = loadInv()
    if (inv.length >= MAX_INV) return false
    inv.push(item)
    saveInv(inv)
    refresh()
    return true
  }

  const style = document.createElement('style')
  style.textContent = `
#gear-panel{display:none!important}
#charsheet{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.78);font-family:Georgia,'Times New Roman',serif}
#charsheet.show{display:flex}
.cs-box{display:flex;gap:28px;background:#0d0815;border:1px solid #6b21a8;border-radius:10px;padding:26px 30px;box-shadow:0 0 46px rgba(168,85,247,.28)}
.cs-col{display:flex;flex-direction:column;align-items:center}
.cs-title{color:#e9d5ff;letter-spacing:.24em;font-size:15px;margin-bottom:4px;text-align:center}
.cs-sub{color:#71717a;font-size:12px;margin-bottom:14px;text-align:center}
.doll{position:relative;width:250px;height:320px;background:radial-gradient(ellipse at 50% 42%,rgba(168,85,247,.09),transparent 68%);border:1px solid #2a1b3d;border-radius:10px}
.doll svg.body{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);opacity:.5}
.cs-slot{position:absolute;width:64px;height:64px;border:1px solid #3f2a55;border-radius:8px;background:rgba(20,12,32,.85);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-align:center;transition:border-color .15s}
.cs-slot:hover{border-color:#a855f7}
.cs-slot .lbl{font-size:9.5px;letter-spacing:.1em;color:#71717a;text-transform:uppercase}
.cs-slot .nm{font-size:10px;line-height:1.15;padding:0 4px;max-height:22px;overflow:hidden}
.wt-ico{width:30px;height:30px;display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}
.inv-cell .wt-ico{width:26px;height:26px}
.cs-totals{margin-top:14px;width:250px;color:#c4b5fd;font-size:12px;line-height:1.7;border-top:1px solid #2a1b3d;padding-top:10px;text-align:center;min-height:20px}
.inv-grid{display:grid;grid-template-columns:repeat(5,58px);grid-auto-rows:58px;gap:6px}
.inv-cell{border:1px solid #3f2a55;border-radius:6px;background:rgba(20,12,32,.85);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;transition:border-color .15s;position:relative}
.inv-cell:hover{border-color:#a855f7}
.inv-cell[data-rare="true"]{border-color:#a16207;box-shadow:inset 0 0 10px rgba(251,191,36,.12)}
.inv-cell[data-uniq="true"]{border-color:#7e22ce;box-shadow:inset 0 0 12px rgba(168,85,247,.22)}
.inv-cell.empty{cursor:default}
.inv-cell.empty:hover{border-color:#3f2a55}
.cs-count{color:#71717a;font-size:11px;margin-top:10px}
.cs-hint{color:#71717a;font-size:11px;margin-top:14px;text-align:center;line-height:1.7}
`
  document.head.appendChild(style)

  const root = document.createElement('div')
  root.id = 'charsheet'
  document.body.appendChild(root)

  let open = false

  function affixLine(a) {
    if (a.stat === 'speed') return '+' + a.value + '% ' + STAT_PL.speed
    return '+' + a.value + ' ' + STAT_PL[a.stat]
  }
  function itemTitle(it) {
    return (it.name + ' [' + RAR_PL[it.rarity] + ']\n' + it.affixes.map(affixLine).join('\n'))
  }
  function itemIcon(it) { return ICONS[it.slot] ? ICONS[it.slot](GEM[it.rarity]) : '' }
  function slotIcon(s) { return ICONS[s]('#8b8b8b') }

  function totalsHtml(L) {
    const t = L.totals
    const parts = []
    if (t.dmg) parts.push('+' + t.dmg + ' obrażeń')
    if (t.hp) parts.push('+' + t.hp + ' życia')
    if (t.speed) parts.push('+' + t.speed + '% szybk. ruchu')
    if (t.mana) parts.push('+' + t.mana + ' many')
    if (t.regen) parts.push('+' + t.regen + ' życia/s')
    return parts.length ? 'Premie: ' + parts.join(' · ') : 'Brak premii z ekwipunku'
  }

  function render() {
    const L = loot()
    if (!L) return
    const hero = window.__WT.hero
    const inv = loadInv()
    const slots = ['charm', 'armor', 'weapon']
    const pos = { charm: 'left:93px;top:8px', armor: 'left:16px;top:190px', weapon: 'right:16px;top:190px' }

    let doll = '<div class="doll">'
    doll += '<svg class="body" width="120" height="220" viewBox="0 0 120 220"><g fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round"><circle cx="60" cy="34" r="20"/><path d="M60 54 L60 60 M40 66 Q60 52 80 66 L76 130 Q60 138 44 130 L40 66 M60 62 L34 118 M60 62 L86 118 M60 132 L48 200 M60 132 L72 200"/></g></svg>'
    for (const s of slots) {
      const it = L.equipped[s]
      const tip = it ? esc(itemTitle(it)).replace(/\n/g, '&#10;') : SLOT_PL[s] + ' — pusto'
      doll += '<div class="cs-slot" data-slot="' + s + '" style="' + pos[s] + '" title="' + tip + '">'
      if (it) {
        doll += itemIcon(it) + '<span class="nm" style="color:' + RAR[it.rarity] + '">' + esc(it.name) + '</span>'
      } else {
        doll += slotIcon(s) + '<span class="lbl">' + SLOT_PL[s] + '</span>'
      }
      doll += '</div>'
    }
    doll += '</div><div class="cs-totals">' + totalsHtml(L) + '</div>'

    let grid = ''
    for (let i = 0; i < MAX_INV; i++) {
      const it = inv[i]
      if (it) {
        const tip = esc(itemTitle(it)).replace(/\n/g, '&#10;')
        grid += '<div class="inv-cell" data-idx="' + i + '" data-rare="' + (it.rarity === 'rare') + '" data-uniq="' + (it.rarity === 'unique') + '" title="' + tip + '">' + itemIcon(it) + '</div>'
      } else {
        grid += '<div class="inv-cell empty"></div>'
      }
    }

    root.innerHTML =
      '<div class="cs-box">' +
      '<div class="cs-col"><div class="cs-title">KARTA POSTACI</div><div class="cs-sub">poziom ' + (hero ? hero.level : '?') + '</div>' + doll + '</div>' +
      '<div class="cs-col"><div class="cs-title">SAKWA</div><div class="cs-sub">plecak tropiciela</div><div class="inv-grid">' + grid + '</div><div class="cs-count">' + inv.length + ' / ' + MAX_INV + '</div>' +
      '<div class="cs-hint">LPM — załóż / zdejmij &middot; PPM — wyrzuć<br/>C lub I — otwórz / zamknij &middot; ESC — zamknij</div></div>' +
      '</div>'
  }

  function refresh() { if (open) render() }

  function equip(i) {
    const L = loot(); if (!L) return
    const inv = loadInv()
    const it = inv[i]; if (!it) return
    const old = L.equipped[it.slot]
    L.equipped[it.slot] = it
    saveGear(L)
    inv.splice(i, 1)
    if (old) inv.push(old)
    saveInv(inv)
    L.onEquip(L.totals, it.name.toUpperCase() + ' — założone')
    render()
  }
  function unequip(slot) {
    const L = loot(); if (!L) return
    const it = L.equipped[slot]; if (!it) return
    const inv = loadInv()
    if (inv.length >= MAX_INV) { L.onEquip(L.totals, 'Sakwa pełna!'); return }
    inv.push(it)
    saveInv(inv)
    L.equipped[slot] = null
    saveGear(L)
    L.onEquip(L.totals, it.name.toUpperCase() + ' — zdjęte')
    render()
  }
  function discard(i) {
    const inv = loadInv()
    if (inv[i]) { inv.splice(i, 1); saveInv(inv); render() }
  }

  root.addEventListener('click', (e) => {
    const cell = e.target.closest('.inv-cell[data-idx]')
    if (cell) { equip(Number(cell.dataset.idx)); return }
    const slot = e.target.closest('.cs-slot')
    if (slot) unequip(slot.dataset.slot)
  })
  root.addEventListener('contextmenu', (e) => {
    const cell = e.target.closest('.inv-cell[data-idx]')
    if (cell) { e.preventDefault(); discard(Number(cell.dataset.idx)) }
  })

  function toggle(force) {
    if (!loot()) return
    open = typeof force === 'boolean' ? force : !open
    root.classList.toggle('show', open)
    if (open) render()
  }

  // ---- starter gear: a Tracker never walks into the moor unarmed ----
  function grantStarters(L) {
    if (localStorage.getItem('wt.starter')) return
    if (L.equipped.weapon || L.equipped.armor || L.equipped.charm) {
      try { localStorage.setItem('wt.starter', '1') } catch {}
      return
    }
    L.equipped.weapon = { slot: 'weapon', rarity: 'common', name: 'Wysłużony Ostrze Tropicielela', affixes: [{ stat: 'dmg', value: 12 }] }
    L.equipped.armor = { slot: 'armor', rarity: 'common', name: 'Wgięty Kirys Żarowarty', affixes: [{ stat: 'hp', value: 15 }] }
    L.equipped.charm = { slot: 'charm', rarity: 'common', name: 'Zwykły Talizman Straży', affixes: [{ stat: 'mana', value: 8 }] }
    saveGear(L)
    try { localStorage.setItem('wt.starter', '1') } catch {}
    L.onEquip(L.totals, 'WYPOSAŻENIE STARTOWE — tak się zaczyna łowy')
    refresh()
  }
  let bootTries = 0
  const bootTimer = setInterval(() => {
    const L = loot()
    if (L) { clearInterval(bootTimer); grantStarters(L) }
    else if (++bootTries > 300) clearInterval(bootTimer)
  }, 100)

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    if (e.code === 'KeyC' || e.code === 'KeyI') { if (loot()) { e.preventDefault(); toggle() } }
    else if (e.code === 'Escape' && open) toggle(false)
  })
})()
;
// ===== Warptracker PL: PANEL ADMINA przedmiotów (klawisz P) =====
;(function () {
  const RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  const RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  const SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  const STATS = ['dmg', 'hp', 'speed', 'mana', 'regen']
  const STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: '% szybk. ruchu', mana: 'many', regen: 'życia/s' }
  const KEY = 'wt.inv'
  const MAX_INV = 20

  function loadInv() {
    try {
      const a = JSON.parse(localStorage.getItem(KEY) || '[]')
      return Array.isArray(a) ? a.slice(0, MAX_INV) : []
    } catch { return [] }
  }
  function saveInv(a) { try { localStorage.setItem(KEY, JSON.stringify(a)) } catch {} }
  function saveGear(L) { try { localStorage.setItem('wt.gear', JSON.stringify(L.equipped)) } catch {} }
  function loot() { return window.__WT && window.__WT.loot }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

  const style = document.createElement('style')
  style.textContent = `
#admin-panel{position:fixed;inset:0;z-index:130;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.82);font-family:Georgia,'Times New Roman',serif}
#admin-panel.show{display:flex}
.adm-box{width:880px;max-height:92vh;overflow:auto;background:#0d0815;border:1px solid #6b21a8;border-radius:10px;padding:22px 26px;box-shadow:0 0 46px rgba(168,85,247,.28)}
.adm-title{color:#e9d5ff;letter-spacing:.24em;font-size:15px;text-align:center;margin-bottom:2px}
.adm-sub{color:#71717a;font-size:11px;text-align:center;margin-bottom:16px}
.adm-cols{display:flex;gap:22px}
.adm-list{width:330px;max-height:56vh;overflow:auto;border:1px solid #2a1b3d;border-radius:8px;background:rgba(16,10,26,.6)}
.adm-item{padding:7px 10px;border-bottom:1px solid #221536;cursor:pointer;display:flex;align-items:center;gap:8px}
.adm-item:hover{background:rgba(168,85,247,.08)}
.adm-item.sel{background:rgba(168,85,247,.16);border-left:3px solid #a855f7}
.adm-item .dot{width:9px;height:9px;border-radius:50%;flex:none}
.adm-item .nm{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.adm-item .tag{font-size:9px;color:#71717a;letter-spacing:.08em}
.adm-form{flex:1;display:flex;flex-direction:column;gap:10px}
.adm-form label{color:#a1a1aa;font-size:10px;letter-spacing:.14em;text-transform:uppercase}
.adm-form input[type=text],.adm-form select{background:rgba(20,12,32,.9);border:1px solid #3f2a55;color:#e9d5ff;border-radius:6px;padding:7px 10px;font-size:13px;width:100%;box-sizing:border-box;font-family:inherit}
.adm-form input:focus,.adm-form select:focus{outline:none;border-color:#a855f7}
.adm-aff{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.adm-aff .aff{border:1px solid #2a1b3d;border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:5px;background:rgba(20,12,32,.7)}
.adm-aff .aff.on{border-color:#7e22ce}
.adm-aff .aff label{display:flex;align-items:center;gap:5px;color:#c4b5fd;font-size:10px;text-transform:none;letter-spacing:0}
.adm-aff input[type=number]{width:100%;background:rgba(10,6,18,.9);border:1px solid #3f2a55;color:#fde047;border-radius:5px;padding:4px 6px;font-size:12px;box-sizing:border-box}
.adm-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.adm-btn{flex:1;min-width:120px;padding:9px 12px;border-radius:7px;border:1px solid #6b21a8;background:rgba(107,33,168,.25);color:#e9d5ff;font-family:inherit;font-size:12px;letter-spacing:.1em;cursor:pointer;text-transform:uppercase}
.adm-btn:hover{background:rgba(168,85,247,.35)}
.adm-btn.green{border-color:#3f6212;background:rgba(63,98,18,.3)}
.adm-btn.red{border-color:#7f1d1d;background:rgba(127,29,29,.3)}
.adm-btn.gold{border-color:#a16207;background:rgba(161,98,7,.25)}
.adm-hint{color:#71717a;font-size:10.5px;text-align:center;margin-top:12px;line-height:1.6}
.adm-empty{color:#52525b;font-size:12px;text-align:center;padding:26px 8px}
`
  document.head.appendChild(style)

  const root = document.createElement('div')
  root.id = 'admin-panel'
  document.body.appendChild(root)
  let open = false
  let sel = null

  function current() {
    const L = loot(); if (!L) return null
    if (!sel) return null
    if (sel.kind === 'inv') return loadInv()[sel.i] || null
    return L.equipped[sel.slot] || null
  }
  function applyStats(L, msg) {
    saveGear(L)
    L.onEquip(L.totals, msg)
  }

  function renderList() {
    const L = loot(); if (!L) return ''
    let h = ''
    for (const s of ['weapon', 'armor', 'charm']) {
      const it = L.equipped[s]
      h += '<div class="adm-item' + (sel && sel.kind === 'eq' && sel.slot === s ? ' sel' : '') + '" data-kind="eq" data-slot="' + s + '">'
      h += '<span class="dot" style="background:' + (it ? RAR[it.rarity] : '#3f2a55') + '"></span>'
      h += '<span class="nm" style="color:' + (it ? RAR[it.rarity] : '#52525b') + '">' + (it ? esc(it.name) : '— ' + SLOT_PL[s] + ' pusta —') + '</span>'
      h += '<span class="tag">ZAŁOŻONE</span></div>'
    }
    const inv = loadInv()
    inv.forEach((it, i) => {
      h += '<div class="adm-item' + (sel && sel.kind === 'inv' && sel.i === i ? ' sel' : '') + '" data-kind="inv" data-idx="' + i + '">'
      h += '<span class="dot" style="background:' + RAR[it.rarity] + '"></span>'
      h += '<span class="nm" style="color:' + RAR[it.rarity] + '">' + esc(it.name) + '</span>'
      h += '<span class="tag">SAKWA</span></div>'
    })
    if (!inv.length && !L.equipped.weapon && !L.equipped.armor && !L.equipped.charm) {
      h += '<div class="adm-empty">brak przedmiotów</div>'
    }
    return h
  }

  function renderForm() {
    const it = current()
    const mk = (a) => (it ? it.affixes.some((x) => x.stat === a) : false)
    const val = (a) => {
      if (!it) return ''
      const x = it.affixes.find((y) => y.stat === a)
      return x ? x.value : ''
    }
    let aff = '<div class="adm-aff">'
    for (const s of STATS) {
      aff += '<div class="aff' + (mk(s) ? ' on' : '') + '" id="aff-' + s + '">'
      aff += '<label><input type="checkbox" id="chk-' + s + '"' + (mk(s) ? ' checked' : '') + '>' + STAT_PL[s].replace('życia/s', 'regen') + '</label>'
      aff += '<input type="number" step="any" id="val-' + s + '" placeholder="0" value="' + val(s) + '"></div>'
    }
    aff += '</div>'

    const opts = (v) => ['common', 'magic', 'rare', 'unique'].map((r) => '<option value="' + r + '"' + (v === r ? ' selected' : '') + '>' + RAR_PL[r] + '</option>').join('')
    const slotOpts = (v) => ['weapon', 'armor', 'charm'].map((s) => '<option value="' + s + '"' + (v === s ? ' selected' : '') + '>' + SLOT_PL[s] + '</option>').join('')

    return (
      '<div class="adm-form">' +
      '<div><label>Nazwa</label><input type="text" id="adm-name" maxlength="60" value="' + (it ? esc(it.name) : 'Nowy przedmiot') + '"></div>' +
      '<div style="display:flex;gap:10px"><div style="flex:1"><label>Slot</label><select id="adm-slot">' + slotOpts(it ? it.slot : 'weapon') + '</select></div>' +
      '<div style="flex:1"><label>Rzadkość</label><select id="adm-rarity">' + opts(it ? it.rarity : 'magic') + '</select></div></div>' +
      '<div><label>Afiksy (zaznacz i ustaw wartość)</label>' + aff + '</div>' +
      '<div class="adm-btns">' +
      '<button class="adm-btn gold" id="adm-save">' + (it ? 'ZAPISZ ZMIANY' : 'UTWÓRZ') + '</button>' +
      '<button class="adm-btn green" id="adm-new">NOWY</button>' +
      (it ? '<button class="adm-btn green" id="adm-equip">ZAŁÓŻ</button><button class="adm-btn red" id="adm-del">USUŃ</button>' : '') +
      '</div></div>'
    )
  }

  function render() {
    if (!loot()) return
    root.innerHTML =
      '<div class="adm-box"><div class="adm-title">PANEL ADMINA — PRZEDMIOTY</div>' +
      '<div class="adm-sub">wybierz przedmiot z listy lub stwórz nowy &middot; zmiany działają natychmiast</div>' +
      '<div class="adm-cols"><div class="adm-list" id="adm-list">' + renderList() + '</div>' + renderForm() + '</div>' +
      '<div class="adm-hint">P — otwórz / zamknij &middot; klik na przedmiot — edycja &middot; NOWY — świeży przedmiot do sakwy<br/>ZAŁÓŻ przenosi przedmiot ze sakwy na slot (stary wraca do sakwy) &middot; USUŃ kasuje przedmiot</div></div>'
    bindForm()
  }

  function readForm() {
    const name = document.getElementById('adm-name').value.trim() || 'Bez nazwy'
    const slot = document.getElementById('adm-slot').value
    const rarity = document.getElementById('adm-rarity').value
    const affixes = []
    for (const s of STATS) {
      if (document.getElementById('chk-' + s).checked) {
        const v = parseFloat(document.getElementById('val-' + s).value)
        if (!isNaN(v) && v !== 0) affixes.push({ stat: s, value: v })
      }
    }
    if (!affixes.length) affixes.push({ stat: 'dmg', value: 1 })
    return { slot, rarity, name, affixes }
  }

  function bindForm() {
    for (const s of STATS) {
      document.getElementById('chk-' + s).addEventListener('change', (e) => {
        document.getElementById('aff-' + s).classList.toggle('on', e.target.checked)
      })
    }
    document.getElementById('adm-save').onclick = () => {
      const L = loot(); if (!L) return
      const data = readForm()
      if (sel && sel.kind === 'eq') {
        const old = L.equipped[sel.slot]
        if (old) { old.name = data.name; old.slot = data.slot; old.rarity = data.rarity; old.affixes = data.affixes }
        applyStats(L, data.name.toUpperCase() + ' — zmienione (admin)')
        if (old && data.slot !== sel.slot) {
          const inv = loadInv(); inv.push(old); saveInv(inv)
          L.equipped[sel.slot] = null
          applyStats(L, data.name.toUpperCase() + ' — przeniesione do sakwy (admin)')
        }
      } else if (sel && sel.kind === 'inv') {
        const inv = loadInv()
        const it = inv[sel.i]
        if (it) { it.name = data.name; it.slot = data.slot; it.rarity = data.rarity; it.affixes = data.affixes; saveInv(inv) }
      } else {
        const inv = loadInv()
        if (inv.length >= MAX_INV) { L.onEquip(L.totals, 'Sakwa pełna!'); return }
        inv.push(data); saveInv(inv)
        sel = { kind: 'inv', i: inv.length - 1 }
      }
      render()
    }
    document.getElementById('adm-new').onclick = () => { sel = null; render() }
    const eq = document.getElementById('adm-equip')
    if (eq) eq.onclick = () => {
      const L = loot(); if (!L || !sel || sel.kind !== 'inv') return
      const inv = loadInv()
      const it = inv[sel.i]; if (!it) return
      const target = L.equipped[it.slot]
      L.equipped[it.slot] = it
      inv.splice(sel.i, 1)
      if (target) inv.push(target)
      saveInv(inv)
      applyStats(L, it.name.toUpperCase() + ' — założone (admin)')
      sel = { kind: 'eq', slot: it.slot }
      render()
    }
    const del = document.getElementById('adm-del')
    if (del) del.onclick = () => {
      const L = loot(); if (!L || !sel) return
      if (sel.kind === 'inv') {
        const inv = loadInv(); inv.splice(sel.i, 1); saveInv(inv)
      } else {
        L.equipped[sel.slot] = null
        applyStats(L, 'przedmiot usunięty (admin)')
      }
      sel = null
      render()
    }
  }

  root.addEventListener('click', (e) => {
    const el = e.target.closest('.adm-item')
    if (!el) return
    if (el.dataset.kind === 'eq') sel = { kind: 'eq', slot: el.dataset.slot }
    else sel = { kind: 'inv', i: Number(el.dataset.idx) }
    render()
  })

  function toggle() {
    if (!loot()) return
    open = !open
    root.classList.toggle('show', open)
    if (open) { sel = null; render() }
  }
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    if (e.code === 'KeyP') { if (loot()) { e.preventDefault(); toggle() } }
    else if (e.code === 'Escape' && open) toggle()
  })
})()

// ===== Warptracker PL: trawiaste podłoże (proceduralna tekstura) =====
;(function () {
  function grassify() {
    const g = window.__WT
    const THREE = window.__WTdebug && window.__WTdebug.THREE
    if (!g || !g.scene || !THREE) return false
    let found = false
    g.scene.traverse((o) => {
      if (o.name === 'ground' && o.material && o.isMesh) {
        found = true
        const S = 256
        const cv = document.createElement('canvas')
        cv.width = S; cv.height = S
        const cx = cv.getContext('2d')
        const img = cx.createImageData(S, S)
        const d = img.data
        const rnd = (n) => {
          const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
          return s - Math.floor(s)
        }
        const G = 8, G2 = 32
        const cell = (x, y, n) => rnd((Math.floor(x) % n) + (Math.floor(y) % n) * n + n * 7.13)
        const smooth = (t) => t * t * (3 - 2 * t)
        const noise = (x, y, n) => {
          const xi = Math.floor(x), yi = Math.floor(y)
          const xf = smooth(x - xi), yf = smooth(y - yi)
          const a = cell(xi, yi, n), b = cell(xi + 1, yi, n), c = cell(xi, yi + 1, n), dd = cell(xi + 1, yi + 1, n)
          return a + (b - a) * xf + (c - a) * yf + (a - b - c + dd) * xf * yf
        }
        for (let y = 0; y < S; y++) {
          for (let x = 0; x < S; x++) {
            const u = x / S, v = y / S
            const n1 = noise(u * G, v * G, G)
            const n2 = noise(u * G2, v * G2, G2)
            const n3 = rnd(x * 7.7 + y * 13.3)
            const h = n1 * 0.55 + n2 * 0.3 + n3 * 0.15
            const i = (y * S + x) * 4
            const dry = Math.pow(h, 2.4)
            d[i] = Math.round(30 + h * 34 + dry * 30)
            d[i + 1] = Math.round(46 + h * 52 + dry * 22)
            d[i + 2] = Math.round(18 + h * 26 + dry * 8)
            d[i + 3] = 255
          }
        }
        cx.putImageData(img, 0, 0)
        const tex = new THREE.CanvasTexture(cv)
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(60, 60)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        o.material.map = tex
        o.material.color.set(0x9aa06a)
        o.material.roughness = 1
        o.material.needsUpdate = true
      }
    })
    return found
  }
  let tries = 0
  const t = setInterval(() => {
    if (grassify() || ++tries > 200) clearInterval(t)
  }, 150)
})()
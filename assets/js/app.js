(()=>{
const T=THREE,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),km=n=>Math.round(n/10)*10+'';
const fmt=n=>(+km(n)).toLocaleString('de-DE')+' KM';
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- materijali ---------- */
const MATS={
 hrast:{n:'Hrast natur',c:'#c9a474',t:'w',g:1,k:1.15},orah:{n:'Orah',c:'#6e4c34',t:'w',g:1,k:1.25},
 krem:{n:'Bijela mat',c:'#f3f2ef',t:'w',k:1},antracit:{n:'Ardor siva',c:'#58595b',t:'w',k:1.1},zelena:{n:'Ardor narandžasta',c:'#f58a1f',t:'w',k:1.12},
 kamen:{n:'Svijetli kamen',c:'#e4e3e0',t:'s',k:1.2},
 bez:{n:'Svijetlosivi buklé',c:'#d8d7d4',t:'f'},siva:{n:'Siva',c:'#8f9092',t:'f'},smaragd:{n:'Narandžastocrvena',c:'#f15a29',t:'f'},bakar:{n:'Narandžasta',c:'#f79328',t:'f'},grafit:{n:'Grafit',c:'#454547',t:'f'}};
const TIP={hrast:'Hrast unosi svjetlinu i mir; lijepo se slaže s bijelim zidovima i sivim tkaninama.',orah:'Orah daje dubinu i toplinu. Uz sivu i narandžasti detalj djeluje bogato, a nenametljivo.',krem:'Bijele mat fronte vizuelno šire prostor — idealne za manje stanove i kuhinje s manje dnevnog svjetla.',antracit:'Siva je mirna, profesionalna baza. Toplinu joj vratite drvenom radnom pločom ili narandžastim detaljem.',zelena:'Narandžaste fronte unose energiju i optimizam. Najljepše su uz bijelu ili sivu i svijetlu radnu ploču.',kamen:'Svijetli kamen je otporan i bezvremenski; reflektuje svjetlo i čini kuhinju prozračnijom.',bez:'Svijetlosivi buklé je mekan na dodir i oprašta svakodnevni život. Dodajte narandžasti jastuk.',siva:'Siva je neutralna baza: mijenjajte jastuke i tepih, garnitura ostaje aktuelna godinama.',smaragd:'Narandžastocrvena pretvara komad u centar sobe — ostatak neka bude miran, u sivoj i bijeloj.',bakar:'Narandžasta donosi sunce u prostor; najljepša je uz bijele zidove i svijetlo drvo.',grafit:'Grafit je praktičan i elegantan. Uz orah dobijate izrazito moderan izgled.'};
const cache={};
function woodCv(c){const k='cv'+c;if(cache[k])return cache[k];const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');x.fillStyle=c;x.fillRect(0,0,256,256);
 for(let i=0;i<110;i++){x.strokeStyle=`rgba(${i%3?'70,40,15':'255,235,200'},${.03+Math.random()*.09})`;x.lineWidth=.5+Math.random()*1.6;const px=Math.random()*256,w=(Math.random()-.5)*14;x.beginPath();x.moveTo(px,0);x.bezierCurveTo(px+w,85,px-w,170,px+w*.4,256);x.stroke()}return cache[k]=cv}
function floorTex(c,rx,ry){const k='fl'+c;if(!cache[k]){const cv=document.createElement('canvas');cv.width=cv.height=512;const x=cv.getContext('2d'),g=woodCv(c);
  for(let r=0;r<8;r++){const off=(r%2)*128+r*37;for(let p=-1;p<3;p++){x.globalAlpha=1;x.drawImage(g,p*256+off%256-128,r*64,256,64);x.fillStyle=`rgba(40,20,5,${Math.random()*.10})`;x.fillRect(p*256+off%256-128,r*64,256,64);x.fillStyle='rgba(30,15,5,.35)';x.fillRect(p*256+off%256-128,r*64,1.5,64)}x.fillStyle='rgba(30,15,5,.3)';x.fillRect(0,r*64,512,1.5)}cache[k]=cv}
 const t=new T.CanvasTexture(cache[k]);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return t}
let noise;
function mat(k){if(cache['m'+k])return cache['m'+k];const d=MATS[k];let m;
 if(d.t=='f'){if(!noise){const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d'),im=x.createImageData(128,128);for(let i=0;i<im.data.length;i+=4){const v=110+Math.random()*145;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}x.putImageData(im,0,0);noise=new T.CanvasTexture(cv);noise.wrapS=noise.wrapT=T.RepeatWrapping;noise.repeat.set(3,3)}
  m=new T.MeshStandardMaterial({color:d.c,roughness:.95,bumpMap:noise,bumpScale:.6})}
 else if(d.g){const t=new T.CanvasTexture(woodCv(d.c));t.colorSpace=T.SRGBColorSpace;m=new T.MeshStandardMaterial({map:t,roughness:.6})}
 else m=new T.MeshStandardMaterial({color:d.c,roughness:d.t=='s'?.32:.55});
 return cache['m'+k]=m}
const sm=(c,r=.6,me=0,ex)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:me,...ex});
const metal=sm(0xa9aaac,.3,.75),dark=sm(0x2a2a2b,.7),white=sm(0xf7f6f3,.9),leaf=sm(0x5c7a55,.9),terra=sm(0xf15a29,.85),
shade=sm(0xfaf3e6,.8,0,{emissive:0xffd9a0,emissiveIntensity:.7}),bookC=[0xf15a29,0x58595b,0xf3f2ef,0xf79328,0x8f9092,0xc9a474].map(c=>sm(c,.85));

/* ---------- geometrija ---------- */
function sh(o,cast=true){o.castShadow=cast;o.receiveShadow=true;return o}
function box(w,h,d,m,x=0,y=0,z=0){const o=sh(new T.Mesh(new T.BoxGeometry(w,h,d),m));o.position.set(x,y,z);return o}
function cyl(r,h,m,x=0,y=0,z=0,r2=r,seg=24){const o=sh(new T.Mesh(new T.CylinderGeometry(r2,r,h,seg),m));o.position.set(x,y,z);return o}
function rbox(w,h,d,r,m,x=0,y=0,z=0){const b=Math.min(r,w/2-.002,h/2-.002,d/2-.002),sw=w-2*b,shh=h-2*b,c=Math.min(b,sw/2,shh/2),s=new T.Shape();
 const X=sw/2,Y=shh/2;s.moveTo(-X+c,-Y);s.lineTo(X-c,-Y);s.quadraticCurveTo(X,-Y,X,-Y+c);s.lineTo(X,Y-c);s.quadraticCurveTo(X,Y,X-c,Y);s.lineTo(-X+c,Y);s.quadraticCurveTo(-X,Y,-X,Y-c);s.lineTo(-X,-Y+c);s.quadraticCurveTo(-X,-Y,-X+c,-Y);
 const g=new T.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:4,curveSegments:6});g.center();const o=sh(new T.Mesh(g,m));o.position.set(x,y,z);return o}
const G=(...a)=>{const g=new T.Group();a.forEach(o=>g.add(o));return g};

function sofa({w=2.4,a='siva',b='orah',corner=false,pillow='smaragd'}={}){const g=G(),f=mat(a),l=mat(b),D=.95,n=w<1.4?1:w<2.2?2:3,iw=w-.4,cw=iw/n;
 for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.02,.12,l,sx*(w/2-.1),.06,sz*(D/2-.1),.03));
 g.add(rbox(w,.2,D,.04,f,0,.22,0),rbox(iw,.5,.16,.05,f,0,.57,-.39));
 for(let i=0;i<n;i++){const x=-iw/2+cw*(i+.5);g.add(rbox(cw-.02,.17,.72,.06,f,x,.4,.1));const bc=rbox(cw-.03,.42,.2,.08,f,x,.68,-.2);bc.rotation.x=-.14;g.add(bc)}
 for(const s of[-1,1])g.add(rbox(.2,.44,D,.07,f,s*(w/2-.1),.5,0));
 if(corner){const x=iw/2-cw/2;g.add(rbox(cw,.2,.72,.04,f,x,.22,D/2+.36),rbox(cw-.02,.17,.72,.06,f,x,.4,D/2+.34));for(const s of[-1,1])g.add(cyl(.02,.12,l,x+s*(cw/2-.08),.06,D/2+.62,.03))}
 if(pillow&&pillow!=a){const p=rbox(.42,.42,.13,.06,mat(pillow),-iw/2+.26,.68,.04);p.rotation.set(-.35,.35,.08);g.add(p)}
 return g}
function fronts(g,x0,w,n,y,h,z,fr,hy,vertical){const dw=w/n;g.add(box(w-.01,h,.004,dark,x0+w/2,y,z-.011));
 for(let i=0;i<n;i++){const x=x0+dw*(i+.5);g.add(box(dw-.006,h-.006,.02,fr,x,y,z));if(vertical){const s=i%2?-1:1;g.add(box(.012,.3,.022,metal,x+s*(dw/2-.045),hy,z+.02))}else g.add(box(Math.min(.18,dw*.4),.012,.022,metal,x,hy,z+.02))}}
function wardrobe({w=2.5,h=2.4,d=.6,a='hrast',b='krem'}={}){const g=G(),n=Math.max(2,Math.round(w/.5));
 g.add(box(w-.04,.08,d-.06,dark,0,.04,-.01),box(w,h-.08,d,mat(b),0,.08+(h-.08)/2,0));
 fronts(g,-w/2,w,n,.08+(h-.08)/2,h-.08,d/2+.011,mat(a),1.05,true);return g}
function kitchen({w=3.2,a='krem',b='hrast',upper=true}={}){const g=G(),fr=mat(a),top=mat(b);let x0=-w/2;
 if(w>=2.4){g.add(box(.6,.1,.55,dark,x0+.3,.05,-.02),box(.6,2.05,.6,fr,x0+.3,.1+1.025,0));g.add(box(.59,2.05,.004,dark,x0+.3,1.125,.3));
  g.add(box(.594,1.3,.02,fr,x0+.3,.75,.311),box(.594,.744,.02,fr,x0+.3,1.778,.311),box(.012,.4,.022,metal,x0+.55,1.1,.33),box(.012,.3,.022,metal,x0+.55,1.6,.33));x0+=.6}
 const rw=w/2-x0,n=Math.max(1,Math.round(rw/.6)),uw=rw/n,cx=x0+rw/2;
 g.add(box(rw,.1,.52,dark,cx,.05,-.02),box(rw,.76,.58,fr,cx,.48,0),box(rw-.01,.76,.004,dark,cx,.48,.29),box(rw+.02,.04,.63,top,cx,.88,.012));
 for(let i=0;i<n;i++){const x=x0+uw*(i+.5);
  if(i%3==1){for(let k=0;k<3;k++)g.add(box(uw-.006,.247,.02,fr,x,.227+k*.253,.301),box(uw*.45,.012,.022,metal,x,.3+k*.253,.321));g.add(box(Math.min(.52,uw-.06),.008,.46,dark,x,.904,.02))}
  else{g.add(box(uw-.006,.754,.02,fr,x,.48,.301),box(.18,.012,.022,metal,x,.8,.321));if(i==n-1&&n>2){g.add(box(Math.min(.46,uw-.08),.006,.38,sm(0x8d8a85,.3,.7),x,.903,.04),cyl(.012,.26,metal,x,1.03,-.2),box(.012,.012,.16,metal,x,1.16,-.13))}}}
 if(upper){g.add(box(rw,.7,.34,fr,cx,1.8,-.12),box(rw,.56,.015,top,cx,1.18,-.283));fronts(g,x0,rw,n,1.8,.7,.061,fr,1.5,false)}
 return g}
function decor(g,k,cx,cy,cw,ch,z){const r=i=>Math.abs(Math.sin(k*12.9898+i*78.233)*43758.5453)%1;
 if(k%5==1){let x=cx-cw/2+.04;for(let i=0;i<6&&x<cx+cw/2-.09;i++){const bw=.028+r(i)*.03,bh=ch*(.55+r(i+9)*.3);g.add(box(bw,bh,.16,bookC[(k+i)%6],x+bw/2,cy+bh/2,z));x+=bw+.003}}
 else if(k%5==3){g.add(cyl(.045,ch*.5,k%2?white:terra,cx,cy+ch*.25,z,.07,20))}
 else if(k%5==4){for(let i=0;i<3;i++)g.add(box(.2,.03,.15,bookC[(k+i)%6],cx-.03+i*.012,cy+.015+i*.03,z))}}
function shelf({w=2,h=2,d=.36,a='hrast',b='antracit'}={}){const g=G(),bm=mat(a),ac=mat(b),t=.025,rows=Math.max(2,Math.round(h/.4)),cols=Math.max(2,Math.round(w/.45)),ch=(h-t)/rows,cw=(w-t)/cols;
 g.add(box(w,h,.008,bm,0,h/2,-d/2+.004));
 for(let r=0;r<=rows;r++)g.add(box(w,t,d,bm,0,t/2+r*ch,0));
 for(let c=0;c<=cols;c++)g.add(box(t,h,d,bm,-w/2+t/2+c*cw,h/2,0));
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const cx=-w/2+t/2+(c+.5)*cw,cy=t+r*ch,k=r*7+c*3;
  if(k%5==0||r==0)g.add(box(cw-t-.004,ch-t-.004,.018,ac,cx,cy+(ch-t)/2,d/2-.009));else decor(g,k,cx,cy,cw-t,ch-t,.02)}
 return g}
function bed({w=1.7,a='siva',b='orah'}={}){const g=G(),f=mat(a),l=mat(b);
 for(const sx of[-1,1])for(const sz of[-1,1])g.add(box(.06,.1,.06,l,sx*(w/2-.02),.05,sz*.98));
 g.add(rbox(w+.08,.24,2.08,.03,f,0,.22,0),rbox(w,.2,2,.07,white,0,.43,.02),rbox(w+.14,1.05,.12,.05,f,0,.58,-1.08),rbox(w+.04,.1,1.3,.05,f,0,.55,.37));
 for(const s of[-1,1]){const p=rbox(w/2-.14,.14,.42,.07,white,s*w/4,.6,-.72);p.rotation.x=.12;g.add(p);g.add(box(.45,.38,.4,l,s*(w/2+.36),.24,-.86),box(.44,.16,.02,dark,s*(w/2+.36),.3,-.655),cyl(.05,.2,shade,s*(w/2+.36),.62,-.86,.09),cyl(.008,.12,metal,s*(w/2+.36),.49,-.86))}
 return g}
function sideboard({w=1.7,a='krem',b='orah'}={}){const g=G(),n=Math.round(w/.45);
 for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.014,.16,metal,sx*(w/2-.08),.08,sz*.15,.02));
 g.add(box(w,.58,.42,mat(b),0,.45,0));fronts(g,-w/2+.02,w-.04,n,.45,.54,.221,mat(a),.45,true);
 g.add(cyl(.05,.3,white,-w/2+.3,.89,0,.085),box(.24,.03,.17,bookC[0],w/2-.4,.755,0),box(.22,.03,.16,bookC[2],w/2-.39,.785,0));return g}
function table({b='orah'}={}){const g=G(cyl(.45,.035,mat(b),0,.385,0,.45,48));for(let i=0;i<3;i++){const a=i*2.094,l=cyl(.014,.38,dark,Math.sin(a)*.3,.19,Math.cos(a)*.3,.02);l.rotation.set(Math.cos(a)*.14,0,-Math.sin(a)*.14);g.add(l)}
 g.add(box(.2,.025,.15,bookC[2],-.1,.415,.05),cyl(.03,.1,terra,.18,.45,-.1,.045));return g}
function lamp(){return G(cyl(.15,.02,dark,0,.01,0),cyl(.01,1.5,metal,0,.76,0),cyl(.2,.28,shade,0,1.6,0,.13,32))}
function plant(){const g=G(cyl(.13,.3,terra,0,.15,0,.17));for(let i=0;i<7;i++){const a=i*.9,o=sh(new T.Mesh(new T.IcosahedronGeometry(.13+((i*37)%5)*.02,1),leaf));o.position.set(Math.sin(a)*.15,.48+i*.075,Math.cos(a)*.15);o.scale.y=1.3;g.add(o)}return g}
function rug(w,d,c){const o=box(w,.012,d,sm(c,1),0,.008,0);o.castShadow=false;return o}
function room(w,l,{wall='#f1f1f0',floor='#c9a474'}={}){const wm=sm(wall,1),g=G();const f=new T.Mesh(new T.PlaneGeometry(w,l),new T.MeshStandardMaterial({map:floorTex(floor,w/1.6,l/1.6),roughness:.7}));f.rotation.x=-Math.PI/2;f.position.y=.003;f.receiveShadow=true;
 g.add(f,box(w+.16,2.7,.08,wm,-.04,1.35,-l/2-.04),box(.08,2.7,l,wm,-w/2-.04,1.35,0),box(w,.08,.015,white,0,.04,-l/2+.008),box(.015,.08,l,white,-w/2+.008,.04,0));g.children.forEach(c=>c.castShadow=false);return g}
const at=(o,x,z,ry=0)=>{o.position.set(x,0,z);o.rotation.y=ry;return o};

/* ---------- stilovi i proizvodi ---------- */
const STYLES={skandi:{n:'Skandinavski',f:'bez',w:'krem',w2:'hrast',wall:'#f4f3f1',fl:'#d2b184',rug:0xffffff,pil:'bakar',pal:['#f4f3f1','#d8d7d4','#c9a474','#8f9092','#58595b'],q:'Svjetlo, zrak i ništa suvišno.',d:'Svijetlo drvo, meke tkanine i mnogo dnevnog svjetla. Prostor koji odmara.'},
 medit:{n:'Sunčani',f:'bakar',w:'krem',w2:'hrast',wall:'#fbf6ee',fl:'#c9a474',rug:0xf0ede7,pil:'bez',pal:['#fbf6ee','#f79328','#c9a474','#f3f2ef','#58595b'],q:'Sunce koje ostaje i kad zađe.',d:'Narandžasta, bijela i svijetlo drvo. Vedar prostor pun optimizma.'},
 modern:{n:'Moderni',f:'grafit',w:'antracit',w2:'orah',wall:'#e3e3e4',fl:'#8a6a4e',rug:0x9a9b9d,pil:'smaragd',pal:['#e3e3e4','#8f9092','#58595b','#6e4c34','#f15a29'],q:'Čiste linije, jasne odluke.',d:'Mat površine, sivi tonovi i precizne linije. Elegantno bez napora.'},
 bos:{n:'Ardor potpis',f:'siva',w:'zelena',w2:'orah',wall:'#f79328',fl:'#7d573b',rug:0xf3f2ef,pil:'smaragd',pal:['#f15a29','#f79328','#58595b','#ffffff','#6e4c34'],q:'Dom u koji se svi vraćaju.',d:'Siva baza, narandžasti zid i topli orah. Hrabar prostor s karakterom.'}};
const FAB=['bez','siva','smaragd','bakar','grafit'],WD=['krem','hrast','orah','antracit','zelena'],LEG=['hrast','orah','antracit'];
const P=[
 {id:'luna',cat:'garniture',name:'Luna',sub:'Ugaona garnitura',la:'Tkanina',A:FAB,lb:'Nogice',B:LEG,a:'siva',b:'orah',dim:'270 × 165 × 85 cm',price:2490,stock:'Izložena u salonu',build:o=>sofa({w:2.7,corner:true,...o})},
 {id:'vrbas',cat:'kuhinje',name:'Vrbas',sub:'Kuhinja po mjeri',la:'Fronte',A:WD,lb:'Radna ploča',B:['kamen','hrast','orah','antracit'],a:'zelena',b:'kamen',dim:'Po mjeri · primjer 320 cm',price:4900,from:1,stock:'Izrada po mjeri',build:o=>kitchen({w:3.2,...o})},
 {id:'kastel',cat:'plakari',name:'Kastel',sub:'Ugradbeni plakar',la:'Fronte',A:WD,lb:'Korpus',B:WD,a:'hrast',b:'krem',dim:'Po mjeri · primjer 250 × 240 cm',price:2350,from:1,stock:'Izrada po mjeri',build:o=>wardrobe(o)},
 {id:'kozara',cat:'regali',name:'Kozara',sub:'Regal za dnevni boravak',la:'Korpus',A:WD,lb:'Vratašca',B:WD,a:'hrast',b:'antracit',dim:'200 × 200 × 36 cm',price:1480,stock:'Izložen u salonu',build:o=>shelf(o)},
 {id:'una',cat:'spavace',name:'Una',sub:'Bračni krevet s noćnim ormarićima',la:'Tkanina',A:FAB,lb:'Drvo',B:LEG,a:'siva',b:'orah',dim:'Ležaj 160 × 200 cm',price:1690,stock:'Izložen u salonu',build:o=>bed(o)},
 {id:'sana',cat:'komode',name:'Sana',sub:'Komoda',la:'Fronte',A:WD,lb:'Korpus',B:WD,a:'krem',b:'orah',dim:'170 × 74 × 42 cm',price:890,stock:'Dostupno po narudžbi',build:o=>sideboard(o)},
 {id:'mila',cat:'garniture',name:'Mila',sub:'Fotelja',la:'Tkanina',A:FAB,lb:'Nogice',B:LEG,a:'smaragd',b:'hrast',dim:'105 × 95 × 85 cm',price:640,stock:'Izložena u salonu',build:o=>sofa({w:1.05,pillow:0,...o})}];
const CATS=[['kuhinje','Kuhinje','po mjeri','vrbas'],['plakari','Plakari','ugradbeni i klizni','kastel'],['garniture','Garniture','dnevni boravak','luna'],['regali','Regali','i TV zidovi','kozara'],['spavace','Spavaće sobe','i dječiji program','una'],['komode','Komode','i predsoblja','sana']];
const byId=id=>P.find(p=>p.id==id);
function styled(p,s){const S=STYLES[s],a=p.A.includes(S.f)?S.f:p.A.includes(S.w)?S.w:p.a,b=p.B.includes(S.w2)&&S.w2!=a?S.w2:p.B.includes('kamen')?(s=='modern'?'orah':'kamen'):p.b;return{a,b}}
function living(s,{w=4.6,l=3.8,empty}={}){const S=STYLES[s],g=room(w,l,{wall:S.wall,floor:S.fl});if(empty)return g;
 g.add(rug(2.6,1.7,S.rug).translateX(-.2).translateZ(.1),at(sofa({w:2.4,a:S.f,b:S.w2,pillow:S.pil}),-.2,-l/2+.62),at(table({b:S.w2}),-.2,.25),at(shelf({w:1.5,h:1.9,a:S.w2,b:S.w}),-w/2+.2,.6,Math.PI/2),at(lamp(),1.45,-l/2+.45),at(plant(),w/2-.45,-l/2+.45),at(sofa({w:1.05,a:s=='bos'?'smaragd':s=='skandi'?'siva':S.f,b:S.w2,pillow:0}),1.5,.7,-1.1));return g}

/* ---------- View ---------- */
const views=[];
class View{
 constructor(c,o={}){this.c=c;this.o=o;const r=this.r=new T.WebGLRenderer({canvas:c,antialias:true,alpha:true});r.setPixelRatio(o.pr||Math.min(devicePixelRatio,2));r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  const s=this.s=new T.Scene();this.cam=new T.PerspectiveCamera(o.fov||30,1,.1,100);s.add(new T.HemisphereLight(0xfff6ea,0xa39382,1.5));
  const d=this.sun=new T.DirectionalLight(0xfff0db,2.6);d.position.set(5,8,6);d.castShadow=true;d.shadow.mapSize.set(o.sm||1024,o.sm||1024);const sc=d.shadow.camera,e=o.ext||5;sc.left=sc.bottom=-e;sc.right=sc.top=e;sc.far=40;d.shadow.bias=-.0004;d.shadow.normalBias=.02;d.shadow.radius=5;s.add(d);
  const f=new T.DirectionalLight(0xe4ecff,.7);f.position.set(-6,3,2);s.add(f);
  this.g=new T.Mesh(new T.PlaneGeometry(60,60),new T.ShadowMaterial({opacity:.2}));this.g.rotation.x=-Math.PI/2;this.g.receiveShadow=true;s.add(this.g);
  this.root=new T.Group();s.add(this.root);this.tg=new T.Vector3(0,.6,0);this.th=.6;this.ph=1.2;this.rad=6;this.rmin=1;this.rmax=30;this.dirty=true;this.vis=true;this.auto=0;
  if(o.orbit!==false)this.bind();
  if(c.isConnected){new IntersectionObserver(e=>{this.vis=e[0].isIntersecting;this.dirty=true},{rootMargin:'100px'}).observe(c);new ResizeObserver(()=>this.resize()).observe(c);views.push(this);this.resize()}}
 resize(){const w=this.c.clientWidth,h=this.c.clientHeight;if(!w||!h)return;this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.onresize&&this.onresize(w,h);this.dirty=true}
 place(){const{th,ph,rad,tg}=this;this.cam.position.set(tg.x+rad*Math.sin(ph)*Math.sin(th),tg.y+rad*Math.cos(ph),tg.z+rad*Math.sin(ph)*Math.cos(th));this.cam.lookAt(tg)}
 frame(t,dt){if(!this.vis||this.off)return;this.tick&&this.tick(t,dt);if(this.auto&&!reduce){this.th+=this.auto*dt;this.dirty=true}
  if(this.tw){const w=this.tw;w.t=Math.min(1,w.t+dt*1000/w.ms);const k=1-Math.pow(1-w.t,3);for(const p of['th','ph','rad'])this[p]=w.f[p]+(w.to[p]-w.f[p])*k;this.tg.lerpVectors(w.f.tg,w.to.tg,k);if(w.t>=1)this.tw=0;this.dirty=true}
  if(!this.dirty)return;this.place();this.r.render(this.s,this.cam);this.dirty=false}
 clear(g=this.root){g.traverse(o=>o.geometry&&o.geometry.dispose());g.clear()}
 set(o){this.clear();this.root.add(o);this.dirty=true}
 fit(o,k=1.15){const b=new T.Box3().setFromObject(o),s=b.getSize(new T.Vector3());b.getCenter(this.tg);const v=this.cam.fov*Math.PI/360,hf=Math.atan(Math.tan(v)*this.cam.aspect);this.rad=s.length()/2/Math.sin(Math.min(v,hf))*k;this.rmin=this.rad*.45;this.rmax=this.rad*1.8;this.dirty=true}
 go(to,ms=1400){this.auto=0;this.tw={f:{th:this.th,ph:this.ph,rad:this.rad,tg:this.tg.clone()},to,t:0,ms:reduce?1:ms}}
 zoom(k){this.rad=clamp(this.rad*k,this.rmin,this.rmax);this.dirty=true}
 ray(e){const r=this.c.getBoundingClientRect(),rc=this.rc||(this.rc=new T.Raycaster());this.place();this.cam.updateMatrixWorld();rc.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.cam);return rc}
 bind(){const c=this.c,Pt=new Map();
  c.addEventListener('pointerdown',e=>{try{c.setPointerCapture(e.pointerId)}catch(_){}this.auto=0;if(this.pick&&this.pick(e)){this.drag=1;return}Pt.set(e.pointerId,[e.clientX,e.clientY])});
  c.addEventListener('pointermove',e=>{if(this.drag){this.onDrag(e);return}const p=Pt.get(e.pointerId);if(!p)return;
   if(Pt.size==1){this.th-=(e.clientX-p[0])*.008;if(!this.lockPh)this.ph=clamp(this.ph-(e.clientY-p[1])*.006,.05,1.5)}
   else{const o=[...Pt].find(([k])=>k!=e.pointerId)[1],d0=Math.hypot(p[0]-o[0],p[1]-o[1]),d1=Math.hypot(e.clientX-o[0],e.clientY-o[1]);if(d1>5)this.zoom(d0/d1)}
   p[0]=e.clientX;p[1]=e.clientY;this.dirty=true});
  const end=e=>{Pt.delete(e.pointerId);this.drag=0};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
  c.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();this.zoom(1+e.deltaY*.01)}},{passive:false});
  c.addEventListener('touchstart',e=>{if(e.touches.length>1||(this.hit&&this.hit(e.touches[0])))e.preventDefault()},{passive:false})}}
const SN=new View(document.createElement('canvas'),{pr:1,orbit:false,sm:1024,ext:6});
function snap(o,w,h,{th=.62,ph=1.22,k=1.02,cam,bg}={}){const v=SN;v.r.setSize(w,h,false);v.cam.aspect=w/h;v.cam.updateProjectionMatrix();v.set(o);v.g.visible=!bg;v.s.background=bg?new T.Color(bg):null;
 if(cam){v.th=cam.th;v.ph=cam.ph;v.rad=cam.rad;v.tg.set(...cam.tg)}else{v.th=th;v.ph=ph;v.fit(o,k)}v.place();v.r.render(v.s,v.cam);return v.c.toDataURL(bg?'image/jpeg':'image/png',.86)}
const thumbs={};
function thumb(id,a,b,th){const p=byId(id);a=a||p.a;b=b||p.b;const k=[id,a,b,th].join();return thumbs[k]||(thumbs[k]=snap(p.build({a,b}),520,400,{th:th??.62}))}
const RC={th:.62,ph:1.2,rad:9.6,tg:[.1,1.05,0]};
const roomShot=(s,o,w=800,h=600)=>snap(living(s,o),w,h,{cam:RC,bg:STYLES[s].wall});

/* ---------- hero ---------- */
const hero=new View($('#heroC'),{orbit:false,ext:5});
{const items=[at(rug(3.4,2.3,0xffffff),0,.3),at(sofa({w:2.7,corner:true,a:'siva',b:'orah',pillow:'smaragd'}),0,-.3),at(shelf({w:1.6,h:2.1,a:'krem',b:'antracit'}),-2.5,-.9,.25),at(table({b:'orah'}),-.55,1),at(lamp(),1.95,-.75),at(plant(),2.5,.6),at(sofa({w:1.05,a:'bez',b:'orah',pillow:0}),-2.3,1.1,1.0)];
 items.forEach((o,i)=>{o.userData.d=.15+i*.14;hero.root.add(o)});
 let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 hero.onresize=(w,h)=>{hero.cam.clearViewOffset();if(w/h<.95){hero.rad=19;hero.tg.set(0,4.5,0);hero.base=.5}else{hero.rad=13;hero.tg.set(0,.75,0);hero.base=.45;hero.cam.setViewOffset(w,h,-w*.235,-h*.04,w,h)}};hero.resize();
 let sx=0,sy=0;hero.tick=t=>{sx+=(mx-sx)*.04;sy+=(my-sy)*.04;hero.th=hero.base+(reduce?0:Math.sin(t*.22)*.2)+sx*.25;hero.ph=1.22-sy*.08-Math.min(scrollY/innerHeight,1)*.25;
  items.forEach(o=>{const k=reduce?1:clamp((t-o.userData.d)/1.1,0,1),e=1-Math.pow(1-k,4);o.position.y=(1-e)*1.6;o.scale.setScalar(.7+.3*e);o.visible=k>0});hero.dirty=true}}

/* ---------- kategorije + viewer ---------- */
const V=new View($('#viewC'));let cur={p:P[0],a:P[0].a,b:P[0].b},seen={};
function swatches(el,list,on,cb){el.innerHTML=list.map(k=>`<button style="background:${MATS[k].c}" class="${k==on?'on':''}" data-k="${k}" title="${MATS[k].n}" aria-label="${MATS[k].n}"></button>`).join('');el.onclick=e=>{const k=e.target.dataset.k;if(k)cb(k)}}
function showP(refit){const{p,a,b}=cur;V.set(p.build({a,b}));if(refit){V.th=.62;V.ph=1.2;V.fit(V.root.children[0],1.1);V.auto=.25}
 $('#pName').textContent=p.name;$('#pSub').textContent=p.sub;$('#pDim').textContent=p.dim;$('#pStock').innerHTML='<i class="dot"></i>'+p.stock;$('#pPrice').innerHTML=(p.from?'od ':'')+fmt(p.price)+'<small>okvirno, s PDV-om</small>';
 $('#la').textContent=p.la;$('#lb').textContent=p.lb;$('#lan').textContent=MATS[a].n;$('#lbn').textContent=MATS[b].n;$('#pTip').textContent=TIP[a];
 swatches($('#swA'),p.A,a,k=>{cur.a=k;showP()});swatches($('#swB'),p.B,b,k=>{cur.b=k;showP()});
 $$('#strip .pc').forEach(c=>c.classList.toggle('on',c.dataset.id==p.id))}
function openP(id,scroll){const p=byId(id);cur={p,a:p.a,b:p.b};seen[p.cat]=(seen[p.cat]||0)+1;$$('#vStyles button').forEach(b=>b.classList.remove('on'));$('#vStage').style.background='';showP(1);strip();if(scroll)$('#proizvodi').scrollIntoView()}
function strip(){const top=Object.entries(seen).sort((a,b)=>b[1]-a[1])[0],list=[...P].sort((x,y)=>(seen[y.cat]||0)-(seen[x.cat]||0));
 if(top)$('#fyT').textContent='Na osnovu pregledanog: '+CATS.find(c=>c[0]==top[0])[1].toLowerCase()+' — slične komade pomjerili smo naprijed.';
 $('#strip').innerHTML=list.map(p=>`<button class="pc ${p.id==cur.p.id?'on':''}" data-id="${p.id}"><img src="${thumb(p.id)}" alt="${p.name}"><b>${p.name}</b><span>${p.sub.split(' s ')[0]} · ${p.from?'od ':''}${fmt(p.price)}</span></button>`).join('')}
$('#strip').onclick=e=>{const c=e.target.closest('.pc');c&&openP(c.dataset.id)};
$('#cats').innerHTML=CATS.map(c=>`<button class="cat rv" data-id="${c[3]}"><img src="${thumb(c[3])}" alt="${c[1]}"><div><span><h3>${c[1]}</h3>${c[2]}</span><i>→</i></div></button>`).join('');
$('#cats').onclick=e=>{const c=e.target.closest('.cat');c&&openP(c.dataset.id,1)};
$('#vStyles').innerHTML=Object.entries(STYLES).map(([k,s])=>`<button data-s="${k}">${s.n}</button>`).join('');
$('#vStyles').onclick=e=>{const s=e.target.dataset.s;if(!s)return;Object.assign(cur,styled(cur.p,s));$$('#vStyles button').forEach(b=>b.classList.toggle('on',b==e.target));$('#vStage').style.background=`radial-gradient(90% 80% at 50% 60%,${STYLES[s].pal[0]},${STYLES[s].pal[1]})`;showP()};
$$('.zoom').forEach(z=>z.onclick=e=>{const d=e.target.dataset.z;if(!d)return;(z.id=='sZoom'?S:V).zoom(d>0?1.18:.85)});
strip();showP(1);

/* ---------- dijalog, upit ---------- */
function dialog(h,b,ok,fn){$('#dH').textContent=h;$('#dB').innerHTML=b;$('#dOk').textContent=ok;$('#dOk').onclick=()=>{dlg.close();fn&&fn()};dlg.showModal()}
function ask(kind,msg){$('#fk').value=kind;if(msg)$('#fm').value=msg;$('#kontakt').scrollIntoView();setTimeout(()=>$('#fn').focus({preventScroll:true}),700)}
const curTxt=()=>`${cur.p.sub} ${cur.p.name} (${MATS[cur.a].n} / ${MATS[cur.b].n})`;
$('#bAR').onclick=()=>dialog('Pogledaj u svom prostoru','<p>Na gotovoj stranici ovo dugme otvara kameru telefona i postavlja komad u stvarnoj veličini na vaš pod — bez aplikacije (Android Scene Viewer / iOS Quick Look), a na računaru prikazuje QR kod za telefon.</p><p>Za to su potrebni 3D modeli stvarnih proizvoda (GLB/USDZ). U prototipu isprobajte isti osjećaj na fotografiji svoje sobe.</p>','Probaj na fotografiji',()=>toViz());
$('#bViz').onclick=()=>toViz();
$('#bRes').onclick=()=>ask('Rezervacija za showroom','Želim uživo pogledati: '+curTxt()+'. Molim vas da mi rezervišete termin u salonu.');
document.addEventListener('click',e=>{const a=e.target.closest('[data-ask]');a&&ask(a.dataset.ask)});

/* ---------- studio ---------- */
const S=new View($('#studC'),{ext:6});let mode='cfg';const planG=new T.Group();S.s.add(planG);planG.visible=false;const camS={};
const CF={kitchen:{n:'Kuhinja',sl:[['w','Širina',180,480,320]],bl:'Radna ploča',B:['kamen','hrast','orah','antracit'],a:'zelena',b:'kamen'},
 wardrobe:{n:'Plakar',sl:[['w','Širina',100,400,250],['h','Visina',200,270,240],['d','Dubina',45,70,60]],bl:'Korpus',B:WD,a:'hrast',b:'krem'},
 shelf:{n:'Regal',sl:[['w','Širina',90,320,200],['h','Visina',80,240,200],['d','Dubina',28,45,36]],bl:'Vratašca',B:WD,a:'hrast',b:'antracit'}};
let cf={k:'kitchen',upper:true};
function cfInit(k){const d=CF[k];cf={k,a:d.a,b:d.b,upper:true};d.sl.forEach(s=>cf[s[0]]=s[4]);
 $('#cSl').innerHTML=d.sl.map(s=>`<div class="sl"><label>${s[1]} <b id="v_${s[0]}"></b></label><input type="range" data-p="${s[0]}" min="${s[2]}" max="${s[3]}" step="5" value="${s[4]}"></div>`).join('');
 $('#cBl').textContent=d.bl;$('#cUp').style.display=k=='kitchen'?'':'none';$('#cUp input').checked=true;$$('#cType .chip').forEach(c=>c.classList.toggle('on',c.dataset.k==k));cfDraw(1)}
function cfPrice(){const w=cf.w/100,h=(cf.h||0)/100,ka=MATS[cf.a].k,kb=MATS[cf.b].k;return cf.k=='kitchen'?w*1250*ka+w*260*kb+(cf.upper?w*520*ka:0)+(cf.w>=240?650:0):cf.k=='wardrobe'?w*h*(330*ka+70*kb)*(cf.d/60*.4+.6):w*h*(230*ka+60*kb)}
function cfDraw(fit){const o={w:cf.w/100,h:cf.h/100,d:cf.d/100,a:cf.a,b:cf.b,upper:cf.upper},obj=cf.k=='kitchen'?kitchen(o):cf.k=='wardrobe'?wardrobe(o):shelf(o);S.set(obj);if(fit){S.th=.55;S.ph=1.22}S.fit(obj,1.12);
 CF[cf.k].sl.forEach(s=>$('#v_'+s[0]).textContent=cf[s[0]]+' cm');$('#cAn').textContent=MATS[cf.a].n;$('#cBn').textContent=MATS[cf.b].n;$('#cPrice').textContent='≈ '+fmt(cfPrice());
 swatches($('#cA'),WD,cf.a,k=>{cf.a=k;cfDraw()});swatches($('#cB'),CF[cf.k].B,cf.b,k=>{cf.b=k;cfDraw()})}
$('#cSl').oninput=e=>{cf[e.target.dataset.p]=+e.target.value;cfDraw()};
$('#cType').onclick=e=>e.target.dataset.k&&cfInit(e.target.dataset.k);
$('#cUp input').onchange=e=>{cf.upper=e.target.checked;cfDraw()};
const cfTxt=()=>`${CF[cf.k].n} po mjeri: ${CF[cf.k].sl.map(s=>s[1].toLowerCase()+' '+cf[s[0]]+' cm').join(', ')}; fronte ${MATS[cf.a].n}, ${CF[cf.k].bl.toLowerCase()} ${MATS[cf.b].n}${cf.k=='kitchen'?(cf.upper?', s gornjim elementima':', bez gornjih elemenata'):''}. Okvirna cijena iz konfiguratora: ${fmt(cfPrice())}.`;
$('#cSend').onclick=()=>ask('Ponuda po mjeri','Zanima me ponuda — '+cfTxt()+' Molim termin za mjerenje.');

/* planer */
const PL={w:4.6,l:4,wall:'#f1f1f0',items:[],sel:null},WALLS=['#f1f1f0','#ffffff','#d5d5d6','#f79328','#f15a29','#58595b'];let roomG,helper;
function plRoom(){if(roomG){planG.remove(roomG);S.clear(roomG)}roomG=room(PL.w,PL.l,{wall:PL.wall});planG.add(roomG);PL.items.forEach(plClamp);$('#rwv').textContent=PL.w.toFixed(1)+' m';$('#rlv').textContent=PL.l.toFixed(1)+' m';if(mode=='plan'){S.tg.set(0,.9,0);S.rmax=Math.hypot(PL.w,PL.l)*3;S.rad=clamp(S.rad,3,S.rmax)}S.dirty=true}
function plClamp(it){const b=new T.Box3().setFromObject(it.o),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3()),ox=c.x-it.o.position.x,oz=c.z-it.o.position.z;
 it.o.position.x=clamp(it.o.position.x,-PL.w/2+s.x/2-ox,PL.w/2-s.x/2-ox);it.o.position.z=clamp(it.o.position.z,-PL.l/2+s.z/2-oz,PL.l/2-s.z/2-oz);helper&&helper.update();S.dirty=true}
function plSel(it){PL.sel=it;if(helper){planG.remove(helper);helper.dispose();helper=null}if(it){helper=new T.BoxHelper(it.o,0xf15a29);planG.add(helper)}S.dirty=true}
function plAdd(id,x=0,z=0,ry=0){const p=byId(id),o=at(p.build({a:p.a,b:p.b}),x,z,ry),it={p,o};planG.add(o);PL.items.push(it);plClamp(it);plSel(it);plSum()}
function plSum(){$('#rN').textContent=PL.items.length;$('#rSum').textContent=fmt(PL.items.reduce((s,i)=>s+i.p.price,0))}
function plHit(e){if(mode!='plan')return null;const h=S.ray(e).intersectObjects(PL.items.map(i=>i.o),true)[0];if(!h)return null;let o=h.object;while(o.parent!=planG)o=o.parent;return{it:PL.items.find(i=>i.o==o),pt:h.point}}
const floorP=new T.Plane(new T.Vector3(0,1,0),0),tmp=new T.Vector3();let off=new T.Vector3();
S.hit=e=>!!plHit(e);
S.pick=e=>{const h=plHit(e);if(!h)return false;plSel(h.it);S.ray(e).ray.intersectPlane(floorP,tmp);off.copy(h.it.o.position).sub(tmp);return true};
S.onDrag=e=>{if(!PL.sel||!S.ray(e).ray.intersectPlane(floorP,tmp))return;PL.sel.o.position.x=tmp.x+off.x;PL.sel.o.position.z=tmp.z+off.z;plClamp(PL.sel)};
$('#rw').oninput=e=>{PL.w=e.target.value/10;plRoom()};$('#rl').oninput=e=>{PL.l=e.target.value/10;plRoom()};
swatches($('#rWall'),[],0,()=>{});$('#rWall').innerHTML=WALLS.map((c,i)=>`<button style="background:${c}" data-c="${c}" class="${i?'':'on'}" aria-label="Boja zida"></button>`).join('');
$('#rWall').onclick=e=>{const c=e.target.dataset.c;if(!c)return;PL.wall=c;$$('#rWall button').forEach(b=>b.classList.toggle('on',b==e.target));plRoom()};
$('#rAdd').innerHTML=P.map(p=>`<button data-id="${p.id}"><img src="${thumb(p.id)}" alt="">${p.name}</button>`).join('');
$('#rAdd').onclick=e=>{const b=e.target.closest('button');b&&plAdd(b.dataset.id,.3,.3)};
$('#planTools').onclick=e=>{const d=e.target.dataset;if(d.v){$$('#planTools [data-v]').forEach(b=>b.classList.toggle('on',b==e.target));const r=Math.hypot(PL.w,PL.l);S.go(d.v=='top'?{th:0,ph:.05,rad:r*2.1,tg:new T.Vector3(0,0,0)}:{th:.6,ph:1.05,rad:r*1.75,tg:new T.Vector3(0,.9,0)},900)}
 if(d.a&&PL.sel){if(d.a=='rot'){PL.sel.o.rotation.y+=Math.PI/2;plClamp(PL.sel)}else{planG.remove(PL.sel.o);S.clear(PL.sel.o);PL.items=PL.items.filter(i=>i!=PL.sel);plSel(null);plSum()}}};
$('#rSend').onclick=()=>ask('Ponuda po mjeri',`Moj plan sobe ${PL.w.toFixed(1)} × ${PL.l.toFixed(1)} m: ${PL.items.map(i=>i.p.sub.split(' s ')[0]+' '+i.p.name).join(', ')||'bez komada'}. Molim prijedlog i ponudu.`);
plRoom();plAdd('luna',-.4,-1.3);plAdd('kozara',-2,.6,Math.PI/2);plAdd('mila',1.4,.8,-1.2);plSel(null);

function tab(t){mode=t;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));$$('.pane').forEach(p=>p.classList.toggle('on',p.id=='p-'+t));
 const three=t=='cfg'||t=='plan';$('#studC').style.display=three?'':'none';$('#sZoom').style.display=three?'':'none';$('#planTools').hidden=t!='plan';$('#vizS').classList.toggle('on',t=='viz');$('#quizS').classList.toggle('on',t=='quiz');S.off=!three;
 if(three){const pl=t=='plan';planG.visible=pl;S.root.visible=!pl;S.g.visible=!pl;S.lockPh=false;if(pl){const r=Math.hypot(PL.w,PL.l);S.tg.set(0,.9,0);S.th=.6;S.ph=1.05;S.rad=r*1.75;S.rmin=3;S.rmax=r*3;$$('#planTools [data-v]').forEach((b,i)=>b.classList.toggle('on',!i))}else cfDraw(1);S.dirty=true}}
$('#tabs').onclick=e=>e.target.dataset.t&&tab(e.target.dataset.t);
cfInit('kitchen');

/* ---------- vizualizator ---------- */
const viz={p:P[0],a:P[0].a,b:P[0].b,th:.5};
function vizOv(){let ov=$('#vizS .ov');if(!ov)return;ov.src=thumb(viz.p.id,viz.a,viz.b,viz.th);$$('#vProd .chip').forEach(c=>c.classList.toggle('on',c.dataset.id==viz.p.id))}
function vizLoad(src){const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=cv.height=40;const x=cv.getContext('2d');x.drawImage(im,0,0,40,40);const d=x.getImageData(0,0,40,40).data,bk={};let R=0,Gn=0,B=0;
  for(let i=0;i<d.length;i+=4){R+=d[i];Gn+=d[i+1];B+=d[i+2];const k=(d[i]>>5)+','+(d[i+1]>>5)+','+(d[i+2]>>5),o=bk[k]||(bk[k]=[0,0,0,0]);o[0]+=d[i];o[1]+=d[i+1];o[2]+=d[i+2];o[3]++}
  const n=d.length/4;R/=n;Gn/=n;B/=n;const lum=(R*.3+Gn*.59+B*.11)/255,warm=(R-B)/255,sat=(Math.max(R,Gn,B)-Math.min(R,Gn,B))/255;
  const pal=Object.values(bk).sort((a,b)=>b[3]-a[3]).slice(0,5).map(o=>`rgb(${o[0]/o[3]|0},${o[1]/o[3]|0},${o[2]/o[3]|0})`);
  const s=warm<.03?'modern':lum>.62?(sat>.16?'medit':'skandi'):lum<.42?'bos':sat>.2?'medit':'skandi',St=STYLES[s];
  $('#vPal').innerHTML=pal.map(c=>`<i style="background:${c}"></i>`).join('');
  $('#vTxt').innerHTML=`Prostor ima <b style="display:inline;text-transform:none;letter-spacing:0;font-size:inherit">${warm<.03?'hladnije, neutralne':'tople'} tonove i ${lum>.62?'mnogo svjetla':lum<.42?'prigušeno svjetlo':'umjerenu svjetlinu'}</b>. Pristaje mu <b style="display:inline;text-transform:none;letter-spacing:0;font-size:inherit">${St.n.toLowerCase()} stil</b>: ${MATS[St.f].n.toLowerCase()}, ${MATS[St.w2].n.toLowerCase()} i ${MATS[St.w].n.toLowerCase()} fronte. Materijale smo već primijenili na komad.`;
  viz.s=s;Object.assign(viz,styled(viz.p,s));
  $('#vizS').innerHTML=`<img class="ph" src="${src}" alt="Vaša soba"><img class="ov" alt="" draggable="false">`;const ov=$('#vizS .ov');ov.style.width=$('#vSize').value+'%';let st;
  ov.onpointerdown=e=>{ov.setPointerCapture(e.pointerId);st=[e.clientX,e.clientY,ov.offsetLeft,ov.offsetTop]};ov.onpointermove=e=>{if(!st)return;ov.style.left=st[2]+e.clientX-st[0]+'px';ov.style.top=st[3]+e.clientY-st[1]+'px'};ov.onpointerup=ov.onpointercancel=()=>st=0;
  $('#vizCtl').style.display='flex';vizOv()};im.src=src}
const rd=f=>{if(!f)return;const r=new FileReader();r.onload=()=>vizLoad(r.result);r.readAsDataURL(f)};
$('#file').onchange=e=>rd(e.target.files[0]);$('#file2').onchange=e=>rd(e.target.files[0]);
$('#sample').onclick=()=>{const g=living('skandi',{empty:true});g.add(at(plant(),1.85,-1.45),at(lamp(),-1.9,-1.5));vizLoad(snap(g,1000,750,{cam:{...RC,rad:8.2,tg:[0,1.1,0]},bg:STYLES.skandi.wall}))};
$('#vProd').innerHTML=P.map(p=>`<button class="chip" data-id="${p.id}">${p.name}</button>`).join('');
$('#vProd').onclick=e=>{const id=e.target.dataset.id;if(!id)return;viz.p=byId(id);Object.assign(viz,viz.s?styled(viz.p,viz.s):{a:viz.p.a,b:viz.p.b});vizOv()};
$('#vSize').oninput=e=>{const o=$('#vizS .ov');if(o)o.style.width=e.target.value+'%'};
$('#vAng').oninput=e=>{viz.th=Math.round(e.target.value/15)*15*Math.PI/180;vizOv()};
$('#vAsk').onclick=()=>ask('3D render u mojim dimenzijama',`Molim 3D render za moj prostor: ${viz.p.sub} ${viz.p.name} (${MATS[viz.a].n}). Fotografiju sobe i dimenzije šaljem u odgovoru.`);
function toViz(){viz.p=cur.p;viz.a=cur.a;viz.b=cur.b;viz.s=0;tab('viz');vizOv();$('#studio').scrollIntoView()}

/* ---------- kviz ---------- */
const Q=[['Šta prvo osjetite u idealnom dnevnom boravku?',['Mir i svjetlinu','Sunce i vedrinu','Red i čiste linije','Energiju i toplinu doma']],['Koji vam je materijal najbliži?',['Svijetli hrast','Bijela i svijetlo drvo','Mat siva','Orah uz jaku boju']],['Koja paleta vas privlači?',['Bijela, svijetlosiva, pijesak','Narandžasta i bijela','Siva i grafit','Narandžasta, siva i orah']],['Kako izgleda vaše savršeno veče?',['Knjiga i tišina','Duga večera s prijateljima','Film na velikoj garnituri','Cijela porodica na okupu']]],SK=Object.keys(STYLES);let qi=0,sc;
function quiz(){if(!qi)sc=[0,0,0,0];$('#qRes').style.display='none';$('#qO').style.display='';$('#qBar').style.width=qi/Q.length*100+'%';$('#qH').textContent=Q[qi][0];$('#qP').textContent=`Pitanje ${qi+1} od ${Q.length}`;$('#qO').innerHTML=Q[qi][1].map((o,i)=>`<button data-i="${i}">${o}</button>`).join('')}
$('#qO').onclick=e=>{const i=e.target.dataset.i;if(i==null)return;sc[i]++;if(++qi<Q.length)return quiz();qi=0;const s=SK[sc.indexOf(Math.max(...sc))],St=STYLES[s];$('#qBar').style.width='100%';$('#qO').style.display='none';
 $('#qH').innerHTML=`Vaš stil: <em>${St.n}</em>`;$('#qP').textContent=St.d;$('#qPal').innerHTML=St.pal.map(c=>`<i style="background:${c}"></i>`).join('');
 const rec=['luna','vrbas','kozara','una'];$('#qRec').innerHTML=rec.map(id=>`<button class="chip" data-id="${id}">${byId(id).name} u 3D →</button>`).join('');$('#qRec').dataset.s=s;$('#qRes').style.display='flex';
 const t=id=>{const p=byId(id),m=styled(p,s);return thumb(id,m.a,m.b)},w=c=>`<div style="background:url(${woodCv(MATS[c].c).toDataURL()}) center/cover"></div>`;
 $('#qEmpty').hidden=true;$('#qEmpty').style.display='none';const m=$('#mood');m.hidden=false;
 m.innerHTML=`<div style="grid-column:span 3;grid-row:span 2"><img src="${roomShot(s)}" alt="${St.n} dnevni boravak"></div><div style="background:${St.pal[2]}"></div>${w(St.w2)}<div class="p" style="grid-column:span 2;grid-row:span 2"><img src="${t('vrbas')}" alt=""></div><div class="q" style="grid-column:span 2">${St.q}</div><div style="background:${MATS[St.f].c}"></div><div style="background:${St.pal[4]}"></div><div class="p" style="grid-column:span 2"><img src="${t('una')}" alt=""></div><div class="p" style="grid-column:span 2"><img src="${t('kozara')}" alt=""></div>`;
 [...m.children].forEach((c,i)=>c.style.animationDelay=i*70+'ms')};
$('#qRec').onclick=e=>{const id=e.target.dataset.id;if(!id)return;openP(id,1);Object.assign(cur,styled(cur.p,$('#qRec').dataset.s));showP()};
$('#qAgain').onclick=()=>{qi=0;quiz()};quiz();

/* ---------- usluge, blog, recenzije ---------- */
const I={d:'<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z"/>',m:'<path d="M14 6l4 4-9 9H5v-4zM13 7l4 4M3 21h18"/>',g:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4"/>',k:'<path d="M3 6h18v12H3zM3 10h18M7 15h4"/>'};
$('#svs').innerHTML=[['d','Dostava','Dovozimo namještaj na vašu adresu i unosimo ga u prostor — pažljivo, u dogovorenom terminu.','Do vaših vrata'],['m','Montaža','Naši majstori montiraju sve na licu mjesta. Kuhinje i plakari po mjeri uklapaju se u milimetar.','Stručni tim'],['g','Garancija','Na kupljene proizvode dajemo garanciju, a za sve što zatreba tu smo i nakon kupovine.','Sigurna kupovina'],['k','Kreditiranje','Addiko Partner kredit od 300 do 50.000 KM, s rokom otplate od 3 do 120 mjeseci. Dostupno je i više drugih uslova plaćanja.','3 – 120 mjeseci']].map(s=>`<div class="sv"><svg viewBox="0 0 24 24">${I[s[0]]}</svg><h3>${s[1]}</h3><p>${s[2]}</p><b>${s[3]}</b></div>`).join('');
$('#blog').innerHTML=[['medit','Urednički vodič','Kuhinja po mjeri: pet pitanja prije mjerenja','Raspored, visina radne ploče, fronte, uređaji i svjetlo — šta odlučiti prije nego što majstor dođe.'],['modern','AI moodboard','Moderni dnevni boravak u sivim tonovima','Grafit, orah i narandžasti detalj: kombinacija koju je naš AI stilista složio za stanove s mnogo svjetla.'],['bos','Sedmični izazov','Ardor potpis: narandžasti zid, siva garnitura','Kako jednu hrabru boju uklopiti u dnevni boravak, a da prostor ostane miran.']].map(b=>`<a class="post" href="#studio"><div class="im"><img src="${roomShot(b[0])}" alt="${b[2]}" loading="lazy"></div><div class="tx"><span class="tag ${b[1][0]=='A'?'c':'g'}" style="width:max-content">${b[1]}</span><h3>${b[2]}</h3><p>${b[3]}</p></div></a>`).join('');
{const im=$$('#bas img');im[0].src=roomShot('skandi',{},960,600);im[1].src=roomShot('skandi',{empty:true},960,600);$('#bas input').oninput=e=>$('#bas').style.setProperty('--x',e.target.value+'%')}
$('#revs').innerHTML=['luna','vrbas','kastel'].map(id=>`<div class="rev"><span class="tag" style="width:max-content">Primjer prikaza</span><div class="st">★★★★★</div><p>Ovdje dolazi stvarna recenzija kupca (Google ili Facebook), uz fotografije prostora prije i poslije opremanja.</p><div class="who"><img src="${thumb(id)}" alt=""><div><b>${byId(id).sub.split(' s ')[0]} ${byId(id).name}</b><br><button data-id="${id}">Pogledaj kupljeni komad u 3D</button></div></div></div>`).join('');
$('#revs').onclick=e=>e.target.dataset.id&&openP(e.target.dataset.id,1);

/* ---------- showroom ---------- */
const SH=new View($('#showC'),{ext:8,sm:2048,fov:34});SH.g.visible=false;
{const g=room(11,7,{wall:'#f1f1f0',floor:'#b8946a'});g.add(
 at(rug(3,2,0xffffff),-2.6,.9),at(sofa({w:2.7,corner:true}),-2.6,-.2),at(table({}),-2.9,1.3),at(shelf({w:2.2,h:2.1}),-2.6,-3.3),at(lamp(),-.7,-.5),at(sofa({w:1.05,a:'smaragd',pillow:0}),-4.4,1.5,1.2),
 at(kitchen({w:3.6,a:'zelena',b:'kamen'}),2.6,-3.2),at(wardrobe({w:3,a:'hrast'}),-5.19,-1.2,Math.PI/2).translateZ(0),at(rug(2.6,2.8,0xf79328),3.2,1.6),at(bed({a:'bez'}),3.2,1.6,Math.PI),at(sideboard({}),.6,2.6,Math.PI),at(plant(),5,-3),at(plant(),-5,2.9));
 SH.root.add(g);const v=(x,y,z)=>new T.Vector3(x,y,z),TOUR=[['Cijeli salon',{th:.5,ph:1.02,rad:17,tg:v(0,.8,0)}],['Dnevni boravak',{th:.75,ph:1.15,rad:8,tg:v(-2.7,.8,.2)}],['Kuhinje',{th:.25,ph:1.2,rad:7,tg:v(2.6,1.1,-3)}],['Plakari',{th:1.25,ph:1.2,rad:7.5,tg:v(-5,1.2,-1.2)}],['Spavaće sobe',{th:-.2,ph:1.0,rad:7.5,tg:v(3.2,.6,1.6)}]];
 Object.assign(SH,{th:.5,ph:1.02,rad:17,rmin:4,rmax:22});SH.tg.set(0,.8,0);SH.onresize=(w,h)=>{SH.cam.fov=w/h<1?48:34;SH.cam.updateProjectionMatrix()};SH.resize();SH.auto=.05;
 $('#tour').innerHTML=TOUR.map((t,i)=>`<button data-i="${i}" class="${i?'':'on'}">${t[0]}</button>`).join('');
 $('#tour').onclick=e=>{const i=e.target.dataset.i;if(i==null)return;$$('#tour button').forEach(b=>b.classList.toggle('on',b==e.target));SH.go({...TOUR[i][1]})}}

/* ---------- kontakt + chat ---------- */
const QK={'Kuhinja po mjeri':'Zanima me kuhinja po mjeri. Dimenzije zida: ___ cm. Želio/željela bih termin za besplatno mjerenje.','Ugradbeni plakar':'Zanima me ugradbeni plakar. Niša je široka ___ cm i visoka ___ cm.','Garnitura':'Tražim garnituru za dnevni boravak. Prostor za garnituru: ___ × ___ cm.','Videopoziv':'Želim videopoziv s dizajnerom i virtuelni obilazak salona.'};
$('#quick').innerHTML=Object.keys(QK).map(k=>`<button class="chip">${k}</button>`).join('');
$('#quick').onclick=e=>{const k=e.target.textContent;if(!QK[k])return;$('#fm').value=QK[k];$('#fk').value=k=='Videopoziv'?'Videopoziv s dizajnerom':'Ponuda po mjeri';$('#fm').focus()};
$('#form').onsubmit=e=>{e.preventDefault();const b=`Ime: ${$('#fn').value}\nTelefon: ${$('#ft').value}\nVrsta upita: ${$('#fk').value}\nŽeljeni datum: ${$('#fd').value||'—'}\n\n${$('#fm').value}`;
 $('#fmsg').textContent='Otvaramo vašu e-poštu s pripremljenim upitom. Ako se ne otvori, pozovite +387 51 433 750.';location.href='mailto:info@ardornamjestaj.com?subject='+encodeURIComponent('Upit s weba — '+$('#fk').value)+'&body='+encodeURIComponent(b)};
const log=$('#log');
function say(t,who='b',acts=[]){const m=document.createElement('div');m.className='m '+who;m.innerHTML=t;acts.forEach(([l,f])=>{const b=document.createElement('button');b.textContent=l+' →';b.onclick=()=>{$('#chat').classList.remove('on');f()};m.append(b)});log.append(m);log.scrollTop=1e6}
const go=(id,t)=>()=>{t&&tab(t);$(id).scrollIntoView()};
function reply(q){const s=q.toLowerCase(),cm=(s.match(/(\d+[.,]?\d*)\s*(cm|m)\b/)||[]),n=cm[1]?parseFloat(cm[1].replace(',','.'))*(cm[2]=='m'?100:1):0;
 if(/kuhinj/.test(s)){if(n){const w=clamp(Math.round(n/5)*5,180,480);tab('cfg');cfInit('kitchen');cf.w=w;$('#cSl input').value=w;cfDraw();return say(`Za zid od ${n} cm složio sam kuhinju širine ${w} cm: ${w>=240?'visoka kolona za frižider + ':''}${Math.round((w-(w>=240?60:0))/60)} donjih elemenata. Okvirno ${fmt(cfPrice())}. Otvorite konfigurator i promijenite fronte.`,'b',[['Otvori konfigurator',go('#studio')]])}
  return say('Rado! Kolika je širina zida za kuhinju? Napišite npr. „kuhinja 320 cm" i odmah ću vam složiti 3D prijedlog s okvirnom cijenom.','b',[['Otvori konfigurator',go('#studio','cfg')]])}
 if(/plakar|ormar/.test(s)){if(n){const w=clamp(Math.round(n/5)*5,100,400);tab('cfg');cfInit('wardrobe');cf.w=w;$('#cSl input').value=w;cfDraw();return say(`Plakar širine ${w} cm imao bi ${Math.max(2,Math.round(w/50))} vrata. Okvirno ${fmt(cfPrice())} pri visini 240 cm.`,'b',[['Pogledaj u 3D',go('#studio')]])}return say('Za plakar mi treba širina niše — napišite npr. „plakar 250 cm".','b',[['Konfigurator plakara',()=>{tab('cfg');cfInit('wardrobe');$('#studio').scrollIntoView()}]])}
 if(/garnitur|sofa|kauč|dnevn|fotelj/.test(s))return say('Za dnevni boravak predlažem ugaonu garnituru Luna (270 × 165 cm). Ako je soba uža od 3,2 m, bolja je trosjed varijanta uz fotelju Mila. Isprobajte tkanine u 3D-u ili je postavite u planer.','b',[['Luna u 3D',()=>openP('luna',1)],['Planer sobe',go('#studio','plan')]]);
 if(/regal|polic|tv/.test(s))return say('Regal Kozara radimo i po mjeri — od 90 do 320 cm širine. Vratašca u boji daju mu karakter.','b',[['Konfiguriši regal',()=>{tab('cfg');cfInit('shelf');$('#studio').scrollIntoView()}]]);
 if(/stil|boj|kombin|moodboard|uredi/.test(s))return say('Najbrži put do vašeg stila je kviz od četiri pitanja — na kraju dobijate moodboard, paletu i preporučene komade.','b',[['Pokreni kviz',go('#studio','quiz')]]);
 if(/slik|fotograf|sob|vizual/.test(s))return say('Učitajte fotografiju sobe u vizualizator: prepoznaću tonove prostora i postaviti komad na sliku.','b',[['Otvori vizualizator',go('#studio','viz')]]);
 if(/cijen|kredit|rat|plaćanj|košta/.test(s))return say('Cijene u konfiguratoru su okvirne; tačnu ponudu dobijate nakon mjerenja. Plaćanje je moguće i putem Addiko Partner kredita: 300 – 50.000 KM, na 3 do 120 mjeseci.','b',[['Zatraži ponudu',go('#kontakt')]]);
 if(/dostav|montaž|garancij/.test(s))return say('Nudimo dostavu i montažu, a na kupljene proizvode dajemo garanciju. Za termin dostave na vašoj adresi pošaljite kratak upit.','b',[['Pošalji upit',go('#kontakt')]]);
 if(/radno|adres|gdje|lokacij|telefon|salon|showroom|termin|video/.test(s))return say('Salon je u ulici Vojvode Pere Krece 21, Banja Luka. Radnim danima 08:00–20:30, subotom 08:00–19:00. Telefon: +387 51 433 750. Mogu vam pripremiti rezervaciju termina ili videopoziv.','b',[['Zakaži termin',()=>ask('Rezervacija za showroom')],['Virtuelni obilazak',go('#showroom')]]);
 say('Mogu pomoći oko kuhinja, plakara, garnitura i regala po mjeri, stila i boja, cijena i kreditiranja. Napišite npr. „kuhinja 300 cm" ili „koji stil mi pristaje".')}
const QR=['Kuhinja 320 cm','Plakar 250 cm','Koji je moj stil?','Kreditiranje','Radno vrijeme'];
$('#qr').innerHTML=QR.map(q=>`<button>${q}</button>`).join('');
function send(q){if(!q.trim())return;say(q.replace(/</g,'&lt;'),'u');setTimeout(()=>reply(q),450)}
$('#qr').onclick=e=>e.target.tagName=='BUTTON'&&send(e.target.textContent);
$('#chatF').onsubmit=e=>{e.preventDefault();send($('#chatI').value);$('#chatI').value=''};
let greeted;function chat(on){$('#chat').classList.toggle('on',on);if(on&&!greeted){greeted=1;say('Dobar dan! Ja sam Ardor asistent. Recite mi šta uređujete i koje su dimenzije prostora — predložiću komade, materijale i okvirnu cijenu.')}}
$('#fab').onclick=()=>chat(!$('#chat').classList.contains('on'));$('#chatX').onclick=()=>chat(false);$('#fAI').onclick=()=>chat(true);

/* ---------- opšte ---------- */
const root=document.documentElement;let saved;try{saved=localStorage.getItem('ardor-theme')}catch(_){}
root.dataset.theme=saved||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
$('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme=='dark'?'light':'dark';try{localStorage.setItem('ardor-theme',root.dataset.theme)}catch(_){}};
$('#burger').onclick=()=>$('#nav').classList.toggle('open');$$('.links a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});
$$('.rv').forEach((el,i)=>{if(el.classList.contains('cat'))el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
const hc=$('.hc');addEventListener('scroll',()=>{$('#nav').classList.toggle('sc',scrollY>30);if(!reduce&&scrollY<innerHeight){hc.style.transform=`translateY(${scrollY*.18}px)`;hc.style.opacity=1-scrollY/innerHeight*1.1}},{passive:true});
let last=0;(function loop(ms){const t=ms/1000,dt=Math.min(.05,t-last);last=t;views.forEach(v=>v.frame(t,dt));requestAnimationFrame(loop)})(0);
window.ARDOR={views,tab,openP,chat};
})();

'use client';
import { useEffect, useRef, useState } from 'react';
import { Building2, LoaderCircle } from 'lucide-react';

export default function HospitalScene({view,paused,onInteract}:{view:number;paused:boolean;onInteract:()=>void}) {
 const host=useRef<HTMLDivElement>(null),reset=useRef<(()=>void)|null>(null);
 const motion=useRef<((paused:boolean)=>void)|null>(null),pausedRef=useRef(paused);
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 useEffect(()=>{reset.current?.();},[view]);
 useEffect(()=>{pausedRef.current=paused;motion.current?.(paused);},[paused]);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let disposed=false,cleanup=()=>{};
  async function init(){try{
   const THREE=await import('three');const {OrbitControls}=await import('three/addons/controls/OrbitControls.js');
   if(disposed||!el)return;
   const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,100);
   camera.position.set(11,9,13);
   const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
   renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
   renderer.domElement.setAttribute('aria-label','Model tiga dimensi gedung Rumah Sakit Bagas. Geser untuk memutar.');renderer.domElement.setAttribute('role','img');el.appendChild(renderer.domElement);
   const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.1,0);controls.enableDamping=true;controls.enableZoom=false;controls.enablePan=false;controls.minPolarAngle=.55;controls.maxPolarAngle=Math.PI/2.3;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');controls.autoRotate=!reduced.matches&&!pausedRef.current;controls.autoRotateSpeed=.28;
   motion.current=(isPaused)=>{controls.autoRotate=!isPaused&&!reduced.matches;};
   controls.addEventListener('start',()=>{controls.autoRotate=false;onInteract();});
   reset.current=()=>{camera.position.set(11,9,13);controls.target.set(0,1.1,0);controls.autoRotate=!reduced.matches&&!pausedRef.current;controls.update();};
   renderer.domElement.tabIndex=0;
   renderer.domElement.setAttribute('aria-label','Model rumah sakit 3D. Geser atau gunakan tombol panah kiri dan kanan untuk memutar.');
   const onKey=(event:KeyboardEvent)=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();controls.autoRotate=false;onInteract();camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),event.key==='ArrowLeft'?-.15:.15);controls.update();}};
   renderer.domElement.addEventListener('keydown',onKey);
   scene.add(new THREE.HemisphereLight(0xeef8ff,0x779998,3));
   const sunlight=new THREE.DirectionalLight(0xffffff,4);sunlight.position.set(-5,12,7);sunlight.castShadow=true;sunlight.shadow.mapSize.set(1024,1024);Object.assign(sunlight.shadow.camera,{left:-8,right:8,top:8,bottom:-8});sunlight.shadow.normalBias=.04;scene.add(sunlight);
   const materials={white:new THREE.MeshStandardMaterial({color:'#f1f5ee',roughness:.62}),facade:new THREE.MeshStandardMaterial({color:'#c9e4e8',roughness:.4}),glass:new THREE.MeshStandardMaterial({color:'#4c9ba9',metalness:.42,roughness:.22}),darkGlass:new THREE.MeshStandardMaterial({color:'#285b70',metalness:.3,roughness:.2}),blue:new THREE.MeshStandardMaterial({color:'#2563db',roughness:.42}),road:new THREE.MeshStandardMaterial({color:'#c2cfcc',roughness:1}),lawn:new THREE.MeshStandardMaterial({color:'#b8cf9c',roughness:1}),leaf:new THREE.MeshStandardMaterial({color:'#568c72',roughness:1}),trunk:new THREE.MeshStandardMaterial({color:'#92765d',roughness:1}),coral:new THREE.MeshStandardMaterial({color:'#ed7965',roughness:.6})};
   type Mat=keyof typeof materials;
   const box=(x:number,y:number,z:number,w:number,h:number,d:number,mat:Mat)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),materials[mat]);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;};
   // Landscape, access road, and pavement.
   box(0,-.22,0,9,.4,7,'white');box(0,-.005,0,8.75,.08,6.75,'lawn');box(0,.045,2.15,8.78,.05,1.45,'road');box(-2.95,.04,-.25,1.35,.05,4.4,'road');
   for(let i=-4;i<=4;i++)box(i,.085,2.4,.45,.012,.065,'white');
   box(.55,.055,-.55,5.8,.08,4.15,'white');
   // Main inpatient wing, roof, windows, and structural mullions.
   box(.9,1.8,-.85,3.5,3.5,2.6,'white');box(.9,3.6,-.85,3.66,.16,2.75,'white');box(.9,3.71,-.85,3.33,.07,2.4,'facade');
   for(let floor=0;floor<5;floor++){const y=.55+floor*.59;box(.9,y,.46,3.33,.4,.04,'glass');box(2.665,y,-.85,.04,.4,2.45,'glass');for(let col=0;col<6;col++)box(-.61+col*.59,y,.496,.055,.43,.05,'white');for(let col=0;col<4;col++)box(2.7,y,-1.9+col*.63,.05,.43,.055,'white');}
   // Clinical wing and its rooftop garden.
   box(-1.45,1.14,-.3,1.5,2.2,2.8,'facade');box(-1.45,2.28,-.3,1.7,.12,3,'white');box(-1.45,2.37,-.3,1.45,.09,2.7,'lawn');
   for(let floor=0;floor<3;floor++){for(let col=0;col<2;col++)box(-1.8+col*.7,.5+floor*.63,1.115,.47,.41,.03,'darkGlass');box(-2.205,.5+floor*.63,-.3,.035,.41,2.5,'glass');}
   // Main entrance canopy, doors, and medical cross.
   box(.65,.61,.99,1.65,1.12,.78,'darkGlass');box(.65,1.3,1.3,2.3,.16,1.1,'blue');box(-.38,.63,1.73,.075,1.22,.075,'white');box(1.68,.63,1.73,.075,1.22,.075,'white');box(.65,.035,1.63,2.1,.1,.6,'white');box(.65,.59,1.39,.055,1.07,.035,'white');box(.98,3.2,.52,.5,.14,.055,'blue');box(.98,3.2,.53,.14,.5,.065,'blue');
   box(1.9,3.85,-1.2,.65,.25,.67,'facade');for(let i=0;i<4;i++)box(1.9,3.99,-1.42+i*.14,.57,.015,.035,'darkGlass');
   function tree(x:number,z:number,scale=1,base=.08){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,.52,6),materials.trunk);trunk.position.set(x,base+.26*scale,z);trunk.scale.setScalar(scale);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.36,1),materials.leaf);crown.position.set(x,base+.68*scale,z);crown.scale.set(scale,1.3*scale,scale);crown.castShadow=true;scene.add(crown);}
   [[-3.7,-2.5],[-3.75,-1.2],[-3.7,.2],[3.65,-2.3],[3.7,-.8],[3.65,.7],[-3.5,3],[2.5,3.1]].forEach(([x,z])=>tree(x,z));tree(-1.5,-1.15,.58,2.43);tree(-1.5,.5,.58,2.43);
   // Ambulance model.
   box(-2.8,.32,2.15,1.05,.43,.48,'white');box(-2.43,.51,2.15,.3,.26,.44,'white');box(-2.25,.5,2.15,.02,.18,.35,'darkGlass');box(-2.86,.54,2.15,.26,.055,.21,'blue');box(-2.9,.34,2.397,.18,.06,.017,'coral');box(-2.9,.34,2.4,.06,.18,.02,'coral');
   for(const x of [-3.14,-2.49])for(const z of [1.91,2.39]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.06,12),materials.darkGlass);wheel.rotation.x=Math.PI/2;wheel.position.set(x,.2,z);scene.add(wheel);}
   let visible=true,frame=0;
   const animate=()=>{if(disposed||!visible||document.hidden)return;frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);};
   const refresh=()=>{cancelAnimationFrame(frame);animate();};
   const resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();renderer.setSize(w,h);refresh();});resize.observe(el);
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh();});observer.observe(el);
   const onMotion=()=>{controls.autoRotate=!reduced.matches&&!pausedRef.current;};
   const contextLost=(e:Event)=>{e.preventDefault();setStatus('error');visible=false;cancelAnimationFrame(frame);};
   renderer.domElement.addEventListener('webglcontextlost',contextLost);document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',onMotion);
   cleanup=()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',refresh);reduced.removeEventListener('change',onMotion);controls.dispose();scene.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.dispose();});Object.values(materials).forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();reset.current=null;};
   if(disposed){cleanup();return;}setStatus('ready');refresh();
  }catch{if(!disposed)setStatus('error');}}
  void init();return()=>{disposed=true;cleanup();};
 },[]);
 return <div className="scene-host" ref={host}>{status!=='ready'&&<div className="scene-fallback" role="status">{status==='loading'?<LoaderCircle className="loading-icon" size={28}/>:<Building2 size={52}/>}<strong>{status==='loading'?'Menyiapkan ruang Anda…':'Gedung utama Rumah Sakit Bagas'}</strong><span>{status==='error'?'Tampilan 3D tidak tersedia di perangkat ini. Informasi layanan tetap bisa diakses.':''}</span></div>}</div>;
}

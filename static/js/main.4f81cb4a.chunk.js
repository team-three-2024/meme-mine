(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{44:function(e,t,n){e.exports=n(62)},60:function(e,t,n){},62:function(e,t,n){"use strict";n.r(t);var a=n(2),o=n(3),r=n(5),i=n(1),c=n(6),l=n(4),s=n.n(l),u=n(36),m=n(21),f=n(9),p=n(65),d=n(10),h=n(18),b=n(30),g=n.n(b),j=n(23),E=n(0);function O(){var e=Object(d.d)(),t=e.camera,n=e.set,a=Object(l.useState)(!1),o=Object(f.a)(a,2),r=o[0],i=o[1],c=new E.PerspectiveCamera(50,16/9,.1,1e3);return Object(l.useEffect)(function(){var e=function(e){"Space"===e.code&&i(!r)};return window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}},[r]),Object(l.useEffect)(function(){r?(c.position.set(-20,0,0),c.lookAt(20,0,0),n({camera:c})):(c.position.set(0,.8,-3),c.lookAt(0,0,0),n({camera:c}))},[r]),Object(d.b)(function(){t.lookAt(-100,200,500),t.updateProjectionMatrix()}),null}var y=n(66),v={objectUrl:{hop:"canary_hop.glb",idle:"canary_idle.glb",walk:"canary_walk.glb"},nodeCoords:"canary.geometry.attributes.position",nodeSigns:[1,-1,-1],nodeScale:2.5,nodeGroupScale:.02,meshColorIndex:"ciano",meshScale:1,debug:!1,model:{material:"Default_OBJ",scale:.02,metalness:.2,roughness:2,opacity:1,color:"white"},gridPosition:[0,-.52,.28],cameraPosition:[-20,0,0],pointColorIndex:{primary:"ciano",hovered:"magenta",active:"magenta"},pointLight:{position:[0,0,0],intensity:[2,2,2],distance:15,color:["ciano","magenta","magenta"]},bloom:{kernelSize:1,luminanceThreshold:.1,luminanceSmoothing:.05,intensity:.1},glitch:{delay:[20,30],duration:[.3,.5],strength:[.1,.3]},lights:{front:{color:"ciano"},left:{color:"white"},right:{color:"magenta"}}},w={ciano:"#01ffff",magenta:"#e6007a",white:"#ffffff",black:"#000000"};function x(e){return"".concat("/meme-mine","/assets/").concat(e)}var S,k,L,M,R=s.a.forwardRef(function(e,t){var n=e.position?e.position:[0,0,0],a=Object(l.useState)(n),o=Object(f.a)(a,2),r=o[0],i=o[1],c=Object(l.useState)(!1),u=Object(f.a)(c,2),m=u[0],p=u[1],h=v.objectUrl[e.animation],b=Object(y.a)(x(h)),g=b.scene,j=b.nodes,O=b.materials,S=b.animations,k=Object(l.useRef)();return Object(l.useEffect)(function(){t.current&&(k.current=new E.AnimationMixer(t.current))},[t]),Object(l.useEffect)(function(){return k.current&&S&&S.forEach(function(t){var n=k.current.clipAction(t);n.timeScale=e.speed,n.play()}),function(){k.current&&k.current.stopAllAction()}},[S]),Object(l.useEffect)(function(){var e=function(e){"ArrowRight"===e.key?i(function(e){return[e[0]-1,e[1],e[2]]}):"ArrowLeft"===e.key&&i(function(e){return[e[0]+1,e[1],e[2]]}),"ArrowUp"!==e.key||m||0!==r[1]||p(!0)};return window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}},[r]),Object(d.b)(function(e,t){k.current&&k.current.update(t),i(m?function(e){var n=e[1]+10*t;return n>=2&&p(!1),[e[0],n<=0?0:n,e[2]]}:function(e){return[e[0],Math.max(0,e[1]-10*t),e[2]]})}),Object(l.useLayoutEffect)(function(){e.meshScale&&j.canary&&j.canary.scale.set(4,4,4),g.traverse(function(e){"Mesh"===e.type&&(e.receiveShadow=e.castShadow=!0)}),Object.assign(O[e.model.material],{wireframe:!1,metalness:e.model.metalness,roughness:e.model.moughness,opacity:e.model.opacity,color:new E.Color(w[e.model.color])})},[g,j,O]),s.a.createElement("mesh",{position:r},s.a.createElement("primitive",Object.assign({ref:t,object:g},e)))}),P=n(64),T=function(e){var t=e.config,n=Object(l.useRef)(),a=Object(l.useRef)(),o=Object(l.useRef)(),r=Object(l.useRef)(),i=Object(l.useRef)(),c=Object(l.useRef)();return Object(d.b)(function(e){var t=e.clock.getElapsedTime(),r=15;parseInt(t)%4===1&&(r=15*Math.random()|0),n.current.position.x=Math.sin(t)/4*r,n.current.position.y=Math.cos(t)/4*r,n.current.position.z=Math.cos(t)/4*r,a.current.position.x=Math.cos(t)/4*10,a.current.position.y=Math.sin(t)/4*10,a.current.position.z=Math.sin(t)/4*10,o.current.position.x=Math.sin(t)/4*10,o.current.position.y=Math.cos(t)/4*10,o.current.position.z=Math.sin(t)/4*10}),!0===t.debug&&(Object(P.a)(r,E.PointLightHelper),Object(P.a)(i,E.PointLightHelper),Object(P.a)(c,E.PointLightHelper)),s.a.createElement(s.a.Fragment,null,s.a.createElement("group",{ref:n},s.a.createElement("pointLight",{ref:r,color:w[t.pointLight.color[0]],position:t.pointLight.position,distance:t.pointLight.distance,intensity:t.pointLight.intensity[0]})),s.a.createElement("group",{ref:a},s.a.createElement("pointLight",{ref:i,color:w[t.pointLight.color[1]],position:t.pointLight.position,distance:t.pointLight.distance,intensity:t.pointLight.intensity[1]})),s.a.createElement("group",{ref:o},s.a.createElement("pointLight",{ref:c,color:w[t.pointLight.color[2]],position:t.pointLight.position,distance:t.pointLight.distance,intensity:t.pointLight.intensity[2]})))},A=n(13),z=s.a.forwardRef(function(e,t){var n=e.positionZ,a=e.side,o=Object(d.c)(E.TextureLoader,x("sbf.jpeg"));return s.a.createElement("mesh",{position:[a,0,n],rotation:[0,0,0],ref:t},s.a.createElement("planeGeometry",{args:[1.2,1.2]}),s.a.createElement("meshBasicMaterial",{map:o,side:E.DoubleSide}))}),I=s.a.forwardRef(function(e,t){var n=Object(l.useState)([]),a=Object(f.a)(n,2),o=a[0],r=a[1],i=Object(l.useState)(0),c=Object(f.a)(i,2),u=c[0],m=c[1],p=Object(l.useRef)(),h=Object(l.useRef)({elapsedTime:0,delta:0});return Object(d.b)(function(e){var n,a,i=e.clock;if(h.current.delta=i.getElapsedTime()-h.current.elapsedTime,t.current){h.current.delta>=.05&&(h.current.elapsedTime=i.getElapsedTime(),m(function(e){return e+1}),r(function(e){return e.map(function(e){return{z:e.z-1,side:e.side}})}));var c=p.current?p.current.position.z:0;if(o.length<5||u%5>c){var l={z:c+(n=10,a=50,Math.floor(Math.random()*(a-n))+n),side:Math.floor(3*Math.random())-1};r(function(e){return[].concat(Object(A.a)(e),[l])})}o.length>5&&r(function(e){return e.slice(1)})}}),s.a.createElement(s.a.Fragment,null,o.map(function(e,t){var n=e.z,a=e.side;return s.a.createElement(z,{key:t,positionZ:n,side:a,ref:t===o.length-1?p:void 0})}))}),C=s.a.forwardRef(function(e,t){var n=e.positionZ;return s.a.createElement("mesh",{position:[0,-.52,n],rotation:[Math.PI/2,0,0],ref:t},s.a.createElement("planeGeometry",{args:[.1,5]}),s.a.createElement("meshBasicMaterial",{color:16777215,side:E.DoubleSide}))}),F=s.a.forwardRef(function(e,t){var n=Object(l.useState)([]),a=Object(f.a)(n,2),o=a[0],r=a[1],i=Object(l.useState)(0),c=Object(f.a)(i,2),u=c[0],m=c[1],p=Object(l.useRef)(),h=Object(l.useRef)({elapsedTime:0,delta:0});return Object(d.b)(function(e){var n=e.clock;if(h.current.delta=n.getElapsedTime()-h.current.elapsedTime,t.current){h.current.delta>=.05&&(h.current.elapsedTime=n.getElapsedTime(),m(function(e){return e+1}),r(function(e){return e.map(function(e){return e-1})}));var a=p.current?p.current.position.z:0;if(o.length<5||u%5>a){var i=a+20;r(function(e){return[].concat(Object(A.a)(e),[i])})}o.length>5&&r(function(e){return e.slice(1)})}}),s.a.createElement(s.a.Fragment,null,o.map(function(e,t){return s.a.createElement(C,{key:t,positionZ:e,ref:t===o.length-1?p:void 0})}))}),B=function(){var e=Object(l.useRef)();return s.a.createElement(d.a,{shadows:!0,dpr:[1,2],camera:{position:v.cameraPosition,fov:50},performance:{min:.1}},s.a.createElement(O,null),s.a.createElement(T,{config:v}),s.a.createElement(F,{ref:e}),s.a.createElement(I,{ref:e}),s.a.createElement(l.Suspense,{fallback:null},s.a.createElement(R,{animation:"walk",speed:"3",scale:v.model.scale,meshColorIndex:v.meshColorIndex,meshScale:v.meshScale,model:v.model,ref:e}),s.a.createElement(h.b,{multisampling:16},s.a.createElement(h.a,{kernelSize:v.bloom.kernelSize,luminanceThreshold:v.bloom.luminanceThreshold,luminanceSmoothing:v.bloom.luminanceSmoothing,intensity:v.bloom.intensity}))),s.a.createElement(p.a,{minPolarAngle:Math.PI/2.8,maxPolarAngle:Math.PI/1.8}))},D=function(){var e=Object(l.useState)(!0),t=Object(f.a)(e,2),n=t[0],a=t[1];Object(l.useEffect)(function(){var e=function(e){"Enter"===e.key&&a(!1)};return document.addEventListener("keydown",e),function(){document.removeEventListener("keydown",e)}},[]);var o=Object(l.useRef)();return n?s.a.createElement(s.a.Fragment,null,s.a.createElement(d.a,{shadows:!0,dpr:[1,2],camera:{position:[3,1,3],fov:50},performance:{min:.1}},s.a.createElement(T,{config:v}),s.a.createElement(l.Suspense,{fallback:null},s.a.createElement(R,{animation:"idle",speed:"1",position:[0,.2,0],scale:v.model.scale,meshColorIndex:v.meshColorIndex,meshScale:v.meshScale,model:v.model,ref:o}),s.a.createElement(h.b,{multisampling:16},s.a.createElement(h.a,{kernelSize:v.bloom.kernelSize,luminanceThreshold:v.bloom.luminanceThreshold,luminanceSmoothing:v.bloom.luminanceSmoothing,intensity:v.bloom.intensity}))),s.a.createElement(p.a,{minPolarAngle:Math.PI/2.8,maxPolarAngle:Math.PI/1.8})),g.a.createPortal(s.a.createElement(_,null,s.a.createElement(G,null,"canary in a meme mine"),s.a.createElement(H,null,"press enter to start")),document.body)):s.a.createElement(B,null)},Z=Object(j.b)(S||(S=Object(m.a)(["\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0; }\n"]))),_=j.a.div(k||(k=Object(m.a)(["\n  position: absolute;\n  top: 25px;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  pointer-events: none;\n"]))),G=j.a.h1(L||(L=Object(m.a)(["\n  color: #fff;\n  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;\n"]))),H=j.a.h2(M||(M=Object(m.a)(["\n  color: #fff;\n  margin-top: 125px;\n  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;\n  animation: "," 1500ms linear infinite;\n"])),Z),J=(n(60),function(e){function t(){return Object(a.a)(this,t),Object(r.a)(this,Object(i.a)(t).apply(this,arguments))}return Object(c.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"App",style:{display:"flex",flexDirection:"column",alignItems:"center",height:"100%"}},s.a.createElement(D,null)))}}]),t}(s.a.Component)),U=document.getElementById("root");Object(u.createRoot)(U).render(s.a.createElement(J,null))}},[[44,2,1]]]);
//# sourceMappingURL=main.4f81cb4a.chunk.js.map
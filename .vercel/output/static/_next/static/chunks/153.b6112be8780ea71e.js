"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[153],{228:(e,t,n)=>{n.d(t,{DY:()=>s,IU:()=>u,uv:()=>l});let r=e=>"object"==typeof e&&"function"==typeof e.then,i=[];function o(e,t,n=(e,t)=>e===t){if(e===t)return!0;if(!e||!t)return!1;let r=e.length;if(t.length!==r)return!1;for(let i=0;i<r;i++)if(!n(e[i],t[i]))return!1;return!0}function a(e,t=null,n=!1,s={}){for(let r of(null===t&&(t=[e]),i))if(o(t,r.keys,r.equal)){if(n)return;if(Object.prototype.hasOwnProperty.call(r,"error"))throw r.error;if(Object.prototype.hasOwnProperty.call(r,"response"))return s.lifespan&&s.lifespan>0&&(r.timeout&&clearTimeout(r.timeout),r.timeout=setTimeout(r.remove,s.lifespan)),r.response;if(!n)throw r.promise}let l={keys:t,equal:s.equal,remove:()=>{let e=i.indexOf(l);-1!==e&&i.splice(e,1)},promise:(r(e)?e:e(...t)).then(e=>{l.response=e,s.lifespan&&s.lifespan>0&&(l.timeout=setTimeout(l.remove,s.lifespan))}).catch(e=>l.error=e)};if(i.push(l),!n)throw l.promise}let s=(e,t,n)=>a(e,t,!1,n),l=(e,t,n)=>void a(e,t,!0,n),u=e=>{if(void 0===e||0===e.length)i.splice(0,i.length);else{let t=i.find(t=>o(e,t.keys,t.equal));t&&t.remove()}}},1401:(e,t,n)=>{n.d(t,{b:()=>i});var r=n(7431);function i(e,t,n,i){var o;return(o=class extends r.ShaderMaterial{constructor(o){for(let i in super({vertexShader:t,fragmentShader:n,...o}),e)this.uniforms[i]=new r.Uniform(e[i]),Object.defineProperty(this,i,{get(){return this.uniforms[i].value},set(e){this.uniforms[i].value=e}});this.uniforms=r.UniformsUtils.clone(this.uniforms),null==i||i(this)}}).key=r.MathUtils.generateUUID(),o}},2407:(e,t,n)=>{e.exports=n(6892)},2436:(e,t,n)=>{var r=n(2115),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=r.useState,a=r.useEffect,s=r.useLayoutEffect,l=r.useDebugValue;function u(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var c="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=o({inst:{value:n,getSnapshot:t}}),i=r[0].inst,c=r[1];return s(function(){i.value=n,i.getSnapshot=t,u(i)&&c({inst:i})},[e,n,t]),a(function(){return u(i)&&c({inst:i}),e(function(){u(i)&&c({inst:i})})},[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:c},2834:(e,t,n)=>{n.d(t,{mK:()=>et,s0:()=>Q});var r,i,o,a,s,l,u,c=n(5155),f=n(2115),d=n(7431),h=n(6990),p=n(1004);function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function g(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],l=t[5],u=t[6],c=t[7],f=t[8];return r*s*f+i*l*u+o*a*c-o*s*u-i*a*f-r*l*c}function w(e,t){for(var n=[],r=e.toArray(),i=t.toArray(),o=0;o<r.length;o++)n[o]=r[o]+i[o];return new d.Matrix3().fromArray(n)}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function E(e,t){if(e){if("string"==typeof e)return x(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return x(e,t)}}function _(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n,r,i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var o=[],a=!0,s=!1;try{for(i=i.call(e);!(a=(n=i.next()).done)&&(o.push(n.value),!t||o.length!==t);a=!0);}catch(e){s=!0,r=e}finally{try{a||null==i.return||i.return()}finally{if(s)throw r}}return o}}(e,t)||E(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function S(e,t,n){return(S=y()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var i=new(Function.bind.apply(e,r));return n&&b(i,n.prototype),i}).apply(null,arguments)}function A(e){var t=_(e[0],2),n=t[0],r=t[1],i=_(e[1],2),o=i[0],a=i[1],s=_(e[2],2);return g(n,r,1,o,a,1,s[0],s[1],1)}var M=new d.Vector2,P=new d.Vector2;function O(e){return e*e*e*(e*(6*e-15)+10)}function C(e,t,n){return e*(1-n)+t*n}function L(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}var j=function e(t,n,r){var i=this;L(this,e),m(this,"dot2",function(e,t){return i.x*e+i.y*t}),m(this,"dot3",function(e,t,n){return i.x*e+i.y*t+i.z*n}),this.x=t,this.y=n,this.z=r},T=[new j(1,1,0),new j(-1,1,0),new j(1,-1,0),new j(-1,-1,0),new j(1,0,1),new j(-1,0,1),new j(1,0,-1),new j(-1,0,-1),new j(0,1,1),new j(0,-1,1),new j(0,1,-1),new j(0,-1,-1)],z=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],R=Array(512),U=Array(512),D=function(e){e>0&&e<1&&(e*=65536),(e=Math.floor(e))<256&&(e|=e<<8);for(var t,n=0;n<256;n++)t=1&n?z[n]^255&e:z[n]^e>>8&255,R[n]=R[n+256]=t,U[n]=U[n+256]=T[t%12]};D(0);var I=.5*(Math.sqrt(3)-1),V=(3-Math.sqrt(3))/6,k=1/3,B=1/6;function N(e){var t=function(e){if("number"==typeof e)e=Math.abs(e);else if("string"==typeof e){var t=e;e=0;for(var n=0;n<t.length;n++)e=(e+(n+1)*(t.charCodeAt(n)%96))%0x7fffffff}return 0===e&&(e=311),e}(e);return function(){var e=48271*t%0x7fffffff;return t=e,e/0x7fffffff}}new function e(t){var n=this;L(this,e),m(this,"seed",0),m(this,"init",function(e){n.seed=e,n.value=N(e)}),m(this,"value",N(this.seed)),this.init(t)}(Math.random());var H=function(e){return 1/(1+e+.48*e*e+.235*e*e*e)};function F(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.25,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:.01,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:1/0,a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:H,s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:.001,l="velocity_"+t;if(void 0===e.__damp&&(e.__damp={}),void 0===e.__damp[l]&&(e.__damp[l]=0),Math.abs(e[t]-n)<=s)return e[t]=n,!1;var u=2/(r=Math.max(1e-4,r)),c=a(u*i),f=e[t]-n,d=n,h=o*r;f=Math.min(Math.max(f,-h),h),n=e[t]-f;var p=(e.__damp[l]+u*f)*i;e.__damp[l]=(e.__damp[l]-u*p)*c;var m=n+(f+p)*c;return d-e[t]>0==m>d&&(m=d,e.__damp[l]=(m-d)/i),e[t]=m,!0}var W=new d.Vector3;var Y=new d.Quaternion,G=new d.Vector4,X=new d.Vector4,$=new d.Vector4;function Z(e){return(Z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}d.BufferGeometry;n(4687);let q=(0,f.createContext)(null),K=e=>(2&e.getAttributes())==2,Q=(0,f.memo)((0,f.forwardRef)(({children:e,camera:t,scene:n,resolutionScale:r,enabled:i=!0,renderPriority:o=1,autoClear:a=!0,depthBuffer:s,enableNormalPass:l,stencilBuffer:u,multisampling:m=8,frameBufferType:v=d.HalfFloatType},b)=>{let{gl:y,scene:g,camera:w,size:x}=(0,h.C)(),E=n||g,_=t||w,[S,A,M]=(0,f.useMemo)(()=>{let e=new p.s0(y,{depthBuffer:s,stencilBuffer:u,multisampling:m,frameBufferType:v});e.addPass(new p.AH(E,_));let t=null,n=null;return l&&((n=new p.Xe(E,_)).enabled=!1,e.addPass(n),void 0!==r&&((t=new p.SP({normalBuffer:n.texture,resolutionScale:r})).enabled=!1,e.addPass(t))),[e,n,t]},[_,y,s,u,m,v,E,l,r]);(0,f.useEffect)(()=>S?.setSize(x.width,x.height),[S,x]),(0,h.D)((e,t)=>{if(i){let e=y.autoClear;y.autoClear=a,u&&!a&&y.clearStencil(),S.render(t),y.autoClear=e}},i?o:0);let P=(0,f.useRef)(null);(0,f.useLayoutEffect)(()=>{let e=[],t=P.current.__r3f;if(t&&S){let n=t.children;for(let t=0;t<n.length;t++){let r=n[t].object;if(r instanceof p.Mj){let i=[r];if(!K(r)){let e=null;for(;(e=n[t+1]?.object)instanceof p.Mj&&!K(e);)i.push(e),t++}let o=new p.Vu(_,...i);e.push(o)}else r instanceof p.oF&&e.push(r)}for(let t of e)S?.addPass(t);A&&(A.enabled=!0),M&&(M.enabled=!0)}return()=>{for(let t of e)S?.removePass(t);A&&(A.enabled=!1),M&&(M.enabled=!1)}},[S,e,_,A,M]),(0,f.useEffect)(()=>{let e=y.toneMapping;return y.toneMapping=d.NoToneMapping,()=>{y.toneMapping=e}},[y]);let O=(0,f.useMemo)(()=>({composer:S,normalPass:A,downSamplingPass:M,resolutionScale:r,camera:_,scene:E}),[S,A,M,r,_,E]);return(0,f.useImperativeHandle)(b,()=>S,[S]),(0,c.jsx)(q.Provider,{value:O,children:(0,c.jsx)("group",{ref:P,children:e})})})),J=0,ee=new WeakMap;p.Mj;let et=((e,t)=>function({blendFunction:n=t?.blendFunction,opacity:r=t?.opacity,...i}){let o=ee.get(e);if(!o){let t=`@react-three/postprocessing/${e.name}-${J++}`;(0,h.e)({[t]:e}),ee.set(e,o=t)}let a=(0,h.C)(e=>e.camera),s=f.useMemo(()=>[...t?.args??[],...i.args??[{...t,...i}]],[JSON.stringify(i)]);return(0,c.jsx)(o,{camera:a,"blendMode-blendFunction":n,"blendMode-opacity-value":r,...i,args:s})})(p.bv,{blendFunction:0});p.i,p.hH;var en=(e=>(e[e.Linear=0]="Linear",e[e.Radial=1]="Radial",e[e.MirroredLinear=2]="MirroredLinear",e))(en||{});p.Mj,p.To;let er={fragmentShader:`

    // original shader by Evan Wallace

    #define MAX_ITERATIONS 100

    uniform float blur;
    uniform float taper;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 direction;
    uniform int samples;

    float random(vec3 scale, float seed) {
        /* use the fragment position for a different seed per-pixel */
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 startPixel = vec2(start.x * resolution.x, start.y * resolution.y);
        vec2 endPixel = vec2(end.x * resolution.x, end.y * resolution.y);
        float f_samples = float(samples);
        float half_samples = f_samples / 2.0;

        // use screen diagonal to normalize blur radii
        float maxScreenDistance = distance(vec2(0.0), resolution); // diagonal distance
        float gradientRadius = taper * (maxScreenDistance);
        float blurRadius = blur * (maxScreenDistance / 16.0);

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
        vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
        float radius = smoothstep(0.0, 1.0, abs(dot(uv * resolution - startPixel, normal)) / gradientRadius) * blurRadius;

        #pragma unroll_loop_start
        for (int i = 0; i <= MAX_ITERATIONS; i++) {
            if (i >= samples) { break; } // return early if over sample count
            float f_i = float(i);
            float s_i = -half_samples + f_i;
            float percent = (s_i + offset - 0.5) / half_samples;
            float weight = 1.0 - abs(percent);
            vec4 sample_i = texture2D(inputBuffer, uv + normalize(direction) / resolution * percent * radius);
            /* switch to pre-multiplied alpha to correctly blur transparent images */
            sample_i.rgb *= sample_i.a;
            color += sample_i * weight;
            total += weight;
        }
        #pragma unroll_loop_end

        outputColor = color / total;

        /* switch back from pre-multiplied alpha */
        outputColor.rgb /= outputColor.a + 0.00001;
    }
    `};p.Mj;p.Mj;p.Mj},2941:(e,t,n)=>{n.d(t,{r:()=>a});var r=n(2115),i=n(6990);let o=(0,r.createContext)(null);function a({iterations:e=10,ms:t=250,threshold:n=.75,step:a=.1,factor:s=.5,flipflops:l=1/0,bounds:u=e=>e>100?[60,100]:[40,60],onIncline:c,onDecline:f,onChange:d,onFallback:h,children:p}){let[m,v]=(0,r.useState)(()=>({fps:0,index:0,factor:s,flipped:0,refreshrate:0,fallback:!1,frames:[],averages:[],subscriptions:new Map,subscribe:e=>{let t=Symbol();return m.subscriptions.set(t,e.current),()=>void m.subscriptions.delete(t)}})),b=0;return(0,i.D)(()=>{let{frames:r,averages:i}=m;if(!m.fallback&&i.length<e){r.push(performance.now());let o=r[r.length-1]-r[0];if(o>=t){if(m.fps=Math.round(r.length/o*1e3)/1,m.refreshrate=Math.max(m.refreshrate,m.fps),i[m.index++%e]=m.fps,i.length===e){let[t,r]=u(m.refreshrate),o=i.filter(e=>e>=r),s=i.filter(e=>e<t);o.length>e*n&&(m.factor=Math.min(1,m.factor+a),m.flipped++,c&&c(m),m.subscriptions.forEach(e=>e.onIncline&&e.onIncline(m))),s.length>e*n&&(m.factor=Math.max(0,m.factor-a),m.flipped++,f&&f(m),m.subscriptions.forEach(e=>e.onDecline&&e.onDecline(m))),b!==m.factor&&(b=m.factor,d&&d(m),m.subscriptions.forEach(e=>e.onChange&&e.onChange(m))),m.flipped>l&&!m.fallback&&(m.fallback=!0,h&&h(m),m.subscriptions.forEach(e=>e.onFallback&&e.onFallback(m))),m.averages=[]}m.frames=[]}}}),r.createElement(o.Provider,{value:m},p)}},3036:(e,t,n)=>{n.d(t,{h:()=>c});var r=n(2115),i=n(5643);let o=e=>{let t,n=new Set,r=(e,r)=>{let i="function"==typeof e?e(t):e;if(!Object.is(i,t)){let e=t;t=(null!=r?r:"object"!=typeof i||null===i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,o={setState:r,getState:i,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(r,i,o);return o},a=e=>e?o(e):o,{useSyncExternalStoreWithSelector:s}=i,l=e=>e,u=(e,t)=>{let n=a(e),i=(e,i=t)=>(function(e,t=l,n){let i=s(e.subscribe,e.getState,e.getInitialState,t,n);return r.useDebugValue(i),i})(n,e,i);return Object.assign(i,n),i},c=(e,t)=>e?u(e,t):u},4688:(e,t,n)=>{n.d(t,{N:()=>g});var r=n(9630),i=n(6990),o=n(2115),a=n(7431),s=Object.defineProperty,l=(e,t,n)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,u=(e,t,n)=>(l(e,"symbol"!=typeof t?t+"":t,n),n);class c{constructor(){u(this,"_listeners")}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let n=this._listeners[e];if(void 0!==n){let e=n.indexOf(t);-1!==e&&n.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}}var f=Object.defineProperty,d=(e,t,n)=>t in e?f(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,h=(e,t,n)=>(d(e,"symbol"!=typeof t?t+"":t,n),n);let p=new a.Ray,m=new a.Plane,v=Math.cos(Math.PI/180*70),b=(e,t)=>(e%t+t)%t;class y extends c{constructor(e,t){super(),h(this,"object"),h(this,"domElement"),h(this,"enabled",!0),h(this,"target",new a.Vector3),h(this,"minDistance",0),h(this,"maxDistance",1/0),h(this,"minZoom",0),h(this,"maxZoom",1/0),h(this,"minPolarAngle",0),h(this,"maxPolarAngle",Math.PI),h(this,"minAzimuthAngle",-1/0),h(this,"maxAzimuthAngle",1/0),h(this,"enableDamping",!1),h(this,"dampingFactor",.05),h(this,"enableZoom",!0),h(this,"zoomSpeed",1),h(this,"enableRotate",!0),h(this,"rotateSpeed",1),h(this,"enablePan",!0),h(this,"panSpeed",1),h(this,"screenSpacePanning",!0),h(this,"keyPanSpeed",7),h(this,"zoomToCursor",!1),h(this,"autoRotate",!1),h(this,"autoRotateSpeed",2),h(this,"reverseOrbit",!1),h(this,"reverseHorizontalOrbit",!1),h(this,"reverseVerticalOrbit",!1),h(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),h(this,"mouseButtons",{LEFT:a.MOUSE.ROTATE,MIDDLE:a.MOUSE.DOLLY,RIGHT:a.MOUSE.PAN}),h(this,"touches",{ONE:a.TOUCH.ROTATE,TWO:a.TOUCH.DOLLY_PAN}),h(this,"target0"),h(this,"position0"),h(this,"zoom0"),h(this,"_domElementKeyEvents",null),h(this,"getPolarAngle"),h(this,"getAzimuthalAngle"),h(this,"setPolarAngle"),h(this,"setAzimuthalAngle"),h(this,"getDistance"),h(this,"getZoomScale"),h(this,"listenToKeyEvents"),h(this,"stopListenToKeyEvents"),h(this,"saveState"),h(this,"reset"),h(this,"update"),h(this,"connect"),h(this,"dispose"),h(this,"dollyIn"),h(this,"dollyOut"),h(this,"getScale"),h(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>c.phi,this.getAzimuthalAngle=()=>c.theta,this.setPolarAngle=e=>{let t=b(e,2*Math.PI),r=c.phi;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),f.phi=t-r,n.update()},this.setAzimuthalAngle=e=>{let t=b(e,2*Math.PI),r=c.theta;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),f.theta=t-r,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",ee),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ee),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),l=s.NONE},this.update=(()=>{let t=new a.Vector3,i=new a.Vector3(0,1,0),o=new a.Quaternion().setFromUnitVectors(e.up,i),h=o.clone().invert(),b=new a.Vector3,g=new a.Quaternion,w=2*Math.PI;return function(){let x=n.object.position;o.setFromUnitVectors(e.up,i),h.copy(o).invert(),t.copy(x).sub(n.target),t.applyQuaternion(o),c.setFromVector3(t),n.autoRotate&&l===s.NONE&&R(2*Math.PI/60/60*n.autoRotateSpeed),n.enableDamping?(c.theta+=f.theta*n.dampingFactor,c.phi+=f.phi*n.dampingFactor):(c.theta+=f.theta,c.phi+=f.phi);let E=n.minAzimuthAngle,_=n.maxAzimuthAngle;isFinite(E)&&isFinite(_)&&(E<-Math.PI?E+=w:E>Math.PI&&(E-=w),_<-Math.PI?_+=w:_>Math.PI&&(_-=w),E<=_?c.theta=Math.max(E,Math.min(_,c.theta)):c.theta=c.theta>(E+_)/2?Math.max(E,c.theta):Math.min(_,c.theta)),c.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,c.phi)),c.makeSafe(),!0===n.enableDamping?n.target.addScaledVector(y,n.dampingFactor):n.target.add(y),n.zoomToCursor&&L||n.object.isOrthographicCamera?c.radius=N(c.radius):c.radius=N(c.radius*d),t.setFromSpherical(c),t.applyQuaternion(h),x.copy(n.target).add(t),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),!0===n.enableDamping?(f.theta*=1-n.dampingFactor,f.phi*=1-n.dampingFactor,y.multiplyScalar(1-n.dampingFactor)):(f.set(0,0,0),y.set(0,0,0));let S=!1;if(n.zoomToCursor&&L){let r=null;if(n.object instanceof a.PerspectiveCamera&&n.object.isPerspectiveCamera){let e=t.length();r=N(e*d);let i=e-r;n.object.position.addScaledVector(O,i),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new a.Vector3(C.x,C.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/d)),n.object.updateProjectionMatrix(),S=!0;let i=new a.Vector3(C.x,C.y,0);i.unproject(n.object),n.object.position.sub(i).add(e),n.object.updateMatrixWorld(),r=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;null!==r&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(r).add(n.object.position):(p.origin.copy(n.object.position),p.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(p.direction))<v?e.lookAt(n.target):(m.setFromNormalAndCoplanarPoint(n.object.up,n.target),p.intersectPlane(m,n.target))))}else n.object instanceof a.OrthographicCamera&&n.object.isOrthographicCamera&&(S=1!==d)&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/d)),n.object.updateProjectionMatrix());return d=1,L=!1,!!(S||b.distanceToSquared(n.object.position)>u||8*(1-g.dot(n.object.quaternion))>u)&&(n.dispatchEvent(r),b.copy(n.object.position),g.copy(n.object.quaternion),S=!1,!0)}})(),this.connect=e=>{n.domElement=e,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",et),n.domElement.addEventListener("pointerdown",q),n.domElement.addEventListener("pointercancel",Q),n.domElement.addEventListener("wheel",J)},this.dispose=()=>{var e,t,r,i,o,a;n.domElement&&(n.domElement.style.touchAction="auto"),null==(e=n.domElement)||e.removeEventListener("contextmenu",et),null==(t=n.domElement)||t.removeEventListener("pointerdown",q),null==(r=n.domElement)||r.removeEventListener("pointercancel",Q),null==(i=n.domElement)||i.removeEventListener("wheel",J),null==(o=n.domElement)||o.ownerDocument.removeEventListener("pointermove",K),null==(a=n.domElement)||a.ownerDocument.removeEventListener("pointerup",Q),null!==n._domElementKeyEvents&&n._domElementKeyEvents.removeEventListener("keydown",ee)};let n=this,r={type:"change"},i={type:"start"},o={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},l=s.NONE,u=1e-6,c=new a.Spherical,f=new a.Spherical,d=1,y=new a.Vector3,g=new a.Vector2,w=new a.Vector2,x=new a.Vector2,E=new a.Vector2,_=new a.Vector2,S=new a.Vector2,A=new a.Vector2,M=new a.Vector2,P=new a.Vector2,O=new a.Vector3,C=new a.Vector2,L=!1,j=[],T={};function z(){return Math.pow(.95,n.zoomSpeed)}function R(e){n.reverseOrbit||n.reverseHorizontalOrbit?f.theta+=e:f.theta-=e}function U(e){n.reverseOrbit||n.reverseVerticalOrbit?f.phi+=e:f.phi-=e}let D=(()=>{let e=new a.Vector3;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),y.add(e)}})(),I=(()=>{let e=new a.Vector3;return function(t,r){!0===n.screenSpacePanning?e.setFromMatrixColumn(r,1):(e.setFromMatrixColumn(r,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),y.add(e)}})(),V=(()=>{let e=new a.Vector3;return function(t,r){let i=n.domElement;if(i&&n.object instanceof a.PerspectiveCamera&&n.object.isPerspectiveCamera){let o=n.object.position;e.copy(o).sub(n.target);let a=e.length();D(2*t*(a*=Math.tan(n.object.fov/2*Math.PI/180))/i.clientHeight,n.object.matrix),I(2*r*a/i.clientHeight,n.object.matrix)}else i&&n.object instanceof a.OrthographicCamera&&n.object.isOrthographicCamera?(D(t*(n.object.right-n.object.left)/n.object.zoom/i.clientWidth,n.object.matrix),I(r*(n.object.top-n.object.bottom)/n.object.zoom/i.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function k(e){n.object instanceof a.PerspectiveCamera&&n.object.isPerspectiveCamera||n.object instanceof a.OrthographicCamera&&n.object.isOrthographicCamera?d=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function B(e){if(!n.zoomToCursor||!n.domElement)return;L=!0;let t=n.domElement.getBoundingClientRect(),r=e.clientX-t.left,i=e.clientY-t.top,o=t.width,a=t.height;C.x=r/o*2-1,C.y=-(i/a*2)+1,O.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function N(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function H(e){g.set(e.clientX,e.clientY)}function F(e){E.set(e.clientX,e.clientY)}function W(){if(1==j.length)g.set(j[0].pageX,j[0].pageY);else{let e=.5*(j[0].pageX+j[1].pageX),t=.5*(j[0].pageY+j[1].pageY);g.set(e,t)}}function Y(){if(1==j.length)E.set(j[0].pageX,j[0].pageY);else{let e=.5*(j[0].pageX+j[1].pageX),t=.5*(j[0].pageY+j[1].pageY);E.set(e,t)}}function G(){let e=j[0].pageX-j[1].pageX,t=j[0].pageY-j[1].pageY,n=Math.sqrt(e*e+t*t);A.set(0,n)}function X(e){if(1==j.length)w.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);w.set(n,r)}x.subVectors(w,g).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(R(2*Math.PI*x.x/t.clientHeight),U(2*Math.PI*x.y/t.clientHeight)),g.copy(w)}function $(e){if(1==j.length)_.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);_.set(n,r)}S.subVectors(_,E).multiplyScalar(n.panSpeed),V(S.x,S.y),E.copy(_)}function Z(e){var t;let r=er(e),i=e.pageX-r.x,o=e.pageY-r.y,a=Math.sqrt(i*i+o*o);M.set(0,a),P.set(0,Math.pow(M.y/A.y,n.zoomSpeed)),t=P.y,k(d/t),A.copy(M)}function q(e){var t,r,o;!1!==n.enabled&&(0===j.length&&(null==(t=n.domElement)||t.ownerDocument.addEventListener("pointermove",K),null==(r=n.domElement)||r.ownerDocument.addEventListener("pointerup",Q)),o=e,j.push(o),"touch"===e.pointerType?function(e){switch(en(e),j.length){case 1:switch(n.touches.ONE){case a.TOUCH.ROTATE:if(!1===n.enableRotate)return;W(),l=s.TOUCH_ROTATE;break;case a.TOUCH.PAN:if(!1===n.enablePan)return;Y(),l=s.TOUCH_PAN;break;default:l=s.NONE}break;case 2:switch(n.touches.TWO){case a.TOUCH.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&G(),n.enablePan&&Y(),l=s.TOUCH_DOLLY_PAN;break;case a.TOUCH.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&G(),n.enableRotate&&W(),l=s.TOUCH_DOLLY_ROTATE;break;default:l=s.NONE}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(i)}(e):function(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case a.MOUSE.DOLLY:if(!1===n.enableZoom)return;B(e),A.set(e.clientX,e.clientY),l=s.DOLLY;break;case a.MOUSE.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enablePan)return;F(e),l=s.PAN}else{if(!1===n.enableRotate)return;H(e),l=s.ROTATE}break;case a.MOUSE.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enableRotate)return;H(e),l=s.ROTATE}else{if(!1===n.enablePan)return;F(e),l=s.PAN}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(i)}(e))}function K(e){!1!==n.enabled&&("touch"===e.pointerType?function(e){switch(en(e),l){case s.TOUCH_ROTATE:if(!1===n.enableRotate)return;X(e),n.update();break;case s.TOUCH_PAN:if(!1===n.enablePan)return;$(e),n.update();break;case s.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&Z(e),n.enablePan&&$(e),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&Z(e),n.enableRotate&&X(e),n.update();break;default:l=s.NONE}}(e):function(e){if(!1!==n.enabled)switch(l){case s.ROTATE:if(!1===n.enableRotate)return;w.set(e.clientX,e.clientY),x.subVectors(w,g).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(R(2*Math.PI*x.x/t.clientHeight),U(2*Math.PI*x.y/t.clientHeight)),g.copy(w),n.update();break;case s.DOLLY:var r,i;if(!1===n.enableZoom)return;(M.set(e.clientX,e.clientY),P.subVectors(M,A),P.y>0)?(r=z(),k(d/r)):P.y<0&&(i=z(),k(d*i)),A.copy(M),n.update();break;case s.PAN:if(!1===n.enablePan)return;_.set(e.clientX,e.clientY),S.subVectors(_,E).multiplyScalar(n.panSpeed),V(S.x,S.y),E.copy(_),n.update()}}(e))}function Q(e){var t,r,i;(function(e){delete T[e.pointerId];for(let t=0;t<j.length;t++)if(j[t].pointerId==e.pointerId)return void j.splice(t,1)})(e),0===j.length&&(null==(t=n.domElement)||t.releasePointerCapture(e.pointerId),null==(r=n.domElement)||r.ownerDocument.removeEventListener("pointermove",K),null==(i=n.domElement)||i.ownerDocument.removeEventListener("pointerup",Q)),n.dispatchEvent(o),l=s.NONE}function J(e){if(!1!==n.enabled&&!1!==n.enableZoom&&(l===s.NONE||l===s.ROTATE)){var t,r;e.preventDefault(),n.dispatchEvent(i),(B(e),e.deltaY<0)?(t=z(),k(d*t)):e.deltaY>0&&(r=z(),k(d/r)),n.update(),n.dispatchEvent(o)}}function ee(e){if(!1!==n.enabled&&!1!==n.enablePan){let t=!1;switch(e.code){case n.keys.UP:V(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:V(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:V(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:V(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}}function et(e){!1!==n.enabled&&e.preventDefault()}function en(e){let t=T[e.pointerId];void 0===t&&(t=new a.Vector2,T[e.pointerId]=t),t.set(e.pageX,e.pageY)}function er(e){return T[(e.pointerId===j[0].pointerId?j[1]:j[0]).pointerId]}this.dollyIn=(e=z())=>{k(d*e),n.update()},this.dollyOut=(e=z())=>{k(d/e),n.update()},this.getScale=()=>d,this.setScale=e=>{k(e),n.update()},this.getZoomScale=()=>z(),void 0!==t&&this.connect(t),this.update()}}let g=o.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:a,enableDamping:s=!0,keyEvents:l=!1,onChange:u,onStart:c,onEnd:f,...d},h)=>{let p=(0,i.C)(e=>e.invalidate),m=(0,i.C)(e=>e.camera),v=(0,i.C)(e=>e.gl),b=(0,i.C)(e=>e.events),g=(0,i.C)(e=>e.setEvents),w=(0,i.C)(e=>e.set),x=(0,i.C)(e=>e.get),E=(0,i.C)(e=>e.performance),_=t||m,S=a||b.connected||v.domElement,A=o.useMemo(()=>new y(_),[_]);return(0,i.D)(()=>{A.enabled&&A.update()},-1),o.useEffect(()=>(l&&A.connect(!0===l?S:l),A.connect(S),()=>void A.dispose()),[l,S,n,A,p]),o.useEffect(()=>{let e=e=>{p(),n&&E.regress(),u&&u(e)},t=e=>{c&&c(e)},r=e=>{f&&f(e)};return A.addEventListener("change",e),A.addEventListener("start",t),A.addEventListener("end",r),()=>{A.removeEventListener("start",t),A.removeEventListener("end",r),A.removeEventListener("change",e)}},[u,c,f,A,p,g]),o.useEffect(()=>{if(e){let e=x().controls;return w({controls:A}),()=>w({controls:e})}},[e,A]),o.createElement("primitive",(0,r.A)({ref:h,object:A,enableDamping:s},d))})},5643:(e,t,n)=>{e.exports=n(6115)},5715:(e,t,n)=>{n.d(t,{X:()=>o});var r=n(2115),i=n(6990);function o({pixelated:e}){let t=(0,i.C)(e=>e.gl),n=(0,i.C)(e=>e.internal.active),o=(0,i.C)(e=>e.performance.current),a=(0,i.C)(e=>e.viewport.initialDpr),s=(0,i.C)(e=>e.setDpr);return r.useEffect(()=>{let r=t.domElement;return()=>{n&&s(a),e&&r&&(r.style.imageRendering="auto")}},[]),r.useEffect(()=>{s(o*a),e&&t.domElement&&(t.domElement.style.imageRendering=1===o?"auto":"pixelated")},[o]),null}},6115:(e,t,n)=>{var r=n(2115),i=n(9033),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=i.useSyncExternalStore,s=r.useRef,l=r.useEffect,u=r.useMemo,c=r.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var f=s(null);if(null===f.current){var d={hasValue:!1,value:null};f.current=d}else d=f.current;var h=a(e,(f=u(function(){function e(e){if(!l){if(l=!0,a=e,e=r(e),void 0!==i&&d.hasValue){var t=d.value;if(i(t,e))return s=t}return s=e}if(t=s,o(a,e))return t;var n=r(e);return void 0!==i&&i(t,n)?(a=e,t):(a=e,s=n)}var a,s,l=!1,u=void 0===n?null:n;return[function(){return e(t())},null===u?void 0:function(){return e(u())}]},[t,n,r,i]))[0],f[1]);return l(function(){d.hasValue=!0,d.value=h},[h]),c(h),h}},6354:(e,t,n)=>{n.d(t,{Af:()=>s,Nz:()=>i,u5:()=>l,y3:()=>f});var r=n(2115);function i(e,t,n){if(!e)return;if(!0===n(e))return e;let r=t?e.return:e.child;for(;r;){let e=i(r,t,n);if(e)return e;r=t?null:r.sibling}}function o(e){try{return Object.defineProperties(e,{_currentRenderer:{get:()=>null,set(){}},_currentRenderer2:{get:()=>null,set(){}}})}catch(t){return e}}(()=>{var e,t;return"undefined"!=typeof window&&((null==(e=window.document)?void 0:e.createElement)||(null==(t=window.navigator)?void 0:t.product)==="ReactNative")})()?r.useLayoutEffect:r.useEffect;let a=o(r.createContext(null));class s extends r.Component{render(){return r.createElement(a.Provider,{value:this._reactInternals},this.props.children)}}function l(){let e=r.useContext(a);if(null===e)throw Error("its-fine: useFiber must be called within a <FiberProvider />!");let t=r.useId();return r.useMemo(()=>{for(let n of[e,null==e?void 0:e.alternate]){if(!n)continue;let e=i(n,!1,e=>{let n=e.memoizedState;for(;n;){if(n.memoizedState===t)return!0;n=n.next}});if(e)return e}},[e,t])}let u=Symbol.for("react.context"),c=e=>null!==e&&"object"==typeof e&&"$$typeof"in e&&e.$$typeof===u;function f(){let e=function(){let e=l(),[t]=r.useState(()=>new Map);t.clear();let n=e;for(;n;){let e=n.type;c(e)&&e!==a&&!t.has(e)&&t.set(e,r.use(o(e))),n=n.return}return t}();return r.useMemo(()=>Array.from(e.keys()).reduce((t,n)=>i=>r.createElement(t,null,r.createElement(n.Provider,{...i,value:e.get(n)})),e=>r.createElement(s,{...e})),[e])}},6892:(e,t)=>{function n(e,t){var n=e.length;for(e.push(t);0<n;){var r=n-1>>>1,i=e[r];if(0<o(i,t))e[r]=t,e[n]=i,n=r;else break}}function r(e){return 0===e.length?null:e[0]}function i(e){if(0===e.length)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;for(var r=0,i=e.length,a=i>>>1;r<a;){var s=2*(r+1)-1,l=e[s],u=s+1,c=e[u];if(0>o(l,n))u<i&&0>o(c,l)?(e[r]=c,e[u]=n,r=u):(e[r]=l,e[s]=n,r=s);else if(u<i&&0>o(c,n))e[r]=c,e[u]=n,r=u;else break}}return t}function o(e,t){var n=e.sortIndex-t.sortIndex;return 0!==n?n:e.id-t.id}if(t.unstable_now=void 0,"object"==typeof performance&&"function"==typeof performance.now){var a,s=performance;t.unstable_now=function(){return s.now()}}else{var l=Date,u=l.now();t.unstable_now=function(){return l.now()-u}}var c=[],f=[],d=1,h=null,p=3,m=!1,v=!1,b=!1,y=!1,g="function"==typeof setTimeout?setTimeout:null,w="function"==typeof clearTimeout?clearTimeout:null,x="undefined"!=typeof setImmediate?setImmediate:null;function E(e){for(var t=r(f);null!==t;){if(null===t.callback)i(f);else if(t.startTime<=e)i(f),t.sortIndex=t.expirationTime,n(c,t);else break;t=r(f)}}function _(e){if(b=!1,E(e),!v)if(null!==r(c))v=!0,S||(S=!0,a());else{var t=r(f);null!==t&&T(_,t.startTime-e)}}var S=!1,A=-1,M=5,P=-1;function O(){return!!y||!(t.unstable_now()-P<M)}function C(){if(y=!1,S){var e=t.unstable_now();P=e;var n=!0;try{e:{v=!1,b&&(b=!1,w(A),A=-1),m=!0;var o=p;try{t:{for(E(e),h=r(c);null!==h&&!(h.expirationTime>e&&O());){var s=h.callback;if("function"==typeof s){h.callback=null,p=h.priorityLevel;var l=s(h.expirationTime<=e);if(e=t.unstable_now(),"function"==typeof l){h.callback=l,E(e),n=!0;break t}h===r(c)&&i(c),E(e)}else i(c);h=r(c)}if(null!==h)n=!0;else{var u=r(f);null!==u&&T(_,u.startTime-e),n=!1}}break e}finally{h=null,p=o,m=!1}}}finally{n?a():S=!1}}}if("function"==typeof x)a=function(){x(C)};else if("undefined"!=typeof MessageChannel){var L=new MessageChannel,j=L.port2;L.port1.onmessage=C,a=function(){j.postMessage(null)}}else a=function(){g(C,0)};function T(e,n){A=g(function(){e(t.unstable_now())},n)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):M=0<e?Math.floor(1e3/e):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_next=function(e){switch(p){case 1:case 2:case 3:var t=3;break;default:t=p}var n=p;p=t;try{return e()}finally{p=n}},t.unstable_requestPaint=function(){y=!0},t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=p;p=e;try{return t()}finally{p=n}},t.unstable_scheduleCallback=function(e,i,o){var s=t.unstable_now();switch(o="object"==typeof o&&null!==o&&"number"==typeof(o=o.delay)&&0<o?s+o:s,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=0x3fffffff;break;case 4:l=1e4;break;default:l=5e3}return l=o+l,e={id:d++,callback:i,priorityLevel:e,startTime:o,expirationTime:l,sortIndex:-1},o>s?(e.sortIndex=o,n(f,e),null===r(c)&&e===r(f)&&(b?(w(A),A=-1):b=!0,T(_,o-s))):(e.sortIndex=l,n(c,e),v||m||(v=!0,S||(S=!0,a()))),e},t.unstable_shouldYield=O,t.unstable_wrapCallback=function(e){var t=p;return function(){var n=p;p=t;try{return e.apply(this,arguments)}finally{p=n}}}},7558:(e,t,n)=>{n.d(t,{Hl:()=>d});var r=n(6990),i=n(2115),o=n(7431);function a(e,t){let n;return(...r)=>{window.clearTimeout(n),n=window.setTimeout(()=>e(...r),t)}}let s=["x","y","top","bottom","left","right","width","height"],l=(e,t)=>s.every(n=>e[n]===t[n]);var u=n(6354),c=n(5155);function f({ref:e,children:t,fallback:n,resize:s,style:u,gl:f,events:d=r.f,eventSource:h,eventPrefix:p,shadows:m,linear:v,flat:b,legacy:y,orthographic:g,frameloop:w,dpr:x,performance:E,raycaster:_,camera:S,scene:A,onPointerMissed:M,onCreated:P,...O}){i.useMemo(()=>(0,r.e)(o),[]);let C=(0,r.u)(),[L,j]=function({debounce:e,scroll:t,polyfill:n,offsetSize:r}={debounce:0,scroll:!1,offsetSize:!1}){var o,s,u;let c=n||("undefined"==typeof window?class{}:window.ResizeObserver);if(!c)throw Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");let[f,d]=(0,i.useState)({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),h=(0,i.useRef)({element:null,scrollContainers:null,resizeObserver:null,lastBounds:f,orientationHandler:null}),p=e?"number"==typeof e?e:e.scroll:null,m=e?"number"==typeof e?e:e.resize:null,v=(0,i.useRef)(!1);(0,i.useEffect)(()=>(v.current=!0,()=>void(v.current=!1)));let[b,y,g]=(0,i.useMemo)(()=>{let e=()=>{if(!h.current.element)return;let{left:e,top:t,width:n,height:i,bottom:o,right:a,x:s,y:u}=h.current.element.getBoundingClientRect(),c={left:e,top:t,width:n,height:i,bottom:o,right:a,x:s,y:u};h.current.element instanceof HTMLElement&&r&&(c.height=h.current.element.offsetHeight,c.width=h.current.element.offsetWidth),Object.freeze(c),v.current&&!l(h.current.lastBounds,c)&&d(h.current.lastBounds=c)};return[e,m?a(e,m):e,p?a(e,p):e]},[d,r,p,m]);function w(){h.current.scrollContainers&&(h.current.scrollContainers.forEach(e=>e.removeEventListener("scroll",g,!0)),h.current.scrollContainers=null),h.current.resizeObserver&&(h.current.resizeObserver.disconnect(),h.current.resizeObserver=null),h.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",h.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",h.current.orientationHandler))}function x(){h.current.element&&(h.current.resizeObserver=new c(g),h.current.resizeObserver.observe(h.current.element),t&&h.current.scrollContainers&&h.current.scrollContainers.forEach(e=>e.addEventListener("scroll",g,{capture:!0,passive:!0})),h.current.orientationHandler=()=>{g()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",h.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",h.current.orientationHandler))}return o=g,s=!!t,(0,i.useEffect)(()=>{if(s)return window.addEventListener("scroll",o,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",o,!0)},[o,s]),u=y,(0,i.useEffect)(()=>(window.addEventListener("resize",u),()=>void window.removeEventListener("resize",u)),[u]),(0,i.useEffect)(()=>{w(),x()},[t,g,y]),(0,i.useEffect)(()=>w,[]),[e=>{e&&e!==h.current.element&&(w(),h.current.element=e,h.current.scrollContainers=function e(t){let n=[];if(!t||t===document.body)return n;let{overflow:r,overflowX:i,overflowY:o}=window.getComputedStyle(t);return[r,i,o].some(e=>"auto"===e||"scroll"===e)&&n.push(t),[...n,...e(t.parentElement)]}(e),x())},f,b]}({scroll:!0,debounce:{scroll:50,resize:0},...s}),T=i.useRef(null),z=i.useRef(null);i.useImperativeHandle(e,()=>T.current);let R=(0,r.a)(M),[U,D]=i.useState(!1),[I,V]=i.useState(!1);if(U)throw U;if(I)throw I;let k=i.useRef(null);(0,r.b)(()=>{let e=T.current;j.width>0&&j.height>0&&e&&(k.current||(k.current=(0,r.c)(e)),async function(){await k.current.configure({gl:f,scene:A,events:d,shadows:m,linear:v,flat:b,legacy:y,orthographic:g,frameloop:w,dpr:x,performance:E,raycaster:_,camera:S,size:j,onPointerMissed:(...e)=>null==R.current?void 0:R.current(...e),onCreated:e=>{null==e.events.connect||e.events.connect(h?(0,r.i)(h)?h.current:h:z.current),p&&e.setEvents({compute:(e,t)=>{let n=e[p+"X"],r=e[p+"Y"];t.pointer.set(n/t.size.width*2-1,-(2*(r/t.size.height))+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),null==P||P(e)}}),k.current.render((0,c.jsx)(C,{children:(0,c.jsx)(r.E,{set:V,children:(0,c.jsx)(i.Suspense,{fallback:(0,c.jsx)(r.B,{set:D}),children:null!=t?t:null})})}))}())}),i.useEffect(()=>{let e=T.current;if(e)return()=>(0,r.d)(e)},[]);let B=h?"none":"auto";return(0,c.jsx)("div",{ref:z,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:B,...u},...O,children:(0,c.jsx)("div",{ref:L,style:{width:"100%",height:"100%"},children:(0,c.jsx)("canvas",{ref:T,style:{display:"block"},children:n})})})}function d(e){return(0,c.jsx)(u.Af,{children:(0,c.jsx)(f,{...e})})}n(2407)},7892:(e,t,n)=>{n.d(t,{X:()=>b});var r=n(6990),i=n(2115),o=n(7431),a=Object.defineProperty,s=(e,t,n)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,l=(e,t,n)=>(s(e,"symbol"!=typeof t?t+"":t,n),n);function u(e,t,n,r,i){let o;if(e=e.subarray||e.slice?e:e.buffer,n=n.subarray||n.slice?n:n.buffer,e=t?e.subarray?e.subarray(t,i&&t+i):e.slice(t,i&&t+i):e,n.set)n.set(e,r);else for(o=0;o<e.length;o++)n[o+r]=e[o];return n}class c extends o.BufferGeometry{constructor(){super(),l(this,"type","MeshLine"),l(this,"isMeshLine",!0),l(this,"positions",[]),l(this,"previous",[]),l(this,"next",[]),l(this,"side",[]),l(this,"width",[]),l(this,"indices_array",[]),l(this,"uvs",[]),l(this,"counters",[]),l(this,"widthCallback",null),l(this,"_attributes"),l(this,"_points",[]),l(this,"points"),l(this,"matrixWorld",new o.Matrix4),Object.defineProperties(this,{points:{enumerable:!0,get(){return this._points},set(e){this.setPoints(e,this.widthCallback)}}})}setMatrixWorld(e){this.matrixWorld=e}setPoints(e,t){var n;if(e=(n=e)instanceof Float32Array?n:n instanceof o.BufferGeometry?n.getAttribute("position").array:n.map(e=>{let t=Array.isArray(e);return e instanceof o.Vector3?[e.x,e.y,e.z]:e instanceof o.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e}).flat(),this._points=e,this.widthCallback=null!=t?t:null,this.positions=[],this.counters=[],e.length&&e[0]instanceof o.Vector3)for(let t=0;t<e.length;t++){let n=e[t],r=t/(e.length-1);this.positions.push(n.x,n.y,n.z),this.positions.push(n.x,n.y,n.z),this.counters.push(r),this.counters.push(r)}else for(let t=0;t<e.length;t+=3){let n=t/(e.length-1);this.positions.push(e[t],e[t+1],e[t+2]),this.positions.push(e[t],e[t+1],e[t+2]),this.counters.push(n),this.counters.push(n)}this.process()}compareV3(e,t){let n=6*e,r=6*t;return this.positions[n]===this.positions[r]&&this.positions[n+1]===this.positions[r+1]&&this.positions[n+2]===this.positions[r+2]}copyV3(e){let t=6*e;return[this.positions[t],this.positions[t+1],this.positions[t+2]]}process(){let e,t,n=this.positions.length/6;this.previous=[],this.next=[],this.side=[],this.width=[],this.indices_array=[],this.uvs=[],t=this.compareV3(0,n-1)?this.copyV3(n-2):this.copyV3(0),this.previous.push(t[0],t[1],t[2]),this.previous.push(t[0],t[1],t[2]);for(let r=0;r<n;r++){if(this.side.push(1),this.side.push(-1),e=this.widthCallback?this.widthCallback(r/(n-1)):1,this.width.push(e),this.width.push(e),this.uvs.push(r/(n-1),0),this.uvs.push(r/(n-1),1),r<n-1){t=this.copyV3(r),this.previous.push(t[0],t[1],t[2]),this.previous.push(t[0],t[1],t[2]);let e=2*r;this.indices_array.push(e,e+1,e+2),this.indices_array.push(e+2,e+1,e+3)}r>0&&(t=this.copyV3(r),this.next.push(t[0],t[1],t[2]),this.next.push(t[0],t[1],t[2]))}t=this.compareV3(n-1,0)?this.copyV3(1):this.copyV3(n-1),this.next.push(t[0],t[1],t[2]),this.next.push(t[0],t[1],t[2]),this._attributes&&this._attributes.position.count===this.counters.length?(this._attributes.position.copyArray(new Float32Array(this.positions)),this._attributes.position.needsUpdate=!0,this._attributes.previous.copyArray(new Float32Array(this.previous)),this._attributes.previous.needsUpdate=!0,this._attributes.next.copyArray(new Float32Array(this.next)),this._attributes.next.needsUpdate=!0,this._attributes.side.copyArray(new Float32Array(this.side)),this._attributes.side.needsUpdate=!0,this._attributes.width.copyArray(new Float32Array(this.width)),this._attributes.width.needsUpdate=!0,this._attributes.uv.copyArray(new Float32Array(this.uvs)),this._attributes.uv.needsUpdate=!0,this._attributes.index.copyArray(new Uint16Array(this.indices_array)),this._attributes.index.needsUpdate=!0):this._attributes={position:new o.BufferAttribute(new Float32Array(this.positions),3),previous:new o.BufferAttribute(new Float32Array(this.previous),3),next:new o.BufferAttribute(new Float32Array(this.next),3),side:new o.BufferAttribute(new Float32Array(this.side),1),width:new o.BufferAttribute(new Float32Array(this.width),1),uv:new o.BufferAttribute(new Float32Array(this.uvs),2),index:new o.BufferAttribute(new Uint16Array(this.indices_array),1),counters:new o.BufferAttribute(new Float32Array(this.counters),1)},this.setAttribute("position",this._attributes.position),this.setAttribute("previous",this._attributes.previous),this.setAttribute("next",this._attributes.next),this.setAttribute("side",this._attributes.side),this.setAttribute("width",this._attributes.width),this.setAttribute("uv",this._attributes.uv),this.setAttribute("counters",this._attributes.counters),this.setAttribute("position",this._attributes.position),this.setAttribute("previous",this._attributes.previous),this.setAttribute("next",this._attributes.next),this.setAttribute("side",this._attributes.side),this.setAttribute("width",this._attributes.width),this.setAttribute("uv",this._attributes.uv),this.setAttribute("counters",this._attributes.counters),this.setIndex(this._attributes.index),this.computeBoundingSphere(),this.computeBoundingBox()}advance({x:e,y:t,z:n}){let r=this._attributes.position.array,i=this._attributes.previous.array,o=this._attributes.next.array,a=r.length;u(r,0,i,0,a),u(r,6,r,0,a-6),r[a-6]=e,r[a-5]=t,r[a-4]=n,r[a-3]=e,r[a-2]=t,r[a-1]=n,u(r,6,o,0,a-6),o[a-6]=e,o[a-5]=t,o[a-4]=n,o[a-3]=e,o[a-2]=t,o[a-1]=n,this._attributes.position.needsUpdate=!0,this._attributes.previous.needsUpdate=!0,this._attributes.next.needsUpdate=!0}}let f=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  #include <fog_pars_vertex>
  #include <clipping_planes_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;
  
  uniform vec2 resolution;
  uniform float lineWidth;
  uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
  }
  
  void main() {
    float aspect = resolution.x / resolution.y;
    vColor = vec4(color, opacity);
    vUV = uv;
    vCounters = counters;
  
    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0) * aspect;
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);
  
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);
  
    float w = lineWidth * width;
  
    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);
  
      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp(w / dot(miter, perp), 0., 4. * lineWidth * width);
    }
  
    //vec2 normal = (cross(vec3(dir, 0.), vec3(0., 0., 1.))).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * w;
    //normal *= projectionMatrix;
    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy * aspect;
    }
  
    finalPosition.xy += normal.xy * side;
    gl_Position = finalPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    #include <clipping_planes_vertex>
    #include <fog_vertex>
  }
`,d=parseInt(o.REVISION.replace(/\D+/g,"")),h=`
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;
  uniform float useGradient;
  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  uniform vec3 gradient[2];
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  void main() {
    #include <logdepthbuf_fragment>
    vec4 diffuseColor = vColor;
    if (useGradient == 1.) diffuseColor = vec4(mix(gradient[0], gradient[1], vCounters), 1.0);
    if (useMap == 1.) diffuseColor *= texture2D(map, vUV * repeat);
    if (useAlphaMap == 1.) diffuseColor.a *= texture2D(alphaMap, vUV * repeat).a;
    if (diffuseColor.a < alphaTest) discard;
    if (useDash == 1.) diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
    diffuseColor.a *= step(vCounters, visibility);
    #include <clipping_planes_fragment>
    gl_FragColor = diffuseColor;     
    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <${d>=154?"colorspace_fragment":"encodings_fragment"}>
  }
`;class p extends o.ShaderMaterial{constructor(e){super({uniforms:{...o.UniformsLib.fog,lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},color:{value:new o.Color(0xffffff)},gradient:{value:[new o.Color(0xff0000),new o.Color(65280)]},opacity:{value:1},resolution:{value:new o.Vector2(1,1)},sizeAttenuation:{value:1},dashArray:{value:0},dashOffset:{value:0},dashRatio:{value:.5},useDash:{value:0},useGradient:{value:0},visibility:{value:1},alphaTest:{value:0},repeat:{value:new o.Vector2(1,1)}},vertexShader:f,fragmentShader:h}),l(this,"lineWidth"),l(this,"map"),l(this,"useMap"),l(this,"alphaMap"),l(this,"useAlphaMap"),l(this,"color"),l(this,"gradient"),l(this,"resolution"),l(this,"sizeAttenuation"),l(this,"dashArray"),l(this,"dashOffset"),l(this,"dashRatio"),l(this,"useDash"),l(this,"useGradient"),l(this,"visibility"),l(this,"repeat"),this.type="MeshLineMaterial",Object.defineProperties(this,{lineWidth:{enumerable:!0,get(){return this.uniforms.lineWidth.value},set(e){this.uniforms.lineWidth.value=e}},map:{enumerable:!0,get(){return this.uniforms.map.value},set(e){this.uniforms.map.value=e}},useMap:{enumerable:!0,get(){return this.uniforms.useMap.value},set(e){this.uniforms.useMap.value=e}},alphaMap:{enumerable:!0,get(){return this.uniforms.alphaMap.value},set(e){this.uniforms.alphaMap.value=e}},useAlphaMap:{enumerable:!0,get(){return this.uniforms.useAlphaMap.value},set(e){this.uniforms.useAlphaMap.value=e}},color:{enumerable:!0,get(){return this.uniforms.color.value},set(e){this.uniforms.color.value=e}},gradient:{enumerable:!0,get(){return this.uniforms.gradient.value},set(e){this.uniforms.gradient.value=e}},opacity:{enumerable:!0,get(){return this.uniforms.opacity.value},set(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get(){return this.uniforms.resolution.value},set(e){this.uniforms.resolution.value.copy(e)}},sizeAttenuation:{enumerable:!0,get(){return this.uniforms.sizeAttenuation.value},set(e){this.uniforms.sizeAttenuation.value=e}},dashArray:{enumerable:!0,get(){return this.uniforms.dashArray.value},set(e){this.uniforms.dashArray.value=e,this.useDash=+(0!==e)}},dashOffset:{enumerable:!0,get(){return this.uniforms.dashOffset.value},set(e){this.uniforms.dashOffset.value=e}},dashRatio:{enumerable:!0,get(){return this.uniforms.dashRatio.value},set(e){this.uniforms.dashRatio.value=e}},useDash:{enumerable:!0,get(){return this.uniforms.useDash.value},set(e){this.uniforms.useDash.value=e}},useGradient:{enumerable:!0,get(){return this.uniforms.useGradient.value},set(e){this.uniforms.useGradient.value=e}},visibility:{enumerable:!0,get(){return this.uniforms.visibility.value},set(e){this.uniforms.visibility.value=e}},alphaTest:{enumerable:!0,get(){return this.uniforms.alphaTest.value},set(e){this.uniforms.alphaTest.value=e}},repeat:{enumerable:!0,get(){return this.uniforms.repeat.value},set(e){this.uniforms.repeat.value.copy(e)}}}),this.setValues(e)}copy(e){return super.copy(e),this.lineWidth=e.lineWidth,this.map=e.map,this.useMap=e.useMap,this.alphaMap=e.alphaMap,this.useAlphaMap=e.useAlphaMap,this.color.copy(e.color),this.gradient=e.gradient,this.opacity=e.opacity,this.resolution.copy(e.resolution),this.sizeAttenuation=e.sizeAttenuation,this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this.dashRatio=e.dashRatio,this.useDash=e.useDash,this.useGradient=e.useGradient,this.visibility=e.visibility,this.alphaTest=e.alphaTest,this.repeat.copy(e.repeat),this}}let m={width:.2,length:1,decay:1,local:!1,stride:0,interval:1},v=(e,t=1)=>(e.set(e.subarray(t)),e.fill(-1/0,-t),e),b=i.forwardRef((e,t)=>{let{children:n}=e,{width:a,length:s,decay:l,local:u,stride:f,interval:d}={...m,...e},{color:h="hotpink",attenuation:b,target:y}=e,g=(0,r.C)(e=>e.size),w=(0,r.C)(e=>e.scene),x=i.useRef(null),[E,_]=i.useState(null),S=function(e,t){let{length:n,local:a,decay:s,interval:l,stride:u}={...m,...t},c=i.useRef(null),[f]=i.useState(()=>new o.Vector3);i.useLayoutEffect(()=>{e&&(c.current=Float32Array.from({length:10*n*3},(t,n)=>e.position.getComponent(n%3)))},[n,e]);let d=i.useRef(new o.Vector3),h=i.useRef(0);return(0,r.D)(()=>{if(e&&c.current){if(0===h.current){let t;a?t=e.position:(e.getWorldPosition(f),t=f);let n=+s;for(let e=0;e<n;e++)t.distanceTo(d.current)<u||(v(c.current,3),c.current.set(t.toArray(),c.current.length-3));d.current.copy(t)}h.current++,h.current=h.current%l}}),c}(E,{length:s,decay:l,local:u,stride:f,interval:d});i.useEffect(()=>{let e=(null==y?void 0:y.current)||x.current.children.find(e=>e instanceof o.Object3D);e&&_(e)},[S,y]);let A=i.useMemo(()=>new c,[]),M=i.useMemo(()=>{var e,t;let r,i=new p({lineWidth:.1*a,color:h,sizeAttenuation:1,resolution:new o.Vector2(g.width,g.height)});return n&&(Array.isArray(n)?r=n.find(e=>"string"==typeof e.type&&"meshLineMaterial"===e.type):"string"==typeof n.type&&"meshLineMaterial"===n.type&&(r=n)),"object"==typeof(null==(e=r)?void 0:e.props)&&(null==(t=r)?void 0:t.props)!==null&&i.setValues(r.props),i},[a,h,g,n]);return i.useEffect(()=>{M.uniforms.resolution.value.set(g.width,g.height)},[g]),(0,r.D)(()=>{S.current&&A.setPoints(S.current,b)}),i.createElement("group",null,(0,r.o)(i.createElement("mesh",{ref:t,geometry:A,material:M}),w),i.createElement("group",{ref:x},n))})},8092:(e,t,n)=>{let r,i;n.d(t,{N:()=>T});var o=n(9630),a=n(2115),s=n(7431),l=n(6990);let u=new s.Box3,c=new s.Vector3;class f extends s.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new s.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new s.InterleavedBufferAttribute(n,3,0)),this.setAttribute("instanceEnd",new s.InterleavedBufferAttribute(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new s.InstancedInterleavedBuffer(n,2*t,1);return this.setAttribute("instanceColorStart",new s.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new s.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),u.setFromBufferAttribute(t),this.boundingBox.union(u))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,o=e.count;i<o;i++)c.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(c)),c.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}let d=parseInt(s.REVISION.replace(/\D+/g,""));class h extends s.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:s.UniformsUtils.clone(s.UniformsUtils.merge([s.UniformsLib.common,s.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${d>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let p=d>=125?"uv1":"uv2",m=new s.Vector4,v=new s.Vector3,b=new s.Vector3,y=new s.Vector4,g=new s.Vector4,w=new s.Vector4,x=new s.Vector3,E=new s.Matrix4,_=new s.Line3,S=new s.Vector3,A=new s.Box3,M=new s.Sphere,P=new s.Vector4;function O(e,t,n){return P.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),P.multiplyScalar(1/P.w),P.x=i/n.width,P.y=i/n.height,P.applyMatrix4(e.projectionMatrixInverse),P.multiplyScalar(1/P.w),Math.abs(Math.max(P.x,P.y))}class C extends s.Mesh{constructor(e=new f,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)v.fromBufferAttribute(t,e),b.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+v.distanceTo(b);let i=new s.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(i,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(i,1,1)),this}raycast(e,t){let n,o,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let u=void 0!==e.params.Line2&&e.params.Line2.threshold||0;r=e.ray;let c=this.matrixWorld,f=this.geometry,d=this.material;if(i=d.linewidth+u,null===f.boundingSphere&&f.computeBoundingSphere(),M.copy(f.boundingSphere).applyMatrix4(c),a)n=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(r.origin));n=O(l,e,d.resolution)}if(M.radius+=n,!1!==r.intersectsSphere(M)){if(null===f.boundingBox&&f.computeBoundingBox(),A.copy(f.boundingBox).applyMatrix4(c),a)o=.5*i;else{let e=Math.max(l.near,A.distanceToPoint(r.origin));o=O(l,e,d.resolution)}A.expandByScalar(o),!1!==r.intersectsBox(A)&&(a?function(e,t){let n=e.matrixWorld,o=e.geometry,a=o.attributes.instanceStart,l=o.attributes.instanceEnd,u=Math.min(o.instanceCount,a.count);for(let o=0;o<u;o++){_.start.fromBufferAttribute(a,o),_.end.fromBufferAttribute(l,o),_.applyMatrix4(n);let u=new s.Vector3,c=new s.Vector3;r.distanceSqToSegment(_.start,_.end,c,u),c.distanceTo(u)<.5*i&&t.push({point:c,pointOnLine:u,distance:r.origin.distanceTo(c),object:e,face:null,faceIndex:o,uv:null,[p]:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,u=e.geometry,c=u.attributes.instanceStart,f=u.attributes.instanceEnd,d=Math.min(u.instanceCount,c.count),h=-t.near;r.at(1,w),w.w=1,w.applyMatrix4(t.matrixWorldInverse),w.applyMatrix4(o),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,x.copy(w),E.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<d;t++){if(y.fromBufferAttribute(c,t),g.fromBufferAttribute(f,t),y.w=1,g.w=1,y.applyMatrix4(E),g.applyMatrix4(E),y.z>h&&g.z>h)continue;if(y.z>h){let e=y.z-g.z,t=(y.z-h)/e;y.lerp(g,t)}else if(g.z>h){let e=g.z-y.z,t=(g.z-h)/e;g.lerp(y,t)}y.applyMatrix4(o),g.applyMatrix4(o),y.multiplyScalar(1/y.w),g.multiplyScalar(1/g.w),y.x*=a.x/2,y.y*=a.y/2,g.x*=a.x/2,g.y*=a.y/2,_.start.copy(y),_.start.z=0,_.end.copy(g),_.end.z=0;let u=_.closestPointToPointParameter(x,!0);_.at(u,S);let d=s.MathUtils.lerp(y.z,g.z,u),m=d>=-1&&d<=1,v=x.distanceTo(S)<.5*i;if(m&&v){_.start.fromBufferAttribute(c,t),_.end.fromBufferAttribute(f,t),_.start.applyMatrix4(l),_.end.applyMatrix4(l);let i=new s.Vector3,o=new s.Vector3;r.distanceSqToSegment(_.start,_.end,o,i),n.push({point:o,pointOnLine:i,distance:r.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,[p]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(m),this.material.uniforms.resolution.value.set(m.z,m.w))}}class L extends f{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(3===t)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class j extends C{constructor(e=new L,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let T=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:r,lineWidth:i,segments:u,dashed:c,...d},p){var m,v;let b=(0,l.C)(e=>e.size),y=a.useMemo(()=>u?new C:new j,[u]),[g]=a.useState(()=>new h),w=(null==n||null==(m=n[0])?void 0:m.length)===4?4:3,x=a.useMemo(()=>{let r=u?new f:new L,i=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),w)}return r},[e,u,n,w]);return a.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),a.useLayoutEffect(()=>{c?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[c,g]),a.useEffect(()=>()=>{x.dispose(),g.dispose()},[x]),a.createElement("primitive",(0,o.A)({object:y,ref:p},d),a.createElement("primitive",{object:x,attach:"geometry"}),a.createElement("primitive",(0,o.A)({object:g,attach:"material",color:t,vertexColors:!!n,resolution:[b.width,b.height],linewidth:null!=(v=null!=r?r:i)?v:1,dashed:c,transparent:4===w},d)))})},8358:(e,t,n)=>{n.d(t,{o:()=>i});var r=n(7431);class i{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}new r.OrthographicCamera(-1,1,1,-1,0,1);class o extends r.BufferGeometry{constructor(){super(),this.setAttribute("position",new r.Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new r.Float32BufferAttribute([0,2,0,0,2,0],2))}}new o},9033:(e,t,n)=>{e.exports=n(2436)},9630:(e,t,n)=>{n.d(t,{A:()=>r});function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(null,arguments)}},9957:(e,t,n)=>{let r,i;n.d(t,{E:()=>g});var o=n(9630),a=n(2115),s=n(2669),l=n(7431),u=n(6990);let c=new l.Vector3,f=new l.Vector3,d=new l.Vector3,h=new l.Vector2;function p(e,t,n){let r=c.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,o=n.height/2;return[r.x*i+i,-(r.y*o)+o]}let m=e=>1e-10>Math.abs(e)?0:e;function v(e,t,n=""){let r="matrix3d(";for(let n=0;16!==n;n++)r+=m(t[n]*e.elements[n])+(15!==n?",":")");return n+r}let b=(r=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,r)),y=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,i(t),"translate(-50%,-50%)")),g=a.forwardRef(({children:e,eps:t=.001,style:n,className:r,prepend:i,center:v,fullscreen:g,portal:w,distanceFactor:x,sprite:E=!1,transform:_=!1,occlude:S,onOcclude:A,castShadow:M,receiveShadow:P,material:O,geometry:C,zIndexRange:L=[0x1000037,0],calculatePosition:j=p,as:T="div",wrapperClass:z,pointerEvents:R="auto",...U},D)=>{let{gl:I,camera:V,scene:k,size:B,raycaster:N,events:H,viewport:F}=(0,u.C)(),[W]=a.useState(()=>document.createElement(T)),Y=a.useRef(null),G=a.useRef(null),X=a.useRef(0),$=a.useRef([0,0]),Z=a.useRef(null),q=a.useRef(null),K=(null==w?void 0:w.current)||H.connected||I.domElement.parentNode,Q=a.useRef(null),J=a.useRef(!1),ee=a.useMemo(()=>S&&"blending"!==S||Array.isArray(S)&&S.length&&function(e){return e&&"object"==typeof e&&"current"in e}(S[0]),[S]);a.useLayoutEffect(()=>{let e=I.domElement;S&&"blending"===S?(e.style.zIndex=`${Math.floor(L[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[S]),a.useLayoutEffect(()=>{if(G.current){let e=Y.current=s.createRoot(W);if(k.updateMatrixWorld(),_)W.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=j(G.current,V,B);W.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return K&&(i?K.prepend(W):K.appendChild(W)),()=>{K&&K.removeChild(W),e.unmount()}}},[K,_]),a.useLayoutEffect(()=>{z&&(W.className=z)},[z]);let et=a.useMemo(()=>_?{position:"absolute",top:0,left:0,width:B.width,height:B.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...g&&{top:-B.height/2,left:-B.width/2,width:B.width,height:B.height},...n},[n,v,g,B,_]),en=a.useMemo(()=>({position:"absolute",pointerEvents:R}),[R]);a.useLayoutEffect(()=>{var t,i;J.current=!1,_?null==(t=Y.current)||t.render(a.createElement("div",{ref:Z,style:et},a.createElement("div",{ref:q,style:en},a.createElement("div",{ref:D,className:r,style:n,children:e})))):null==(i=Y.current)||i.render(a.createElement("div",{ref:D,style:et,className:r,children:e}))});let er=a.useRef(!0);(0,u.D)(e=>{if(G.current){V.updateMatrixWorld(),G.current.updateWorldMatrix(!0,!1);let e=_?$.current:j(G.current,V,B);if(_||Math.abs(X.current-V.zoom)>t||Math.abs($.current[0]-e[0])>t||Math.abs($.current[1]-e[1])>t){let t=function(e,t){let n=c.setFromMatrixPosition(e.matrixWorld),r=f.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),o=t.getWorldDirection(d);return i.angleTo(o)>Math.PI/2}(G.current,V),n=!1;ee&&(Array.isArray(S)?n=S.map(e=>e.current):"blending"!==S&&(n=[k]));let r=er.current;n?er.current=function(e,t,n,r){let i=c.setFromMatrixPosition(e.matrixWorld),o=i.clone();o.project(t),h.set(o.x,o.y),n.setFromCamera(h,t);let a=n.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}(G.current,V,N,n)&&!t:er.current=!t,r!==er.current&&(A?A(!er.current):W.style.display=er.current?"block":"none");let i=Math.floor(L[0]/2),o=S?ee?[L[0],i]:[i-1,0]:L;if(W.style.zIndex=`${function(e,t,n){if(t instanceof l.PerspectiveCamera||t instanceof l.OrthographicCamera){let r=c.setFromMatrixPosition(e.matrixWorld),i=f.setFromMatrixPosition(t.matrixWorld),o=r.distanceTo(i),a=(n[1]-n[0])/(t.far-t.near),s=n[1]-a*t.far;return Math.round(a*o+s)}}(G.current,V,o)}`,_){let[e,t]=[B.width/2,B.height/2],n=V.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:o,bottom:a,right:s}=V,l=b(V.matrixWorldInverse),u=r?`scale(${n})translate(${m(-(s+o)/2)}px,${m((i+a)/2)}px)`:`translateZ(${n}px)`,c=G.current.matrixWorld;E&&((c=V.matrixWorldInverse.clone().transpose().copyPosition(c).scale(G.current.scale)).elements[3]=c.elements[7]=c.elements[11]=0,c.elements[15]=1),W.style.width=B.width+"px",W.style.height=B.height+"px",W.style.perspective=r?"":`${n}px`,Z.current&&q.current&&(Z.current.style.transform=`${u}${l}translate(${e}px,${t}px)`,q.current.style.transform=y(c,1/((x||10)/400)))}else{let t=void 0===x?1:function(e,t){if(t instanceof l.OrthographicCamera)return t.zoom;if(!(t instanceof l.PerspectiveCamera))return 1;{let n=c.setFromMatrixPosition(e.matrixWorld),r=f.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*n.distanceTo(r))}}(G.current,V)*x;W.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}$.current=e,X.current=V.zoom}}if(!ee&&Q.current&&!J.current)if(_){if(Z.current){let e=Z.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=V;if(t||C)U.scale&&(Array.isArray(U.scale)?U.scale instanceof l.Vector3?Q.current.scale.copy(U.scale.clone().divideScalar(1)):Q.current.scale.set(1/U.scale[0],1/U.scale[1],1/U.scale[2]):Q.current.scale.setScalar(1/U.scale));else{let t=(x||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;Q.current.scale.set(n,r,1)}J.current=!0}}}else{let t=W.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/F.factor,n=t.clientWidth*e,r=t.clientHeight*e;Q.current.scale.set(n,r,1),J.current=!0}Q.current.lookAt(e.camera.position)}});let ei=a.useMemo(()=>({vertexShader:_?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[_]);return a.createElement("group",(0,o.A)({},U,{ref:G}),S&&!ee&&a.createElement("mesh",{castShadow:M,receiveShadow:P,ref:Q},C||a.createElement("planeGeometry",null),O||a.createElement("shaderMaterial",{side:l.DoubleSide,vertexShader:ei.vertexShader,fragmentShader:ei.fragmentShader})))})}}]);
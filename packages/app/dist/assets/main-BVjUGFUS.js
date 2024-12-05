(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var Z,Le;class gt extends Error{}gt.prototype.name="InvalidTokenError";function Qs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ti(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Qs(t)}catch{return atob(t)}}function hs(r,t){if(typeof r!="string")throw new gt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new gt(`Invalid token specified: missing part #${e+1}`);let i;try{i=ti(s)}catch(n){throw new gt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new gt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ei="mu:context",oe=`${ei}:change`;class si{constructor(t,e){this._proxy=ii(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class de extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new si(t,this),this.style.display="contents"}attach(t){return this.addEventListener(oe,t),t}detach(t){this.removeEventListener(oe,t)}}function ii(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(oe,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ri(r,t){const e=us(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function us(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return us(r,i.host)}class ni extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ds(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ni(e,r))}class pe{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function oi(r){return t=>({...t,...r})}const ae="mu:auth:jwt",ps=class fs extends pe{constructor(t,e){super((s,i)=>this.update(s,i),t,fs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(li(s)),te(i);case"auth/signout":return e(ci()),te(this._redirectForLogin);case"auth/redirect":return te(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ps.EVENT_TYPE="auth:message";let ms=ps;const gs=ds(ms.EVENT_TYPE);function te(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class ai extends de{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=it.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ms(this.context,this.redirect).attach(this)}}class st{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ae),t}}class it extends st{constructor(t){super();const e=hs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new it(t);return localStorage.setItem(ae,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ae);return t?it.authenticate(t):new st}}function li(r){return oi({user:it.authenticate(r),token:r})}function ci(){return r=>{const t=r.user;return{user:t&&t.authenticated?st.deauthenticate(t):t,token:""}}}function hi(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function ui(r){return r.authenticated?hs(r.token||""):{}}const P=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:it,Provider:ai,User:st,dispatch:gs,headers:hi,payload:ui},Symbol.toStringTag,{value:"Module"}));function Ut(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function le(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ys=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:le,relay:Ut},Symbol.toStringTag,{value:"Module"}));function fe(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const di=new DOMParser;function W(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=di.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const h=f.parentNode;h==null||h.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return ze(a);case"bigint":case"boolean":case"number":case"symbol":return ze(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,h=a.map(l);return f.replaceChildren(...h),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ze(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Bt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}Z=class extends HTMLElement{constructor(){super(),this._state={},Bt(this).template(Z.template).styles(Z.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Ut(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},pi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},Z.template=W`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,Z.styles=fe`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function pi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const vs=class bs extends pe{constructor(t){super((e,s)=>this.update(e,s),t,bs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(mi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(gi(s,i));break}}}};vs.EVENT_TYPE="history:message";let me=vs;class Ie extends de{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=fi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ge(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new me(this.context).attach(this)}}function fi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function mi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function gi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ge=ds(me.EVENT_TYPE),Lt=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ie,Provider:Ie,Service:me,dispatch:ge},Symbol.toStringTag,{value:"Module"}));class F{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Me(this._provider,t);this._effects.push(i),e(i)}else ri(this._target,this._contextLabel).then(i=>{const n=new Me(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const _s=class $s extends HTMLElement{constructor(){super(),this._state={},this._user=new st,this._authObserver=new F(this,"blazing:auth"),Bt(this).template($s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;yi(i,this._state,e,this.authorization).then(n=>dt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},dt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&je(this.src,this.authorization).then(e=>{this._state=e,dt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&je(this.src,this.authorization).then(i=>{this._state=i,dt(i,this)});break;case"new":s&&(this._state={},dt({},this));break}}};_s.observedAttributes=["src","new","action"];_s.template=W`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function je(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function dt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function yi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ws=class xs extends pe{constructor(t,e){super(e,t,xs.EVENT_TYPE,!1)}};ws.EVENT_TYPE="mu:message";let Es=ws;class vi extends de{constructor(t,e,s){super(e),this._user=new st,this._updateFn=t,this._authObserver=new F(this,s)}connectedCallback(){const t=new Es(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const bi=Object.freeze(Object.defineProperty({__proto__:null,Provider:vi,Service:Es},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,ye=Tt.ShadowRoot&&(Tt.ShadyCSS===void 0||Tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),He=new WeakMap;let ks=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&He.set(e,t))}return t}toString(){return this.cssText}};const _i=r=>new ks(typeof r=="string"?r:r+"",void 0,ve),$i=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ks(e,r,ve)},wi=(r,t)=>{if(ye)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Tt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},De=ye?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return _i(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xi,defineProperty:Ei,getOwnPropertyDescriptor:ki,getOwnPropertyNames:Ai,getOwnPropertySymbols:Si,getPrototypeOf:Pi}=Object,rt=globalThis,We=rt.trustedTypes,Ci=We?We.emptyScript:"",Fe=rt.reactiveElementPolyfillSupport,yt=(r,t)=>r,zt={toAttribute(r,t){switch(t){case Boolean:r=r?Ci:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},be=(r,t)=>!xi(r,t),Be={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),rt.litPropertyMetadata??(rt.litPropertyMetadata=new WeakMap);let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ei(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=ki(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(yt("elementProperties")))return;const t=Pi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(yt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(yt("properties"))){const e=this.properties,s=[...Ai(e),...Si(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(De(i))}else t!==void 0&&e.push(De(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:zt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:zt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??be)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[yt("elementProperties")]=new Map,Q[yt("finalized")]=new Map,Fe==null||Fe({ReactiveElement:Q}),(rt.reactiveElementVersions??(rt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,Mt=It.trustedTypes,qe=Mt?Mt.createPolicy("lit-html",{createHTML:r=>r}):void 0,As="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,Ss="?"+N,Oi=`<${Ss}>`,B=document,$t=()=>B.createComment(""),wt=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,Ri=r=>_e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",ee=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,Ke=/>/g,M=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Je=/"/g,Ps=/^(?:script|style|textarea|title)$/i,Ti=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ft=Ti(1),nt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Xe=new WeakMap,H=B.createTreeWalker(B,129);function Cs(r,t){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const Ni=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=pt;for(let l=0;l<e;l++){const a=r[l];let d,f,h=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===pt?f[1]==="!--"?o=Ve:f[1]!==void 0?o=Ke:f[2]!==void 0?(Ps.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=i??pt,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?M:f[3]==='"'?Je:Ye):o===Je||o===Ye?o=M:o===Ve||o===Ke?o=pt:(o=M,i=void 0);const u=o===M&&r[l+1].startsWith("/>")?" ":"";n+=o===pt?a+Oi:h>=0?(s.push(d),a.slice(0,h)+As+a.slice(h)+N+u):a+N+(h===-2?l:u)}return[Cs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ce=class Os{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ni(t,e);if(this.el=Os.createElement(d,s),H.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=H.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(As)){const c=f[o++],u=i.getAttribute(h).split(N),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:u,ctor:p[1]==="."?Li:p[1]==="?"?zi:p[1]==="@"?Ii:qt}),i.removeAttribute(h)}else h.startsWith(N)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(Ps.test(i.tagName)){const h=i.textContent.split(N),c=h.length-1;if(c>0){i.textContent=Mt?Mt.emptyScript:"";for(let u=0;u<c;u++)i.append(h[u],$t()),H.nextNode(),a.push({type:2,index:++n});i.append(h[c],$t())}}}else if(i.nodeType===8)if(i.data===Ss)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(N,h+1))!==-1;)a.push({type:7,index:n}),h+=N.length-1}n++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}};function ot(r,t,e=r,s){var i,n;if(t===nt)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=wt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=ot(r,o._$AS(r,t.values),o,s)),t}class Ui{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??B).importNode(e,!0);H.currentNode=i;let n=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new St(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Mi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=B,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),wt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==nt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ri(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ce.createElement(Cs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ui(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Xe.get(t.strings);return e===void 0&&Xe.set(t.strings,e=new ce(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new St(this.O($t()),this.O($t()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=ot(this,t,e,0),o=!wt(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ot(this,l[s+a],e,a),d===nt&&(d=this._$AH[a]),o||(o=!wt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Li extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class zi extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ii extends qt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??$)===nt)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const Ze=It.litHtmlPolyfillSupport;Ze==null||Ze(ce,St),(It.litHtmlVersions??(It.litHtmlVersions=[])).push("3.2.0");const ji=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new St(t.insertBefore($t(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let et=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=ji(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return nt}};et._$litElement$=!0,et.finalized=!0,(Le=globalThis.litElementHydrateSupport)==null||Le.call(globalThis,{LitElement:et});const Ge=globalThis.litElementPolyfillSupport;Ge==null||Ge({LitElement:et});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hi={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:be},Di=(r=Hi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Rs(r){return(t,e)=>typeof e=="object"?Di(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ts(r){return Rs({...r,state:!0,attribute:!1})}function Wi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Fi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ns={};(function(r){var t=function(){var e=function(h,c,u,p){for(u=u||{},p=h.length;p--;u[h[p]]=c);return u},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,u,p,g,m,v,Jt){var E=v.length-1;switch(m){case 1:return new g.Root({},[v[E-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[E-1],v[E]]);break;case 4:case 5:this.$=v[E];break;case 6:this.$=new g.Literal({value:v[E]});break;case 7:this.$=new g.Splat({name:v[E]});break;case 8:this.$=new g.Param({name:v[E]});break;case 9:this.$=new g.Optional({},[v[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,u){if(u.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,u)}},parse:function(c){var u=this,p=[0],g=[null],m=[],v=this.table,Jt="",E=0,Te=0,Js=2,Ne=1,Xs=m.slice.call(arguments,1),_=Object.create(this.lexer),z={yy:{}};for(var Xt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Xt)&&(z.yy[Xt]=this.yy[Xt]);_.setInput(c,z.yy),z.yy.lexer=_,z.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Zt=_.yylloc;m.push(Zt);var Zs=_.options&&_.options.ranges;typeof z.yy.parseError=="function"?this.parseError=z.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Gs=function(){var X;return X=_.lex()||Ne,typeof X!="number"&&(X=u.symbols_[X]||X),X},x,I,A,Gt,J={},Ot,O,Ue,Rt;;){if(I=p[p.length-1],this.defaultActions[I]?A=this.defaultActions[I]:((x===null||typeof x>"u")&&(x=Gs()),A=v[I]&&v[I][x]),typeof A>"u"||!A.length||!A[0]){var Qt="";Rt=[];for(Ot in v[I])this.terminals_[Ot]&&Ot>Js&&Rt.push("'"+this.terminals_[Ot]+"'");_.showPosition?Qt="Parse error on line "+(E+1)+`:
`+_.showPosition()+`
Expecting `+Rt.join(", ")+", got '"+(this.terminals_[x]||x)+"'":Qt="Parse error on line "+(E+1)+": Unexpected "+(x==Ne?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(Qt,{text:_.match,token:this.terminals_[x]||x,line:_.yylineno,loc:Zt,expected:Rt})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+x);switch(A[0]){case 1:p.push(x),g.push(_.yytext),m.push(_.yylloc),p.push(A[1]),x=null,Te=_.yyleng,Jt=_.yytext,E=_.yylineno,Zt=_.yylloc;break;case 2:if(O=this.productions_[A[1]][1],J.$=g[g.length-O],J._$={first_line:m[m.length-(O||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(O||1)].first_column,last_column:m[m.length-1].last_column},Zs&&(J._$.range=[m[m.length-(O||1)].range[0],m[m.length-1].range[1]]),Gt=this.performAction.apply(J,[Jt,Te,E,z.yy,A[1],g,m].concat(Xs)),typeof Gt<"u")return Gt;O&&(p=p.slice(0,-1*O*2),g=g.slice(0,-1*O),m=m.slice(0,-1*O)),p.push(this.productions_[A[1]][0]),g.push(J.$),m.push(J._$),Ue=v[p[p.length-2]][p[p.length-1]],p.push(Ue);break;case 3:return!0}}return!0}},d=function(){var h={EOF:1,parseError:function(u,p){if(this.yy.parser)this.yy.parser.parseError(u,p);else throw new Error(u)},setInput:function(c,u){return this.yy=u||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var u=c.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var u=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),u=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+u+"^"},test_match:function(c,u){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,u,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!u||p[0].length>u[0].length)){if(u=p,g=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(c=this.test_match(u,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var u=this.next();return u||this.lex()},begin:function(u){this.conditionStack.push(u)},popState:function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},pushState:function(u){this.begin(u)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(u,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Fi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ns);function G(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Us={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ls=Ns.parser;Ls.yy=Us;var Bi=Ls,qi=Object.keys(Us);function Vi(r){return qi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var zs=Vi,Ki=zs,Yi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Is(r){this.captures=r.captures,this.re=r.re}Is.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Ji=Ki({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Yi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Is({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Xi=Ji,Zi=zs,Gi=Zi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Qi=Gi,tr=Bi,er=Xi,sr=Qi;Pt.prototype=Object.create(null);Pt.prototype.match=function(r){var t=er.visit(this.ast),e=t.match(r);return e||!1};Pt.prototype.reverse=function(r){return sr.visit(this.ast,r)};function Pt(r){var t;if(this?t=this:t=Object.create(Pt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=tr.parse(r),t}var ir=Pt,rr=ir,nr=rr;const or=Wi(nr);var ar=Object.defineProperty,Ms=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ar(t,e,i),i};const js=class extends et{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ft` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new or(i.path)})),this._historyObserver=new F(this,e),this._authObserver=new F(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ft` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(gs(this,"auth/redirect"),ft` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ft` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ft` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){ge(this,"history/redirect",{href:t})}};js.styles=$i`
    :host,
    main {
      display: contents;
    }
  `;let jt=js;Ms([Ts()],jt.prototype,"_user");Ms([Ts()],jt.prototype,"_match");const lr=Object.freeze(Object.defineProperty({__proto__:null,Element:jt,Switch:jt},Symbol.toStringTag,{value:"Module"})),cr=class Hs extends HTMLElement{constructor(){if(super(),Bt(this).template(Hs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};cr.template=W`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Ds=class he extends HTMLElement{constructor(){super(),this._array=[],Bt(this).template(he.template).styles(he.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ws("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{le(t,"button.add")?Ut(t,"input-array:add"):le(t,"button.remove")&&Ut(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],hr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ds.template=W`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ds.styles=fe`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function hr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ws(e)))}function Ws(r,t){const e=r===void 0?W`<input />`:W`<input value="${r}" />`;return W`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function $e(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ur=Object.defineProperty,dr=Object.getOwnPropertyDescriptor,pr=(r,t,e,s)=>{for(var i=dr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ur(t,e,i),i};class K extends et{constructor(t){super(),this._pending=[],this._observer=new F(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}pr([Rs()],K.prototype,"model");const fr={};function mr(r,t,e){switch(r[0]){case"exercise/select":gr(r[1]).then(i=>t(n=>({...n,exerciseInfo:i})));break;case"exercise/index":yr().then(i=>t(n=>({...n,exercises:i})));break;case"routine/list":vr(e).then(i=>t(n=>({...n,routineNames:i})));break;case"routine/select":br(r[1],e).then(i=>t(n=>({...n,routine:i})));break;case"routine/create":_r(r[1],e).then(i=>t(n=>({...n,routine:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;case"routine/delete":$r(r[1],e).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;case"routine/updateWeek":wr(r[1],e).then(i=>t(n=>({...n,routine:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;case"entry/update":xr(r[1],e).then(i=>t(n=>({...n,routine:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function gr(r){return fetch(`/api/exercise/${r.ref}`).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Exercise Info:",t),t})}function yr(){return fetch("/api/exercise").then(r=>{if(r.status===200)return r.json()}).then(r=>{if(r)return console.log("Exercises:",r),r})}function vr(r){return fetch(`/api/routine/${r.username}`,{headers:P.headers(r)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Routines:",t),t})}function br(r,t){return fetch(`/api/routine/${t.username}/${r.name}`,{headers:P.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Routine:",e),e})}function _r(r,t){return fetch("/api/routine",{method:"POST",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify({username:t.username,name:r.name,workouts:r.workouts})}).then(e=>{if(e.status===201)return e.json();throw new Error(`Failed to create routine for ${t.username}`)}).then(e=>{if(e)return e})}function $r(r,t){return fetch(`/api/routine/${r.name}`,{method:"DELETE",headers:{...P.headers(t)}}).then(e=>{if(e.status!==204)throw new Error(`Failed to create routine for ${t.username}`)})}function wr(r,t){var e;return fetch(`/api/routine/${(e=r.routine)==null?void 0:e._id}`,{method:"PUT",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(r.routine)}).then(s=>{var i;if(s.status===200)return s.json();throw new Error(`Failed to update week in ${(i=r.routine)==null?void 0:i.name} for ${t.username}`)}).then(s=>{if(s)return s})}function xr(r,t){var i,n;const e=(i=r.entry)!=null&&i._id?"PUT":"POST",s=e==="PUT"?`/api/entry/${(n=r.entry)==null?void 0:n._id}`:"/api/entry";return fetch(s,{method:e,headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(r.entry)}).then(o=>{var l;if(o.status===200)return fetch(`/api/routine/${t.username}/${(l=r.routine)==null?void 0:l.name}`,{headers:P.headers(t)}).then(a=>{if(a.status===200)return a.json()}).then(a=>{if(a)return console.log("Routine:",a),a});if(o.status===201)return o.json().then(a=>{console.log("HERE",a);const d=a;return fetch(`/api/workout/addEntry/${r.exerciseName}/${r.workoutId}`,{method:"PUT",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify({entryId:d._id})}).then(f=>{var h;if(f.status===200)return fetch(`/api/routine/${t.username}/${(h=r.routine)==null?void 0:h.name}`,{headers:P.headers(t)}).then(c=>{if(c.status===200)return c.json()}).then(c=>{if(c)return console.log("Routine:",c),c});throw new Error(`Failed to update workout with entry for ${t.username}`)})});throw new Error(`Failed to create entry for ${t.username}`)})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=globalThis,we=Nt.ShadowRoot&&(Nt.ShadyCSS===void 0||Nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xe=Symbol(),Qe=new WeakMap;let Fs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qe.set(e,t))}return t}toString(){return this.cssText}};const Er=r=>new Fs(typeof r=="string"?r:r+"",void 0,xe),Y=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Fs(e,r,xe)},kr=(r,t)=>{if(we)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Nt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ts=we?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Er(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ar,defineProperty:Sr,getOwnPropertyDescriptor:Pr,getOwnPropertyNames:Cr,getOwnPropertySymbols:Or,getPrototypeOf:Rr}=Object,L=globalThis,es=L.trustedTypes,Tr=es?es.emptyScript:"",se=L.reactiveElementPolyfillSupport,vt=(r,t)=>r,Ht={toAttribute(r,t){switch(t){case Boolean:r=r?Tr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Ee=(r,t)=>!Ar(r,t),ss={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:Ee};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),L.litPropertyMetadata??(L.litPropertyMetadata=new WeakMap);class tt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ss){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Sr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Pr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ss}static _$Ei(){if(this.hasOwnProperty(vt("elementProperties")))return;const t=Rr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(vt("properties"))){const e=this.properties,s=[...Cr(e),...Or(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ts(i))}else t!==void 0&&e.push(ts(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return kr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ht).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ht;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Ee)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[vt("elementProperties")]=new Map,tt[vt("finalized")]=new Map,se==null||se({ReactiveElement:tt}),(L.reactiveElementVersions??(L.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Dt=bt.trustedTypes,is=Dt?Dt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Bs="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,qs="?"+U,Nr=`<${qs}>`,q=document,xt=()=>q.createComment(""),Et=r=>r===null||typeof r!="object"&&typeof r!="function",ke=Array.isArray,Ur=r=>ke(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",ie=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rs=/-->/g,ns=/>/g,j=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),os=/'/g,as=/"/g,Vs=/^(?:script|style|textarea|title)$/i,Lr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=Lr(1),at=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),ls=new WeakMap,D=q.createTreeWalker(q,129);function Ks(r,t){if(!ke(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return is!==void 0?is.createHTML(t):t}const zr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=mt;for(let l=0;l<e;l++){const a=r[l];let d,f,h=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===mt?f[1]==="!--"?o=rs:f[1]!==void 0?o=ns:f[2]!==void 0?(Vs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=i??mt,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?j:f[3]==='"'?as:os):o===as||o===os?o=j:o===rs||o===ns?o=mt:(o=j,i=void 0);const u=o===j&&r[l+1].startsWith("/>")?" ":"";n+=o===mt?a+Nr:h>=0?(s.push(d),a.slice(0,h)+Bs+a.slice(h)+U+u):a+U+(h===-2?l:u)}return[Ks(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class kt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=zr(t,e);if(this.el=kt.createElement(d,s),D.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=D.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(Bs)){const c=f[o++],u=i.getAttribute(h).split(U),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:u,ctor:p[1]==="."?Mr:p[1]==="?"?jr:p[1]==="@"?Hr:Vt}),i.removeAttribute(h)}else h.startsWith(U)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(Vs.test(i.tagName)){const h=i.textContent.split(U),c=h.length-1;if(c>0){i.textContent=Dt?Dt.emptyScript:"";for(let u=0;u<c;u++)i.append(h[u],xt()),D.nextNode(),a.push({type:2,index:++n});i.append(h[c],xt())}}}else if(i.nodeType===8)if(i.data===qs)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(U,h+1))!==-1;)a.push({type:7,index:n}),h+=U.length-1}n++}}static createElement(t,e){const s=q.createElement("template");return s.innerHTML=t,s}}function lt(r,t,e=r,s){var o,l;if(t===at)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=Et(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=lt(r,i._$AS(r,t.values),i,s)),t}class Ir{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??q).importNode(e,!0);D.currentNode=i;let n=D.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Ct(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Dr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=D.nextNode(),o++)}return D.currentNode=q,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Ct{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),Et(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==at&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ur(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&Et(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=kt.createElement(Ks(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Ir(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ls.get(t.strings);return e===void 0&&ls.set(t.strings,e=new kt(t)),e}k(t){ke(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Ct(this.O(xt()),this.O(xt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Vt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=lt(this,t,e,0),o=!Et(t)||t!==this._$AH&&t!==at,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=lt(this,l[s+a],e,a),d===at&&(d=this._$AH[a]),o||(o=!Et(d)||d!==this._$AH[a]),d===w?t=w:t!==w&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mr extends Vt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}}class jr extends Vt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}}class Hr extends Vt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??w)===at)return;const s=this._$AH,i=t===w&&s!==w||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==w&&(s===w||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Dr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}}const re=bt.litHtmlPolyfillSupport;re==null||re(kt,Ct),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.2.1");const Wr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Ct(t.insertBefore(xt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let _t=class extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Wr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return at}};var cs;_t._$litElement$=!0,_t.finalized=!0,(cs=globalThis.litElementHydrateSupport)==null||cs.call(globalThis,{LitElement:_t});const ne=globalThis.litElementPolyfillSupport;ne==null||ne({LitElement:_t});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fr={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:Ee},Br=(r=Fr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function S(r){return(t,e)=>typeof e=="object"?Br(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(r){return S({...r,state:!0,attribute:!1})}const qr=fe`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  body {
    line-height: 1.5;
  }
  img {
    max-width: 100%;
  }
  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
`,Kt={styles:qr};var Vr=Object.defineProperty,ht=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Vr(t,e,i),i};function Kr(r,t){t.selectedRoutine!==r&&(window.location.href=`/app/routine/${r}`)}const Se=class Se extends K{constructor(){super("log:model"),this.open=!1,this.deleting=!1,this.routines=[]}addNewRoutine(){Lt.dispatch(this,"history/navigate",{href:"/app/routine"})}deleteRoutine(t){this.dispatchMessage(["routine/delete",{name:this.routineDeleting,onSuccess:()=>{},onFailure:e=>console.log("ERROR:",e)}]),this.selectedRoutine===this.routineDeleting&&(this.dispatchMessage(["routine/list",{}]),Lt.dispatch(this,"history/navigate",{href:"/app"})),this.routines=this.routines.filter(e=>e!==t),this.deleting=!1,this.routineDeleting=void 0}toggleDropdown(){this.open=!this.open}confirmDelete(t){this.deleting=!0,this.routineDeleting=t}cancelDelete(){this.deleting=!1,this.routineDeleting=void 0}render(){return this.location==="/app"&&(this.selectedRoutine="Select a"),y`
      <div class="dropdown-container">
        <div class="dropdown-actuator" @click=${this.toggleDropdown}>
          <h1>
            ${this.selectedRoutine} Routine
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="dropdown-icon ${this.open?"open":""}"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </h1>
        </div>
        ${this.open?y`
              <ul class="dropdown-menu">
                ${this.routines.map(t=>y`<div class="list-item">
                      <li
                        @click=${()=>Kr(t,this)}
                        class="routine ${t===this.selectedRoutine?"selected":""}"
                      >
                        ${t}
                      </li>
                      ${this.deleting&&this.routineDeleting===t?y`
                            <div class="confirmation">
                              <button
                                @click=${()=>this.deleteRoutine(t)}
                                class="confirm-delete"
                              >
                                Confirm
                              </button>
                              <button
                                @click=${this.cancelDelete}
                                class="cancel-delete"
                              >
                                Cancel
                              </button>
                            </div>
                          `:y`
                            <button
                              @click=${()=>this.confirmDelete(t)}
                              class="delete-button"
                            >
                              X
                            </button>
                          `}
                    </div>`)}
                <li @click=${this.addNewRoutine} class="add-routine-button">
                  <svg viewBox="0 0 24 24" class="icon">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </li>
              </ul>
            `:""}
      </div>
    `}};Se.styles=Y`
    .dropdown-container {
      position: relative;
      display: inline-block;
    }

    .dropdown-actuator {
      cursor: pointer;
    }

    .dropdown-icon {
      transform: rotate(0deg);
      transition: transform 0.2s ease;
    }
    .dropdown-icon.open {
      transform: rotate(180deg);
    }

    .dropdown-actuator:hover .dropdown-icon {
      color: var(--color-accent);
    }

    .dropdown-menu {
      z-index: 2;
      list-style-type: none;
      position: absolute;
      min-width: 100%;
      background-color: var(--color-background-page);
      border: solid var(--color-accent);
      margin-top: 0;
      padding: 0;
    }

    .dropdown-menu .routine {
      width: 100%;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--color-text);
    }

    .dropdown-menu .routine:hover:not(.selected) {
      color: var(--color-link);
    }

    .dropdown-menu .routine.selected {
      color: #aaa;
      cursor: default;
    }

    h1 {
      margin: 0;
      font-size: var(--size-type-xxlarge);
      font-style: oblique;
    }

    .add-routine-button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .icon {
      width: 24px;
      height: 24px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
    }
    .confirmation {
      display: flex;
    }
    .confirm-delete,
    .cancel-delete,
    .delete-button {
      background: none;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      color: white;
      font-weight: bold;
    }
    .confirm-delete {
      background-color: #409238;
    }
    .cancel-delete {
      background-color: #d83b3b;
    }
    .confirm-delete:hover,
    .cancel-delete:hover,
    .add-routine-button:hover,
    .delete-button:hover {
      color: var(--color-link);
    }
    .delete-button {
      color: var(--color-text);
    }
    .delete-button:hover {
      background-color: #d83b3b;
    }
  `;let R=Se;ht([S()],R.prototype,"open");ht([b()],R.prototype,"deleting");ht([b()],R.prototype,"routineDeleting");ht([S()],R.prototype,"location");ht([S()],R.prototype,"routines");ht([b()],R.prototype,"selectedRoutine");var Yr=Object.defineProperty,Jr=Object.getOwnPropertyDescriptor,Yt=(r,t,e,s)=>{for(var i=s>1?void 0:s?Jr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Yr(t,e,i),i};function Xr(r){const e=r.target.checked;ys.relay(r,"dark-mode",{checked:e})}function Zr(r){ys.relay(r,"auth:message",["auth/signout"])}const Wt=class Wt extends K{constructor(){super("log:model"),this._authObserver=new F(this,"log:auth"),this._histObserver=new F(this,"log:history")}get routine(){return this.model.routine}get routineNames(){return this.model.routineNames}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{var e,s;if(t&&t.username!==this.userid){this.userid=t.username;const i=(s=(e=this.shadowRoot)==null?void 0:e.querySelector("#userid"))==null?void 0:s.parentNode;i.href=`/user/${this.userid}`}}),this._histObserver.observe(({location:t})=>{t&&t.pathname!==this.location&&(this.location=t.pathname)}),this.dispatchMessage(["routine/list",{}])}updateWeek(){this.dispatchMessage(["routine/updateWeek",{routine:this.routine,onSuccess:()=>{},onFailure:t=>console.log("ERROR:",t)}])}render(){var s,i,n;const{latest_week:t}=this.routine||{},e=this.renderWeek(t);return y`
      <header>
        ${(s=this.location)!=null&&s.startsWith("/app/routine/")||this.location==="/app"?y`<my-dropdown
              location=${this.location}
              .selectedRoutine=${(i=this.routine)==null?void 0:i.name}
              .routines=${this.routineNames}
            ></my-dropdown>`:y`<a class="link" href="/">&larr; Return Home</a>`}
        ${(n=this.location)!=null&&n.startsWith("/app/routine/")?e:""}
        <div>
          <a>
            Hello,
            <a
              ><span id="userid"
                >${this.userid==="anonymous"?"":this.userid}</span
              ></a
            >
          </a>
          <menu>
            <li>
              <label @change=${Xr}>
                <input type="checkbox" autocomplete="off" />
                Dark mode
              </label>
            </li>
            <li class="when-signed-in">
              <a class="link" id="signout" @click=${Zr}>Sign Out</a>
            </li>
            <li class="when-signed-out">
              <a class="link" href="/login">Sign In</a>
            </li>
          </menu>
        </div>
      </header>
    `}renderWeek(t){return y`<div class="change-week">
      <button
        class="change-button ${t===1?"disabled":""}"
        @click="${this.goToPreviousWeek}"
        ?disabled="${t===1}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="prev-button"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <span class="week-label">Week ${t}</span>

      <button class="change-button" @click="${this.goToNextWeek}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="next-button"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>`}goToPreviousWeek(){this.routine&&this.routine.latest_week>0&&(this.routine.latest_week--,this.updateWeek())}goToNextWeek(){this.routine&&(console.log("incrementing week"),this.routine.latest_week++,this.updateWeek())}};Wt.uses=$e({"my-dropdown":R}),Wt.styles=[Kt.styles,Y`
      header {
        background-color: var(--color-background-header);
        border: var(--size-border) solid var(--color-accent);
        color: var(--color-text);
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);

        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--size-spacing-medium);

        margin-bottom: var(--size-spacing-large);
      }
      .link {
        color: var(--color-link);
        cursor: pointer;
        text-decoration: underline;
      }
      #userid:empty::before {
        content: "user";
      }
      #userid:empty {
        color: var(--color-text);
        text-decoration: none;
      }
      #userid:not(:empty) {
        color: var(--color-link);
        cursor: pointer;
        text-decoration: underline;
      }
      menu li input {
        cursor: pointer;
      }
      a:has(#userid:empty) ~ menu > .when-signed-in,
      a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
        display: none;
      }

      .change-week {
        display: flex;
        padding-top: 0.5rem;

        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .change-button {
        background-color: inherit;
        border: none;
        color: var(--color-text);
        cursor: pointer;
      }
      .change-button:hover {
        color: var(--color-accent);
      }
      .change-button.disabled {
        color: var(--color-background-header);
        background-color: inherit;
        cursor: auto;
      }
      .prev-button {
        transform: rotate(90deg);
      }
      .next-button {
        transform: rotate(-90deg);
      }
      .week-label {
        font-size: var(--size-type-large);
      }
    `];let V=Wt;Yt([S()],V.prototype,"userid",2);Yt([b()],V.prototype,"location",2);Yt([b()],V.prototype,"routine",1);Yt([b()],V.prototype,"routineNames",1);function Gr(r,t,e){r.preventDefault();const s=r.target,i=new FormData(s),n="POST",o={"Content-Type":"application/json"},l=JSON.stringify(Object.fromEntries(i));fetch(t,{method:n,headers:o,body:l}).then(a=>{if(a.status!==200)throw`Form submission failed: Status ${a.status}`;return a.json()}).then(a=>{const{token:d}=a;s.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:d,redirect:e}]}))}).catch(a=>console.log("Error submitting form:",a))}const Pe=class Pe extends _t{handleSubmit(t){const e=this.getAttribute("api"),s=this.getAttribute("redirect")||"/";e&&Gr(t,e,s)}render(){return y`
      <form @submit=${this.handleSubmit}>
        <label>
          <span>
            <slot name="username">Username</slot>
          </span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>
            <slot name="password">Password</slot>
          </span>
          <input type="password" name="password" />
        </label>
        <slot name="submit">
          <button type="submit">Sign In</button>
        </slot>
      </form>
    `}};Pe.styles=Y`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    span {
      color: var(--color-text);
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: var(--color-link);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    button {
      padding: 0.75rem;
      background-color: var(--color-background-header);
      color: var(--color-background-page);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: var(--color-link);
    }
  `;let ue=Pe;var Qr=Object.defineProperty,tn=Object.getOwnPropertyDescriptor,C=(r,t,e,s)=>{for(var i=s>1?void 0:s?tn(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Qr(t,e,i),i};function en(r,t,e){const s=r==null?void 0:r.workouts.find(n=>n.name===t);if(!s)throw new Error("Workout not found in routine.");const i=s.exercises.find(n=>n.exercise_name===e);if(!i)throw new Error("Exercise not found in workout.");return i.entries[0]||{week:r==null?void 0:r.latest_week,sets:[],comment:""}}const Ce=class Ce extends K{constructor(){super("log:model"),this.isAddingSet=!1,this.isEditingComment=!1,this.editingSetIndex=null,this.handleInputBlur=t=>{setTimeout(()=>{var i,n;const e=(i=this.shadowRoot)==null?void 0:i.getElementById("new-reps"),s=(n=this.shadowRoot)==null?void 0:n.getElementById("new-weight");!(e!=null&&e.matches(":focus"))&&!(s!=null&&s.matches(":focus"))&&(e.value&&s.value?this.saveNewSet():!e.value&&!s.value&&this.cancelAddSet())},100)},this.handleInputFocus=t=>{t.stopPropagation()},this.toggleCommentEdit=()=>{this.isEditingComment=!0,setTimeout(()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector(".comment-input");t==null||t.focus()},0)},this.handleCommentKeyDown=t=>{t.key==="Enter"?this.saveComment():t.key==="Escape"&&(this.isEditingComment=!1)},this.saveComment=()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector(".comment-input");this.entry&&t&&(this.entry.comment=t.value,this.saveEntry()),this.isEditingComment=!1}}get newEntry(){return this.model.entry}saveEntry(){console.log(this.entry),this.dispatchMessage(["entry/update",{routine:this.routine,workoutId:this.workoutId,exerciseName:this.exerciseName,entry:this.entry,onSuccess:()=>{},onFailure:t=>console.log("ERROR:",t)}])}render(){var s,i;this.entry=en(this.routine,this.workoutName,this.exerciseName);const{sets:t,comment:e}={sets:this.renderSets((s=this.entry)==null?void 0:s.sets),comment:this.renderComment((i=this.entry)==null?void 0:i.comment)};return y`
      <section class="exercise">
        <dt>
          <a href="/app/exercise/${this.exerciseRef}"> ${this.exerciseName} </a>
          ${e}
        </dt>
        <dd>${t}</dd>
      </section>
    `}renderSets(t){return y`
      <table class="sets-table">
        <thead>
          <tr>
            <th>Set</th>
            <th>Reps</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          ${t==null?void 0:t.map((e,s)=>y`
              <tr @click=${()=>this.startEditingSet(s)}>
                <td>${s+1}</td>
                <td>${e.repetitions}</td>
                <td>${e.weight}</td>
              </tr>
            `)}
          ${this.isAddingSet||this.editingSetIndex!==null?y`
                <tr class="adding-set">
                  <td>
                    ${this.editingSetIndex!==null?this.editingSetIndex+1:t!=null&&t.length?t.length+1:1}
                  </td>
                  <td>
                    <input
                      type="number"
                      id="new-reps"
                      placeholder="Reps"
                      .value=${this.editingSetIndex!==null?t[this.editingSetIndex].repetitions.toString():""}
                      @keydown=${this.handleInputKeyDown}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      id="new-weight"
                      placeholder="Weight"
                      .value=${this.editingSetIndex!==null?t[this.editingSetIndex].weight.toString():""}
                      @keydown=${this.handleInputKeyDown}
                    />
                  </td>
                </tr>
              `:y`
                <tr class="add-set-row">
                  <td colspan="3">
                    <button
                      @click=${this.startAddingSet}
                      class="add-set-button"
                    >
                      <svg viewBox="0 0 24 24" class="icon">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              `}
        </tbody>
      </table>
    `}startEditingSet(t){this.isAddingSet=!0,this.editingSetIndex=t,setTimeout(()=>{var i,n;const e=(i=this.shadowRoot)==null?void 0:i.getElementById("new-reps"),s=(n=this.shadowRoot)==null?void 0:n.getElementById("new-weight");e==null||e.addEventListener("blur",this.handleInputBlur),s==null||s.addEventListener("blur",this.handleInputBlur),e==null||e.addEventListener("focus",this.handleInputFocus),s==null||s.addEventListener("focus",this.handleInputFocus),e==null||e.focus()},0)}startAddingSet(){this.isAddingSet=!0,this.editingSetIndex=null,setTimeout(()=>{var s,i;const t=(s=this.shadowRoot)==null?void 0:s.getElementById("new-reps"),e=(i=this.shadowRoot)==null?void 0:i.getElementById("new-weight");t==null||t.addEventListener("blur",this.handleInputBlur),e==null||e.addEventListener("blur",this.handleInputBlur),t==null||t.addEventListener("focus",this.handleInputFocus),e==null||e.addEventListener("focus",this.handleInputFocus),t==null||t.focus()},0)}handleInputKeyDown(t){t.key==="Enter"?this.saveNewSet():t.key==="Escape"&&this.cancelAddSet()}cancelAddSet(){var s,i;const t=(s=this.shadowRoot)==null?void 0:s.getElementById("new-reps"),e=(i=this.shadowRoot)==null?void 0:i.getElementById("new-weight");t==null||t.removeEventListener("blur",this.handleInputBlur),e==null||e.removeEventListener("blur",this.handleInputBlur),t==null||t.removeEventListener("focus",this.handleInputFocus),e==null||e.removeEventListener("focus",this.handleInputFocus),t&&(t.value=""),e&&(e.value=""),this.isAddingSet=!1,this.editingSetIndex=null}saveNewSet(){var n,o,l,a;const t=(n=this.shadowRoot)==null?void 0:n.getElementById("new-reps"),e=(o=this.shadowRoot)==null?void 0:o.getElementById("new-weight");t==null||t.removeEventListener("blur",this.handleInputBlur),e==null||e.removeEventListener("blur",this.handleInputBlur),t==null||t.removeEventListener("focus",this.handleInputFocus),e==null||e.removeEventListener("focus",this.handleInputFocus);const s=parseInt(t.value),i=parseFloat(e.value);!isNaN(s)&&!isNaN(i)&&(this.editingSetIndex!==null?(l=this.entry)!=null&&l.sets&&(this.entry.sets[this.editingSetIndex]={repetitions:s,weight:i}):(a=this.entry)==null||a.sets.push({repetitions:s,weight:i}),this.saveEntry(),this.isAddingSet=!1,this.editingSetIndex=null)}renderComment(t){return y`
      <div class="comment-container">
        <button class="comment-button" @click=${this.toggleCommentEdit}>
          <svg viewBox="0 0 24 24" class="icon ${t?"filled":""}">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
          ${this.isEditingComment?y`
                <input
                  type="text"
                  class="comment-input"
                  .value=${t||""}
                  @keydown=${this.handleCommentKeyDown}
                  @blur=${this.saveComment}
                />
              `:t?y`<span class="comment-tooltip">${t}</span>`:""}
        </button>
      </div>
    `}};Ce.styles=Y`
    a {
      color: var(--color-link);
      width: 100%;
      flex-grow: 1;
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    dt {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
      font-weight: var(--font-weight-darker);
      font-size: var(--size-type-medium);
      align-items: center;
      gap: 0.5rem;
    }
    .comment-container {
      margin-left: auto;
    }
    dd {
      margin: 0;
    }
    .icon {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .sets-table {
      width: 100%;
      border-collapse: collapse;
      color: rgb(51 51 51);
    }
    .sets-table th,
    .sets-table td {
      padding: 0.5rem;
      text-align: center;
      border: 1px solid #ddd;
    }
    .sets-table th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .sets-table tr:nth-child(even) {
      background-color: #f4f4f4;
    }
    .sets-table tr:nth-child(odd) {
      background-color: #ede8f5;
    }
    .sets-table tr:hover {
      background-color: #f1f1f1;
    }

    .add-set-row {
      background-color: #f4f4f4;
    }
    .add-set-button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .add-set-button:hover {
      opacity: 0.6;
    }
    .add-set-button .icon {
      width: 24px;
      height: 24px;
    }

    .adding-set input {
      width: 100%;
      padding: 0.25rem;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .comment-button {
      background: none;
      border: none;
      position: relative;
      color: var(--color-text);
      cursor: pointer;
    }
    .comment-tooltip {
      display: none;
      position: absolute;
      transform: translateX(-50%);
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .comment-button:hover .comment-tooltip {
      display: block;
    }
    .filled {
      fill: var(--color-accent);
    }
    .comment-input {
      color: rgb(51 51 51);
      position: absolute;
      transform: translateX(-50%);
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      max-width: 250px;
      z-index: 10;
    }
  `;let k=Ce;C([b()],k.prototype,"routine",2);C([S()],k.prototype,"workoutId",2);C([S()],k.prototype,"workoutName",2);C([S()],k.prototype,"exerciseName",2);C([S()],k.prototype,"exerciseRef",2);C([b()],k.prototype,"entry",2);C([b()],k.prototype,"isAddingSet",2);C([b()],k.prototype,"isEditingComment",2);C([b()],k.prototype,"editingSetIndex",2);C([b()],k.prototype,"newEntry",1);var sn=Object.defineProperty,rn=Object.getOwnPropertyDescriptor,Ae=(r,t,e,s)=>{for(var i=s>1?void 0:s?rn(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&sn(t,e,i),i};const Ft=class Ft extends K{constructor(){super("log:model"),this.name="",this.userid=""}get routine(){return this.model.routine}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="name"&&e!==s&&s&&this.dispatchMessage(["routine/select",{username:this.userid,name:s}])}render(){const{workouts:t=[]}=this.routine||{};if(!t||t.length===0)return;const e=t.map(({_id:s,name:i,exercises:n})=>{if(s)return this.renderWorkout([s.toString(),i,n])});return y`
      <style>
        main.page {
          --page-grids: ${t.length};
        }
      </style>
      <main class="page">
        <section class="log">${e}</section>
      </main>
    `}renderWorkout([t,e,s]){return y`
      <section class="workout">
        <h2>
          <span>${e}</span>
          <!-- TODO: set up icons -->
          <svg class="icon">
            <use
              href="/icons/workouts.svg#icon-${e==="Upper"?"push":e==="Lower"?"legs":e.toLowerCase()}"
            />
          </svg>
        </h2>
        <section class="exercises">
          <dl>
            ${s==null?void 0:s.map(({exercise_ref:i,exercise_name:n})=>y`
                  <exercise-entry
                    .routine=${this.routine}
                    workoutId=${t}
                    workoutName=${e}
                    exerciseName=${n}
                    exerciseRef=${i}
                  />
                `)}
          </dl>
        </section>
      </section>
    `}};Ft.uses=$e({"exercise-entry":k}),Ft.styles=[Kt.styles,Y`
      main {
        background-color: var(--color-background-page);
        color: var(--color-text);
        font-family: var(--font-family-body);
        font-weight: var(--font-weight-normal);
        line-height: var(--font-line-height-body);
        font-size: var(--size-type-body);
      }
      h2 {
        font-size: var(--size-type-xlarge);

        background-color: var(--color-background-header);
        border: var(--size-border) solid var(--color-accent);
        color: var(--color-text);
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);
      }
      h3 {
        font-size: var(--size-type-large);
      }
      .page > section {
        margin: 0 var(--size-spacing-large) var(--size-spacing-large)
          var(--size-spacing-large);
      }
      span {
        color: var(--color-link);
      }
      svg.icon {
        display: inline;
        height: 1.9em;
        width: 1.9em;
        vertical-align: middle;
        fill: currentColor;
      }

      main.page {
        display: grid;
        grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];
        column-gap: var(--size-spacing-medium);
      }
      .log {
        grid-column: start / end;
        display: grid;
        grid-template-columns: subgrid;

        > h2 {
          grid-column: auto / span 1;
        }
      }
      .workout > h2 {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .exercises {
        > dl {
          --page-grids: 2;

          display: grid;
          grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];

          > exercise-entry {
            border: var(--size-border) solid var(--color-accent);
            border-top: none;
            padding: var(--size-spacing-medium);
          }
        }
        :nth-child(even) {
          border-left: none;
        }
      }
    `];let ct=Ft;Ae([S({attribute:"name",reflect:!0})],ct.prototype,"name",2);Ae([S({attribute:"user-id",reflect:!0})],ct.prototype,"userid",2);Ae([b()],ct.prototype,"routine",1);var nn=Object.defineProperty,on=Object.getOwnPropertyDescriptor,Ys=(r,t,e,s)=>{for(var i=s>1?void 0:s?on(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&nn(t,e,i),i};const Oe=class Oe extends K{get exerciseInfo(){return this.model.exerciseInfo}constructor(){super("log:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="exerciseref"&&e!==s&&s&&this.dispatchMessage(["exercise/select",{ref:s}])}render(){const{name:t,description:e,muscles:s=[],type:i=[],mechanic:n,level:o,instructions:l=[],images:a=[]}=this.exerciseInfo||{};return y`
      <main class="page">
        <section class="definition">
          <h1>${t}</h1>
          <p>${e}</p>
        </section>
        <section class="instruction">
          <h2>Instructions</h2>
          ${l?y`
                <span slot="instructions">
                  <ol>
                    ${l.map(d=>y`<li>${d}</li>`)}
                  </ol>
                </span>
              `:y`<p>"No instructions.</p>`} <br />
          <p>
            <b>Type:</b> ${i.join(", ")} <br />
            <b>Mechanic:</b> ${n} <br />
            <b>Main muscles targeted:</b> ${s.join(", ")} <br />
            <b>Level:</b> ${o}
          </p>
        </section>
        <section class="images">
          ${a?y`
                ${a.map(d=>y`<img
                      src="${d}"
                      style="width: 400px; height: auto"
                    />`)}
              `:""}
        </section>
      </main>
    `}};Oe.styles=[Kt.styles,Y`
      h1,
      h2 {
        background-color: var(--color-background-header);
        border: var(--size-border) solid var(--color-accent);
        color: var(--color-text);
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);
      }
      h1 {
        font-size: var(--size-type-xxlarge);
        font-style: oblique;
      }
      h2 {
        font-size: var(--size-type-xlarge);
      }
      section {
        margin: 0 var(--size-spacing-large) var(--size-spacing-large)
          var(--size-spacing-large);
      }
      p {
        margin: 0 var(--size-spacing-large) var(--size-spacing-large)
          var(--size-spacing-large);
      }
      img {
        border: var(--size-border) solid var(--color-accent);
        border-radius: var(--size-radius-medium);
      }

      main.page {
        --page-grids: 3;
        display: grid;
        grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];
        column-gap: var(--size-spacing-medium);
      }
      .definition {
        grid-column: start / end;
        > * {
          margin-bottom: var(--size-spacing-small);
        }
        > h1 {
          display: flex;
          justify-content: center;
          align-content: center;
          padding: var(--size-spacing-medium);
        }
      }

      .instruction {
        grid-column: auto / span 2;
        > * {
          margin-bottom: var(--size-spacing-small);
        }
        > h2 {
          padding: var(--size-spacing-medium);
        }
      }
    `];let At=Oe;Ys([S()],At.prototype,"exerciseref",2);Ys([b()],At.prototype,"exerciseInfo",1);var an=Object.defineProperty,ln=Object.getOwnPropertyDescriptor,ut=(r,t,e,s)=>{for(var i=s>1?void 0:s?ln(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&an(t,e,i),i};const Re=class Re extends K{constructor(){super("log:model"),this.routineName="",this.workouts=[],this.currentWorkout={_id:void 0,name:"",order:void 0,exercises:[]},this.selectedExercise="",this.nameLocked=!1}get exerciseList(){return this.model.exercises}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["exercise/index",{}])}createRoutine(){this.routineName&&this.workouts.length>0&&this.dispatchMessage(["routine/create",{name:this.routineName,workouts:this.workouts.map((t,e)=>({_id:void 0,name:t.name,order:e,exercises:t.exercises.map(s=>({exercise_ref:s.exercise_ref,exercise_name:s.exercise_name,entries:[]}))})),onSuccess:()=>{this.dispatchMessage(["routine/list",{}]),Lt.dispatch(this,"history/navigate",{href:`/app/routine/${this.routineName}`})},onFailure:t=>console.log("ERROR:",t)}])}render(){var t;return y`
      <main class="page">
        <section class="form">
          <section class="title"><h2>Create a Routine</h2></section>
          <section class="routine-name">
            <label>
              <input
                type="text"
                .value=${this.routineName}
                @input=${e=>this.routineName=e.target.value}
                placeholder="Enter routine name"
              />
            </label>
          </section>
          <section>
            <h3>Add Workout</h3>
            <label>
              <input
                type="text"
                .value=${this.currentWorkout.name}
                @input=${this.updateWorkoutName}
                ?disabled=${this.nameLocked}
                placeholder="Enter workout name"
              />
            </label>
            <div class="exercise-selector">
              <select
                .value=${this.selectedExercise}
                @change=${e=>this.selectedExercise=e.target.value}
              >
                <option value="">Select Exercise</option>
                ${(t=this.exerciseList)==null?void 0:t.map(e=>y`
                      <option value=${e.ref}>${e.name}</option>
                    `)}
              </select>
              <button
                @click=${this.addExerciseToWorkout}
                ?disabled=${!this.selectedExercise||!this.currentWorkout.name}
              >
                Add Exercise to Workout
              </button>
            </div>
            <button
              @click=${this.addWorkout}
              ?disabled=${!this.currentWorkout.name||this.currentWorkout.exercises.length===0}
            >
              Add Workout to Routine
            </button>
          </section>

          <section>
            <button
              @click=${this.createRoutine}
              ?disabled=${!this.routineName||this.workouts.length===0}
            >
              Create Routine
            </button>
          </section>
        </section>
        <section class="current-workouts">
          <h2>Current Workouts</h2>
          <div class="workouts-box">
            ${this.workouts.map((e,s)=>y`
                <div class="workout">
                  <div class="workout-header">
                    <h3>Workout #${s+1}: ${e.name}</h3>
                  </div>
                  <ul>
                    ${e.exercises.map((i,n)=>y`
                        <li>
                          ${i.exercise_name}
                          <button
                            class="delete-button"
                            @click=${()=>this.deleteExercise(s,n)}
                          >
                            X
                          </button>
                        </li>
                      `)}
                  </ul>
                </div>
              `)}
          </div>
        </section>
      </main>
    `}updateWorkoutName(t){const e=t.target.value;this.currentWorkout={...this.currentWorkout,name:e},this.nameLocked=this.currentWorkout.exercises.length>0}addExerciseToWorkout(){var e;const t=(e=this.exerciseList)==null?void 0:e.find(s=>s.ref===this.selectedExercise);if(t&&this.currentWorkout.name){const s={...this.currentWorkout,exercises:[...this.currentWorkout.exercises,{exercise_ref:t.ref,exercise_name:t.name,entries:[]}]};this.currentWorkout=s,this.nameLocked=!0;const i=this.workouts.findIndex(n=>n.name===this.currentWorkout.name);i!==-1?this.workouts=this.workouts.map((n,o)=>o===i?s:n):this.workouts=[...this.workouts,s],this.selectedExercise=""}console.log(this.workouts)}deleteExercise(t,e){const s=this.workouts.map((i,n)=>{if(n===t){const o=i.exercises.filter((l,a)=>a!==e);return o.length>0?{...i,exercises:o}:null}return i}).filter(Boolean);this.workouts=s,(t===-1||this.workouts.length===0)&&(this.nameLocked=!1)}addWorkout(){if(this.currentWorkout.name&&this.currentWorkout.exercises.length>0){const t=this.workouts.findIndex(e=>e.name===this.currentWorkout.name);t!==-1?this.workouts=this.workouts.map((e,s)=>s===t?{...this.currentWorkout}:e):this.workouts=[...this.workouts,{...this.currentWorkout}],this.currentWorkout={_id:void 0,name:"",exercises:[],order:void 0},this.nameLocked=!1}}};Re.styles=[Kt.styles,Y`
      main {
        margin-top: 3rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
        background-color: var(--color-background-page);
        color: var(--color-text);
        font-family: var(--font-family-body);
        font-weight: var(--font-weight-normal);
        line-height: var(--font-line-height-body);
        font-size: var(--size-type-body);
      }
      h2 {
        font-size: var(--size-type-xlarge);

        color: var(--color-link);
        padding: 0.5rem;
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);
      }
      h3 {
        font-size: var(--size-type-large);
        color: var(--color-link);
      }
      .page > section {
        margin: 0 var(--size-spacing-large) var(--size-spacing-large)
          var(--size-spacing-large);
      }
      .form {
        width: 50%;
      }
      .form section {
        margin-bottom: 2rem;
      }
      .title {
        display: flex;
        justify-content: center;
        margin-bottom: 0rem !important;
      }
      input,
      select {
        width: 100%;
        margin: 0.5rem 0;
        padding: 0.5rem;
      }

      button {
        width: 100%;
        padding: 0.75rem;
        margin: 0.5rem 0;
        background-color: var(--color-accent);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      button:disabled {
        background-color: #ddd;
        cursor: default;
      }

      .current-workouts {
        border: var(--size-border) solid var(--color-accent);
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .current-workouts > h2 {
        text-align: center;
        margin-top: 0.5rem;
      }
      .workouts-box {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--size-spacing-medium);
        width: 100%;
        padding: 0 var(--size-spacing-medium);
      }

      .workout {
        border: 1px solid #eee;
        padding: var(--size-spacing-small);
      }
      .workout ul {
        list-style-type: disc;
        padding-left: 1.5rem;
      }

      .exercise-selector {
        display: flex;
        flex-direction: column;
        gap: 0.5px;
      }

      .delete-button {
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 3px;
        width: 15px;
        height: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .workout li {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `];let T=Re;ut([b()],T.prototype,"routineName",2);ut([b()],T.prototype,"workouts",2);ut([b()],T.prototype,"currentWorkout",2);ut([b()],T.prototype,"selectedExercise",2);ut([b()],T.prototype,"nameLocked",2);ut([b()],T.prototype,"exerciseList",1);const cn=[{path:"/app/exercise/:ref",view:r=>y`
      <exercise-view exerciseRef=${r.ref}></exercise-view>
    `},{auth:"protected",path:"/app/routine/:name",view:r=>y`
      <log-view name=${r.name}></log-view>
    `},{auth:"protected",path:"/app/routine",view:()=>y` <routine-view></routine-view>`},{auth:"protected",path:"/app",view:()=>y` <home-view></home-view> `},{path:"/",redirect:"/app"}];$e({"mu-auth":P.Provider,"mu-history":Lt.Provider,"mu-switch":class extends lr.Element{constructor(){super(cn,"log:history","log:auth")}},"mu-store":class extends bi.Provider{constructor(){super(mr,fr,"log:auth")}},"my-header":V,"login-form":ue,"log-view":ct,"exercise-view":At,"routine-view":T});

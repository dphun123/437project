(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var V,ve;class it extends Error{}it.prototype.name="InvalidTokenError";function Hs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function js(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Hs(t)}catch{return atob(t)}}function Ke(r,t){if(typeof r!="string")throw new it("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new it(`Invalid token specified: missing part #${e+1}`);let i;try{i=js(s)}catch(n){throw new it(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new it(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Is="mu:context",Yt=`${Is}:change`;class Ds{constructor(t,e){this._proxy=Vs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Je extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ds(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Yt,t),t}detach(t){this.removeEventListener(Yt,t)}}function Vs(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Yt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function qs(r,t){const e=Ze(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function Ze(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return Ze(r,i.host)}class Fs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ge(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Fs(e,r))}class Xt{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Bs(r){return t=>({...t,...r})}const Kt="mu:auth:jwt",Qe=class Xe extends Xt{constructor(t,e){super((s,i)=>this.update(s,i),t,Xe.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(Ys(s)),Dt(i);case"auth/signout":return e(Ks()),Dt(this._redirectForLogin);case"auth/redirect":return Dt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Qe.EVENT_TYPE="auth:message";let ts=Qe;const es=Ge(ts.EVENT_TYPE);function Dt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class Ws extends Je{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Y.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ts(this.context,this.redirect).attach(this)}}class at{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Kt),t}}class Y extends at{constructor(t){super();const e=Ke(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Y(t);return localStorage.setItem(Kt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Kt);return t?Y.authenticate(t):new at}}function Ys(r){return Bs({user:Y.authenticate(r),token:r})}function Ks(){return r=>{const t=r.user;return{user:t&&t.authenticated?at.deauthenticate(t):t,token:""}}}function Js(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function Zs(r){return r.authenticated?Ke(r.token||""):{}}const At=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Y,Provider:Ws,User:at,dispatch:es,headers:Js,payload:Zs},Symbol.toStringTag,{value:"Module"}));function Et(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function Jt(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ss=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Jt,relay:Et},Symbol.toStringTag,{value:"Module"}));function te(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Gs=new DOMParser;function z(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=Gs.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return $e(a);case"bigint":case"boolean":case"number":case"symbol":return $e(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function $e(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Tt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}V=class extends HTMLElement{constructor(){super(),this._state={},Tt(this).template(V.template).styles(V.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Et(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},Qs(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},V.template=z`
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
  `,V.styles=te`
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
  `;function Qs(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const is=class rs extends Xt{constructor(t){super((e,s)=>this.update(e,s),t,rs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ti(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(ei(s,i));break}}}};is.EVENT_TYPE="history:message";let ee=is;class be extends Je{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Xs(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),se(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ee(this.context).attach(this)}}function Xs(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ti(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function ei(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const se=Ge(ee.EVENT_TYPE),si=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:be,Provider:be,Service:ee,dispatch:se},Symbol.toStringTag,{value:"Module"}));class C{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ae(this._provider,t);this._effects.push(i),e(i)}else qs(this._target,this._contextLabel).then(i=>{const n=new Ae(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ae{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ns=class os extends HTMLElement{constructor(){super(),this._state={},this._user=new at,this._authObserver=new C(this,"blazing:auth"),Tt(this).template(os.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ii(i,this._state,e,this.authorization).then(n=>X(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},X(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ee(this.src,this.authorization).then(e=>{this._state=e,X(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ee(this.src,this.authorization).then(i=>{this._state=i,X(i,this)});break;case"new":s&&(this._state={},X({},this));break}}};ns.observedAttributes=["src","new","action"];ns.template=z`
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
  `;function Ee(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function X(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function ii(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ri=class as extends Xt{constructor(t,e){super(e,t,as.EVENT_TYPE,!1)}};ri.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t=globalThis,ie=$t.ShadowRoot&&($t.ShadyCSS===void 0||$t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),we=new WeakMap;let ls=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ie&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=we.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&we.set(e,t))}return t}toString(){return this.cssText}};const ni=r=>new ls(typeof r=="string"?r:r+"",void 0,re),oi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ls(e,r,re)},ai=(r,t)=>{if(ie)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=$t.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Se=ie?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ni(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:li,defineProperty:ci,getOwnPropertyDescriptor:hi,getOwnPropertyNames:ui,getOwnPropertySymbols:di,getPrototypeOf:pi}=Object,K=globalThis,xe=K.trustedTypes,fi=xe?xe.emptyScript:"",Pe=K.reactiveElementPolyfillSupport,rt=(r,t)=>r,wt={toAttribute(r,t){switch(t){case Boolean:r=r?fi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ne=(r,t)=>!li(r,t),ke={attribute:!0,type:String,converter:wt,reflect:!1,hasChanged:ne};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),K.litPropertyMetadata??(K.litPropertyMetadata=new WeakMap);let F=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ci(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=hi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ke}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;const t=pi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){const e=this.properties,s=[...ui(e),...di(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Se(i))}else t!==void 0&&e.push(Se(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:wt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:wt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ne)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[rt("elementProperties")]=new Map,F[rt("finalized")]=new Map,Pe==null||Pe({ReactiveElement:F}),(K.reactiveElementVersions??(K.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,xt=St.trustedTypes,Oe=xt?xt.createPolicy("lit-html",{createHTML:r=>r}):void 0,cs="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,hs="?"+x,mi=`<${hs}>`,H=document,lt=()=>H.createComment(""),ct=r=>r===null||typeof r!="object"&&typeof r!="function",oe=Array.isArray,gi=r=>oe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Vt=`[ 	
\f\r]`,tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ce=/-->/g,Te=/>/g,U=RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Re=/'/g,Ue=/"/g,us=/^(?:script|style|textarea|title)$/i,yi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),et=yi(1),J=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ne=new WeakMap,L=H.createTreeWalker(H,129);function ds(r,t){if(!oe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oe!==void 0?Oe.createHTML(t):t}const _i=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=tt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===tt?f[1]==="!--"?o=Ce:f[1]!==void 0?o=Te:f[2]!==void 0?(us.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=i??tt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ue:Re):o===Ue||o===Re?o=U:o===Ce||o===Te?o=tt:(o=U,i=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===tt?a+mi:u>=0?(s.push(d),a.slice(0,u)+cs+a.slice(u)+x+h):a+x+(u===-2?l:h)}return[ds(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Zt=class ps{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=_i(t,e);if(this.el=ps.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(cs)){const c=f[o++],h=i.getAttribute(u).split(x),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?$i:p[1]==="?"?bi:p[1]==="@"?Ai:Rt}),i.removeAttribute(u)}else u.startsWith(x)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(us.test(i.tagName)){const u=i.textContent.split(x),c=u.length-1;if(c>0){i.textContent=xt?xt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],lt()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],lt())}}}else if(i.nodeType===8)if(i.data===hs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(x,u+1))!==-1;)a.push({type:7,index:n}),u+=x.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function Z(r,t,e=r,s){var i,n;if(t===J)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ct(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Z(r,o._$AS(r,t.values),o,s)),t}class vi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new mt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ei(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class mt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),ct(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==J&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Zt.createElement(ds(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new vi(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ne.get(t.strings);return e===void 0&&Ne.set(t.strings,e=new Zt(t)),e}k(t){oe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new mt(this.O(lt()),this.O(lt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Rt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!ct(t)||t!==this._$AH&&t!==J,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Z(this,l[s+a],e,a),d===J&&(d=this._$AH[a]),o||(o=!ct(d)||d!==this._$AH[a]),d===v?t=v:t!==v&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class $i extends Rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}class bi extends Rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}}class Ai extends Rt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??v)===J)return;const s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ei{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const Le=St.litHtmlPolyfillSupport;Le==null||Le(Zt,mt),(St.litHtmlVersions??(St.litHtmlVersions=[])).push("3.2.0");const wi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new mt(t.insertBefore(lt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let W=class extends F{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=wi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return J}};W._$litElement$=!0,W.finalized=!0,(ve=globalThis.litElementHydrateSupport)==null||ve.call(globalThis,{LitElement:W});const Me=globalThis.litElementPolyfillSupport;Me==null||Me({LitElement:W});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Si={attribute:!0,type:String,converter:wt,reflect:!1,hasChanged:ne},xi=(r=Si,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function fs(r){return(t,e)=>typeof e=="object"?xi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ms(r){return fs({...r,state:!0,attribute:!1})}function Pi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function ki(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var gs={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Mt){var E=y.length-1;switch(m){case 1:return new g.Root({},[y[E-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[E-1],y[E]]);break;case 4:case 5:this.$=y[E];break;case 6:this.$=new g.Literal({value:y[E]});break;case 7:this.$=new g.Splat({name:y[E]});break;case 8:this.$=new g.Param({name:y[E]});break;case 9:this.$=new g.Optional({},[y[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Mt="",E=0,ge=0,Ns=2,ye=1,Ls=m.slice.call(arguments,1),_=Object.create(this.lexer),T={yy:{}};for(var zt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,zt)&&(T.yy[zt]=this.yy[zt]);_.setInput(c,T.yy),T.yy.lexer=_,T.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Ht=_.yylloc;m.push(Ht);var Ms=_.options&&_.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var zs=function(){var D;return D=_.lex()||ye,typeof D!="number"&&(D=h.symbols_[D]||D),D},A,R,w,jt,I={},_t,S,_e,vt;;){if(R=p[p.length-1],this.defaultActions[R]?w=this.defaultActions[R]:((A===null||typeof A>"u")&&(A=zs()),w=y[R]&&y[R][A]),typeof w>"u"||!w.length||!w[0]){var It="";vt=[];for(_t in y[R])this.terminals_[_t]&&_t>Ns&&vt.push("'"+this.terminals_[_t]+"'");_.showPosition?It="Parse error on line "+(E+1)+`:
`+_.showPosition()+`
Expecting `+vt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":It="Parse error on line "+(E+1)+": Unexpected "+(A==ye?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(It,{text:_.match,token:this.terminals_[A]||A,line:_.yylineno,loc:Ht,expected:vt})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+A);switch(w[0]){case 1:p.push(A),g.push(_.yytext),m.push(_.yylloc),p.push(w[1]),A=null,ge=_.yyleng,Mt=_.yytext,E=_.yylineno,Ht=_.yylloc;break;case 2:if(S=this.productions_[w[1]][1],I.$=g[g.length-S],I._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Ms&&(I._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),jt=this.performAction.apply(I,[Mt,ge,E,T.yy,w[1],g,m].concat(Ls)),typeof jt<"u")return jt;S&&(p=p.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),p.push(this.productions_[w[1]][0]),g.push(I.$),m.push(I._$),_e=y[p[p.length-2]][p[p.length-1]],p.push(_e);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof ki<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(gs);function q(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var ys={Root:q("Root"),Concat:q("Concat"),Literal:q("Literal"),Splat:q("Splat"),Param:q("Param"),Optional:q("Optional")},_s=gs.parser;_s.yy=ys;var Oi=_s,Ci=Object.keys(ys);function Ti(r){return Ci.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var vs=Ti,Ri=vs,Ui=/[\-{}\[\]+?.,\\\^$|#\s]/g;function $s(r){this.captures=r.captures,this.re=r.re}$s.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Ni=Ri({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Ui,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new $s({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Li=Ni,Mi=vs,zi=Mi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Hi=zi,ji=Oi,Ii=Li,Di=Hi;gt.prototype=Object.create(null);gt.prototype.match=function(r){var t=Ii.visit(this.ast),e=t.match(r);return e||!1};gt.prototype.reverse=function(r){return Di.visit(this.ast,r)};function gt(r){var t;if(this?t=this:t=Object.create(gt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=ji.parse(r),t}var Vi=gt,qi=Vi,Fi=qi;const Bi=Pi(Fi);var Wi=Object.defineProperty,bs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Wi(t,e,i),i};const As=class extends W{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>et` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new Bi(i.path)})),this._historyObserver=new C(this,e),this._authObserver=new C(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),et` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(es(this,"auth/redirect"),et` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):et` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),et` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){se(this,"history/redirect",{href:t})}};As.styles=oi`
    :host,
    main {
      display: contents;
    }
  `;let Pt=As;bs([ms()],Pt.prototype,"_user");bs([ms()],Pt.prototype,"_match");const Yi=Object.freeze(Object.defineProperty({__proto__:null,Element:Pt,Switch:Pt},Symbol.toStringTag,{value:"Module"})),Ki=class Es extends HTMLElement{constructor(){if(super(),Tt(this).template(Es.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ki.template=z`
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
  `;const ws=class Gt extends HTMLElement{constructor(){super(),this._array=[],Tt(this).template(Gt.template).styles(Gt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ss("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Jt(t,"button.add")?Et(t,"input-array:add"):Jt(t,"button.remove")&&Et(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ji(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ws.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ws.styles=te`
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
  `;function Ji(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ss(e)))}function Ss(r,t){const e=r===void 0?z`<input />`:z`<input value="${r}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Zi(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Gi=Object.defineProperty,Qi=Object.getOwnPropertyDescriptor,Xi=(r,t,e,s)=>{for(var i=Qi(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Gi(t,e,i),i};class tr extends W{constructor(t){super(),this._pending=[],this._observer=new C(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Xi([fs()],tr.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,ae=bt.ShadowRoot&&(bt.ShadyCSS===void 0||bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,le=Symbol(),ze=new WeakMap;let xs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ae&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ze.set(e,t))}return t}toString(){return this.cssText}};const er=r=>new xs(typeof r=="string"?r:r+"",void 0,le),Ut=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new xs(e,r,le)},sr=(r,t)=>{if(ae)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=bt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},He=ae?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return er(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ir,defineProperty:rr,getOwnPropertyDescriptor:nr,getOwnPropertyNames:or,getOwnPropertySymbols:ar,getPrototypeOf:lr}=Object,k=globalThis,je=k.trustedTypes,cr=je?je.emptyScript:"",qt=k.reactiveElementPolyfillSupport,nt=(r,t)=>r,kt={toAttribute(r,t){switch(t){case Boolean:r=r?cr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ce=(r,t)=>!ir(r,t),Ie={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:ce};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);class B extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&rr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=nr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ie}static _$Ei(){if(this.hasOwnProperty(nt("elementProperties")))return;const t=lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nt("properties"))){const e=this.properties,s=[...or(e),...ar(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(He(i))}else t!==void 0&&e.push(He(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return sr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:kt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:kt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ce)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[nt("elementProperties")]=new Map,B[nt("finalized")]=new Map,qt==null||qt({ReactiveElement:B}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ot=globalThis,Ot=ot.trustedTypes,De=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ps="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,ks="?"+P,hr=`<${ks}>`,j=document,ht=()=>j.createComment(""),ut=r=>r===null||typeof r!="object"&&typeof r!="function",he=Array.isArray,ur=r=>he(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Ft=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,qe=/>/g,N=RegExp(`>|${Ft}(?:([^\\s"'>=/]+)(${Ft}*=${Ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,Be=/"/g,Os=/^(?:script|style|textarea|title)$/i,dr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),b=dr(1),G=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),We=new WeakMap,M=j.createTreeWalker(j,129);function Cs(r,t){if(!he(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return De!==void 0?De.createHTML(t):t}const pr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=st;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===st?f[1]==="!--"?o=Ve:f[1]!==void 0?o=qe:f[2]!==void 0?(Os.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??st,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?Be:Fe):o===Be||o===Fe?o=N:o===Ve||o===qe?o=st:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===st?a+hr:u>=0?(s.push(d),a.slice(0,u)+Ps+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[Cs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class dt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=pr(t,e);if(this.el=dt.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ps)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?mr:p[1]==="?"?gr:p[1]==="@"?yr:Nt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Os.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ht()),M.nextNode(),a.push({type:2,index:++n});i.append(u[c],ht())}}}else if(i.nodeType===8)if(i.data===ks)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}}function Q(r,t,e=r,s){var o,l;if(t===G)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ut(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=Q(r,i._$AS(r,t.values),i,s)),t}class fr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??j).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new yt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new _r(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class yt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),ut(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ur(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=dt.createElement(Cs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new fr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=We.get(t.strings);return e===void 0&&We.set(t.strings,e=new dt(t)),e}k(t){he(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new yt(this.O(ht()),this.O(ht()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!ut(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Q(this,l[s+a],e,a),d===G&&(d=this._$AH[a]),o||(o=!ut(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class mr extends Nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class gr extends Nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class yr extends Nt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??$)===G)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class _r{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const Bt=ot.litHtmlPolyfillSupport;Bt==null||Bt(dt,yt),(ot.litHtmlVersions??(ot.litHtmlVersions=[])).push("3.2.1");const vr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new yt(t.insertBefore(ht(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=vr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return G}};var Ye;O._$litElement$=!0,O.finalized=!0,(Ye=globalThis.litElementHydrateSupport)==null||Ye.call(globalThis,{LitElement:O});const Wt=globalThis.litElementPolyfillSupport;Wt==null||Wt({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $r={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:ce},br=(r=$r,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ts(r){return(t,e)=>typeof e=="object"?br(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lt(r){return Ts({...r,state:!0,attribute:!1})}const Ar=te`
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
`,ue={styles:Ar};var Er=Object.defineProperty,Rs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Er(t,e,i),i};function wr(r){const e=r.target.checked;ss.relay(r,"dark-mode",{checked:e})}function Sr(r){ss.relay(r,"auth:message",["auth/signout"])}const de=class de extends O{constructor(){super(...arguments),this.userid="anonymous",this.location="/app",this._authObserver=new C(this,"log:auth"),this._histObserver=new C(this,"log:history")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{var e,s;if(t&&t.username!==this.userid){this.userid=t.username;const i=(s=(e=this.shadowRoot)==null?void 0:e.querySelector("#userid"))==null?void 0:s.parentNode;i.href=`/user/${this.userid}`}}),this._histObserver.observe(({location:t})=>{console.log("LOCATION",t.pathname),console.log("PREV LOCATION",this.location),t&&t.pathname!==this.location&&(this.location=t.pathname)})}render(){return b`
      <header>
        ${this.location==="/app"?b`<h1>PPL Routine</h1>`:b`<a class="link" href="/">&larr; Workout Log</a>`}
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
              <label @change=${wr}>
                <input type="checkbox" autocomplete="off" />
                Dark mode
              </label>
            </li>
            <li class="when-signed-in">
              <a class="link" id="signout" @click=${Sr}>Sign Out</a>
            </li>
            <li class="when-signed-out">
              <a class="link" href="/login">Sign In</a>
            </li>
          </menu>
        </div>
      </header>
    `}};de.styles=[ue.styles,Ut`
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
      h1 {
        font-size: var(--size-type-xxlarge);
        font-style: oblique;
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
    `];let pt=de;Rs([Lt()],pt.prototype,"userid");Rs([Lt()],pt.prototype,"location");function xr(r,t,e){r.preventDefault();const s=r.target,i=new FormData(s),n="POST",o={"Content-Type":"application/json"},l=JSON.stringify(Object.fromEntries(i));fetch(t,{method:n,headers:o,body:l}).then(a=>{if(a.status!==200)throw`Form submission failed: Status ${a.status}`;return a.json()}).then(a=>{const{token:d}=a;s.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:d,redirect:e}]}))}).catch(a=>console.log("Error submitting form:",a))}const pe=class pe extends O{handleSubmit(t){const e=this.getAttribute("api"),s=this.getAttribute("redirect")||"/";e&&xr(t,e,s)}render(){return b`
      <form @submit=${this.handleSubmit}>
        <slot name="title">
          <h3>Sign in with Username and Password</h3>
        </slot>
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
    `}};pe.styles=Ut`
    /* TODO: Style the header here */
  `;let Qt=pe;var Pr=Object.defineProperty,kr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Pr(t,e,i),i};const fe=class fe extends O{constructor(){super(...arguments),this._authObserver=new C(this,"log:auth"),this._user=new At.User}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t)})}render(){const e=[["legs","Legs",[{name:"Squat",ref:"squat"},{name:"Leg Press",ref:"leg-press"},{name:"Glute-Ham Raise",ref:"ghr"},{name:"Leg Extension",ref:"leg-extension"},{name:"Leg Curl",ref:"leg-curl"}]],["push","Push",[{name:"Bench Press",ref:"bench-press"}]],["pull","Pull",[{name:"Pull-up",ref:"pull-up"}]]].map(([s,i,n])=>this.renderWorkout([s,i,n]));return b`
      <main class="page">
        <section class="log">${e}</section>
      </main>
    `}renderWorkout([t,e,s]){return b`
      <section class="workout">
        <h2>
          <a href="/workout/${t}.html">${e}</a>
          <svg class="icon">
            <use href="/icons/workouts.svg#icon-${t}" />
          </svg>
        </h2>
        <section class="exercises">
          <dl>
            ${s.map(i=>b`
                  <!-- <exercise-entry
                    src="/api/entry/exercise/${i.ref}"
                    ref=${i.ref}
                  >
                    ${i.name}
                  </exercise-entry> -->
                  <section class="exercise">
                    <dt>
                      <a href="/app/exercise/${i.ref}"
                        ><slot>${i.name}</slot></a
                      >
                    </dt>
                    <dd>
                      <ul>
                        <slot name="entries">No entries yet</slot>
                      </ul>
                    </dd>
                  </section>
                `)}
          </dl>
        </section>
      </section>
    `}};fe.styles=[ue.styles,Ut`
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
      a {
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
        --page-grids: 3;
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

          > exercise-entries {
            border: var(--size-border) solid var(--color-accent);
            border-top: none;
            padding: var(--size-spacing-medium);
          }
        }
        :nth-child(even) {
          border-left: none;
        }
      }
    `];let Ct=fe;kr([Lt()],Ct.prototype,"_authObserver");var Or=Object.defineProperty,Us=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Or(t,e,i),i};const me=class me extends O{constructor(){super(...arguments),this.ref="",this._authObserver=new C(this,"log:auth"),this._user=new At.User}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate()})}hydrate(){const t=`/api/exercise/${this.ref}`;fetch(t,{headers:At.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{e&&(this.exerciseInfo=e)}).catch(e=>console.log("Failed to get exercise data:",e))}render(){const{name:t,description:e,muscles:s=[],type:i=[],mechanic:n,level:o,instructions:l=[],images:a=[]}=this.exerciseInfo||{};return b`
      <main class="page">
        <section class="definition">
          <h1>${t}</h1>
          <p>${e}</p>
        </section>
        <section class="instruction">
          <h2>Instructions</h2>
          ${l?b`
                <span slot="instructions">
                  <ol>
                    ${l.map(d=>b`<li>${d}</li>`)}
                  </ol>
                </span>
              `:b`<p>"No instructions.</p>`} <br />
          <p>
            <b>Type:</b> ${i.join(", ")} <br />
            <b>Mechanic:</b> ${n} <br />
            <b>Main muscles targeted:</b> ${s.join(", ")} <br />
            <b>Level:</b> ${o}
          </p>
        </section>
        <section class="images">
          ${a?b`
                ${a.map(d=>b`<img
                      src=${d}
                      style="width: 400px; height: auto"
                    />`)}
              `:""}
        </section>
      </main>
    `}};me.styles=[ue.styles,Ut`
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
    `];let ft=me;Us([Ts({attribute:"ref",reflect:!0})],ft.prototype,"ref");Us([Lt()],ft.prototype,"exerciseInfo");const Cr=[{path:"/app/exercise/:ref",view:r=>b`
      <exercise-view ref=${r.ref}></exercise-view>
    `},{auth:"protected",path:"/app",view:()=>b` <log-view></log-view> `},{path:"/",redirect:"/app"}];Zi({"mu-auth":At.Provider,"mu-history":si.Provider,"mu-switch":class extends Yi.Element{constructor(){super(Cr,"log:history","log:auth")}},"my-header":pt,"login-form":Qt,"log-view":Ct,"exercise-view":ft});

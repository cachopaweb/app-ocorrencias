import{a as __commonJSMin,i as require_react,n as createLucideIcon,r as require_jsx_runtime,u as __toESM}from"./api-aCyM4nR9.js";import{E as require_react_dom}from"./index-c5jQGFJT.js";import{t as Icone_Portal_default}from"./Icone_Portal-kKcdAYE2.js";var Printer=createLucideIcon(`Printer`,[[`path`,{d:`M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,key:`143wyd`}],[`path`,{d:`M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`,key:`1itne7`}],[`rect`,{x:`6`,y:`14`,width:`12`,height:`8`,rx:`1`,key:`1ue0tg`}]]),require_lib=__commonJSMin(((e,t)=>{(function(n,r){typeof e==`object`&&typeof t==`object`?t.exports=r(require_react(),require_react_dom()):typeof define==`function`&&define.amd?define(`lib`,[`react`,`react-dom`],r):typeof e==`object`?e.lib=r(require_react(),require_react_dom()):n.lib=r(n.react,n[`react-dom`])})(typeof self<`u`?self:e,(function(e,t){return function(){var n={328:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.PrintContextConsumer=t.PrintContext=void 0;var r=n(496);t.PrintContext=Object.prototype.hasOwnProperty.call(r,`createContext`)?r.createContext({}):null,t.PrintContextConsumer=t.PrintContext?t.PrintContext.Consumer:function(){return null}},428:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.ReactToPrint=void 0;var r=n(316),i=n(496),a=n(190),o=n(328),s=n(940);t.ReactToPrint=function(e){function t(){var t=e.apply(this,r.__spreadArray([],r.__read(arguments),!1))||this;return t.startPrint=function(e){var n=t.props,r=n.onAfterPrint,i=n.onPrintError,a=n.print,o=n.documentTitle;setTimeout((function(){var n,s;if(e.contentWindow){if(e.contentWindow.focus(),a)a(e).then((function(){return r?.()})).then((function(){return t.handleRemoveIframe()})).catch((function(e){i?i(`print`,e):t.logMessages(["An error was thrown by the specified `print` function"])}));else{if(e.contentWindow.print){var c=e.contentDocument?.title??``,l=e.ownerDocument.title;o&&(e.ownerDocument.title=o,e.contentDocument&&(e.contentDocument.title=o)),e.contentWindow.print(),o&&(e.ownerDocument.title=l,e.contentDocument&&(e.contentDocument.title=c))}else t.logMessages(["Printing for this browser is not currently possible: the browser does not have a `print` method available for iframes."]);r?.(),t.handleRemoveIframe()}}else t.logMessages(["Printing failed because the `contentWindow` of the print iframe did not load. This is possibly an error with `react-to-print`. Please file an issue: https://github.com/gregnb/react-to-print/issues/"])}),500)},t.triggerPrint=function(e){var n=t.props,r=n.onBeforePrint,i=n.onPrintError;if(r){var a=r();a&&typeof a.then==`function`?a.then((function(){t.startPrint(e)})).catch((function(e){i&&i(`onBeforePrint`,e)})):t.startPrint(e)}else t.startPrint(e)},t.handlePrint=function(e){var n=t.props,i=n.bodyClass,o=n.content,s=n.copyStyles,c=n.fonts,l=n.pageStyle,u=n.nonce,d=typeof e==`function`?e():null;if(d&&typeof o==`function`&&t.logMessages(['"react-to-print" received a `content` prop and a content param passed the callback return by `useReactToPrint. The `content` prop will be ignored.'],`warning`),d||typeof o!=`function`||(d=o()),d!==void 0){if(d!==null){var f=document.createElement(`iframe`);f.width=`${document.documentElement.clientWidth}px`,f.height=`${document.documentElement.clientHeight}px`,f.style.position=`absolute`,f.style.top=`-${document.documentElement.clientHeight+100}px`,f.style.left=`-${document.documentElement.clientWidth+100}px`,f.id=`printWindow`,f.srcdoc=`<!DOCTYPE html>`;var p=(0,a.findDOMNode)(d);if(p){var m=p.cloneNode(!0),h=m instanceof Text,g=document.querySelectorAll(`link[rel~='stylesheet'], link[as='style']`),_=h?[]:m.querySelectorAll(`img`),v=h?[]:m.querySelectorAll(`video`),y=c?c.length:0;t.numResourcesToLoad=g.length+_.length+v.length+y,t.resourcesLoaded=[],t.resourcesErrored=[];var b=function(e,n){t.resourcesLoaded.includes(e)?t.logMessages([`Tried to mark a resource that has already been handled`,e],`debug`):(n?(t.logMessages(r.__spreadArray([`"react-to-print" was unable to load a resource but will continue attempting to print the page`],r.__read(n),!1)),t.resourcesErrored.push(e)):t.resourcesLoaded.push(e),t.resourcesLoaded.length+t.resourcesErrored.length===t.numResourcesToLoad&&t.triggerPrint(f))};f.onload=function(){var e,n,a,o;f.onload=null;var d=f.contentDocument||f.contentWindow?.document;if(d){d.body.appendChild(m),c&&(f.contentDocument?.fonts&&f.contentWindow?.FontFace?c.forEach((function(e){var t=new FontFace(e.family,e.source,{weight:e.weight,style:e.style});f.contentDocument.fonts.add(t),t.loaded.then((function(){b(t)})).catch((function(e){b(t,[`Failed loading the font:`,t,`Load error:`,e])}))})):(c.forEach((function(e){return b(e)})),t.logMessages([`"react-to-print" is not able to load custom fonts because the browser does not support the FontFace API but will continue attempting to print the page`])));var g=typeof l==`function`?l():l;if(typeof g!=`string`)t.logMessages([`"react-to-print" expected a "string" from \`pageStyle\` but received "${typeof g}". Styles from \`pageStyle\` will not be applied.`]);else{var y=d.createElement(`style`);u&&(y.setAttribute(`nonce`,u),d.head.setAttribute(`nonce`,u)),y.appendChild(d.createTextNode(g)),d.head.appendChild(y)}if(i&&(e=d.body.classList).add.apply(e,r.__spreadArray([],r.__read(i.split(` `)),!1)),!h){for(var x=h?[]:p.querySelectorAll(`canvas`),S=d.querySelectorAll(`canvas`),C=0;C<x.length;++C){var w=x[C],T=S[C].getContext(`2d`);T&&T.drawImage(w,0,0)}var E=function(e){var t=_[e],n=t.getAttribute(`src`);if(n){var r=new Image;r.onload=function(){return b(t)},r.onerror=function(e,n,r,i,a){return b(t,[`Error loading <img>`,t,`Error`,a])},r.src=n}else b(t,[`Found an <img> tag with an empty "src" attribute. This prevents pre-loading it. The <img> is:`,t])};for(C=0;C<_.length;C++)E(C);var D=function(e){var t=v[e];t.preload=`auto`;var n=t.getAttribute(`poster`);if(n){var r=new Image;r.onload=function(){return b(t)},r.onerror=function(e,r,i,a,o){return b(t,[`Error loading video poster`,n,`for video`,t,`Error:`,o])},r.src=n}else t.readyState>=2?b(t):(t.onloadeddata=function(){return b(t)},t.onerror=function(e,n,r,i,a){return b(t,[`Error loading video`,t,`Error`,a])},t.onstalled=function(){return b(t,[`Loading video stalled, skipping`,t])})};for(C=0;C<v.length;C++)D(C);var O=`input`,k=p.querySelectorAll(O),A=d.querySelectorAll(O);for(C=0;C<k.length;C++)A[C].value=k[C].value;var j=`input[type=checkbox],input[type=radio]`,M=p.querySelectorAll(j),N=d.querySelectorAll(j);for(C=0;C<M.length;C++)N[C].checked=M[C].checked;var P=`select`,F=p.querySelectorAll(P),I=d.querySelectorAll(P);for(C=0;C<F.length;C++)I[C].value=F[C].value}if(s)for(var L=document.querySelectorAll(`style, link[rel~='stylesheet'], link[as='style']`),R=function(e,n){var r=L[e];if(r.tagName.toLowerCase()===`style`){var i=d.createElement(r.tagName),a=r.sheet;if(a){var o=``;try{for(var s=a.cssRules.length,c=0;c<s;++c)typeof a.cssRules[c].cssText==`string`&&(o+=`${a.cssRules[c].cssText}\r
`)}catch{t.logMessages(["A stylesheet could not be accessed. This is likely due to the stylesheet having cross-origin imports, and many browsers block script access to cross-origin stylesheets. See https://github.com/gregnb/react-to-print/issues/429 for details. You may be able to load the sheet by both marking the stylesheet with the cross `crossorigin` attribute, and setting the `Access-Control-Allow-Origin` header on the server serving the stylesheet. Alternatively, host the stylesheet on your domain to avoid this issue entirely.",r],`warning`)}i.setAttribute(`id`,`react-to-print-${e}`),u&&i.setAttribute(`nonce`,u),i.appendChild(d.createTextNode(o)),d.head.appendChild(i)}}else if(r.getAttribute(`href`)){if(r.hasAttribute(`disabled`))t.logMessages(["`react-to-print` encountered a <link> tag with a `disabled` attribute and will ignore it. Note that the `disabled` attribute is deprecated, and some browsers ignore it. You should stop using it. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-disabled. The <link> is:",r],`warning`),b(r);else{for(var l=d.createElement(r.tagName),f=(c=0,r.attributes.length);c<f;++c){var p=r.attributes[c];p&&l.setAttribute(p.nodeName,p.nodeValue||``)}l.onload=function(){return b(l)},l.onerror=function(e,t,n,r,i){return b(l,[`Failed to load`,l,`Error:`,i])},u&&l.setAttribute(`nonce`,u),d.head.appendChild(l)}}else t.logMessages(["`react-to-print` encountered a <link> tag with an empty `href` attribute. In addition to being invalid HTML, this can cause problems in many browsers, and so the <link> was not loaded. The <link> is:",r],`warning`),b(r)},z=(C=0,L.length);C<z;++C)R(C)}t.numResourcesToLoad!==0&&s||t.triggerPrint(f)},t.handleRemoveIframe(!0),document.body.appendChild(f)}else t.logMessages(['"react-to-print" could not locate the DOM node corresponding with the `content` prop'])}else t.logMessages([`There is nothing to print because the "content" prop returned "null". Please ensure "content" is renderable before allowing "react-to-print" to be called.`])}else t.logMessages(["To print a functional component ensure it is wrapped with `React.forwardRef`, and ensure the forwarded ref is used. See the README for an example: https://github.com/gregnb/react-to-print#examples"])},t.handleRemoveIframe=function(e){var n=t.props.removeAfterPrint;if(e||n){var r=document.getElementById(`printWindow`);r&&document.body.removeChild(r)}},t.logMessages=function(e,n){n===void 0&&(n=`error`),t.props.suppressErrors||(n===`error`?console.error(e):n===`warning`?console.warn(e):n===`debug`&&console.debug(e))},t}return r.__extends(t,e),t.prototype.handleClick=function(e,t){var n=this,r=this.props,i=r.onBeforeGetContent,a=r.onPrintError;if(i){var o=i();o&&typeof o.then==`function`?o.then((function(){return n.handlePrint(t)})).catch((function(e){a&&a(`onBeforeGetContent`,e)})):this.handlePrint(t)}else this.handlePrint(t)},t.prototype.render=function(){var e=this.props,t=e.children,n=e.trigger;if(n)return i.cloneElement(n(),{onClick:this.handleClick.bind(this)});if(!o.PrintContext)return this.logMessages([`"react-to-print" requires React ^16.3.0 to be able to use "PrintContext"`]),null;var r={handlePrint:this.handleClick.bind(this)};return i.createElement(o.PrintContext.Provider,{value:r},t)},t.defaultProps=s.defaultProps,t}(i.Component)},940:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.defaultProps=void 0,t.defaultProps={copyStyles:!0,pageStyle:`
        @page {
            /* Remove browser default header (title) and footer (url) */
            margin: 0;
        }
        @media print {
            body {
                /* Tell browsers to print background colors */
                -webkit-print-color-adjust: exact; /* Chrome/Safari/Edge/Opera */
                color-adjust: exact; /* Firefox */
            }
        }
    `,removeAfterPrint:!1,suppressErrors:!1}},892:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.useReactToPrint=void 0;var r=n(316),i=n(496),a=n(428),o=n(940),s=n(860),c=Object.prototype.hasOwnProperty.call(i,`useMemo`)&&Object.prototype.hasOwnProperty.call(i,`useCallback`);t.useReactToPrint=function(e){if(!c)return e.suppressErrors||console.error(`"react-to-print" requires React ^16.8.0 to be able to use "useReactToPrint"`),function(){throw Error(`"react-to-print" requires React ^16.8.0 to be able to use "useReactToPrint"`)};var t=i.useMemo((function(){return new a.ReactToPrint(r.__assign(r.__assign({},o.defaultProps),e))}),[e]);return i.useCallback((function(e,n){return(0,s.wrapCallbackWithArgs)(t,t.handleClick,n)(e)}),[t])}},860:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.wrapCallbackWithArgs=void 0;var r=n(316);t.wrapCallbackWithArgs=function(e,t){var n=[...arguments].slice(2);return function(){var i=[...arguments];return t.apply(e,r.__spreadArray(r.__spreadArray([],r.__read(i),!1),r.__read(n),!1))}}},496:function(t){t.exports=e},190:function(e){e.exports=t},316:function(e,t,n){n.r(t),n.d(t,{__addDisposableResource:function(){return P},__assign:function(){return a},__asyncDelegator:function(){return T},__asyncGenerator:function(){return w},__asyncValues:function(){return E},__await:function(){return C},__awaiter:function(){return m},__classPrivateFieldGet:function(){return j},__classPrivateFieldIn:function(){return N},__classPrivateFieldSet:function(){return M},__createBinding:function(){return g},__decorate:function(){return s},__disposeResources:function(){return I},__esDecorate:function(){return l},__exportStar:function(){return _},__extends:function(){return i},__generator:function(){return h},__importDefault:function(){return A},__importStar:function(){return k},__makeTemplateObject:function(){return D},__metadata:function(){return p},__param:function(){return c},__propKey:function(){return d},__read:function(){return y},__rest:function(){return o},__runInitializers:function(){return u},__setFunctionName:function(){return f},__spread:function(){return b},__spreadArray:function(){return S},__spreadArrays:function(){return x},__values:function(){return v}});var r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)};function i(e,t){if(typeof t!=`function`&&t!==null)throw TypeError(`Class extends value `+String(t)+` is not a constructor or null`);function n(){this.constructor=e}r(e,t),e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var a=function(){return a=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},a.apply(this,arguments)};function o(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}function s(e,t,n,r){var i,a=arguments.length,o=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)o=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(o=(a<3?i(o):a>3?i(t,n,o):i(t,n))||o);return a>3&&o&&Object.defineProperty(t,n,o),o}function c(e,t){return function(n,r){t(n,r,e)}}function l(e,t,n,r,i,a){function o(e){if(e!==void 0&&typeof e!=`function`)throw TypeError(`Function expected`);return e}for(var s,c=r.kind,l=c===`getter`?`get`:c===`setter`?`set`:`value`,u=!t&&e?r.static?e:e.prototype:null,d=t||(u?Object.getOwnPropertyDescriptor(u,r.name):{}),f=!1,p=n.length-1;p>=0;p--){var m={};for(var h in r)m[h]=h===`access`?{}:r[h];for(var h in r.access)m.access[h]=r.access[h];m.addInitializer=function(e){if(f)throw TypeError(`Cannot add initializers after decoration has completed`);a.push(o(e||null))};var g=(0,n[p])(c===`accessor`?{get:d.get,set:d.set}:d[l],m);if(c===`accessor`){if(g===void 0)continue;if(typeof g!=`object`||!g)throw TypeError(`Object expected`);(s=o(g.get))&&(d.get=s),(s=o(g.set))&&(d.set=s),(s=o(g.init))&&i.unshift(s)}else(s=o(g))&&(c===`field`?i.unshift(s):d[l]=s)}u&&Object.defineProperty(u,r.name,d),f=!0}function u(e,t,n){for(var r=arguments.length>2,i=0;i<t.length;i++)n=r?t[i].call(e,n):t[i].call(e);return r?n:void 0}function d(e){return typeof e==`symbol`?e:`${e}`}function f(e,t,n){return typeof t==`symbol`&&(t=t.description?`[${t.description}]`:``),Object.defineProperty(e,"name",{configurable:!0,value:n?`${n} ${t}`:t})}function p(e,t){if(typeof Reflect==`object`&&typeof Reflect.metadata==`function`)return Reflect.metadata(e,t)}function m(e,t,n,r){return new(n||=Promise)((function(i,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,s)}c((r=r.apply(e,t||[])).next())}))}function h(e,t){var n,r,i,a,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},typeof Symbol==`function`&&(a[Symbol.iterator]=function(){return this}),a;function s(s){return function(c){return function(s){if(n)throw TypeError(`Generator is already executing.`);for(;a&&(a=0,s[0]&&(o=0)),o;)try{if(n=1,r&&(i=2&s[0]?r.return:s[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,s[1])).done)return i;switch(r=0,i&&(s=[2&s[0],i.value]),s[0]){case 0:case 1:i=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,r=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!((i=(i=o.trys).length>0&&i[i.length-1])||s[0]!==6&&s[0]!==2)){o=0;continue}if(s[0]===3&&(!i||s[1]>i[0]&&s[1]<i[3])){o.label=s[1];break}if(s[0]===6&&o.label<i[1]){o.label=i[1],i=s;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(s);break}i[2]&&o.ops.pop(),o.trys.pop();continue}s=t.call(e,o)}catch(e){s=[6,e],r=0}finally{n=i=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,c])}}}var g=Object.create?function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);i&&!(`get`in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}:function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]};function _(e,t){for(var n in e)n==="default"||Object.prototype.hasOwnProperty.call(t,n)||g(t,e,n)}function v(e){var t=typeof Symbol==`function`&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length==`number`)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw TypeError(t?`Object is not iterable.`:`Symbol.iterator is not defined.`)}function y(e,t){var n=typeof Symbol==`function`&&e[Symbol.iterator];if(!n)return e;var r,i,a=n.call(e),o=[];try{for(;(t===void 0||t-->0)&&!(r=a.next()).done;)o.push(r.value)}catch(e){i={error:e}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(i)throw i.error}}return o}function b(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(y(arguments[t]));return e}function x(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),i=0;for(t=0;t<n;t++)for(var a=arguments[t],o=0,s=a.length;o<s;o++,i++)r[i]=a[o];return r}function S(e,t,n){if(n||arguments.length===2)for(var r,i=0,a=t.length;i<a;i++)!r&&i in t||(r||=Array.prototype.slice.call(t,0,i),r[i]=t[i]);return e.concat(r||Array.prototype.slice.call(t))}function C(e){return this instanceof C?(this.v=e,this):new C(e)}function w(e,t,n){if(!Symbol.asyncIterator)throw TypeError(`Symbol.asyncIterator is not defined.`);var r,i=n.apply(e,t||[]),a=[];return r={},o(`next`),o(`throw`),o(`return`),r[Symbol.asyncIterator]=function(){return this},r;function o(e){i[e]&&(r[e]=function(t){return new Promise((function(n,r){a.push([e,t,n,r])>1||s(e,t)}))})}function s(e,t){try{(n=i[e](t)).value instanceof C?Promise.resolve(n.value.v).then(c,l):u(a[0][2],n)}catch(e){u(a[0][3],e)}var n}function c(e){s(`next`,e)}function l(e){s(`throw`,e)}function u(e,t){e(t),a.shift(),a.length&&s(a[0][0],a[0][1])}}function T(e){var t={},n;return r(`next`),r(`throw`,(function(e){throw e})),r(`return`),t[Symbol.iterator]=function(){return this},t;function r(r,i){t[r]=e[r]?function(t){return(n=!n)?{value:C(e[r](t)),done:!1}:i?i(t):t}:i}}function E(e){if(!Symbol.asyncIterator)throw TypeError(`Symbol.asyncIterator is not defined.`);var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e=v(e),t={},r(`next`),r(`throw`),r(`return`),t[Symbol.asyncIterator]=function(){return this},t);function r(n){t[n]=e[n]&&function(t){return new Promise((function(r,i){(function(e,t,n,r){Promise.resolve(r).then((function(t){e({value:t,done:n})}),t)})(r,i,(t=e[n](t)).done,t.value)}))}}}function D(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var O=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t};function k(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)n!=="default"&&Object.prototype.hasOwnProperty.call(e,n)&&g(t,e,n);return O(t,e),t}function A(e){return e&&e.__esModule?e:{default:e}}function j(e,t,n,r){if(n===`a`&&!r)throw TypeError(`Private accessor was defined without a getter`);if(typeof t==`function`?e!==t||!r:!t.has(e))throw TypeError(`Cannot read private member from an object whose class did not declare it`);return n===`m`?r:n===`a`?r.call(e):r?r.value:t.get(e)}function M(e,t,n,r,i){if(r===`m`)throw TypeError(`Private method is not writable`);if(r===`a`&&!i)throw TypeError(`Private accessor was defined without a setter`);if(typeof t==`function`?e!==t||!i:!t.has(e))throw TypeError(`Cannot write private member to an object whose class did not declare it`);return r===`a`?i.call(e,n):i?i.value=n:t.set(e,n),n}function N(e,t){if(t===null||typeof t!=`object`&&typeof t!=`function`)throw TypeError(`Cannot use 'in' operator on non-object`);return typeof e==`function`?t===e:e.has(t)}function P(e,t,n){if(t!=null){if(typeof t!=`object`&&typeof t!=`function`)throw TypeError(`Object expected.`);var r;if(n){if(!Symbol.asyncDispose)throw TypeError(`Symbol.asyncDispose is not defined.`);r=t[Symbol.asyncDispose]}if(r===void 0){if(!Symbol.dispose)throw TypeError(`Symbol.dispose is not defined.`);r=t[Symbol.dispose]}if(typeof r!=`function`)throw TypeError(`Object not disposable.`);e.stack.push({value:t,dispose:r,async:n})}else n&&e.stack.push({async:!0});return t}var F=typeof SuppressedError==`function`?SuppressedError:function(e,t,n){var r=Error(n);return r.name=`SuppressedError`,r.error=e,r.suppressed=t,r};function I(e){function t(t){e.error=e.hasError?new F(t,e.error,`An error was suppressed during disposal.`):t,e.hasError=!0}return function n(){for(;e.stack.length;){var r=e.stack.pop();try{var i=r.dispose&&r.dispose.call(r.value);if(r.async)return Promise.resolve(i).then(n,(function(e){return t(e),n()}))}catch(e){t(e)}}if(e.hasError)throw e.error}()}t.default={__extends:i,__assign:a,__rest:o,__decorate:s,__param:c,__metadata:p,__awaiter:m,__generator:h,__createBinding:g,__exportStar:_,__values:v,__read:y,__spread:b,__spreadArrays:x,__spreadArray:S,__await:C,__asyncGenerator:w,__asyncDelegator:T,__asyncValues:E,__makeTemplateObject:D,__importStar:k,__importDefault:A,__classPrivateFieldGet:j,__classPrivateFieldSet:M,__classPrivateFieldIn:N,__addDisposableResource:P,__disposeResources:I}}},r={};function i(e){var t=r[e];if(t!==void 0)return t.exports;var a=r[e]={exports:{}};return n[e](a,a.exports,i),a.exports}i.d=function(e,t){for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.r=function(e){typeof Symbol<`u`&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:`Module`}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return function(){var e=a;Object.defineProperty(e,"__esModule",{value:!0}),e.useReactToPrint=e.ReactToPrint=e.PrintContextConsumer=void 0;var t=i(328);Object.defineProperty(e,"PrintContextConsumer",{enumerable:!0,get:function(){return t.PrintContextConsumer}});var n=i(428);Object.defineProperty(e,"ReactToPrint",{enumerable:!0,get:function(){return n.ReactToPrint}});var r=i(892);Object.defineProperty(e,"useReactToPrint",{enumerable:!0,get:function(){return r.useReactToPrint}}),e.default=i(428).ReactToPrint}(),a}()}))})),import_react=__toESM(require_react()),leftRecibo_default=`/assets/leftRecibo-Cb-_SYr-.png`,portalCom_default=`/assets/portalCom-DEOBG1iw.png`,__defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(e,t,n)=>t in e?__defProp(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,__spreadValues=(e,t)=>{for(var n in t||={})__hasOwnProp.call(t,n)&&__defNormalProp(e,n,t[n]);if(__getOwnPropSymbols)for(var n of __getOwnPropSymbols(t))__propIsEnum.call(t,n)&&__defNormalProp(e,n,t[n]);return e},__objRest=(e,t)=>{var n={};for(var r in e)__hasOwnProp.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&__getOwnPropSymbols)for(var r of __getOwnPropSymbols(e))t.indexOf(r)<0&&__propIsEnum.call(e,r)&&(n[r]=e[r]);return n},qrcodegen;(e=>{let t=class{constructor(e,n,r,i){if(this.version=e,this.errorCorrectionLevel=n,this.modules=[],this.isFunction=[],e<t.MIN_VERSION||e>t.MAX_VERSION)throw RangeError(`Version value out of range`);if(i<-1||i>7)throw RangeError(`Mask value out of range`);this.size=e*4+17;let o=[];for(let e=0;e<this.size;e++)o.push(!1);for(let e=0;e<this.size;e++)this.modules.push(o.slice()),this.isFunction.push(o.slice());this.drawFunctionPatterns();let s=this.addEccAndInterleave(r);if(this.drawCodewords(s),i==-1){let e=1e9;for(let t=0;t<8;t++){this.applyMask(t),this.drawFormatBits(t);let n=this.getPenaltyScore();n<e&&(i=t,e=n),this.applyMask(t)}}a(0<=i&&i<=7),this.mask=i,this.applyMask(i),this.drawFormatBits(i),this.isFunction=[]}static encodeText(n,r){let i=e.QrSegment.makeSegments(n);return t.encodeSegments(i,r)}static encodeBinary(n,r){let i=e.QrSegment.makeBytes(n);return t.encodeSegments([i],r)}static encodeSegments(e,n,i=1,o=40,c=-1,l=!0){if(!(t.MIN_VERSION<=i&&i<=o&&o<=t.MAX_VERSION)||c<-1||c>7)throw RangeError(`Invalid value`);let u,d;for(u=i;;u++){let r=t.getNumDataCodewords(u,n)*8,i=s.getTotalBits(e,u);if(i<=r){d=i;break}if(u>=o)throw RangeError(`Data too long`)}for(let e of[t.Ecc.MEDIUM,t.Ecc.QUARTILE,t.Ecc.HIGH])l&&d<=t.getNumDataCodewords(u,e)*8&&(n=e);let f=[];for(let t of e){r(t.mode.modeBits,4,f),r(t.numChars,t.mode.numCharCountBits(u),f);for(let e of t.getData())f.push(e)}a(f.length==d);let p=t.getNumDataCodewords(u,n)*8;a(f.length<=p),r(0,Math.min(4,p-f.length),f),r(0,(8-f.length%8)%8,f),a(f.length%8==0);for(let e=236;f.length<p;e^=253)r(e,8,f);let m=[];for(;m.length*8<f.length;)m.push(0);return f.forEach((e,t)=>m[t>>>3]|=e<<7-(t&7)),new t(u,n,m,c)}getModule(e,t){return 0<=e&&e<this.size&&0<=t&&t<this.size&&this.modules[t][e]}getModules(){return this.modules}drawFunctionPatterns(){for(let e=0;e<this.size;e++)this.setFunctionModule(6,e,e%2==0),this.setFunctionModule(e,6,e%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);let e=this.getAlignmentPatternPositions(),t=e.length;for(let n=0;n<t;n++)for(let r=0;r<t;r++)n==0&&r==0||n==0&&r==t-1||n==t-1&&r==0||this.drawAlignmentPattern(e[n],e[r]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(e){let t=this.errorCorrectionLevel.formatBits<<3|e,n=t;for(let e=0;e<10;e++)n=n<<1^(n>>>9)*1335;let r=(t<<10|n)^21522;a(!(r>>>15));for(let e=0;e<=5;e++)this.setFunctionModule(8,e,i(r,e));this.setFunctionModule(8,7,i(r,6)),this.setFunctionModule(8,8,i(r,7)),this.setFunctionModule(7,8,i(r,8));for(let e=9;e<15;e++)this.setFunctionModule(14-e,8,i(r,e));for(let e=0;e<8;e++)this.setFunctionModule(this.size-1-e,8,i(r,e));for(let e=8;e<15;e++)this.setFunctionModule(8,this.size-15+e,i(r,e));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let e=this.version;for(let t=0;t<12;t++)e=e<<1^(e>>>11)*7973;let t=this.version<<12|e;a(!(t>>>18));for(let e=0;e<18;e++){let n=i(t,e),r=this.size-11+e%3,a=Math.floor(e/3);this.setFunctionModule(r,a,n),this.setFunctionModule(a,r,n)}}drawFinderPattern(e,t){for(let n=-4;n<=4;n++)for(let r=-4;r<=4;r++){let i=Math.max(Math.abs(r),Math.abs(n)),a=e+r,o=t+n;0<=a&&a<this.size&&0<=o&&o<this.size&&this.setFunctionModule(a,o,i!=2&&i!=4)}}drawAlignmentPattern(e,t){for(let n=-2;n<=2;n++)for(let r=-2;r<=2;r++)this.setFunctionModule(e+r,t+n,Math.max(Math.abs(r),Math.abs(n))!=1)}setFunctionModule(e,t,n){this.modules[t][e]=n,this.isFunction[t][e]=!0}addEccAndInterleave(e){let n=this.version,r=this.errorCorrectionLevel;if(e.length!=t.getNumDataCodewords(n,r))throw RangeError(`Invalid argument`);let i=t.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][n],o=t.ECC_CODEWORDS_PER_BLOCK[r.ordinal][n],s=Math.floor(t.getNumRawDataModules(n)/8),c=i-s%i,l=Math.floor(s/i),u=[],d=t.reedSolomonComputeDivisor(o);for(let n=0,r=0;n<i;n++){let i=e.slice(r,r+l-o+(n<c?0:1));r+=i.length;let a=t.reedSolomonComputeRemainder(i,d);n<c&&i.push(0),u.push(i.concat(a))}let f=[];for(let e=0;e<u[0].length;e++)u.forEach((t,n)=>{(e!=l-o||n>=c)&&f.push(t[e])});return a(f.length==s),f}drawCodewords(e){if(e.length!=Math.floor(t.getNumRawDataModules(this.version)/8))throw RangeError(`Invalid argument`);let n=0;for(let t=this.size-1;t>=1;t-=2){t==6&&(t=5);for(let r=0;r<this.size;r++)for(let a=0;a<2;a++){let o=t-a,s=t+1&2?r:this.size-1-r;!this.isFunction[s][o]&&n<e.length*8&&(this.modules[s][o]=i(e[n>>>3],7-(n&7)),n++)}}a(n==e.length*8)}applyMask(e){if(e<0||e>7)throw RangeError(`Mask value out of range`);for(let t=0;t<this.size;t++)for(let n=0;n<this.size;n++){let r;switch(e){case 0:r=(n+t)%2==0;break;case 1:r=t%2==0;break;case 2:r=n%3==0;break;case 3:r=(n+t)%3==0;break;case 4:r=(Math.floor(n/3)+Math.floor(t/2))%2==0;break;case 5:r=n*t%2+n*t%3==0;break;case 6:r=(n*t%2+n*t%3)%2==0;break;case 7:r=((n+t)%2+n*t%3)%2==0;break;default:throw Error(`Unreachable`)}!this.isFunction[t][n]&&r&&(this.modules[t][n]=!this.modules[t][n])}}getPenaltyScore(){let e=0;for(let n=0;n<this.size;n++){let r=!1,i=0,a=[0,0,0,0,0,0,0];for(let o=0;o<this.size;o++)this.modules[n][o]==r?(i++,i==5?e+=t.PENALTY_N1:i>5&&e++):(this.finderPenaltyAddHistory(i,a),r||(e+=this.finderPenaltyCountPatterns(a)*t.PENALTY_N3),r=this.modules[n][o],i=1);e+=this.finderPenaltyTerminateAndCount(r,i,a)*t.PENALTY_N3}for(let n=0;n<this.size;n++){let r=!1,i=0,a=[0,0,0,0,0,0,0];for(let o=0;o<this.size;o++)this.modules[o][n]==r?(i++,i==5?e+=t.PENALTY_N1:i>5&&e++):(this.finderPenaltyAddHistory(i,a),r||(e+=this.finderPenaltyCountPatterns(a)*t.PENALTY_N3),r=this.modules[o][n],i=1);e+=this.finderPenaltyTerminateAndCount(r,i,a)*t.PENALTY_N3}for(let n=0;n<this.size-1;n++)for(let r=0;r<this.size-1;r++){let i=this.modules[n][r];i==this.modules[n][r+1]&&i==this.modules[n+1][r]&&i==this.modules[n+1][r+1]&&(e+=t.PENALTY_N2)}let n=0;for(let e of this.modules)n=e.reduce((e,t)=>e+ +!!t,n);let r=this.size*this.size,i=Math.ceil(Math.abs(n*20-r*10)/r)-1;return a(0<=i&&i<=9),e+=i*t.PENALTY_N4,a(0<=e&&e<=2568888),e}getAlignmentPatternPositions(){if(this.version==1)return[];{let e=Math.floor(this.version/7)+2,t=this.version==32?26:Math.ceil((this.version*4+4)/(e*2-2))*2,n=[6];for(let r=this.size-7;n.length<e;r-=t)n.splice(1,0,r);return n}}static getNumRawDataModules(e){if(e<t.MIN_VERSION||e>t.MAX_VERSION)throw RangeError(`Version number out of range`);let n=(16*e+128)*e+64;if(e>=2){let t=Math.floor(e/7)+2;n-=(25*t-10)*t-55,e>=7&&(n-=36)}return a(208<=n&&n<=29648),n}static getNumDataCodewords(e,n){return Math.floor(t.getNumRawDataModules(e)/8)-t.ECC_CODEWORDS_PER_BLOCK[n.ordinal][e]*t.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][e]}static reedSolomonComputeDivisor(e){if(e<1||e>255)throw RangeError(`Degree out of range`);let n=[];for(let t=0;t<e-1;t++)n.push(0);n.push(1);let r=1;for(let i=0;i<e;i++){for(let e=0;e<n.length;e++)n[e]=t.reedSolomonMultiply(n[e],r),e+1<n.length&&(n[e]^=n[e+1]);r=t.reedSolomonMultiply(r,2)}return n}static reedSolomonComputeRemainder(e,n){let r=n.map(e=>0);for(let i of e){let e=i^r.shift();r.push(0),n.forEach((n,i)=>r[i]^=t.reedSolomonMultiply(n,e))}return r}static reedSolomonMultiply(e,t){if(e>>>8||t>>>8)throw RangeError(`Byte out of range`);let n=0;for(let r=7;r>=0;r--)n=n<<1^(n>>>7)*285,n^=(t>>>r&1)*e;return a(!(n>>>8)),n}finderPenaltyCountPatterns(e){let t=e[1];a(t<=this.size*3);let n=t>0&&e[2]==t&&e[3]==t*3&&e[4]==t&&e[5]==t;return(n&&e[0]>=t*4&&e[6]>=t?1:0)+(n&&e[6]>=t*4&&e[0]>=t?1:0)}finderPenaltyTerminateAndCount(e,t,n){return e&&(this.finderPenaltyAddHistory(t,n),t=0),t+=this.size,this.finderPenaltyAddHistory(t,n),this.finderPenaltyCountPatterns(n)}finderPenaltyAddHistory(e,t){t[0]==0&&(e+=this.size),t.pop(),t.unshift(e)}},n=t;n.MIN_VERSION=1,n.MAX_VERSION=40,n.PENALTY_N1=3,n.PENALTY_N2=3,n.PENALTY_N3=40,n.PENALTY_N4=10,n.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],n.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],e.QrCode=n;function r(e,t,n){if(t<0||t>31||e>>>t)throw RangeError(`Value out of range`);for(let r=t-1;r>=0;r--)n.push(e>>>r&1)}function i(e,t){return!!(e>>>t&1)}function a(e){if(!e)throw Error(`Assertion error`)}let o=class{constructor(e,t,n){if(this.mode=e,this.numChars=t,this.bitData=n,t<0)throw RangeError(`Invalid argument`);this.bitData=n.slice()}static makeBytes(e){let t=[];for(let n of e)r(n,8,t);return new o(o.Mode.BYTE,e.length,t)}static makeNumeric(e){if(!o.isNumeric(e))throw RangeError(`String contains non-numeric characters`);let t=[];for(let n=0;n<e.length;){let i=Math.min(e.length-n,3);r(parseInt(e.substr(n,i),10),i*3+1,t),n+=i}return new o(o.Mode.NUMERIC,e.length,t)}static makeAlphanumeric(e){if(!o.isAlphanumeric(e))throw RangeError(`String contains unencodable characters in alphanumeric mode`);let t=[],n=0;for(;n+2<=e.length;n+=2){let i=o.ALPHANUMERIC_CHARSET.indexOf(e.charAt(n))*45;i+=o.ALPHANUMERIC_CHARSET.indexOf(e.charAt(n+1)),r(i,11,t)}return n<e.length&&r(o.ALPHANUMERIC_CHARSET.indexOf(e.charAt(n)),6,t),new o(o.Mode.ALPHANUMERIC,e.length,t)}static makeSegments(e){return e==``?[]:o.isNumeric(e)?[o.makeNumeric(e)]:o.isAlphanumeric(e)?[o.makeAlphanumeric(e)]:[o.makeBytes(o.toUtf8ByteArray(e))]}static makeEci(e){let t=[];if(e<0)throw RangeError(`ECI assignment value out of range`);if(e<128)r(e,8,t);else if(e<16384)r(2,2,t),r(e,14,t);else if(e<1e6)r(6,3,t),r(e,21,t);else throw RangeError(`ECI assignment value out of range`);return new o(o.Mode.ECI,0,t)}static isNumeric(e){return o.NUMERIC_REGEX.test(e)}static isAlphanumeric(e){return o.ALPHANUMERIC_REGEX.test(e)}getData(){return this.bitData.slice()}static getTotalBits(e,t){let n=0;for(let r of e){let e=r.mode.numCharCountBits(t);if(r.numChars>=1<<e)return 1/0;n+=4+e+r.bitData.length}return n}static toUtf8ByteArray(e){e=encodeURI(e);let t=[];for(let n=0;n<e.length;n++)e.charAt(n)==`%`?(t.push(parseInt(e.substr(n+1,2),16)),n+=2):t.push(e.charCodeAt(n));return t}},s=o;s.NUMERIC_REGEX=/^[0-9]*$/,s.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,s.ALPHANUMERIC_CHARSET=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`,e.QrSegment=s})(qrcodegen||={}),(e=>{(e=>{let t=class{constructor(e,t){this.ordinal=e,this.formatBits=t}},n=t;n.LOW=new t(0,1),n.MEDIUM=new t(1,0),n.QUARTILE=new t(2,3),n.HIGH=new t(3,2),e.Ecc=n})(e.QrCode||={})})(qrcodegen||={}),(e=>{(e=>{let t=class{constructor(e,t){this.modeBits=e,this.numBitsCharCount=t}numCharCountBits(e){return this.numBitsCharCount[Math.floor((e+7)/17)]}},n=t;n.NUMERIC=new t(1,[10,12,14]),n.ALPHANUMERIC=new t(2,[9,11,13]),n.BYTE=new t(4,[8,16,16]),n.KANJI=new t(8,[8,10,12]),n.ECI=new t(7,[0,0,0]),e.Mode=n})(e.QrSegment||={})})(qrcodegen||={});var qrcodegen_default=qrcodegen,ERROR_LEVEL_MAP={L:qrcodegen_default.QrCode.Ecc.LOW,M:qrcodegen_default.QrCode.Ecc.MEDIUM,Q:qrcodegen_default.QrCode.Ecc.QUARTILE,H:qrcodegen_default.QrCode.Ecc.HIGH},DEFAULT_SIZE=128,DEFAULT_LEVEL=`L`,DEFAULT_BGCOLOR=`#FFFFFF`,DEFAULT_FGCOLOR=`#000000`,DEFAULT_INCLUDEMARGIN=!1,MARGIN_SIZE=4,DEFAULT_IMG_SCALE=.1;function generatePath(e,t=0){let n=[];return e.forEach(function(e,r){let i=null;e.forEach(function(a,o){if(!a&&i!==null){n.push(`M${i+t} ${r+t}h${o-i}v1H${i+t}z`),i=null;return}if(o===e.length-1){if(!a)return;i===null?n.push(`M${o+t},${r+t} h1v1H${o+t}z`):n.push(`M${i+t},${r+t} h${o+1-i}v1H${i+t}z`);return}a&&i===null&&(i=o)})}),n.join(``)}function excavateModules(e,t){return e.slice().map((e,n)=>n<t.y||n>=t.y+t.h?e:e.map((e,n)=>n<t.x||n>=t.x+t.w?e:!1))}function getImageSettings(e,t,n,r){if(r==null)return null;let i=n?MARGIN_SIZE:0,a=e.length+i*2,o=Math.floor(t*DEFAULT_IMG_SCALE),s=a/t,c=(r.width||o)*s,l=(r.height||o)*s,u=r.x==null?e.length/2-c/2:r.x*s,d=r.y==null?e.length/2-l/2:r.y*s,f=null;if(r.excavate){let e=Math.floor(u),t=Math.floor(d);f={x:e,y:t,w:Math.ceil(c+u-e),h:Math.ceil(l+d-t)}}return{x:u,y:d,h:l,w:c,excavation:f}}var SUPPORTS_PATH2D=function(){try{new Path2D().addPath(new Path2D)}catch{return!1}return!0}();function QRCodeSVG(e){let t=e,{value:n,size:r=DEFAULT_SIZE,level:i=DEFAULT_LEVEL,bgColor:a=DEFAULT_BGCOLOR,fgColor:o=DEFAULT_FGCOLOR,includeMargin:s=DEFAULT_INCLUDEMARGIN,imageSettings:c}=t,l=__objRest(t,[`value`,`size`,`level`,`bgColor`,`fgColor`,`includeMargin`,`imageSettings`]),u=qrcodegen_default.QrCode.encodeText(n,ERROR_LEVEL_MAP[i]).getModules(),d=s?MARGIN_SIZE:0,f=u.length+d*2,p=getImageSettings(u,r,s,c),m=null;c!=null&&p!=null&&(p.excavation!=null&&(u=excavateModules(u,p.excavation)),m=import_react.createElement(`image`,{xlinkHref:c.src,height:p.h,width:p.w,x:p.x+d,y:p.y+d,preserveAspectRatio:`none`}));let h=generatePath(u,d);return import_react.createElement(`svg`,__spreadValues({height:r,width:r,viewBox:`0 0 ${f} ${f}`},l),import_react.createElement(`path`,{fill:a,d:`M0,0 h${f}v${f}H0z`,shapeRendering:`crispEdges`}),import_react.createElement(`path`,{fill:o,d:h,shapeRendering:`crispEdges`}),m)}var require_extenso_min=__commonJSMin(((exports,module)=>{(function(e,t){typeof exports==`object`&&typeof module==`object`?module.exports=t():typeof define==`function`&&define.amd?define([],t):typeof exports==`object`?exports.extenso=t():e.extenso=t()})(typeof self<`u`?self:exports,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){typeof Symbol<`u`&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:`Module`}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t||4&t&&typeof e==`object`&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&typeof e!=`string`)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,`a`,t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p=``,n(n.s=`./index.js`)}({"./index.js":function(module$1,exports$1,__webpack_require__){eval(`module.exports = __webpack_require__(/*! ./src/write-all */ "./src/write-all.js").default;

//# sourceURL=webpack://extenso/./index.js?`)},"./node_modules/@arr/reverse/module.js":function(module$2,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (arr) {
  if (arr == null) {
    return [];
  }

  var i = 0,
      len = arr.length,
      j = len - 1;
  var k,
      tmp,
      mid = len / 2 | 0; // same as Math.floor

  for (; i < mid; i++) {
    tmp = arr[i];
    k = j - i;
    arr[i] = arr[k];
    arr[k] = tmp;
  }

  return arr;
});

//# sourceURL=webpack://extenso/./node_modules/@arr/reverse/module.js?`)},"./node_modules/assign-deep/index.js":function(module$3,exports$2,__webpack_require__){eval(`/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */


const assignSymbols = __webpack_require__(/*! assign-symbols */ "./node_modules/assign-deep/node_modules/assign-symbols/index.js");

const toString = Object.prototype.toString;

const assign = module.exports = (target, ...args) => {
  let i = 0;
  if (isPrimitive(target)) target = args[i++];
  if (!target) target = {};

  for (; i < args.length; i++) {
    if (isObject(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isObject(target[key]) && isObject(args[i][key])) {
          assign(target[key], args[i][key]);
        } else {
          target[key] = args[i][key];
        }
      }

      assignSymbols(target, args[i]);
    }
  }

  return target;
};

function isObject(val) {
  return typeof val === 'function' || toString.call(val) === '[object Object]';
}

function isPrimitive(val) {
  return typeof val === 'object' ? val === null : typeof val !== 'function';
}

//# sourceURL=webpack://extenso/./node_modules/assign-deep/index.js?`)},"./node_modules/assign-deep/node_modules/assign-symbols/index.js":function(module$4,exports$3,__webpack_require__){eval(`/*!
 * assign-symbols <https://github.com/jonschlinkert/assign-symbols>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */


const toString = Object.prototype.toString;
const isEnumerable = Object.prototype.propertyIsEnumerable;
const getSymbols = Object.getOwnPropertySymbols;

module.exports = (target, ...args) => {
  if (!isObject(target)) {
    throw new TypeError('expected the first argument to be an object');
  }

  if (args.length === 0 || typeof Symbol !== 'function' || typeof getSymbols !== 'function') {
    return target;
  }

  for (let arg of args) {
    let names = getSymbols(arg);

    for (let key of names) {
      if (isEnumerable.call(arg, key)) {
        target[key] = arg[key];
      }
    }
  }

  return target;
};

function isObject(val) {
  return typeof val === 'function' || toString.call(val) === '[object Object]' || Array.isArray(val);
}

//# sourceURL=webpack://extenso/./node_modules/assign-deep/node_modules/assign-symbols/index.js?`)},"./node_modules/format-number/index.js":function(module$5,exports$4){eval(`module.exports = formatter;
module.exports.default = formatter;

function formatter(options) {
  options = options || {}; // *********************************************************************************************
  // Set defaults for negatives
  // options.negative, options.negativeOut, options.separator retained for backward compatibility
  // *********************************************************************************************
  // type of negative; default left

  options.negativeType = options.negativeType || (options.negative === 'R' ? 'right' : 'left'); // negative symbols '-' or '()'

  if (typeof options.negativeLeftSymbol !== 'string') {
    switch (options.negativeType) {
      case 'left':
        options.negativeLeftSymbol = '-';
        break;

      case 'brackets':
        options.negativeLeftSymbol = '(';
        break;

      default:
        options.negativeLeftSymbol = '';
    }
  }

  if (typeof options.negativeRightSymbol !== 'string') {
    switch (options.negativeType) {
      case 'right':
        options.negativeRightSymbol = '-';
        break;

      case 'brackets':
        options.negativeRightSymbol = ')';
        break;

      default:
        options.negativeRightSymbol = '';
    }
  } // whether negative symbol should be inside/outside prefix and suffix


  if (typeof options.negativeLeftOut !== "boolean") {
    options.negativeLeftOut = options.negativeOut === false ? false : true;
  }

  if (typeof options.negativeRightOut !== "boolean") {
    options.negativeRightOut = options.negativeOut === false ? false : true;
  } //prefix and suffix


  options.prefix = options.prefix || '';
  options.suffix = options.suffix || ''; //separators

  if (typeof options.integerSeparator !== 'string') {
    options.integerSeparator = typeof options.separator === 'string' ? options.separator : ',';
  }

  options.decimalsSeparator = typeof options.decimalsSeparator === 'string' ? options.decimalsSeparator : '';
  options.decimal = options.decimal || '.'; //padders

  options.padLeft = options.padLeft || -1; //default no padding

  options.padRight = options.padRight || -1; //default no padding

  function format(number, overrideOptions) {
    overrideOptions = overrideOptions || {};

    if (number || number === 0) {
      number = '' + number; //convert number to string if it isn't already
    } else {
      return '';
    } //identify a negative number and make it absolute


    var output = [];
    var negative = number.charAt(0) === '-';
    number = number.replace(/^\\-/g, ''); //Prepare output with left hand negative and/or prefix

    if (!options.negativeLeftOut && !overrideOptions.noUnits) {
      output.push(options.prefix);
    }

    if (negative) {
      output.push(options.negativeLeftSymbol);
    }

    if (options.negativeLeftOut && !overrideOptions.noUnits) {
      output.push(options.prefix);
    } //Format core number


    number = number.split('.');
    if (options.round != null) round(number, options.round);
    if (options.truncate != null) number[1] = truncate(number[1], options.truncate);
    if (options.padLeft > 0) number[0] = padLeft(number[0], options.padLeft);
    if (options.padRight > 0) number[1] = padRight(number[1], options.padRight);
    if (!overrideOptions.noSeparator && number[1]) number[1] = addDecimalSeparators(number[1], options.decimalsSeparator);
    if (!overrideOptions.noSeparator && number[0]) number[0] = addIntegerSeparators(number[0], options.integerSeparator);
    output.push(number[0]);

    if (number[1]) {
      output.push(options.decimal);
      output.push(number[1]);
    } //Prepare output with right hand negative and/or prefix


    if (options.negativeRightOut && !overrideOptions.noUnits) {
      output.push(options.suffix);
    }

    if (negative) {
      output.push(options.negativeRightSymbol);
    }

    if (!options.negativeRightOut && !overrideOptions.noUnits) {
      output.push(options.suffix);
    } //join output and return


    return output.join('');
  }

  format.negative = options.negative;
  format.negativeOut = options.negativeOut;
  format.negativeType = options.negativeType;
  format.negativeLeftOut = options.negativeLeftOut;
  format.negativeLeftSymbol = options.negativeLeftSymbol;
  format.negativeRightOut = options.negativeRightOut;
  format.negativeRightSymbol = options.negativeRightSymbol;
  format.prefix = options.prefix;
  format.suffix = options.suffix;
  format.separate = options.separate;
  format.integerSeparator = options.integerSeparator;
  format.decimalsSeparator = options.decimalsSeparator;
  format.decimal = options.decimal;
  format.padLeft = options.padLeft;
  format.padRight = options.padRight;
  format.truncate = options.truncate;
  format.round = options.round;

  function unformat(number, allowedSeparators) {
    allowedSeparators = allowedSeparators || [];

    if (options.allowedSeparators) {
      options.allowedSeparators.forEach(function (s) {
        allowedSeparators.push(s);
      });
    }

    allowedSeparators.push(options.integerSeparator);
    allowedSeparators.push(options.decimalsSeparator);
    number = number.replace(options.prefix, '');
    number = number.replace(options.suffix, '');
    var newNumber = number;

    do {
      number = newNumber;

      for (var i = 0; i < allowedSeparators.length; i++) {
        newNumber = newNumber.replace(allowedSeparators[i], '');
      }
    } while (newNumber != number);

    return number;
  }

  format.unformat = unformat;

  function validate(number, allowedSeparators) {
    number = unformat(number, allowedSeparators);
    number = number.split(options.decimal);

    if (number.length > 2) {
      return false;
    } else if (options.truncate != null && number[1] && number[1].length > options.truncate) {
      return false;
    } else if (options.round != null && number[1] && number[1].length > options.round) {
      return false;
    } else {
      return /^-?\\d+\\.?\\d*$/.test(number);
    }
  }

  return format;
} //where x is already the integer part of the number


function addIntegerSeparators(x, separator) {
  x += '';
  if (!separator) return x;
  var rgx = /(\\d+)(\\d{3})/;

  while (rgx.test(x)) {
    x = x.replace(rgx, '$1' + separator + '$2');
  }

  return x;
} //where x is already the decimal part of the number


function addDecimalSeparators(x, separator) {
  x += '';
  if (!separator) return x;
  var rgx = /(\\d{3})(\\d+)/;

  while (rgx.test(x)) {
    x = x.replace(rgx, '$1' + separator + '$2');
  }

  return x;
} //where x is the integer part of the number


function padLeft(x, padding) {
  x = x + '';
  var buf = [];

  while (buf.length + x.length < padding) {
    buf.push('0');
  }

  return buf.join('') + x;
} //where x is the decimals part of the number


function padRight(x, padding) {
  if (x) {
    x += '';
  } else {
    x = '';
  }

  var buf = [];

  while (buf.length + x.length < padding) {
    buf.push('0');
  }

  return x + buf.join('');
}

function truncate(x, length) {
  if (x) {
    x += '';
  }

  if (x && x.length > length) {
    return x.substr(0, length);
  } else {
    return x;
  }
} //where number is an array with 0th item as integer string and 1st item as decimal string (no negatives)


function round(number, places) {
  if (number[1] && places >= 0 && number[1].length > places) {
    //truncate to correct number of decimal places
    var decim = number[1].slice(0, places); //if next digit was >= 5 we need to round up

    if (+number[1].substr(places, 1) >= 5) {
      //But first count leading zeros as converting to a number will loose them
      var leadingzeros = "";

      while (decim.charAt(0) === "0") {
        leadingzeros = leadingzeros + "0";
        decim = decim.substr(1);
      } //Then we can change decim to a number and add 1 before replacing leading zeros


      decim = +decim + 1 + '';
      decim = leadingzeros + decim;

      if (decim.length > places) {
        //adding one has made it longer
        number[0] = +number[0] + +decim.charAt(0) + ''; //add value of firstchar to the integer part

        decim = decim.substring(1); //ignore the 1st char at the beginning which is the carry to the integer part
      }
    }

    number[1] = decim;
  }

  return number;
}

//# sourceURL=webpack://extenso/./node_modules/format-number/index.js?`)},"./src/get-list.js":function(module$6,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listLt10", function() { return listLt10; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listLt100", function() { return listLt100; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listLt1000", function() { return listLt1000; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listGt1000", function() { return listGt1000; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listDecimals", function() { return listDecimals; });
/**\r
 * Obter lista de números menores que dez.\r
 *\r
 * @method listLt10\r
 * @param {string} locale Código do país que deve ser escrito.\r
 * @returns {Array} Lista das partes do número.\r
 */
var listLt10 = function listLt10(locale) {
  return ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
};
/**\r
 * Obter lista de números menores que cem.\r
 *\r
 * @method listLt100\r
 * @param {string} locale Código do país que deve ser escrito.\r
 * @returns {Array} Lista das partes do número.\r
 */

var listLt100 = function listLt100(locale) {
  return ['dez', 'onze', 'doze', 'treze', {
    br: 'quatorze',
    pt: 'catorze'
  }[locale], 'quinze', {
    br: 'dezesseis',
    pt: 'dezasseis'
  }[locale], {
    br: 'dezessete',
    pt: 'dezassete'
  }[locale], 'dezoito', {
    br: 'dezenove',
    pt: 'dezanove'
  }[locale], 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
};
/**\r
 * Obter lista de números menores que mil.\r
 *\r
 * @method listLt1000\r
 * @param {string} locale Código do país que deve ser escrito.\r
 * @returns {Array} Lista das partes do número.\r
 */

var listLt1000 = function listLt1000(locale) {
  return ['cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
};
/**\r
 * Obter lista de números maiores que mil.\r
 *\r
 * @method listGt1000\r
 * @param {string} locale Código do país que deve ser escrito.\r
 * @returns {Array} Lista das partes do número.\r
 */

var listGt1000 = function listGt1000(locale) {
  return ['mil', 'milhões', {
    br: 'bilhões',
    pt: 'biliões'
  }[locale], {
    br: 'trilhões',
    pt: 'triliões'
  }[locale], {
    br: 'quatrilhões',
    pt: 'quatriliões'
  }[locale], {
    br: 'quintilhões',
    pt: 'quintiliões'
  }[locale], {
    br: 'sextilhões',
    pt: 'sextiliões'
  }[locale], {
    br: 'septilhões',
    pt: 'septiliões'
  }[locale], {
    br: 'octilhões',
    pt: 'octiliões'
  }[locale], {
    br: 'nonilhões',
    pt: 'noniliões'
  }[locale], {
    br: 'decilhões',
    pt: 'deciliões'
  }[locale], {
    br: 'undecilhões',
    pt: 'undeciliões'
  }[locale], {
    br: 'duodecilhões',
    pt: 'duodeciliões'
  }[locale]];
};
/**\r
 * Obter lista de números decimais.\r
 *\r
 * @method listDecimals\r
 * @param {string} locale Código do país que deve ser escrito.\r
 * @returns {Array} Lista das partes do número.\r
 */

var listDecimals = function listDecimals(locale) {
  return ['milésimo', 'milionésimo', 'bilionésimo', 'trilionésimo', 'quatrilionésimo', 'quintilionésimo', 'sextilionésimo', 'septilionésimo', 'octilionésimo', 'nonilionésimo', 'decilionésimo', 'undecilionésimo', 'duodecilionésimo'];
};

//# sourceURL=webpack://extenso/./src/get-list.js?`)},"./src/gt1000/index.js":function(module$7,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _int_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./int-util */ "./src/gt1000/int-util.js");
/* harmony import */ var _parts_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parts-util */ "./src/gt1000/parts-util.js");


/**\r
 * Escrever números maiores que mil.\r
 *\r
 * @function gt1000\r
 * @param {string} int Número inteiro maior que mil.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {number} Valor escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (int, locale) {
  var number = Object(_parts_util__WEBPACK_IMPORTED_MODULE_1__["write"])(Object(_parts_util__WEBPACK_IMPORTED_MODULE_1__["addComma"])(Object(_parts_util__WEBPACK_IMPORTED_MODULE_1__["addConjunction"])(Object(_parts_util__WEBPACK_IMPORTED_MODULE_1__["singularize"])(Object(_parts_util__WEBPACK_IMPORTED_MODULE_1__["clear"])(Object(_parts_util__WEBPACK_IMPORTED_MODULE_1__["name"])(Object(_int_util__WEBPACK_IMPORTED_MODULE_0__["split"])(int), locale))), int)), locale);
  return number.join(' ');
});

//# sourceURL=webpack://extenso/./src/gt1000/index.js?`)},"./src/gt1000/int-util.js":function(module$8,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "split", function() { return split; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastNumber", function() { return getLastNumber; });
/* harmony import */ var format_number__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! format-number */ "./node_modules/format-number/index.js");
/* harmony import */ var format_number__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(format_number__WEBPACK_IMPORTED_MODULE_0__);

/**\r
 * Separar um inteiro em uma array com base na formatação de um número.\r
 *\r
 * @method split\r
 * @param {string} int Número inteiro.\r
 * @returns {Array} Array com as partes do número.\r
 */

var split = function split(int) {
  var format = format_number__WEBPACK_IMPORTED_MODULE_0___default()();
  var formatted = format(int);
  var splitted = formatted.split(',');
  return splitted;
};
/**\r
 * Obter a última parte de um número.\r
 *\r
 * @method getLastNumber\r
 * @param {string} int Número inteiro.\r
 * @returns {number} Última parte do número.\r
 */

var getLastNumber = function getLastNumber(int) {
  var splitted = split(int);
  var last = splitted[splitted.length - 1];
  var integer = parseInt(last);
  return integer;
};

//# sourceURL=webpack://extenso/./src/gt1000/int-util.js?`)},"./src/gt1000/parts-util.js":function(module$9,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addComma", function() { return addComma; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addConjunction", function() { return addConjunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clear", function() { return clear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "name", function() { return name; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "singularize", function() { return singularize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "write", function() { return write; });
/* harmony import */ var _arr_reverse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @arr/reverse */ "./node_modules/@arr/reverse/module.js");
/* harmony import */ var _int_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./int-util */ "./src/gt1000/int-util.js");
/* harmony import */ var _get_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../get-list */ "./src/get-list.js");
/* harmony import */ var _lt1000__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lt1000 */ "./src/lt1000.js");




/**\r
 * Adicionar vírgula entre algumas partes.\r
 *\r
 * @method addComma\r
 * @param {Array} parts Array com as partes.\r
 * @returns {Array} Partes com a vírgula caso tenho sido necessário.\r
 */

var addComma = function addComma(parts) {
  return parts.map(function (part, index, array) {
    // REGRA: Não adiciona entre a penúltima e a última parte.
    return index < array.length - 2 ? "".concat(part, ",") : part;
  });
};
/**\r
 * Adicionar conjunção "e" em determinadas partes.\r
 *\r
 * @method addConjunction\r
 * @param {Array} parts Partes do número que está sendo processado.\r
 * @param {string} int Número inteiro que está sendo processado.\r
 * @returns {Array} Partes com a conjução "e" caso tenha sido necessário.\r
 */

var addConjunction = function addConjunction(parts, int) {
  var lastNum = Object(_int_util__WEBPACK_IMPORTED_MODULE_1__["getLastNumber"])(int); // A parte é valida apenas se:
  // - Caso 1: A parte é um inteiro menor que cem.
  // - Caso 2: A parte é um inteiro divisível por cem.

  if (lastNum < 100 || lastNum % 100 === 0) {
    return parts.map(function (part, index, array) {
      return index === array.length - 2 ? "".concat(part, " e") : part;
    });
  }

  return parts;
};
/**\r
 * Limpar partes que não são lidas no número.\r
 *\r
 * @method clear\r
 * @param {Array} parts Partes do número que está sendo processado.\r
 * @returns {Array} Partes com algumas partes removidas.\r
 */

var clear = function clear(parts) {
  // Etapas para a remoção:
  // - Etapa 1: Remove zeros à esquerda.
  // - Etapa 2: Remove partes que não são lidas.
  // - Etapa 3: Remove o "1" das partes com "1 mil".
  return parts.map(function (part) {
    return part.replace(/^0+\\s?/, '');
  }).filter(function (part) {
    return /^\\d/.test(part);
  }).map(function (part) {
    return part.replace(/^1\\s(mil)$/, '$1');
  });
};
/**\r
 * Escrever por extenso os números inteiros dentro das partes.\r
 *\r
 * @method name\r
 * @param {Array} parts Partes do número que está sendo processado.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {Array} Partes com os inteiros escritos por extenso.\r
 */

var name = function name(parts, locale) {
  return Object(_arr_reverse__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_arr_reverse__WEBPACK_IMPORTED_MODULE_0__["default"])(parts).map(function (part, i) {
    var numberName = Object(_get_list__WEBPACK_IMPORTED_MODULE_2__["listGt1000"])(locale)[i - 1];
    return numberName ? "".concat(part, " ").concat(numberName) : part;
  }));
};
/**\r
 * Singularizar partes do número que são maiores que um.\r
 *\r
 * @method singularize\r
 * @param {Array} parts Partes do número que está sendo processado.\r
 * @returns {string} Número com as partes singularizadas.\r
 */

var singularize = function singularize(parts) {
  var regex = /^(1\\s.*)ões/;

  var replacer = function replacer(str) {
    return str.replace(regex, '$1ão');
  };

  return parts.map(replacer);
};
/**\r
 * Deve escrever os inteiros restantes em uma array com as partes.\r
 *\r
 * @method write\r
 * @param {Array} parts Partes do número que está sendo processado.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {string} Número como todas as partes escritas por extenso.\r
 */

var write = function write(parts, locale) {
  return parts.map(function (part) {
    return part.replace(/^(\\d+)/, function (digit) {
      var int = parseInt(digit);
      return Object(_lt1000__WEBPACK_IMPORTED_MODULE_3__["default"])(int, locale);
    });
  });
};

//# sourceURL=webpack://extenso/./src/gt1000/parts-util.js?`)},"./src/lt10.js":function(module$10,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _get_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-list */ "./src/get-list.js");

/**\r
 * Obter um número inteiro menor que dez por extenso.\r
 *\r
 * @function lt10\r
 * @param {number} int Um número inteiro menor que dez.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {string} O número por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (int, locale) {
  return Object(_get_list__WEBPACK_IMPORTED_MODULE_0__["listLt10"])(locale)[int];
});

//# sourceURL=webpack://extenso/./src/lt10.js?`)},"./src/lt100.js":function(module$11,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lt10__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lt10 */ "./src/lt10.js");
/* harmony import */ var _get_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-list */ "./src/get-list.js");


/**\r
 * Obter um número inteiro menor que cem por extenso.\r
 *\r
 * @function lt100\r
 * @param {number} int Um número inteiro menor que cem.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {string} O número escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (int, locale) {
  if (int < 10) return Object(_lt10__WEBPACK_IMPORTED_MODULE_0__["default"])(int, locale);
  if (int < 20) return Object(_get_list__WEBPACK_IMPORTED_MODULE_1__["listLt100"])(locale)[int - 10];
  var unit = Object(_lt10__WEBPACK_IMPORTED_MODULE_0__["default"])(int % 10, locale);
  var ten = Object(_get_list__WEBPACK_IMPORTED_MODULE_1__["listLt100"])(locale)[(int - int % 10) / 10 + 8];
  return unit !== 'zero' ? "".concat(ten, " e ").concat(unit) : ten;
});

//# sourceURL=webpack://extenso/./src/lt100.js?`)},"./src/lt1000.js":function(module$12,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _get_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-list */ "./src/get-list.js");
/* harmony import */ var _lt100__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lt100 */ "./src/lt100.js");


/**\r
 * Obter um número inteiro menor que mil por extenso.\r
 *\r
 * @function lt1000\r
 * @param {number} int Um número inteiro menor que mil.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {string} Número escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (int, locale) {
  if (int < 100) return Object(_lt100__WEBPACK_IMPORTED_MODULE_1__["default"])(int, locale);
  if (int === 100) return 'cem';
  var hundredInt = int - int % 100;
  var restInt = int % 100;
  var hundred = Object(_get_list__WEBPACK_IMPORTED_MODULE_0__["listLt1000"])(locale)[hundredInt / 100 - 1];
  var rest = Object(_lt100__WEBPACK_IMPORTED_MODULE_1__["default"])(restInt, locale);
  return restInt ? "".concat(hundred, " e ").concat(rest) : hundred;
});

//# sourceURL=webpack://extenso/./src/lt1000.js?`)},"./src/num-util.js":function(module$13,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidNumber", function() { return isValidNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseNumber", function() { return parseNumber; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**\r
 * Verificar se um valor é um número, da língua portuguesa, valido.\r
 *\r
 * @method isValidNumber\r
 * @param {string} val Um valor para ser verificado.\r
 * @returns {boolean} Verificação do valor.\r
 */
var isValidNumber = function isValidNumber(val) {
  if (typeof val === 'number' && !Number.isSafeInteger(val)) {
    return false;
  } // Verifica se é um número


  if (/^-?\\d{1,3}\\d?((\\.\\d{3})+)?$/.test(val) // ...formatado
  || /^-?\\d{1,3}\\d?((\\.\\d{3})+)?,\\d+$/.test(val) // ...decimal formatado
  || /^-?\\d+$/.test(val) // ...não formatado
  || /^-?\\d+,\\d+/.test(val) // ...decimal não formatado
  ) {
      return true;
    }

  return false;
};
/**\r
 * Analisar um número.\r
 *\r
 * @method parseNumber\r
 * @param {string} val Um número para ser analisado\r
 * @returns {object} Objeto com as informações do número\r
 */

var parseNumber = function parseNumber(num) {
  var isNegative = /^-/.test(num);
  var normalized = num.replace(/(-|\\.)/g, '');

  if (normalized.includes(',')) {
    var _normalized$split$map = normalized.split(',').map(function (val) {
      return val.replace(/^0+$/, '0');
    }),
        _normalized$split$map2 = _slicedToArray(_normalized$split$map, 2),
        integer = _normalized$split$map2[0],
        decimal = _normalized$split$map2[1];

    return {
      isNegative: isNegative,
      integer: integer,
      decimal: decimal
    };
  }

  return {
    isNegative: isNegative,
    integer: normalized,
    decimal: '0'
  };
};

//# sourceURL=webpack://extenso/./src/num-util.js?`)},"./src/write-all.js":function(module$14,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidOpt", function() { return isValidOpt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toNegative", function() { return toNegative; });
/* harmony import */ var assign_deep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! assign-deep */ "./node_modules/assign-deep/index.js");
/* harmony import */ var assign_deep__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(assign_deep__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _num_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./num-util */ "./src/num-util.js");
/* harmony import */ var _write_currency__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./write-currency */ "./src/write-currency/index.js");
/* harmony import */ var _write_decimal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./write-decimal */ "./src/write-decimal/index.js");
/* harmony import */ var _write_int__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./write-int */ "./src/write-int.js");





/**\r
 * Verificar se uma opção é válida.\r
 *\r
 * @method isValidOpt\r
 * @param {string} val Valor da opção.\r
 * @param {Array} vals Valores para checagem.\r
 * @returns {boolean} Informação da validade da opção.\r
 */

var isValidOpt = function isValidOpt(val, vals) {
  return vals.includes(val);
};
/**\r
 * Passar um número escrito por extenso para o modo negativo.\r
 *\r
 * @method toNegative\r
 * @param {string} num Valor escrito por extenso.\r
 * @param {string} [mode='formal'] Opção sobre o modo a ser escrito.\r
 * @returns {string} Valor como negativo.\r
 */

var toNegative = function toNegative(num) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'formal';
  return mode === 'informal' ? "menos ".concat(num) : "".concat(num, " negativo");
};
/**\r
 * Escrever números por extenso.\r
 *\r
 * @param {string|number} num Número para ser escrito por extenso.\r
 * @param {object} opts Opções para configurar modo de escrita.\r
 * @returns {string} Número escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (num, opts) {
  if (typeof num !== 'string' && typeof num !== 'number') {
    throw new TypeError('Must be a string or a number');
  }

  var numString = num.toString();

  if (!Object(_num_util__WEBPACK_IMPORTED_MODULE_1__["isValidNumber"])(numString)) {
    throw new Error('Invalid number');
  }

  var defaultOpts = {
    mode: 'number',
    locale: 'br',
    negative: 'formal',
    currency: {
      type: 'BRL'
    },
    number: {
      gender: 'm',
      decimal: 'formal'
    } // Usando o pacote 'assign-deep' no lugar de Object.assign(),
    // pois esse último substitui completamente todas as propriedades
    // de um objeto que está dentro de outro objeto.

  };
  opts = assign_deep__WEBPACK_IMPORTED_MODULE_0___default()(defaultOpts, opts);

  if (!isValidOpt(opts.mode, ['number', 'currency']) || !isValidOpt(opts.locale, ['pt', 'br']) || !isValidOpt(opts.negative, ['formal', 'informal']) || !isValidOpt(opts.currency.type, ['BRL', 'EUR']) || !isValidOpt(opts.number.gender, ['m', 'f']) || !isValidOpt(opts.number.decimal, ['formal', 'informal'])) {
    throw new Error('Invalid option');
  }

  var _parseNumber = Object(_num_util__WEBPACK_IMPORTED_MODULE_1__["parseNumber"])(numString),
      isNegative = _parseNumber.isNegative,
      integer = _parseNumber.integer,
      decimal = _parseNumber.decimal;

  if (opts.mode === 'currency') {
    var iso = opts.currency.type;
    var locale = opts.locale;
    var numText = Object(_write_currency__WEBPACK_IMPORTED_MODULE_2__["default"])(iso, locale, integer, decimal);
    return isNegative ? toNegative(numText, opts.negative) : numText;
  }

  if (opts.mode === 'number') {
    var intNameSingular = opts.number.gender === 'f' ? 'inteira' : 'inteiro';
    var intName = parseInt(integer) === 1 ? intNameSingular : "".concat(intNameSingular, "s");
    var intText = Object(_write_int__WEBPACK_IMPORTED_MODULE_4__["default"])(integer, opts.locale, opts.number.gender);
    var decText = Object(_write_decimal__WEBPACK_IMPORTED_MODULE_3__["default"])(decimal, opts.locale, opts.number.decimal); // Se tem a parte inteira e não tem a parte decimal

    if (integer !== '0' && decimal === '0') {
      return isNegative ? toNegative(intText, opts.negative) : intText;
    } // Se não tem a parte inteira e tem a parte decimal


    if (integer === '0' && decimal !== '0') {
      var number = opts.number.decimal === 'informal' ? "zero ".concat(decText) : decText;
      return isNegative ? toNegative(number, opts.negative) : number;
    } // Se tem a parte inteira e a parte decimal


    if (integer !== '0' && decimal !== '0') {
      if (opts.number.decimal === 'informal') {
        return "".concat(intText, " ").concat(decText);
      }

      var _numText = "".concat(intText, " ").concat(intName, " e ").concat(decText);

      return isNegative ? toNegative(_numText, opts.negative) : _numText;
    }
  }
});

//# sourceURL=webpack://extenso/./src/write-all.js?`)},"./src/write-currency/currencies.json":function(module$15){eval(`module.exports = {"BRL":{"singular":"real","plural":"reais","subunit":{"singular":"centavo","plural":"centavos"}},"EUR":{"singular":"euro","plural":"euros","subunit":{"singular":"cêntimo","plural":"cêntimos"}}};

//# sourceURL=webpack://extenso/./src/write-currency/currencies.json?`)},"./src/write-currency/index.js":function(module$16,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIsos", function() { return getIsos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidIso", function() { return isValidIso; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isZero", function() { return isZero; });
/* harmony import */ var _currencies_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./currencies.json */ "./src/write-currency/currencies.json");
var _currencies_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./currencies.json */ "./src/write-currency/currencies.json", 1);
/* harmony import */ var _write__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./write */ "./src/write-currency/write.js");
/* harmony import */ var _write_subunit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./write-subunit */ "./src/write-currency/write-subunit.js");



/**\r
 * Obter lista dos códigos ISO de um registro de moedas.\r
 *\r
 * @method getIsos\r
 * @param {object} currencies Objeto com registro de moedas.\r
 * @returns {Array} Lista com os códigos ISO.\r
 */

var getIsos = function getIsos(currencies) {
  return Object.keys(currencies);
};
/**\r
 * Verificar se há um código ISO registrado.\r
 *\r
 * @method isValidIso\r
 * @param {string} iso Código ISO para ser verificado.\r
 * @param {object} currencies Objeto com registro de moedas.\r
 * @returns {boolean} Informação da existência do registro.\r
 */

var isValidIso = function isValidIso(iso, currencies) {
  return getIsos(currencies).includes(iso);
};
/**\r
 * Verificar se um número, envolvido em string, é igual a zero.\r
 *\r
 * @method isZero\r
 * @param {string} val Número envolvido numa string.\r
 * @returns {boolean} Informação do valor.\r
 * @example\r
 * isZero('00') // true\r
 * isZero('42') // false\r
 */

var isZero = function isZero(val) {
  return /^0+$/.test(val);
};
/**\r
 * Obter um valor monetário escrito por extenso.\r
 *\r
 * @method writeCurrency\r
 * @param {string} iso Código ISO da moeda que deverá ser usada.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @param {string} [unit='0'] Valor da moeda (parte inteira).\r
 * @param {string} [subunit='0'] Sub-unidade do valor (parte "decimal").\r
 * @returns {string} Valor escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (iso, locale) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';
  var subunit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '0';

  if (!isValidIso(iso, _currencies_json__WEBPACK_IMPORTED_MODULE_0__)) {
    throw new Error('Invalid ISO code');
  }

  var opts = _currencies_json__WEBPACK_IMPORTED_MODULE_0__[iso];
  var unitText = Object(_write__WEBPACK_IMPORTED_MODULE_1__["default"])(unit, locale, opts);
  var subunitText = Object(_write_subunit__WEBPACK_IMPORTED_MODULE_2__["default"])(subunit, locale, opts);
  if (isZero(unit)) return subunitText;
  if (isZero(subunit)) return unitText;
  if (isZero(unit) && isZero(subunit)) return "zero ".concat(opts.plural);
  return "".concat(unitText, " e ").concat(subunitText);
});

//# sourceURL=webpack://extenso/./src/write-currency/index.js?`)},"./src/write-currency/write-subunit.js":function(module$17,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _write_int__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../write-int */ "./src/write-int.js");

/**\r
 * Obter a sub-unidade escrita por extenso.\r
 *\r
 * @method writeSubunit\r
 * @param {string} val Valor a ser escrito.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @param {object} opts Opções de escrita do valor.\r
 * @returns {string} Valor escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (val, locale, opts) {
  var textNumber = Object(_write_int__WEBPACK_IMPORTED_MODULE_0__["default"])(val, locale);
  return parseInt(val) === 1 ? "".concat(textNumber, " ").concat(opts.subunit.singular) : "".concat(textNumber, " ").concat(opts.subunit.plural);
});

//# sourceURL=webpack://extenso/./src/write-currency/write-subunit.js?`)},"./src/write-currency/write.js":function(module$18,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _write_int__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../write-int */ "./src/write-int.js");

/**\r
 * Obter o valor escrito por extenso.\r
 *\r
 * @method write\r
 * @param {string} val O valor a ser escrito.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @param {object} opts As opções de escrita do valor.\r
 * @returns {string} O valor escrito por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (val, locale, opts) {
  var number = parseInt(val);
  var text = Object(_write_int__WEBPACK_IMPORTED_MODULE_0__["default"])(val, locale);
  if (number === 1) return "".concat(text, " ").concat(opts.singular);
  if (number >= 1e+6) return "".concat(text, " de ").concat(opts.plural);
  return "".concat(text, " ").concat(opts.plural);
});

//# sourceURL=webpack://extenso/./src/write-currency/write.js?`)},"./src/write-decimal/index.js":function(module$19,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pluralize", function() { return pluralize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeDecimalFormal", function() { return writeDecimalFormal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeDecimalInformal", function() { return writeDecimalInformal; });
/* harmony import */ var _write_int__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../write-int */ "./src/write-int.js");
/* harmony import */ var _get_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../get-list */ "./src/get-list.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/write-decimal/util.js");



/**\r
 * Adicionar 's' nos finais de determinadas palavras - pluralizar.\r
 *\r
 * @method pluralize\r
 * @param {string} val Um substantivo.\r
 * @param {number} count A quantidade de objeto.\r
 * @returns {string} Palavra pluralizada.\r
 */

var pluralize = function pluralize(val, count) {
  return count > 1 ? "".concat(val, "s") : val;
};
/**\r
 * Escrever formalmente a parte decimal de um número.\r
 *\r
 * @method writeDecimalFormal\r
 * @param {string} int Um número inteiro referente ao decimal.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {string} A parte decimal escrita por extenso.\r
 */

var writeDecimalFormal = function writeDecimalFormal(int, locale) {
  // Veja <https://bit.ly/2SrsXVO> (no <archive.org>) para entender tudo.
  var len = int.length;
  var intNum = parseInt(int);
  var intNormalized = int.replace(/^0+/, '');
  var intText = Object(_write_int__WEBPACK_IMPORTED_MODULE_0__["default"])(intNormalized, locale);
  var intType = pluralize(Object(_util__WEBPACK_IMPORTED_MODULE_2__["getType"])(len), intNum);
  var intTypeOf = Object(_get_list__WEBPACK_IMPORTED_MODULE_1__["listDecimals"])(locale)[Math.floor(len / 3 - 1)];
  if (len < 3) return "".concat(intText, " ").concat(intType);
  if (len % 3 === 0) return "".concat(intText, " ").concat(pluralize(intTypeOf, intNum));
  return "".concat(intText, " ").concat(intType, " de ").concat(intTypeOf);
};
/**\r
 * Escrever informalmente a parte decimal de um número.\r
 *\r
 * @method writeDecimalInformal\r
 * @param {string} int Um número inteiro referente ao decimal.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @returns {string} A parte decimal escrita por extenso.\r
 */

var writeDecimalInformal = function writeDecimalInformal(int, locale) {
  return "v\\xEDrgula ".concat(Object(_write_int__WEBPACK_IMPORTED_MODULE_0__["default"])(int, locale));
};
/**\r
 * Escrever a parte decimal de um número por extenso.\r
 *\r
 * @method writeDecimal\r
 * @param {string} int Um número inteiro referente ao decimal.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @param {string} opt Opção informando se é 'formal' ou 'informal'.\r
 * @returns {string} A parte decimal escrita por extenso.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (int, locale, opt) {
  return opt && opt === 'informal' ? writeDecimalInformal(int, locale) : writeDecimalFormal(int, locale);
});

//# sourceURL=webpack://extenso/./src/write-decimal/index.js?`)},"./src/write-decimal/util.js":function(module$20,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getType", function() { return getType; });
/**\r
 * Obter a informação do tipo da casa decimal (décimo ou centésimo).\r
 *\r
 * @method getType\r
 * @param {number} place O número de casas do valor decimal.\r
 * @returns {string} Informação do tipo da casa.\r
 */
var getType = function getType(place) {
  switch (place % 3) {
    case 1:
      return 'décimo';
      break;

    case 2:
      return 'centésimo';
      break;
  }
};

//# sourceURL=webpack://extenso/./src/write-decimal/util.js?`)},"./src/write-int.js":function(module$21,__webpack_exports__,__webpack_require__){eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toFemale", function() { return toFemale; });
/* harmony import */ var _lt1000__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lt1000 */ "./src/lt1000.js");
/* harmony import */ var _gt1000__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gt1000 */ "./src/gt1000/index.js");


/**\r
 * Passar para o feminino alguns números.\r
 *\r
 * @method toFemale\r
 * @param {string} num Um número qualquer.\r
 * @returns {string} O número com algumas partes no feminino.\r
 * @example\r
 * toFemale('quarenta e dois')\r
 * // 'quarenta e duas'\r
 */

var toFemale = function toFemale(num) {
  return num.replace(/\\bum\\b/, 'uma').replace(/\\bdois\\b/, 'duas');
};
/**\r
 * Obter qualquer número escrito por extenso.\r
 *\r
 * @method writeInt\r
 * @param {string} int Um número para ser escrito.\r
 * @param {string} locale Código do país para escrever o número.\r
 * @param {string} [gender='m'] A opção do gênero do número.\r
 * @returns {string} O número escrito.\r
 */

/* harmony default export */ __webpack_exports__["default"] = (function (int, locale) {
  var gender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'm';
  var intNum = parseInt(int);
  var num;
  if (intNum < 1000) num = Object(_lt1000__WEBPACK_IMPORTED_MODULE_0__["default"])(intNum, locale);
  if (intNum === 1000) num = 'mil';
  if (intNum > 1000) num = Object(_gt1000__WEBPACK_IMPORTED_MODULE_1__["default"])(int, locale);
  return gender === 'f' ? toFemale(num) : num;
});

//# sourceURL=webpack://extenso/./src/write-int.js?`)}})})})),import_extenso_min=__toESM(require_extenso_min(),1);function reaisPorExtenso(e){var t=e.toString().replace(`.`,`,`);return(0,import_extenso_min.default)(t,{mode:`currency`,currency:{type:`BRL`}})}function extraiDia(e){return e[1]===`/`?e[0]:e[0]+e[1]}function formatarNumeroVigula(e){return e.toFixed(2).replace(`.`,`,`)}function dataPorExtenso(e){var t=[`janeiro`,`fevereiro`,`março`,`abril`,`maio`,`junho`,`julho`,`agosto`,`setembro`,`outubro`,`novembro`,`dezembro`],e=new Date,n=e.getDate(),r=t[e.getMonth()],i=e.getFullYear();return n+` de `+r+` de `+i}function dataAtualPorExtenso(){return dataPorExtenso(new Date)}var Pix=class{constructor(e,t,n,r,i,a){this.pixKey=e,this.description=t,this.merchantName=n,this.merchantCity=r,this.txid=i,this.amount=a.toFixed(2),this.ID_PAYLOAD_FORMAT_INDICATOR=`00`,this.ID_MERCHANT_ACCOUNT_INFORMATION=`26`,this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI=`00`,this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY=`01`,this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION=`02`,this.ID_MERCHANT_CATEGORY_CODE=`52`,this.ID_TRANSACTION_CURRENCY=`53`,this.ID_TRANSACTION_AMOUNT=`54`,this.ID_COUNTRY_CODE=`58`,this.ID_MERCHANT_NAME=`59`,this.ID_MERCHANT_CITY=`60`,this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE=`62`,this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID=`05`,this.ID_CRC16=`63`}_getValue(e,t){return e+String(t.length).padStart(2,`0`)+t}_getMechantAccountInfo(){let e=this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI,`br.gov.bcb.pix`),t=this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY,this.pixKey),n=this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION,this.description);return this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION,e+t+n)}_getAdditionalDataFieldTemplate(){let e=this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,this.txid);return this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE,e)}getPayload(){let e=this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR,`01`)+this._getMechantAccountInfo()+this._getValue(this.ID_MERCHANT_CATEGORY_CODE,`0000`)+this._getValue(this.ID_TRANSACTION_CURRENCY,`986`)+this._getValue(this.ID_TRANSACTION_AMOUNT,this.amount)+this._getValue(this.ID_COUNTRY_CODE,`BR`)+this._getValue(this.ID_MERCHANT_NAME,this.merchantName)+this._getValue(this.ID_MERCHANT_CITY,this.merchantCity)+this._getAdditionalDataFieldTemplate();return e+this._getCRC16(e)}_getCRC16(e){function t(e){return e.charCodeAt(0)}function n(e){return e<0&&(e=4294967295+e+1),parseInt(e,10).toString(16)}e=e+this.ID_CRC16+`04`;let r=4129,i=65535,a;if((a=e.length)>0)for(let n=0;n<a;n++){i^=t(e[n])<<8;for(let e=0;e<8;e++)(i<<=1)&65536&&(i^=4129),i&=65535}return this.ID_CRC16+`04`+n(i).toUpperCase()}},import_jsx_runtime=require_jsx_runtime();function Impressao({dados:e}){let[t,n]=(0,import_react.useState)(``),[r,i]=(0,import_react.useState)(!0);return(0,import_react.useEffect)(()=>{i(!0);let t=new Pix(`05557971000150`,e.referencia,`PORTAL`,`FATIMA`,e.codPix.toString(),e.valor);n(t.getPayload()),i(!1)},[]),(0,import_jsx_runtime.jsx)(import_jsx_runtime.Fragment,{children:r?(0,import_jsx_runtime.jsx)(import_jsx_runtime.Fragment,{}):(0,import_jsx_runtime.jsx)(`div`,{children:(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-row text-[12px] w-[794px] h-[561px] text-black`,children:[(0,import_jsx_runtime.jsx)(`img`,{className:`print-only border-0`,src:leftRecibo_default,alt:``}),(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-col`,children:[(0,import_jsx_runtime.jsx)(Cabecalho,{valor:e.valor}),(0,import_jsx_runtime.jsxs)(`div`,{className:`pt-2`,children:[(0,import_jsx_runtime.jsx)(Linha,{texto:`Cliente | Endereço`,valor:e.cliente+` | `+e.endereco}),(0,import_jsx_runtime.jsx)(Linha,{texto:`Valor`,valor:e.valortxt}),(0,import_jsx_runtime.jsx)(LinhaDividida,{textoUm:`Referencia`,textoDois:`Venc.`,valorUm:e.referencia,valorDois:e.venc})]}),(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-row text-black pt-20`,children:[(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-row pt-10`,children:[(0,import_jsx_runtime.jsxs)(`p`,{children:[`Fátima do Sul, `,dataAtualPorExtenso()]}),(0,import_jsx_runtime.jsx)(`p`,{className:`pl-32 pr-5`,children:`Recebido em _____/_____/_____`})]}),(0,import_jsx_runtime.jsxs)(`div`,{className:`ml-32 mt-5`,children:[(0,import_jsx_runtime.jsx)(QRCodeSVG,{size:`75`,value:t}),`,`]})]}),(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-col`,children:[(0,import_jsx_runtime.jsx)(`p`,{className:`ml-32`,children:`____________________________________________________________`}),(0,import_jsx_runtime.jsx)(`p`,{className:`ml-32`,children:`Yuzuri & Lopes Ltda - CNPJ: 05.557.971/0001-50`}),(0,import_jsx_runtime.jsx)(`p`,{className:`ml-32`,children:`Avenida 09 de Julho, 1753 - Centro`}),(0,import_jsx_runtime.jsx)(`p`,{className:`ml-32`,children:`Fátima do Sul - MS  Fone: (67) 3467-3694`})]})]})]})})})}function Cabecalho({valor:e}){return(0,import_jsx_runtime.jsx)(import_jsx_runtime.Fragment,{children:(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-row w-full pt-5 rounded-b-[20px] bordaEstilizada border-slate-700 border-b-2 border-l-2 border-r-2`,children:[(0,import_jsx_runtime.jsx)(`img`,{className:`h-28 p-2 bordaEstilizada`,src:Icone_Portal_default,alt:``}),(0,import_jsx_runtime.jsx)(`img`,{className:`h-28 p-2 bordaEstilizada`,src:portalCom_default,alt:``}),(0,import_jsx_runtime.jsx)(`div`,{className:`pl-10 pr-2 pt-3`,children:(0,import_jsx_runtime.jsxs)(`div`,{className:`bordaEstilizada rounded-[20px] h-20 w-36 text-black border-slate-700 border-2`,children:[(0,import_jsx_runtime.jsx)(`p`,{className:`pl-3 pt-3 font-bold `,children:`VALOR`}),(0,import_jsx_runtime.jsxs)(`p`,{className:`pt-5 pl-5 text-2xl`,children:[`R$ `,formatarNumeroVigula(e)]})]})})]})})}function Linha({texto:e,valor:t}){return(0,import_jsx_runtime.jsx)(`div`,{className:`pt-4`,children:(0,import_jsx_runtime.jsxs)(`div`,{className:`border-black border-2 bordaEstilizada`,children:[(0,import_jsx_runtime.jsx)(`p`,{className:`pl-2 pt-1`,children:e}),(0,import_jsx_runtime.jsx)(`p`,{className:`font-normal text-xs pl-2`,children:t})]})})}function LinhaDividida({textoUm:e,textoDois:t,valorUm:n,valorDois:r}){return(0,import_jsx_runtime.jsx)(`div`,{className:`pt-2`,children:(0,import_jsx_runtime.jsx)(`div`,{className:`border-black border-2 bordaEstilizada`,children:(0,import_jsx_runtime.jsxs)(`div`,{className:`flex flex-row justify-between`,children:[(0,import_jsx_runtime.jsxs)(`div`,{children:[(0,import_jsx_runtime.jsx)(`p`,{className:`pl-2 pt-1`,children:e}),(0,import_jsx_runtime.jsx)(`p`,{className:`font-normal text-xs pl-2`,children:n})]}),(0,import_jsx_runtime.jsxs)(`div`,{children:[(0,import_jsx_runtime.jsx)(`p`,{className:`pl-2 pt-1`,children:t}),(0,import_jsx_runtime.jsx)(`p`,{className:`font-normal text-xs pl-2`,children:r})]}),(0,import_jsx_runtime.jsx)(`div`,{})]})})})}export{Printer as a,require_lib as i,extraiDia as n,reaisPorExtenso as r,Impressao as t};
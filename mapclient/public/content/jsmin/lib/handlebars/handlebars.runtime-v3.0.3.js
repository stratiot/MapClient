/*!

 handlebars v3.0.3

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/

(function(t,n){typeof exports=="object"&&typeof module=="object"?module.exports=n():typeof define=="function"&&define.amd?define(n):typeof exports=="object"?exports.Handlebars=n():t.Handlebars=n()})(this,function(){return function(e){function n(r){if(t[r])return t[r].exports;var i=t[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}([function(e,t,n){"use strict";function g(){var e=new o.HandlebarsEnvironment;return h.extend(e,o),e.SafeString=a["default"],e.Exception=l["default"],e.Utils=h,e.escapeExpression=h.escapeExpression,e.VM=d,e.template=function(t){return d.template(t,e)},e}var r=n(7)["default"],i=n(8)["default"];t.__esModule=!0;var s=n(1),o=r(s),u=n(2),a=i(u),f=n(3),l=i(f),c=n(4),h=r(c),p=n(5),d=r(p),v=n(6),m=i(v),y=g();y.create=g,m["default"](y),y["default"]=y,t["default"]=y,e.exports=t["default"]},function(e,t,n){"use strict";function m(e,t){this.helpers=e||{},this.partials=t||{},g(this)}function g(e){e.registerHelper("helperMissing",function(){if(arguments.length===1)return undefined;throw new a["default"]('Missing helper: "'+arguments[arguments.length-1].name+'"')}),e.registerHelper("blockHelperMissing",function(t,n){var r=n.inverse,i=n.fn;if(t===!0)return i(this);if(t===!1||t==null)return r(this);if(h(t))return t.length>0?(n.ids&&(n.ids=[n.name]),e.helpers.each(t,n)):r(this);if(n.data&&n.ids){var s=w(n.data);s.contextPath=o.appendContextPath(n.data.contextPath,n.name),n={data:s}}return i(t,n)}),e.registerHelper("each",function(e,t){function l(t,r,i){u&&(u.key=t,u.index=r,u.first=r===0,u.last=!!i,f&&(u.contextPath=f+t)),s+=n(e[t],{data:u,blockParams:o.blockParams([e[t],t],[f+t,null])})}if(!t)throw new a["default"]("Must pass iterator to #each");var n=t.fn,r=t.inverse,i=0,s="",u=undefined,f=undefined;t.data&&t.ids&&(f=o.appendContextPath(t.data.contextPath,t.ids[0])+"."),p(e)&&(e=e.call(this)),t.data&&(u=w(t.data));if(e&&typeof e=="object")if(h(e))for(var c=e.length;i<c;i++)l(i,i,i===e.length-1);else{var d=undefined;for(var v in e)e.hasOwnProperty(v)&&(d&&l(d,i-1),d=v,i++);d&&l(d,i-1,!0)}return i===0&&(s=r(this)),s}),e.registerHelper("if",function(e,t){return p(e)&&(e=e.call(this)),!t.hash.includeZero&&!e||o.isEmpty(e)?t.inverse(this):t.fn(this)}),e.registerHelper("unless",function(t,n){return e.helpers["if"].call(this,t,{fn:n.inverse,inverse:n.fn,hash:n.hash})}),e.registerHelper("with",function(e,t){p(e)&&(e=e.call(this));var n=t.fn;if(!o.isEmpty(e)){if(t.data&&t.ids){var r=w(t.data);r.contextPath=o.appendContextPath(t.data.contextPath,t.ids[0]),t={data:r}}return n(e,t)}return t.inverse(this)}),e.registerHelper("log",function(t,n){var r=n.data&&n.data.level!=null?parseInt(n.data.level,10):1;e.log(r,t)}),e.registerHelper("lookup",function(e,t){return e&&e[t]})}function w(e){var t=o.extend({},e);return t._parent=e,t}var r=n(7)["default"],i=n(8)["default"];t.__esModule=!0,t.HandlebarsEnvironment=m,t.createFrame=w;var s=n(4),o=r(s),u=n(3),a=i(u),f="3.0.1";t.VERSION=f;var l=6;t.COMPILER_REVISION=l;var c={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:"== 1.x.x",5:"== 2.0.0-alpha.x",6:">= 2.0.0-beta.1"};t.REVISION_CHANGES=c;var h=o.isArray,p=o.isFunction,d=o.toString,v="[object Object]";m.prototype={constructor:m,logger:y,log:b,registerHelper:function(t,n){if(d.call(t)===v){if(n)throw new a["default"]("Arg not supported with multiple helpers");o.extend(this.helpers,t)}else this.helpers[t]=n},unregisterHelper:function(t){delete this.helpers[t]},registerPartial:function(t,n){if(d.call(t)===v)o.extend(this.partials,t);else{if(typeof n=="undefined")throw new a["default"]("Attempting to register a partial as undefined");this.partials[t]=n}},unregisterPartial:function(t){delete this.partials[t]}};var y={methodMap:{0:"debug",1:"info",2:"warn",3:"error"},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:1,log:function(t,n){if(typeof console!="undefined"&&y.level<=t){var r=y.methodMap[t];(console[r]||console.log).call(console,n)}}};t.logger=y;var b=y.log;t.log=b},function(e,t,n){"use strict";function r(e){this.string=e}t.__esModule=!0,r.prototype.toString=r.prototype.toHTML=function(){return""+this.string},t["default"]=r,e.exports=t["default"]},function(e,t,n){"use strict";function i(e,t){var n=t&&t.loc,s=undefined,o=undefined;n&&(s=n.start.line,o=n.start.column,e+=" - "+s+":"+o);var u=Error.prototype.constructor.call(this,e);for(var a=0;a<r.length;a++)this[r[a]]=u[r[a]];Error.captureStackTrace&&Error.captureStackTrace(this,i),n&&(this.lineNumber=s,this.column=o)}t.__esModule=!0;var r=["description","fileName","lineNumber","message","name","number","stack"];i.prototype=new Error,t["default"]=i,e.exports=t["default"]},function(e,t,n){"use strict";function o(e){return r[e]}function u(e){for(var t=1;t<arguments.length;t++)for(var n in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],n)&&(e[n]=arguments[t][n]);return e}function c(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}function h(e){if(typeof e!="string"){if(e&&e.toHTML)return e.toHTML();if(e==null)return"";if(!e)return e+"";e=""+e}return s.test(e)?e.replace(i,o):e}function p(e){return!e&&e!==0?!0:l(e)&&e.length===0?!0:!1}function d(e,t){return e.path=t,e}function v(e,t){return(e?e+".":"")+t}t.__esModule=!0,t.extend=u,t.indexOf=c,t.escapeExpression=h,t.isEmpty=p,t.blockParams=d,t.appendContextPath=v;var r={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},i=/[&<>"'`]/g,s=/[&<>"'`]/,a=Object.prototype.toString;t.toString=a;var f=function(t){return typeof t=="function"};f(/x/)&&(t.isFunction=f=function(e){return typeof e=="function"&&a.call(e)==="[object Function]"});var f;t.isFunction=f;var l=Array.isArray||function(e){return e&&typeof e=="object"?a.call(e)==="[object Array]":!1};t.isArray=l},function(e,t,n){"use strict";function l(e){var t=e&&e[0]||1,n=f.COMPILER_REVISION;if(t!==n){if(t<n){var r=f.REVISION_CHANGES[n],i=f.REVISION_CHANGES[t];throw new a["default"]("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+r+") or downgrade your runtime to an older version ("+i+").")}throw new a["default"]("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+e[1]+").")}}function c(e,t){function n(n,r,i){i.hash&&(r=o.extend({},r,i.hash)),n=t.VM.resolvePartial.call(this,n,r,i);var s=t.VM.invokePartial.call(this,n,r,i);s==null&&t.compile&&(i.partials[i.name]=t.compile(n,e.compilerOptions,t),s=i.partials[i.name](r,i));if(s!=null){if(i.indent){var u=s.split("\n");for(var f=0,l=u.length;f<l;f++){if(!u[f]&&f+1===l)break;u[f]=i.indent+u[f]}s=u.join("\n")}return s}throw new a["default"]("The partial "+i.name+" could not be compiled when running in runtime-only mode")}function i(t){var n=arguments[1]===undefined?{}:arguments[1],s=n.data;i._setup(n),!n.partial&&e.useData&&(s=m(t,s));var o=undefined,u=e.useBlockParams?[]:undefined;return e.useDepths&&(o=n.depths?[t].concat(n.depths):[t]),e.main.call(r,t,r.helpers,r.partials,s,u,o)}if(!t)throw new a["default"]("No environment passed to template");if(!e||!e.main)throw new a["default"]("Unknown template object: "+typeof e);t.VM.checkRevision(e.compiler);var r={strict:function(t,n){if(n in t)return t[n];throw new a["default"]('"'+n+'" not defined in '+t)},lookup:function(t,n){var r=t.length;for(var i=0;i<r;i++)if(t[i]&&t[i][n]!=null)return t[i][n]},lambda:function(t,n){return typeof t=="function"?t.call(n):t},escapeExpression:o.escapeExpression,invokePartial:n,fn:function(n){return e[n]},programs:[],program:function(t,n,r,i,s){var o=this.programs[t],u=this.fn(t);return n||s||i||r?o=h(this,t,u,n,r,i,s):o||(o=this.programs[t]=h(this,t,u)),o},data:function(t,n){while(t&&n--)t=t._parent;return t},merge:function(t,n){var r=t||n;return t&&n&&t!==n&&(r=o.extend({},n,t)),r},noop:t.VM.noop,compilerInfo:e.compiler};return i.isTop=!0,i._setup=function(n){n.partial?(r.helpers=n.helpers,r.partials=n.partials):(r.helpers=r.merge(n.helpers,t.helpers),e.usePartial&&(r.partials=r.merge(n.partials,t.partials)))},i._child=function(t,n,i,s){if(e.useBlockParams&&!i)throw new a["default"]("must pass block params");if(e.useDepths&&!s)throw new a["default"]("must pass parent depths");return h(r,t,e[t],n,0,i,s)},i}function h(e,t,n,r,i,s,o){function u(t){var i=arguments[1]===undefined?{}:arguments[1];return n.call(e,t,e.helpers,e.partials,i.data||r,s&&[i.blockParams].concat(s),o&&[t].concat(o))}return u.program=t,u.depth=o?o.length:0,u.blockParams=i||0,u}function p(e,t,n){return e?!e.call&&!n.name&&(n.name=e,e=n.partials[e]):e=n.partials[n.name],e}function d(e,t,n){n.partial=!0;if(e===undefined)throw new a["default"]("The partial "+n.name+" could not be found");if(e instanceof Function)return e(t,n)}function v(){return""}function m(e,t){if(!t||!("root"in t))t=t?f.createFrame(t):{},t.root=e;return t}var r=n(7)["default"],i=n(8)["default"];t.__esModule=!0,t.checkRevision=l,t.template=c,t.wrapProgram=h,t.resolvePartial=p,t.invokePartial=d,t.noop=v;var s=n(4),o=r(s),u=n(3),a=i(u),f=n(1)},function(e,t,n){(function(n){"use strict";t.__esModule=!0,t["default"]=function(e){var t=typeof n!="undefined"?n:window,r=t.Handlebars;e.noConflict=function(){t.Handlebars===e&&(t.Handlebars=r)}},e.exports=t["default"]}).call(t,function(){return this}())},function(e,t,n){"use strict";t["default"]=function(e){if(e&&e.__esModule)return e;var t={};if(typeof e=="object"&&e!==null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t},t.__esModule=!0},function(e,t,n){"use strict";t["default"]=function(e){return e&&e.__esModule?e:{"default":e}},t.__esModule=!0}])});
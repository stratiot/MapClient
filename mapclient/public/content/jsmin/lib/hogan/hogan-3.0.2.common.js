/*!
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan={};(function(e){function t(e,t,n){var r;return t&&typeof t=="object"&&(t[e]!==undefined?r=t[e]:n&&t.get&&typeof t.get=="function"&&(r=t.get(e))),r}function n(e,t,n,r,i,s){function o(){}function u(){}o.prototype=e,u.prototype=e.subs;var a,f=new o;f.subs=new u,f.subsText={},f.buf="",r=r||{},f.stackSubs=r,f.subsText=s;for(a in t)r[a]||(r[a]=t[a]);for(a in r)f.subs[a]=r[a];i=i||{},f.stackPartials=i;for(a in n)i[a]||(i[a]=n[a]);for(a in i)f.partials[a]=i[a];return f}function r(e){return String(e===null||e===undefined?"":e)}function i(e){return e=r(e),l.test(e)?e.replace(s,"&amp;").replace(o,"&lt;").replace(u,"&gt;").replace(a,"&#39;").replace(f,"&quot;"):e}e.Template=function(e,t,n,r){e=e||{},this.r=e.code||this.r,this.c=n,this.options=r||{},this.text=t||"",this.partials=e.partials||{},this.subs=e.subs||{},this.buf=""},e.Template.prototype={r:function(e,t,n){return""},v:i,t:r,render:function(e,t,n){return this.ri([e],t||{},n)},ri:function(e,t,n){return this.r(e,t,n)},ep:function(e,t){var r=this.partials[e],i=t[r.name];if(r.instance&&r.base==i)return r.instance;if(typeof i=="string"){if(!this.c)throw new Error("No compiler available.");i=this.c.compile(i,this.options)}if(!i)return null;this.partials[e].base=i;if(r.subs){t.stackText||(t.stackText={});for(key in r.subs)t.stackText[key]||(t.stackText[key]=this.activeSub!==undefined&&t.stackText[this.activeSub]?t.stackText[this.activeSub]:this.text);i=n(i,r.subs,r.partials,this.stackSubs,this.stackPartials,t.stackText)}return this.partials[e].instance=i,i},rp:function(e,t,n,r){var i=this.ep(e,n);return i?i.ri(t,n,r):""},rs:function(e,t,n){var r=e[e.length-1];if(!c(r)){n(e,t,this);return}for(var i=0;i<r.length;i++)e.push(r[i]),n(e,t,this),e.pop()},s:function(e,t,n,r,i,s,o){var u;return c(e)&&e.length===0?!1:(typeof e=="function"&&(e=this.ms(e,t,n,r,i,s,o)),u=!!e,!r&&u&&t&&t.push(typeof e=="object"?e:t[t.length-1]),u)},d:function(e,n,r,i){var s,o=e.split("."),u=this.f(o[0],n,r,i),a=this.options.modelGet,f=null;if(e==="."&&c(n[n.length-2]))u=n[n.length-1];else for(var l=1;l<o.length;l++)s=t(o[l],u,a),s!==undefined?(f=u,u=s):u="";return i&&!u?!1:(!i&&typeof u=="function"&&(n.push(f),u=this.mv(u,n,r),n.pop()),u)},f:function(e,n,r,i){var s=!1,o=null,u=!1,a=this.options.modelGet;for(var f=n.length-1;f>=0;f--){o=n[f],s=t(e,o,a);if(s!==undefined){u=!0;break}}return u?(!i&&typeof s=="function"&&(s=this.mv(s,n,r)),s):i?!1:""},ls:function(e,t,n,i,s){var o=this.options.delimiters;return this.options.delimiters=s,this.b(this.ct(r(e.call(t,i)),t,n)),this.options.delimiters=o,!1},ct:function(e,t,n){if(this.options.disableLambda)throw new Error("Lambda features disabled.");return this.c.compile(e,this.options).render(t,n)},b:function(e){this.buf+=e},fl:function(){var e=this.buf;return this.buf="",e},ms:function(e,t,n,r,i,s,o){var u,a=t[t.length-1],f=e.call(a);return typeof f=="function"?r?!0:(u=this.activeSub&&this.subsText&&this.subsText[this.activeSub]?this.subsText[this.activeSub]:this.text,this.ls(f,a,n,u.substring(i,s),o)):f},mv:function(e,t,n){var i=t[t.length-1],s=e.call(i);return typeof s=="function"?this.ct(r(s.call(i)),i,n):s},sub:function(e,t,n,r){var i=this.subs[e];i&&(this.activeSub=e,i(t,n,this,r),this.activeSub=!1)}};var s=/&/g,o=/</g,u=/>/g,a=/\'/g,f=/\"/g,l=/[&<>\"\']/,c=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"}})(typeof exports!="undefined"?exports:Hogan),function(e){function t(e){e.n.substr(e.n.length-1)==="}"&&(e.n=e.n.substring(0,e.n.length-1))}function n(e){return e.trim?e.trim():e.replace(/^\s*|\s*$/g,"")}function r(e,t,n){if(t.charAt(n)!=e.charAt(0))return!1;for(var r=1,i=e.length;r<i;r++)if(t.charAt(n+r)!=e.charAt(r))return!1;return!0}function i(t,n,r,u){var a=[],f=null,l=null,c=null;l=r[r.length-1];while(t.length>0){c=t.shift();if(!(!l||l.tag!="<"||c.tag in E))throw new Error("Illegal content in < super tag.");if(e.tags[c.tag]<=e.tags.$||s(c,u))r.push(c),c.nodes=i(t,c.tag,r,u);else{if(c.tag=="/"){if(r.length===0)throw new Error("Closing tag without opener: /"+c.n);f=r.pop();if(c.n!=f.n&&!o(c.n,f.n,u))throw new Error("Nesting error: "+f.n+" vs. "+c.n);return f.end=c.i,a}c.tag=="\n"&&(c.last=t.length==0||t[0].tag=="\n")}a.push(c)}if(r.length>0)throw new Error("missing closing tag: "+r.pop().n);return a}function s(e,t){for(var n=0,r=t.length;n<r;n++)if(t[n].o==e.n)return e.tag="#",!0}function o(e,t,n){for(var r=0,i=n.length;r<i;r++)if(n[r].c==e&&n[r].o==t)return!0}function u(e){var t=[];for(var n in e)t.push('"'+f(n)+'": function(c,p,t,i) {'+e[n]+"}");return"{ "+t.join(",")+" }"}function a(e){var t=[];for(var n in e.partials)t.push('"'+f(n)+'":{name:"'+f(e.partials[n].name)+'", '+a(e.partials[n])+"}");return"partials: {"+t.join(",")+"}, subs: "+u(e.subs)}function f(e){return e.replace(y,"\\\\").replace(v,'\\"').replace(m,"\\n").replace(g,"\\r").replace(b,"\\u2028").replace(w,"\\u2029")}function l(e){return~e.indexOf(".")?"d":"f"}function c(e,t){var n="<"+(t.prefix||""),r=n+e.n+S++;return t.partials[r]={name:e.n,partials:{}},t.code+='t.b(t.rp("'+f(r)+'",c,p,"'+(e.indent||"")+'"));',r}function h(e,t){t.code+="t.b(t.t(t."+l(e.n)+'("'+f(e.n)+'",c,p,0)));'}function p(e){return"t.b("+e+");"}var d=/\S/,v=/\"/g,m=/\n/g,g=/\r/g,y=/\\/g,b=/\u2028/,w=/\u2029/;e.tags={"#":1,"^":2,"<":3,$:4,"/":5,"!":6,">":7,"=":8,_v:9,"{":10,"&":11,_t:12},e.scan=function(i,s){function o(){y.length>0&&(b.push({tag:"_t",text:new String(y)}),y="")}function u(){var t=!0;for(var n=S;n<b.length;n++){t=e.tags[b[n].tag]<e.tags._v||b[n].tag=="_t"&&b[n].text.match(d)===null;if(!t)return!1}return t}function a(e,t){o();if(e&&u())for(var n=S,r;n<b.length;n++)b[n].text&&((r=b[n+1])&&r.tag==">"&&(r.indent=b[n].text.toString()),b.splice(n,1));else t||b.push({tag:"\n"});w=!1,S=b.length}function f(e,t){var r="="+T,i=e.indexOf(r,t),s=n(e.substring(e.indexOf("=",t)+1,i)).split(" ");return x=s[0],T=s[s.length-1],i+r.length-1}var l=i.length,c=0,h=1,p=2,v=c,m=null,g=null,y="",b=[],w=!1,E=0,S=0,x="{{",T="}}";s&&(s=s.split(" "),x=s[0],T=s[1]);for(E=0;E<l;E++)v==c?r(x,i,E)?(--E,o(),v=h):i.charAt(E)=="\n"?a(w):y+=i.charAt(E):v==h?(E+=x.length-1,g=e.tags[i.charAt(E+1)],m=g?i.charAt(E+1):"_v",m=="="?(E=f(i,E),v=c):(g&&E++,v=p),w=E):r(T,i,E)?(b.push({tag:m,n:n(y),otag:x,ctag:T,i:m=="/"?w-x.length:E+T.length}),y="",E+=T.length-1,v=c,m=="{"&&(T=="}}"?E++:t(b[b.length-1]))):y+=i.charAt(E);return a(w,!0),b};var E={_t:!0,"\n":!0,$:!0,"/":!0};e.stringify=function(t,n,r){return"{code: function (c,p,i) { "+e.wrapMain(t.code)+" },"+a(t)+"}"};var S=0;e.generate=function(t,n,r){S=0;var i={code:"",subs:{},partials:{}};return e.walk(t,i),r.asString?this.stringify(i,n,r):this.makeTemplate(i,n,r)},e.wrapMain=function(e){return'var t=this;t.b(i=i||"");'+e+"return t.fl();"},e.template=e.Template,e.makeTemplate=function(e,t,n){var r=this.makePartials(e);return r.code=new Function("c","p","i",this.wrapMain(e.code)),new this.template(r,t,this,n)},e.makePartials=function(e){var t,n={subs:{},partials:e.partials,name:e.name};for(t in n.partials)n.partials[t]=this.makePartials(n.partials[t]);for(t in e.subs)n.subs[t]=new Function("c","p","t","i",e.subs[t]);return n},e.codegen={"#":function(t,n){n.code+="if(t.s(t."+l(t.n)+'("'+f(t.n)+'",c,p,1),'+"c,p,0,"+t.i+","+t.end+',"'+t.otag+" "+t.ctag+'")){'+"t.rs(c,p,"+"function(c,p,t){",e.walk(t.nodes,n),n.code+="});c.pop();}"},"^":function(t,n){n.code+="if(!t.s(t."+l(t.n)+'("'+f(t.n)+'",c,p,1),c,p,1,0,0,"")){',e.walk(t.nodes,n),n.code+="};"},">":c,"<":function(t,n){var r={partials:{},code:"",subs:{},inPartial:!0};e.walk(t.nodes,r);var i=n.partials[c(t,n)];i.subs=r.subs,i.partials=r.partials},$:function(t,n){var r={subs:{},code:"",partials:n.partials,prefix:t.n};e.walk(t.nodes,r),n.subs[t.n]=r.code,n.inPartial||(n.code+='t.sub("'+f(t.n)+'",c,p,i);')},"\n":function(e,t){t.code+=p('"\\n"'+(e.last?"":" + i"))},_v:function(e,t){t.code+="t.b(t.v(t."+l(e.n)+'("'+f(e.n)+'",c,p,0)));'},_t:function(e,t){t.code+=p('"'+f(e.text)+'"')},"{":h,"&":h},e.walk=function(t,n){var r;for(var i=0,s=t.length;i<s;i++)r=e.codegen[t[i].tag],r&&r(t[i],n);return n},e.parse=function(e,t,n){return n=n||{},i(e,"",[],n.sectionTags||[])},e.cache={},e.cacheKey=function(e,t){return[e,!!t.asString,!!t.disableLambda,t.delimiters,!!t.modelGet].join("||")},e.compile=function(t,n){n=n||{};var r=e.cacheKey(t,n),i=this.cache[r];if(i){var s=i.partials;for(var o in s)delete s[o].instance;return i}return i=this.generate(this.parse(this.scan(t,n.delimiters),t,n),t,n),this.cache[r]=i}}(typeof exports!="undefined"?exports:Hogan),typeof module!="undefined"&&module.exports&&(module.exports=Hogan);
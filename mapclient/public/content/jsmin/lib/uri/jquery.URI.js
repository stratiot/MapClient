/*!
 * URI.js - Mutating URLs
 * jQuery Plugin
 *
 * Version: 1.14.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/jquery-uri-plugin.html
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function(e,t){"use strict";typeof exports=="object"?module.exports=t(require("jquery","./URI")):typeof define=="function"&&define.amd?define(["jquery","./URI"],t):t(e.jQuery,e.URI)})(this,function(e,t){"use strict";function n(e){return e.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")}function r(e){var n=e.nodeName.toLowerCase(),r=t.domAttributes[n];return n==="input"&&e.type!=="image"?undefined:r}function i(t){return{get:function(n){return e(n).uri()[t]()},set:function(n,r){return e(n).uri()[t](r),r}}}function s(t,n){var i,s,a;return!r(t)||!n?!1:(i=n.match(l),!i||!i[5]&&i[2]!==":"&&!u[i[2]]?!1:(a=e(t).uri(),i[5]?a.is(i[5]):i[2]===":"?(s=i[1].toLowerCase()+":",u[s]?u[s](a,i[4]):!1):(s=i[1].toLowerCase(),o[s]?u[i[2]](a[s](),i[4],s):!1)))}var o={},u={"=":function(e,t){return e===t},"^=":function(e,t){return!!(e+"").match(new RegExp("^"+n(t),"i"))},"$=":function(e,t){return!!(e+"").match(new RegExp(n(t)+"$","i"))},"*=":function(e,t,r){return r==="directory"&&(e+="/"),!!(e+"").match(new RegExp(n(t),"i"))},"equals:":function(e,t){return e.equals(t)},"is:":function(e,t){return e.is(t)}};e.each("authority directory domain filename fragment hash host hostname href password path pathname port protocol query resource scheme search subdomain suffix tld username".split(" "),function(t,n){o[n]=!0,e.attrHooks["uri:"+n]=i(n)});var a={get:function(t){return e(t).uri()},set:function(t,n){return e(t).uri().href(n).toString()}};e.each(["src","href","action","uri","cite"],function(t,n){e.attrHooks[n]={set:a.set}}),e.attrHooks.uri.get=a.get,e.fn.uri=function(e){var n=this.first(),i=n.get(0),s=r(i);if(!s)throw new Error('Element "'+i.nodeName+'" does not have either property: href, src, action, cite');if(e!==undefined){var o=n.data("uri");if(o)return o.href(e);e instanceof t||(e=t(e||""))}else{e=n.data("uri");if(e)return e;e=t(n.attr(s)||"")}return e._dom_element=i,e._dom_attribute=s,e.normalize(),n.data("uri",e),e},t.prototype.build=function(e){if(this._dom_element)this._string=t.build(this._parts),this._deferred_build=!1,this._dom_element.setAttribute(this._dom_attribute,this._string),this._dom_element[this._dom_attribute]=this._string;else if(e===!0)this._deferred_build=!0;else if(e===undefined||this._deferred_build)this._string=t.build(this._parts),this._deferred_build=!1;return this};var f,l=/^([a-zA-Z]+)\s*([\^\$*]?=|:)\s*(['"]?)(.+)\3|^\s*([a-zA-Z0-9]+)\s*$/;return e.expr.createPseudo?f=e.expr.createPseudo(function(e){return function(t){return s(t,e)}}):f=function(e,t,n){return s(e,n[3])},e.expr[":"].uri=f,e});
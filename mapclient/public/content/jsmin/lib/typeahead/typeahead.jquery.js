/*!
 * typeahead.js 0.11.1
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
 */

(function(e,t){typeof define=="function"&&define.amd?define("typeahead",["jquery"],function(e){return t(e)}):typeof exports=="object"?module.exports=t(require("jquery")):t(jQuery)})(this,function(e){var t=function(){"use strict";return{isMsie:function(){return/(msie|trident)/i.test(navigator.userAgent)?navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]:!1},isBlankString:function(e){return!e||/^\s*$/.test(e)},escapeRegExChars:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},isString:function(e){return typeof e=="string"},isNumber:function(e){return typeof e=="number"},isArray:e.isArray,isFunction:e.isFunction,isObject:e.isPlainObject,isUndefined:function(e){return typeof e=="undefined"},isElement:function(e){return!!e&&e.nodeType===1},isJQuery:function(t){return t instanceof e},toStr:function(n){return t.isUndefined(n)||n===null?"":n+""},bind:e.proxy,each:function(t,n){function r(e,t){return n(t,e)}e.each(t,r)},map:e.map,filter:e.grep,every:function(t,n){var r=!0;return t?(e.each(t,function(e,i){if(!(r=n.call(null,i,e,t)))return!1}),!!r):r},some:function(t,n){var r=!1;return t?(e.each(t,function(e,i){if(r=n.call(null,i,e,t))return!1}),!!r):r},mixin:e.extend,identity:function(e){return e},clone:function(t){return e.extend(!0,{},t)},getIdGenerator:function(){var e=0;return function(){return e++}},templatify:function(n){function r(){return String(n)}return e.isFunction(n)?n:r},defer:function(e){setTimeout(e,0)},debounce:function(e,t,n){var r,i;return function(){var s=this,o=arguments,u,a;return u=function(){r=null,n||(i=e.apply(s,o))},a=n&&!r,clearTimeout(r),r=setTimeout(u,t),a&&(i=e.apply(s,o)),i}},throttle:function(e,t){var n,r,i,s,o,u;return o=0,u=function(){o=new Date,i=null,s=e.apply(n,r)},function(){var a=new Date,f=t-(a-o);return n=this,r=arguments,f<=0?(clearTimeout(i),i=null,o=a,s=e.apply(n,r)):i||(i=setTimeout(u,f)),s}},stringify:function(e){return t.isString(e)?e:JSON.stringify(e)},noop:function(){}}}(),n=function(){"use strict";function n(n){var o,u;return u=t.mixin({},e,n),o={css:s(),classes:u,html:r(u),selectors:i(u)},{css:o.css,html:o.html,classes:o.classes,selectors:o.selectors,mixin:function(e){t.mixin(e,o)}}}function r(e){return{wrapper:'<span class="'+e.wrapper+'"></span>',menu:'<div class="'+e.menu+'"></div>'}}function i(e){var n={};return t.each(e,function(e,t){n[t]="."+e}),n}function s(){var e={wrapper:{position:"relative",display:"inline-block"},hint:{position:"absolute",top:"0",left:"0",borderColor:"transparent",boxShadow:"none",opacity:"1"},input:{position:"relative",verticalAlign:"top",backgroundColor:"transparent"},inputWithNoHint:{position:"relative",verticalAlign:"top"},menu:{position:"absolute",top:"100%",left:"0",zIndex:"100",display:"none"},ltr:{left:"0",right:"auto"},rtl:{left:"auto",right:" 0"}};return t.isMsie()&&t.mixin(e.input,{backgroundImage:"url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"}),e}var e={wrapper:"twitter-typeahead",input:"tt-input",hint:"tt-hint",menu:"tt-menu",dataset:"tt-dataset",suggestion:"tt-suggestion",selectable:"tt-selectable",empty:"tt-empty",open:"tt-open",cursor:"tt-cursor",highlight:"tt-highlight"};return n}(),r=function(){"use strict";function i(t){(!t||!t.el)&&e.error("EventBus initialized without el"),this.$el=e(t.el)}var n,r;return n="typeahead:",r={render:"rendered",cursorchange:"cursorchanged",select:"selected",autocomplete:"autocompleted"},t.mixin(i.prototype,{_trigger:function(t,r){var i;return i=e.Event(n+t),(r=r||[]).unshift(i),this.$el.trigger.apply(this.$el,r),i},before:function(e){var t,n;return t=[].slice.call(arguments,1),n=this._trigger("before"+e,t),n.isDefaultPrevented()},trigger:function(e){var t;this._trigger(e,[].slice.call(arguments,1)),(t=r[e])&&this._trigger(t,[].slice.call(arguments,1))}}),i}(),i=function(){"use strict";function n(t,n,r,i){var s;if(!r)return this;n=n.split(e),r=i?f(r,i):r,this._callbacks=this._callbacks||{};while(s=n.shift())this._callbacks[s]=this._callbacks[s]||{sync:[],async:[]},this._callbacks[s][t].push(r);return this}function r(e,t,r){return n.call(this,"async",e,t,r)}function i(e,t,r){return n.call(this,"sync",e,t,r)}function s(t){var n;if(!this._callbacks)return this;t=t.split(e);while(n=t.shift())delete this._callbacks[n];return this}function o(n){var r,i,s,o,a;if(!this._callbacks)return this;n=n.split(e),s=[].slice.call(arguments,1);while((r=n.shift())&&(i=this._callbacks[r]))o=u(i.sync,this,[r].concat(s)),a=u(i.async,this,[r].concat(s)),o()&&t(a);return this}function u(e,t,n){function r(){var r;for(var i=0,s=e.length;!r&&i<s;i+=1)r=e[i].apply(t,n)===!1;return!r}return r}function a(){var e;return window.setImmediate?e=function(t){setImmediate(function(){t()})}:e=function(t){setTimeout(function(){t()},0)},e}function f(e,t){return e.bind?e.bind(t):function(){e.apply(t,[].slice.call(arguments,0))}}var e=/\s+/,t=a();return{onSync:i,onAsync:r,off:s,trigger:o}}(),s=function(e){"use strict";function r(e,n,r){var i=[],s;for(var o=0,u=e.length;o<u;o++)i.push(t.escapeRegExChars(e[o]));return s=r?"\\b("+i.join("|")+")\\b":"("+i.join("|")+")",n?new RegExp(s):new RegExp(s,"i")}var n={node:null,pattern:null,tagName:"strong",className:null,wordsOnly:!1,caseSensitive:!1};return function(s){function u(t){var n,r,i;if(n=o.exec(t.data))i=e.createElement(s.tagName),s.className&&(i.className=s.className),r=t.splitText(n.index),r.splitText(n[0].length),i.appendChild(r.cloneNode(!0)),t.parentNode.replaceChild(i,r);return!!n}function a(e,t){var n,r=3;for(var i=0;i<e.childNodes.length;i++)n=e.childNodes[i],n.nodeType===r?i+=t(n)?1:0:a(n,t)}var o;s=t.mixin({},n,s);if(!s.node||!s.pattern)return;s.pattern=t.isArray(s.pattern)?s.pattern:[s.pattern],o=r(s.pattern,s.caseSensitive,s.wordsOnly),a(s.node,u)}}(window.document),o=function(){"use strict";function r(n,r){n=n||{},n.input||e.error("input is missing"),r.mixin(this),this.$hint=e(n.hint),this.$input=e(n.input),this.query=this.$input.val(),this.queryWhenFocused=this.hasFocus()?this.query:null,this.$overflowHelper=s(this.$input),this._checkLanguageDirection(),this.$hint.length===0&&(this.setHint=this.getHint=this.clearHint=this.clearHintIfInvalid=t.noop)}function s(t){return e('<pre aria-hidden="true"></pre>').css({position:"absolute",visibility:"hidden",whiteSpace:"pre",fontFamily:t.css("font-family"),fontSize:t.css("font-size"),fontStyle:t.css("font-style"),fontVariant:t.css("font-variant"),fontWeight:t.css("font-weight"),wordSpacing:t.css("word-spacing"),letterSpacing:t.css("letter-spacing"),textIndent:t.css("text-indent"),textRendering:t.css("text-rendering"),textTransform:t.css("text-transform")}).insertAfter(t)}function o(e,t){return r.normalizeQuery(e)===r.normalizeQuery(t)}function u(e){return e.altKey||e.ctrlKey||e.metaKey||e.shiftKey}var n;return n={9:"tab",27:"esc",37:"left",39:"right",13:"enter",38:"up",40:"down"},r.normalizeQuery=function(e){return t.toStr(e).replace(/^\s*/g,"").replace(/\s{2,}/g," ")},t.mixin(r.prototype,i,{_onBlur:function(){this.resetInputValue(),this.trigger("blurred")},_onFocus:function(){this.queryWhenFocused=this.query,this.trigger("focused")},_onKeydown:function(t){var r=n[t.which||t.keyCode];this._managePreventDefault(r,t),r&&this._shouldTrigger(r,t)&&this.trigger(r+"Keyed",t)},_onInput:function(){this._setQuery(this.getInputValue()),this.clearHintIfInvalid(),this._checkLanguageDirection()},_managePreventDefault:function(t,n){var r;switch(t){case"up":case"down":r=!u(n);break;default:r=!1}r&&n.preventDefault()},_shouldTrigger:function(t,n){var r;switch(t){case"tab":r=!u(n);break;default:r=!0}return r},_checkLanguageDirection:function(){var t=(this.$input.css("direction")||"ltr").toLowerCase();this.dir!==t&&(this.dir=t,this.$hint.attr("dir",t),this.trigger("langDirChanged",t))},_setQuery:function(t,n){var r,i;r=o(t,this.query),i=r?this.query.length!==t.length:!1,this.query=t,!n&&!r?this.trigger("queryChanged",this.query):!n&&i&&this.trigger("whitespaceChanged",this.query)},bind:function(){var e=this,r,i,s,o;return r=t.bind(this._onBlur,this),i=t.bind(this._onFocus,this),s=t.bind(this._onKeydown,this),o=t.bind(this._onInput,this),this.$input.on("blur.tt",r).on("focus.tt",i).on("keydown.tt",s),!t.isMsie()||t.isMsie()>9?this.$input.on("input.tt",o):this.$input.on("keydown.tt keypress.tt cut.tt paste.tt",function(r){if(n[r.which||r.keyCode])return;t.defer(t.bind(e._onInput,e,r))}),this},focus:function(){this.$input.focus()},blur:function(){this.$input.blur()},getLangDir:function(){return this.dir},getQuery:function(){return this.query||""},setQuery:function(t,n){this.setInputValue(t),this._setQuery(t,n)},hasQueryChangedSinceLastFocus:function(){return this.query!==this.queryWhenFocused},getInputValue:function(){return this.$input.val()},setInputValue:function(t){this.$input.val(t),this.clearHintIfInvalid(),this._checkLanguageDirection()},resetInputValue:function(){this.setInputValue(this.query)},getHint:function(){return this.$hint.val()},setHint:function(t){this.$hint.val(t)},clearHint:function(){this.setHint("")},clearHintIfInvalid:function(){var t,n,r,i;t=this.getInputValue(),n=this.getHint(),r=t!==n&&n.indexOf(t)===0,i=t!==""&&r&&!this.hasOverflow(),!i&&this.clearHint()},hasFocus:function(){return this.$input.is(":focus")},hasOverflow:function(){var t=this.$input.width()-2;return this.$overflowHelper.text(this.getInputValue()),this.$overflowHelper.width()>=t},isCursorAtEnd:function(){var e,n,r;return e=this.$input.val().length,n=this.$input[0].selectionStart,t.isNumber(n)?n===e:document.selection?(r=document.selection.createRange(),r.moveStart("character",-e),e===r.text.length):!0},destroy:function(){this.$hint.off(".tt"),this.$input.off(".tt"),this.$overflowHelper.remove(),this.$hint=this.$input=this.$overflowHelper=e("<div>")}}),r}(),u=function(){"use strict";function o(n,i){n=n||{},n.templates=n.templates||{},n.templates.notFound=n.templates.notFound||n.templates.empty,n.source||e.error("missing source"),n.node||e.error("missing node"),n.name&&!f(n.name)&&e.error("invalid dataset name: "+n.name),i.mixin(this),this.highlight=!!n.highlight,this.name=n.name||r(),this.limit=n.limit||5,this.displayFn=u(n.display||n.displayKey),this.templates=a(n.templates,this.displayFn),this.source=n.source.__ttAdapter?n.source.__ttAdapter():n.source,this.async=t.isUndefined(n.async)?this.source.length>2:!!n.async,this._resetLastSuggestion(),this.$el=e(n.node).addClass(this.classes.dataset).addClass(this.classes.dataset+"-"+this.name)}function u(e){function n(t){return t[e]}return e=e||t.stringify,t.isFunction(e)?e:n}function a(n,r){function i(t){return e("<div>").text(r(t))}return{notFound:n.notFound&&t.templatify(n.notFound),pending:n.pending&&t.templatify(n.pending),header:n.header&&t.templatify(n.header),footer:n.footer&&t.templatify(n.footer),suggestion:n.suggestion||i}}function f(e){return/^[_a-zA-Z0-9-]+$/.test(e)}var n,r;return n={val:"tt-selectable-display",obj:"tt-selectable-object"},r=t.getIdGenerator(),o.extractData=function(r){var i=e(r);return i.data(n.obj)?{val:i.data(n.val)||"",obj:i.data(n.obj)||null}:null},t.mixin(o.prototype,i,{_overwrite:function(t,n){n=n||[],n.length?this._renderSuggestions(t,n):this.async&&this.templates.pending?this._renderPending(t):!this.async&&this.templates.notFound?this._renderNotFound(t):this._empty(),this.trigger("rendered",this.name,n,!1)},_append:function(t,n){n=n||[],n.length&&this.$lastSuggestion.length?this._appendSuggestions(t,n):n.length?this._renderSuggestions(t,n):!this.$lastSuggestion.length&&this.templates.notFound&&this._renderNotFound(t),this.trigger("rendered",this.name,n,!0)},_renderSuggestions:function(t,n){var r;r=this._getSuggestionsFragment(t,n),this.$lastSuggestion=r.children().last(),this.$el.html(r).prepend(this._getHeader(t,n)).append(this._getFooter(t,n))},_appendSuggestions:function(t,n){var r,i;r=this._getSuggestionsFragment(t,n),i=r.children().last(),this.$lastSuggestion.after(r),this.$lastSuggestion=i},_renderPending:function(t){var n=this.templates.pending;this._resetLastSuggestion(),n&&this.$el.html(n({query:t,dataset:this.name}))},_renderNotFound:function(t){var n=this.templates.notFound;this._resetLastSuggestion(),n&&this.$el.html(n({query:t,dataset:this.name}))},_empty:function(){this.$el.empty(),this._resetLastSuggestion()},_getSuggestionsFragment:function(i,o){var u=this,a;return a=document.createDocumentFragment(),t.each(o,function(r){var s,o;o=u._injectQuery(i,r),s=e(u.templates.suggestion(o)).data(n.obj,r).data(n.val,u.displayFn(r)).addClass(u.classes.suggestion+" "+u.classes.selectable),a.appendChild(s[0])}),this.highlight&&s({className:this.classes.highlight,node:a,pattern:i}),e(a)},_getFooter:function(t,n){return this.templates.footer?this.templates.footer({query:t,suggestions:n,dataset:this.name}):null},_getHeader:function(t,n){return this.templates.header?this.templates.header({query:t,suggestions:n,dataset:this.name}):null},_resetLastSuggestion:function(){this.$lastSuggestion=e()},_injectQuery:function(n,r){return t.isObject(r)?t.mixin({_query:n},r):r},update:function(n){function u(e){if(s)return;s=!0,e=(e||[]).slice(0,r.limit),o=e.length,r._overwrite(n,e),o<r.limit&&r.async&&r.trigger("asyncRequested",n)}function a(t){t=t||[],!i&&o<r.limit&&(r.cancel=e.noop,o+=t.length,r._append(n,t.slice(0,r.limit-o)),r.async&&r.trigger("asyncReceived",n))}var r=this,i=!1,s=!1,o=0;this.cancel(),this.cancel=function(){i=!0,r.cancel=e.noop,r.async&&r.trigger("asyncCanceled",n)},this.source(n,u,a),!s&&u([])},cancel:e.noop,clear:function(){this._empty(),this.cancel(),this.trigger("cleared")},isEmpty:function(){return this.$el.is(":empty")},destroy:function(){this.$el=e("<div>")}}),o}(),a=function(){"use strict";function n(n,r){function s(t){var n=i.$node.find(t.node).first();return t.node=n.length?n:e("<div>").appendTo(i.$node),new u(t,r)}var i=this;n=n||{},n.node||e.error("node is required"),r.mixin(this),this.$node=e(n.node),this.query=null,this.datasets=t.map(n.datasets,s)}return t.mixin(n.prototype,i,{_onSelectableClick:function(n){this.trigger("selectableClicked",e(n.currentTarget))},_onRendered:function(t,n,r,i){this.$node.toggleClass(this.classes.empty,this._allDatasetsEmpty()),this.trigger("datasetRendered",n,r,i)},_onCleared:function(){this.$node.toggleClass(this.classes.empty,this._allDatasetsEmpty()),this.trigger("datasetCleared")},_propagate:function(){this.trigger.apply(this,arguments)},_allDatasetsEmpty:function(){function n(e){return e.isEmpty()}return t.every(this.datasets,n)},_getSelectables:function(){return this.$node.find(this.selectors.selectable)},_removeCursor:function(){var t=this.getActiveSelectable();t&&t.removeClass(this.classes.cursor)},_ensureVisible:function(t){var n,r,i,s;n=t.position().top,r=n+t.outerHeight(!0),i=this.$node.scrollTop(),s=this.$node.height()+parseInt(this.$node.css("paddingTop"),10)+parseInt(this.$node.css("paddingBottom"),10),n<0?this.$node.scrollTop(i+n):s<r&&this.$node.scrollTop(i+(r-s))},bind:function(){var e=this,n;return n=t.bind(this._onSelectableClick,this),this.$node.on("click.tt",this.selectors.selectable,n),t.each(this.datasets,function(t){t.onSync("asyncRequested",e._propagate,e).onSync("asyncCanceled",e._propagate,e).onSync("asyncReceived",e._propagate,e).onSync("rendered",e._onRendered,e).onSync("cleared",e._onCleared,e)}),this},isOpen:function(){return this.$node.hasClass(this.classes.open)},open:function(){this.$node.addClass(this.classes.open)},close:function(){this.$node.removeClass(this.classes.open),this._removeCursor()},setLanguageDirection:function(t){this.$node.attr("dir",t)},selectableRelativeToCursor:function(t){var n,r,i,s;return r=this.getActiveSelectable(),n=this._getSelectables(),i=r?n.index(r):-1,s=i+t,s=(s+1)%(n.length+1)-1,s=s<-1?n.length-1:s,s===-1?null:n.eq(s)},setCursor:function(t){this._removeCursor();if(t=t&&t.first())t.addClass(this.classes.cursor),this._ensureVisible(t)},getSelectableData:function(t){return t&&t.length?u.extractData(t):null},getActiveSelectable:function(){var t=this._getSelectables().filter(this.selectors.cursor).first();return t.length?t:null},getTopSelectable:function(){var t=this._getSelectables().first();return t.length?t:null},update:function(n){function i(e){e.update(n)}var r=n!==this.query;return r&&(this.query=n,t.each(this.datasets,i)),r},empty:function(){function n(e){e.clear()}t.each(this.datasets,n),this.query=null,this.$node.addClass(this.classes.empty)},destroy:function(){function r(e){e.destroy()}this.$node.off(".tt"),this.$node=e("<div>"),t.each(this.datasets,r)}}),n}(),f=function(){"use strict";function n(){a.apply(this,[].slice.call(arguments,0))}var e=a.prototype;return t.mixin(n.prototype,a.prototype,{open:function(){return!this._allDatasetsEmpty()&&this._show(),e.open.apply(this,[].slice.call(arguments,0))},close:function(){return this._hide(),e.close.apply(this,[].slice.call(arguments,0))},_onRendered:function(){return this._allDatasetsEmpty()?this._hide():this.isOpen()&&this._show(),e._onRendered.apply(this,[].slice.call(arguments,0))},_onCleared:function(){return this._allDatasetsEmpty()?this._hide():this.isOpen()&&this._show(),e._onCleared.apply(this,[].slice.call(arguments,0))},setLanguageDirection:function(n){return this.$node.css(n==="ltr"?this.css.ltr:this.css.rtl),e.setLanguageDirection.apply(this,[].slice.call(arguments,0))},_hide:function(){this.$node.hide()},_show:function(){this.$node.css("display","block")}}),n}(),l=function(){"use strict";function n(n,i){var s,o,u,a,f,l,h,p,d,v,m;n=n||{},n.input||e.error("missing input"),n.menu||e.error("missing menu"),n.eventBus||e.error("missing event bus"),i.mixin(this),this.eventBus=n.eventBus,this.minLength=t.isNumber(n.minLength)?n.minLength:1,this.input=n.input,this.menu=n.menu,this.enabled=!0,this.active=!1,this.input.hasFocus()&&this.activate(),this.dir=this.input.getLangDir(),this._hacks(),this.menu.bind().onSync("selectableClicked",this._onSelectableClicked,this).onSync("asyncRequested",this._onAsyncRequested,this).onSync("asyncCanceled",this._onAsyncCanceled,this).onSync("asyncReceived",this._onAsyncReceived,this).onSync("datasetRendered",this._onDatasetRendered,this).onSync("datasetCleared",this._onDatasetCleared,this),s=r(this,"activate","open","_onFocused"),o=r(this,"deactivate","_onBlurred"),u=r(this,"isActive","isOpen","_onEnterKeyed"),a=r(this,"isActive","isOpen","_onTabKeyed"),f=r(this,"isActive","_onEscKeyed"),l=r(this,"isActive","open","_onUpKeyed"),h=r(this,"isActive","open","_onDownKeyed"),p=r(this,"isActive","isOpen","_onLeftKeyed"),d=r(this,"isActive","isOpen","_onRightKeyed"),v=r(this,"_openIfActive","_onQueryChanged"),m=r(this,"_openIfActive","_onWhitespaceChanged"),this.input.bind().onSync("focused",s,this).onSync("blurred",o,this).onSync("enterKeyed",u,this).onSync("tabKeyed",a,this).onSync("escKeyed",f,this).onSync("upKeyed",l,this).onSync("downKeyed",h,this).onSync("leftKeyed",p,this).onSync("rightKeyed",d,this).onSync("queryChanged",v,this).onSync("whitespaceChanged",m,this).onSync("langDirChanged",this._onLangDirChanged,this)}function r(e){var n=[].slice.call(arguments,1);return function(){var r=[].slice.call(arguments);t.each(n,function(t){return e[t].apply(e,r)})}}return t.mixin(n.prototype,{_hacks:function(){var r,i;r=this.input.$input||e("<div>"),i=this.menu.$node||e("<div>"),r.on("blur.tt",function(e){var n,s,o;n=document.activeElement,s=i.is(n),o=i.has(n).length>0,t.isMsie()&&(s||o)&&(e.preventDefault(),e.stopImmediatePropagation(),t.defer(function(){r.focus()}))}),i.on("mousedown.tt",function(e){e.preventDefault()})},_onSelectableClicked:function(t,n){this.select(n)},_onDatasetCleared:function(){this._updateHint()},_onDatasetRendered:function(t,n,r,i){this._updateHint(),this.eventBus.trigger("render",r,i,n)},_onAsyncRequested:function(t,n,r){this.eventBus.trigger("asyncrequest",r,n)},_onAsyncCanceled:function(t,n,r){this.eventBus.trigger("asynccancel",r,n)},_onAsyncReceived:function(t,n,r){this.eventBus.trigger("asyncreceive",r,n)},_onFocused:function(){this._minLengthMet()&&this.menu.update(this.input.getQuery())},_onBlurred:function(){this.input.hasQueryChangedSinceLastFocus()&&this.eventBus.trigger("change",this.input.getQuery())},_onEnterKeyed:function(t,n){var r;(r=this.menu.getActiveSelectable())&&this.select(r)&&n.preventDefault()},_onTabKeyed:function(t,n){var r;(r=this.menu.getActiveSelectable())?this.select(r)&&n.preventDefault():(r=this.menu.getTopSelectable())&&this.autocomplete(r)&&n.preventDefault()},_onEscKeyed:function(){this.close()},_onUpKeyed:function(){this.moveCursor(-1)},_onDownKeyed:function(){this.moveCursor(1)},_onLeftKeyed:function(){this.dir==="rtl"&&this.input.isCursorAtEnd()&&this.autocomplete(this.menu.getTopSelectable())},_onRightKeyed:function(){this.dir==="ltr"&&this.input.isCursorAtEnd()&&this.autocomplete(this.menu.getTopSelectable())},_onQueryChanged:function(t,n){this._minLengthMet(n)?this.menu.update(n):this.menu.empty()},_onWhitespaceChanged:function(){this._updateHint()},_onLangDirChanged:function(t,n){this.dir!==n&&(this.dir=n,this.menu.setLanguageDirection(n))},_openIfActive:function(){this.isActive()&&this.open()},_minLengthMet:function(n){return n=t.isString(n)?n:this.input.getQuery()||"",n.length>=this.minLength},_updateHint:function(){var n,r,i,s,u,a,f;n=this.menu.getTopSelectable(),r=this.menu.getSelectableData(n),i=this.input.getInputValue(),r&&!t.isBlankString(i)&&!this.input.hasOverflow()?(s=o.normalizeQuery(i),u=t.escapeRegExChars(s),a=new RegExp("^(?:"+u+")(.+$)","i"),f=a.exec(r.val),f&&this.input.setHint(i+f[1])):this.input.clearHint()},isEnabled:function(){return this.enabled},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},isActive:function(){return this.active},activate:function(){return this.isActive()?!0:!this.isEnabled()||this.eventBus.before("active")?!1:(this.active=!0,this.eventBus.trigger("active"),!0)},deactivate:function(){return this.isActive()?this.eventBus.before("idle")?!1:(this.active=!1,this.close(),this.eventBus.trigger("idle"),!0):!0},isOpen:function(){return this.menu.isOpen()},open:function(){return!this.isOpen()&&!this.eventBus.before("open")&&(this.menu.open(),this._updateHint(),this.eventBus.trigger("open")),this.isOpen()},close:function(){return this.isOpen()&&!this.eventBus.before("close")&&(this.menu.close(),this.input.clearHint(),this.input.resetInputValue(),this.eventBus.trigger("close")),!this.isOpen()},setVal:function(n){this.input.setQuery(t.toStr(n))},getVal:function(){return this.input.getQuery()},select:function(t){var n=this.menu.getSelectableData(t);return n&&!this.eventBus.before("select",n.obj)?(this.input.setQuery(n.val,!0),this.eventBus.trigger("select",n.obj),this.close(),!0):!1},autocomplete:function(t){var n,r,i;return n=this.input.getQuery(),r=this.menu.getSelectableData(t),i=r&&n!==r.val,i&&!this.eventBus.before("autocomplete",r.obj)?(this.input.setQuery(r.val),this.eventBus.trigger("autocomplete",r.obj),!0):!1},moveCursor:function(t){var n,r,i,s,o;return n=this.input.getQuery(),r=this.menu.selectableRelativeToCursor(t),i=this.menu.getSelectableData(r),s=i?i.obj:null,o=this._minLengthMet()&&this.menu.update(n),!o&&!this.eventBus.before("cursorchange",s)?(this.menu.setCursor(r),i?this.input.setInputValue(i.val):(this.input.resetInputValue(),this._updateHint()),this.eventBus.trigger("cursorchange",s),!0):!1},destroy:function(){this.input.destroy(),this.menu.destroy()}}),n}();(function(){"use strict";function c(t,n){t.each(function(){var t=e(this),r;(r=t.data(s.typeahead))&&n(r,t)})}function h(e,t){return e.clone().addClass(t.classes.hint).removeData().css(t.css.hint).css(d(e)).prop("readonly",!0).removeAttr("id name placeholder required").attr({autocomplete:"off",spellcheck:"false",tabindex:-1})}function p(e,t){e.data(s.attrs,{dir:e.attr("dir"),autocomplete:e.attr("autocomplete"),spellcheck:e.attr("spellcheck"),style:e.attr("style")}),e.addClass(t.classes.input).attr({autocomplete:"off",spellcheck:!1});try{!e.attr("dir")&&e.attr("dir","auto")}catch(n){}return e}function d(e){return{backgroundAttachment:e.css("background-attachment"),backgroundClip:e.css("background-clip"),backgroundColor:e.css("background-color"),backgroundImage:e.css("background-image"),backgroundOrigin:e.css("background-origin"),backgroundPosition:e.css("background-position"),backgroundRepeat:e.css("background-repeat"),backgroundSize:e.css("background-size")}}function v(e){var n,r;n=e.data(s.www),r=e.parent().filter(n.selectors.wrapper),t.each(e.data(s.attrs),function(n,r){t.isUndefined(n)?e.removeAttr(r):e.attr(r,n)}),e.removeData(s.typeahead).removeData(s.www).removeData(s.attr).removeClass(n.classes.input),r.length&&(e.detach().insertAfter(r),r.remove())}function m(n){var r,i;return r=t.isJQuery(n)||t.isElement(n),i=r?e(n).first():[],i.length?i:null}var i,s,u;i=e.fn.typeahead,s={www:"tt-www",attrs:"tt-attrs",typeahead:"tt-typeahead"},u={initialize:function(u,c){function v(){var n,i,v,g,y,b,w,E,S,x,T;t.each(c,function(e){e.highlight=!!u.highlight}),n=e(this),i=e(d.html.wrapper),v=m(u.hint),g=m(u.menu),y=u.hint!==!1&&!v,b=u.menu!==!1&&!g,y&&(v=h(n,d)),b&&(g=e(d.html.menu).css(d.css.menu)),v&&v.val(""),n=p(n,d);if(y||b)i.css(d.css.wrapper),n.css(y?d.css.input:d.css.inputWithNoHint),n.wrap(i).parent().prepend(y?v:null).append(b?g:null);T=b?f:a,w=new r({el:n}),E=new o({hint:v,input:n},d),S=new T({node:g,datasets:c},d),x=new l({input:E,menu:S,eventBus:w,minLength:u.minLength},d),n.data(s.www,d),n.data(s.typeahead,x)}var d;return c=t.isArray(c)?c:[].slice.call(arguments,1),u=u||{},d=n(u.classNames),this.each(v)},isEnabled:function(){var t;return c(this.first(),function(e){t=e.isEnabled()}),t},enable:function(){return c(this,function(e){e.enable()}),this},disable:function(){return c(this,function(e){e.disable()}),this},isActive:function(){var t;return c(this.first(),function(e){t=e.isActive()}),t},activate:function(){return c(this,function(e){e.activate()}),this},deactivate:function(){return c(this,function(e){e.deactivate()}),this},isOpen:function(){var t;return c(this.first(),function(e){t=e.isOpen()}),t},open:function(){return c(this,function(e){e.open()}),this},close:function(){return c(this,function(e){e.close()}),this},select:function(n){var r=!1,i=e(n);return c(this.first(),function(e){r=e.select(i)}),r},autocomplete:function(n){var r=!1,i=e(n);return c(this.first(),function(e){r=e.autocomplete(i)}),r},moveCursor:function(t){var n=!1;return c(this.first(),function(e){n=e.moveCursor(t)}),n},val:function(t){var n;return arguments.length?(c(this,function(e){e.setVal(t)}),this):(c(this.first(),function(e){n=e.getVal()}),n)},destroy:function(){return c(this,function(e,t){v(t),e.destroy()}),this}},e.fn.typeahead=function(e){return u[e]?u[e].apply(this,[].slice.call(arguments,1)):u.initialize.apply(this,arguments)},e.fn.typeahead.noConflict=function(){return e.fn.typeahead=i,this}})()});
var xmlToJSON=function(){this.version="1.3";var e={mergeCDATA:!0,grokAttr:!0,grokText:!0,normalize:!0,xmlns:!0,namespaceKey:"_ns",textKey:"_text",valueKey:"_value",attrKey:"_attr",cdataKey:"_cdata",attrsAsObject:!0,stripAttrPrefix:!0,stripElemPrefix:!0,childrenAsArray:!0},t=new RegExp(/(?!xmlns)^.*:/),n=new RegExp(/^\s+|\s+$/g);return this.grokType=function(e){return/^\s*$/.test(e)?null:/^(?:true|false)$/i.test(e)?"true"===e.toLowerCase():isFinite(e)?parseFloat(e):e},this.parseString=function(e,t){return this.parseXML(this.stringToXML(e),t)},this.parseXML=function(r,i){for(var s in i)e[s]=i[s];var o={},u=0,f="";if(e.xmlns&&r.namespaceURI&&(o[e.namespaceKey]=r.namespaceURI),r.attributes&&r.attributes.length>0){var l={};for(u;u<r.attributes.length;u++){var h=r.attributes.item(u);m={};var p="";p=e.stripAttrPrefix?h.name.replace(t,""):h.name,e.grokAttr?m[e.valueKey]=this.grokType(h.value.replace(n,"")):m[e.valueKey]=h.value.replace(n,""),e.xmlns&&h.namespaceURI&&(m[e.namespaceKey]=h.namespaceURI),e.attrsAsObject?l[p]=m:o[e.attrKey+p]=m}e.attrsAsObject&&(o[e.attrKey]=l)}if(r.hasChildNodes())for(var d,v,m,g=0;g<r.childNodes.length;g++)d=r.childNodes.item(g),4===d.nodeType?e.mergeCDATA?f+=d.nodeValue:o.hasOwnProperty(e.cdataKey)?(o[e.cdataKey].constructor!==Array&&(o[e.cdataKey]=[o[e.cdataKey]]),o[e.cdataKey].push(d.nodeValue)):e.childrenAsArray?(o[e.cdataKey]=[],o[e.cdataKey].push(d.nodeValue)):o[e.cdataKey]=d.nodeValue:3===d.nodeType?f+=d.nodeValue:1===d.nodeType&&(0===u&&(o={}),v=e.stripElemPrefix?d.nodeName.replace(t,""):d.nodeName,m=xmlToJSON.parseXML(d),o.hasOwnProperty(v)?(o[v].constructor!==Array&&(o[v]=[o[v]]),o[v].push(m)):(e.childrenAsArray?(o[v]=[],o[v].push(m)):o[v]=m,u++));else f||(e.childrenAsArray?(o[e.textKey]=[],o[e.textKey].push(null)):o[e.textKey]=null);if(f)if(e.grokText){var y=this.grokType(f.replace(n,""));null!==y&&void 0!==y&&(o[e.textKey]=y)}else e.normalize?o[e.textKey]=f.replace(n,"").replace(/\s+/g," "):o[e.textKey]=f.replace(n,"");return o},this.xmlToString=function(e){try{var t=e.xml?e.xml:(new XMLSerializer).serializeToString(e);return t}catch(n){return null}},this.stringToXML=function(e){try{var t=null;if(window.DOMParser){var n=new DOMParser;return t=n.parseFromString(e,"text/xml")}return t=new ActiveXObject("Microsoft.XMLDOM"),t.async=!1,t.loadXML(e),t}catch(r){return null}},this}();"undefined"!=typeof module&&null!==module&&module.exports?module.exports=xmlToJSON:"function"==typeof define&&define.amd&&define(function(){return xmlToJSON}),function(){var e=function(e,t){"use strict";var n=null,r=null,i=[],s=null;t.LayerType={WMS:"WMS",WFS:"WFS",TILE:"Tile",GeoJSON:"GeoJSON",KML:"KML",GML:"GML",GPX:"GPX",CSV:"CSV",WCS:"WCS",WCPS:"WCPS"},t.version="0.0.1",t.define=function(e){if(e)for(var t=e.split("."),n=window,r=0;r<t.length;r++)t[r]&&("undefined"==typeof n[t[r]]&&(n[t[r]]={__namespace:t.slice(0,r+1).join(".")}),n=n[t[r]])};var o=function(e,t){if(t)for(var n in t)t.hasOwnProperty(n)&&void 0!==t[n]&&(e[n]=t[n]);return e};t.Class=function(){for(var e,t,n=(arguments,function(){"function"==typeof this.initialize&&this.initialize.apply(this,arguments)}),r={},i=function(){},s=0,u=arguments.length;u>s;++s)"function"==typeof arguments[s]?(0===s&&u>1&&(t=arguments[s].prototype.initialize,arguments[s].prototype.initialize=i(),r=new arguments[s],r.constructor=n,void 0===t?delete arguments[s].prototype.initialize:arguments[s].prototype.initialize=t),e=arguments[s].prototype):e=arguments[s],o(r,e);return n.prototype=r,n.prototype.constructor=n,n};var u={};return t.registerFrameworkResolver=function(e,t){return u.hasOwnProperty(e)?(console.log("Resolver for framework "+e+" already registered."),!1):(u[e]=t,!0)},t.resolveFramework=function(){for(var e in u)if(u[e]())return e;return null},t.isDefined=function(e){return"undefined"!=typeof e},t.isFunction=function(e){return"function"==typeof e},t.isObject=function(e){return"object"==typeof e},t.isEmpty=function(e){if(null===e)return!0;if(e.length>0)return!1;if(0===e.length)return!0;for(var t in e)if(hasOwnProperty.call(e,t))return!1;return!0},t.isClass=function(e){for(var t=e.split("."),n=window,r=0;r<t.length;r++){if(!t[r]||"undefined"==typeof n[t[r]])return!1;if(r===t.length-1&&"function"!=typeof n[t[r]])return!1;n=n[t[r]]}return!0},t.isArray=function(e){return Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e)},t.getQueryStringParameters=function(e){var t={};return e.replace(new RegExp("([^?=&]+)(=([^&#]*))?","g"),function(e,n,r,i){t[n]=i}),t},t.locator={_dependencies:[],_factories:[],register:function(e,t){var n=this._dependencies.indexOf(e);return 0>n?(this._dependencies.push(e),this._factories.push(t)):this._factories[n]=t,t},unregister:function(e){var t=this._dependencies.indexOf(e);t>=0&&(this._dependencies.splice(t,1),this._factories.splice(t,1))},resolve:function(e){var t=this._dependencies.indexOf(e);return 0>t?null:this._factories[t]},create:function(e,t){var n=this.resolve(e);return n?new n(t):null}},t.registry={_LayerTypeRegistry:[],registerLayerType:function(e){for(var n=null,r=0;r<this._LayerTypeRegistry.length;r++)if(this._LayerTypeRegistry[r].layer===e.layer&&this._LayerTypeRegistry[r].framework===e.framework){n=this._LayerTypeRegistry[r];break}n?n.type=e.type:(n={layer:e.layer,framework:e.framework,type:e.type},this._LayerTypeRegistry.push(n)),t.locator.register(e.type,e.factory)},resolveLayerType:function(e){for(var n=null,r=t.resolveFramework(),i=0;i<this._LayerTypeRegistry.length;i++)if(this._LayerTypeRegistry[i].layer===e&&this._LayerTypeRegistry[i].framework===r){n=this._LayerTypeRegistry[i];break}return n?n.type:null},createLayer:function(e){var n=this.resolveLayerType(e.type);return n?t.locator.create(n,e):null},getFactories:function(){return this._LayerTypeRegistry.map(function(e){return t.locator.resolve(e.type)})}},t._PM=window.PM,t.noConflict=function(){return window.PM===t&&("undefined"!=typeof this._PM?window.PM=this._PM:delete window.PM),this},n=jQuery("script").last().attr("src"),n=n.substring(0,n.lastIndexOf("/")+1),r=jQuery("script").last().data("library"),r||(r="ol"),t.ready=function(o){if(!t.isFunction(o))return void console.log("Argument for ready() is not a function.");if(t.resolveFramework()||(e("<link/>",{rel:"stylesheet",type:"text/css",href:n+"lib/"+r+"/"+r+".css"}).appendTo("head"),i.push(n+"lib/"+r+"/"+r+".js"),i.push(n+"publicamundi."+r+".js")),0===i.length)o();else{var u=function(){s&&(s=null),i.length>0?(s=i[0],i.shift(),e.ajax({url:s,dataType:"script",success:u,cache:!0})):o()};u()}},t};"undefined"!=typeof define&&define.amd?define(["jquery","shared"],e):("undefined"==typeof PublicaMundi&&(PublicaMundi={__namespace:"PublicaMundi"}),e($,PublicaMundi))}(),function(e,t){"use strict";"undefined"!=typeof t&&(t.Map=t.Class({initialize:function(e){this._map=null,this._layers=[],this._control=null,this._viewbox="0,0,0,0",this._popup=null,this._highlight=null,this._featureOverlay=null,this._layerHighlight=null,this._featureHighlight=null,e=e||{},e.target=t.isDefined(e.target)?e.target:null,e.projection=t.isDefined(e.projection)?e.projection:"EPSG:3857",e.center=t.isDefined(e.center)?e.center:[0,0],e.zoom=t.isDefined(e.zoom)?e.zoom:2},setExtent:function(e){return this},_setViewBox:function(){return this},_getViewBox:function(){return this._viewbox},setLayerControl:function(e){return this},getLayerControl:function(){return this._control},getMap:function(){return this._map},getOverlay:function(){return this._popup},getFeatureOverlay:function(){return this._featureOverlay},setCenter:function(e,t){return this},getCenter:function(){return null},setZoom:function(e){return this},getZoom:function(){return null},getProjection:function(){return null},getTarget:function(){return null},getLayers:function(){return this._layers},_listen:function(){return null},createLayer:function(e){var n=null;switch(typeof e){case"string":var r=[".gson",".geojson"];r.some(function(t){return e.indexOf(t,e.length-t.length)})&&this.createLayer({type:t.LayerType.GeoJSON,url:e,projection:this.getProjection()});break;case"object":for(var i=t.registry.getFactories(),s=0;s<i.length;s++)if(e instanceof i[s]){n=e;break}n||(t.isDefined(e.projection)||(e.projection=this.getProjection()),n=t.registry.createLayer(e),n.setMap(this)),n?this.addLayer(n):console.log("Layer of type "+e.type+" is not supported.")}return n&&this._layers.push(n),n},addLayer:function(e){},removeLayer:function(e){}}),t.locator.register("PublicaMundi.Map",t.Map),t.map=function(e){return t.locator.create("PublicaMundi.Map",e)},t.configure=function(e,n,r){var i="string"==typeof e?t.map({target:e}):t.map(e);return jQuery.getJSON(n,function(e){if(e.center&&i.setCenter(e.center),e.zoom&&i.setZoom(e.zoom),t.isArray(e.layers))for(var n=0;n<e.layers.length;n++)i.addLayer(e.layers[n]);t.isFunction(r)&&r.call(this,e)}),i})}(window,window.PublicaMundi),function(e,t){"undefined"!=typeof t&&(t.define("PublicaMundi"),t.Helpers=t.Class({initialize:function(e){}}),t.locator.register("PublicaMundi.Helpers",t.Helpers))}(window,PublicaMundi),function(e,t){"undefined"!=typeof t&&(t.define("PublicaMundi"),t.Parser=t.Class({initialize:function(e){},parseWMS:function(e){var t,n={};try{t=xmlToJSON.parseXML(e,{childrenAsArray:!1})}catch(r){return console.log(r),n.success=!1,n.error_msg="Server response is not a valid XML document. Cannot display",n}if(t.ServiceExceptionReport)return n.success=!1,n.error_msg="Service Exception Report. Please try again.",n;var i=null;if(t.WMS_Capabilities)i=t.WMS_Capabilities;else if(t.WMT_MS_Capabilities&&(i=t.WMT_MS_Capabilities,i instanceof Array))for(var s in i){var o=i[s];o.Capability&&(i=o)}if(!i._attr)return n.success=!1,n.error_msg="WMS Capabilities Load Exception. Please try again.",n;n.version=i._attr.version._value;var u=[];if(!i.Capability.Layer)return n.success=!1,n.error_msg="No WMS Layers found in provided endpoint.",n;i.Capability.Layer.Layer?u=i.Capability.Layer.Layer:i.Capability.Layer&&(u=i.Capability.Layer),u instanceof Array||(u=[u]);for(var s in u){var a=u[s];a.Name=a.Name._text,a.Title=a.Title._text,a.Abstract=a.Abstract._text,a.CRS=a.CRS._text;var f=a.EX_GeographicBoundingBox,l=null;if(f){var c=f.eastBoundLongitude._text,h=f.westBoundLongitude._text,p=f.northBoundLatitude._text,d=f.southBoundLatitude._text;l=[h,d,c,p],a.EX_GeographicBoundingBox=l}}return n.Layer=u,n.success=!0,n},parseWFS:function(e){var t,n={};try{t=xmlToJSON.parseXML(e,{childrenAsArray:!1})}catch(r){return console.log(r),n.success=!1,n.error_msg="Server response is not a valid XML document. Cannot display",n}var i=null;if(!t.WFS_Capabilities)return console.log("unexpected version"),console.log(s),n.success=!1,n.error_msg="WFS Capabilities error. Could not load layers.",n;i=t.WFS_Capabilities;var s=null;i._attr&&(s=i._attr.version._value),n=i,n.version=s;var o=[];if(i.FeatureTypeList)o=i.FeatureTypeList.FeatureType;else{if(!i["wfs:FeatureTypeList"])return n.success=!1,n.error_msg="No WFS Features provided in selected endpoint.",n;o=i["wfs:FeatureTypeList"]["wfs:FeatureType"]}for(var u in o){var a=o[u];a.Name=a.Name._text,a.Title=a.Title._text,a.Abstract=a.Abstract._text;var f=[];for(var l in a.Keywords.Keyword){var c=a.Keywords.Keyword[l];f.push(c._text)}a.Keywords=f;var h=a.WGS84BoundingBox,p=null;if(h){var d=h.LowerCorner._text.split(" "),v=h.UpperCorner._text.split(" ");p=[parseFloat(d[0]),parseFloat(d[1]),parseFloat(v[0]),parseFloat(v[1])],a.WGS84BoundingBox=p}var m=null;if(a.DefaultCRS){var g=a.DefaultCRS._text,y=g.split(":");m=y[y.length-3]+":"+y[y.length-1],a.DefaultCRS=m}}n.Layer=o;var b=null;return i.OperationsMetadata&&(b=i.OperationsMetadata.Operation),n.Format=b,n.success=!0,n}}),t.locator.register("PublicaMundi.Parser",t.Parser),t.parser=function(e){return t.locator.create("PublicaMundi.Parser",e)})}(window,PublicaMundi),function(e,t){"undefined"!=typeof t&&(t.define("PublicaMundi"),t.Layer=t.Class({initialize:function(e){this._map=null,this._type=null,this._layer=null,this._style={normal:{color:"#3399CC",radius:6,weight:1.25,opacity:1,fillColor:"#FFFFFF",fillOpacity:.4},highlight:{}},this._extent=e.bbox||null,this._options=e||{}},setMap:function(e){this._map=e},getMap:function(){return this._map},getType:function(){return this._type},getLayer:function(){return this._layer},getStyle:function(){return this._style},fitToMap:function(){return this._extent},onLayerLoad:function(){return this._layer},getOptions:function(){return this._options},addToControl:function(){return null},update:function(){return null},_transformStyle:function(){return null}}),t.locator.register("PublicaMundi.Layer",t.Layer))}(window,PublicaMundi);
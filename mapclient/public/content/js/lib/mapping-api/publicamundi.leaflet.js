/* PublicaMundi Mapping API version 0.1.0 2015-11-05 */

!function(a,b){"use strict";"undefined"!=typeof b&&(b.define("PublicaMundi.Leaflet"),b.Leaflet.Framework="leaflet",b.registerFrameworkResolver(b.Leaflet.Framework,function(){return b.isObject(L)&&b.isFunction(L.Map)?!0:!1}))}(window,PublicaMundi),toGeoJSON=function(){"use strict";function a(a){if(!a||!a.length)return 0;for(var b=0,c=0;b<a.length;b++)c=(c<<5)-c+a.charCodeAt(b)|0;return c}function b(a,b){return a.getElementsByTagName(b)}function c(a,b){return a.getAttribute(b)}function d(a,b){return parseFloat(c(a,b))}function e(a,c){var d=b(a,c);return d.length?d[0]:null}function f(a){return a.normalize&&a.normalize(),a}function g(a){for(var b=0,c=[];b<a.length;b++)c[b]=parseFloat(a[b]);return c}function h(a){var b={};for(var c in a)a[c]&&(b[c]=a[c]);return b}function i(a){return a&&f(a),a&&a.firstChild&&a.firstChild.nodeValue||""}function j(a){return g(a.replace(p,"").split(","))}function k(a){for(var b=a.replace(q,"").split(r),c=[],d=0;d<b.length;d++)c.push(j(b[d]));return c}function l(a){var b=[d(a,"lon"),d(a,"lat")],c=e(a,"ele");return c&&b.push(parseFloat(i(c))),b}function m(){return{type:"FeatureCollection",features:[]}}function n(a){return o.serializeToString(a)}var o,p=/\s*/g,q=/^\s*|\s*$/g,r=/\s+/;"undefined"!=typeof XMLSerializer?o=new XMLSerializer:"object"!=typeof exports||"object"!=typeof process||process.browser||(o=new(require("xmldom").XMLSerializer));var s={kml:function(d){function f(a){var b,c;return a=a||"","#"===a.substr(0,1)&&(a=a.substr(1)),(6===a.length||3===a.length)&&(b=a),8===a.length&&(c=parseInt(a.substr(0,2),16)/255,b=a.substr(2)),[b,isNaN(c)?void 0:c]}function h(a){return g(a.split(" "))}function l(a){var c=b(a,"coord","gx"),d=[];0===c.length&&(c=b(a,"gx:coord"));for(var e=0;e<c.length;e++)d.push(h(i(c[e])));return d}function o(a){var c,d,f,g,h,m=[];if(e(a,"MultiGeometry"))return o(e(a,"MultiGeometry"));if(e(a,"MultiTrack"))return o(e(a,"MultiTrack"));if(e(a,"gx:MultiTrack"))return o(e(a,"gx:MultiTrack"));for(f=0;f<s.length;f++)if(d=b(a,s[f]))for(g=0;g<d.length;g++)if(c=d[g],"Point"==s[f])m.push({type:"Point",coordinates:j(i(e(c,"coordinates")))});else if("LineString"==s[f])m.push({type:"LineString",coordinates:k(i(e(c,"coordinates")))});else if("Polygon"==s[f]){var n=b(c,"LinearRing"),p=[];for(h=0;h<n.length;h++)p.push(k(i(e(n[h],"coordinates"))));m.push({type:"Polygon",coordinates:p})}else("Track"==s[f]||"gx:Track"==s[f])&&m.push({type:"LineString",coordinates:l(c)});return m}function p(a){var c,d=o(a),g={},h=i(e(a,"name")),j=i(e(a,"styleUrl")),k=i(e(a,"description")),l=e(a,"TimeSpan"),m=e(a,"ExtendedData"),n=e(a,"LineStyle"),p=e(a,"PolyStyle");if(!d.length)return[];if(h&&(g.name=h),j&&r[j]&&(g.styleUrl=j,g.styleHash=r[j]),k&&(g.description=k),l){var q=i(e(l,"begin")),s=i(e(l,"end"));g.timespan={begin:q,end:s}}if(n){var t=f(i(e(n,"color"))),u=t[0],v=t[1],w=parseFloat(i(e(n,"width")));u&&(g.stroke=u),isNaN(v)||(g["stroke-opacity"]=v),isNaN(w)||(g["stroke-width"]=w)}if(p){var x=f(i(e(p,"color"))),y=x[0],z=x[1],A=i(e(p,"fill")),B=i(e(p,"outline"));y&&(g.fill=y),isNaN(z)||(g["fill-opacity"]=z),A&&(g["fill-opacity"]="1"===A?1:0),B&&(g["stroke-opacity"]="1"===B?1:0)}if(m){var C=b(m,"Data"),D=b(m,"SimpleData");for(c=0;c<C.length;c++)g[C[c].getAttribute("name")]=i(e(C[c],"value"));for(c=0;c<D.length;c++)g[D[c].getAttribute("name")]=i(D[c])}return[{type:"Feature",geometry:1===d.length?d[0]:{type:"GeometryCollection",geometries:d},properties:g}]}for(var q=m(),r={},s=["Polygon","LineString","Point","Track","gx:Track"],t=b(d,"Placemark"),u=b(d,"Style"),v=0;v<u.length;v++)r["#"+c(u[v],"id")]=a(n(u[v])).toString(16);for(var w=0;w<t.length;w++)q.features=q.features.concat(p(t[w]));return q},gpx:function(a){function c(a,c){var d=b(a,c),e=[],f=d.length;if(!(2>f)){for(var g=0;f>g;g++)e.push(l(d[g]));return e}}function d(a){for(var d,e=b(a,"trkseg"),f=[],g=0;g<e.length;g++)d=c(e[g],"trkpt"),d&&f.push(d);return 0!==f.length?{type:"Feature",properties:j(a),geometry:{type:1===f.length?"LineString":"MultiLineString",coordinates:1===f.length?f[0]:f}}:void 0}function f(a){var b=c(a,"rtept");if(b)return{type:"Feature",properties:j(a),geometry:{type:"LineString",coordinates:b}}}function g(a){var b=j(a);return b.sym=i(e(a,"sym")),{type:"Feature",properties:b,geometry:{type:"Point",coordinates:l(a)}}}function j(a){var b,c=["name","desc","author","copyright","link","time","keywords"],d={};for(b=0;b<c.length;b++)d[c[b]]=i(e(a,c[b]));return h(d)}var k,n,o=b(a,"trk"),p=b(a,"rte"),q=b(a,"wpt"),r=m();for(k=0;k<o.length;k++)n=d(o[k]),n&&r.features.push(n);for(k=0;k<p.length;k++)n=f(p[k]),n&&r.features.push(n);for(k=0;k<q.length;k++)r.features.push(g(q[k]));return r}};return s}(),"undefined"!=typeof module&&(module.exports=toGeoJSON),function(a,b,c){"undefined"!=typeof b&&"undefined"!=typeof c&&(b.define("PublicaMundi.Leaflet"),_project=function(a){var b=c.CRS.EPSG3857.projection.project(a).multiplyBy(6378137);return b},_unproject=function(a){var b=c.point(a[0],a[1]).divideBy(6378137);return c.CRS.EPSG3857.projection.unproject(b)},b.Leaflet.Map=b.Class(b.Map,{addOverlay:function(a){var b=new c.popup({className:"hideparent",closeButton:!1}).setLatLng(this._map.getCenter());return b.setContent(a),b.addTo(this._map),this._popup=b,b},getOverlayElement:function(a){return a.getContent()},setOverlayPosition:function(a,b){var c=[b[0]/6378137,b[1]/6378137];a.setLatLng(c)},initialize:function(a){function d(a){e._highlight&&e._lastClicked&&(e._lastClicked.resetStyle(e._highlight),e._highlight=null,e._lastClicked=null)}b.Map.prototype.initialize.call(this,a);var e=this;if(this._lastClicked=null,b.isClass("L.Map")&&a instanceof c.Map?this._map=a:this._map=c.map(a.target,{center:_unproject(a.center),zoom:a.zoom,maxZoom:a.maxZoom,minZoom:a.minZoom,attributionControl:!1,closePopupOnClick:!1}),a.layerControl&&this.setLayerControl(),this._listen(),this._map.on("click",d),"undefined"!=typeof a.layers&&b.isArray(a.layers))for(var f=0;f<a.layers.length;f++)this.createLayer(a.layers[f])},setCenter:function(a,c){b.isArray(a)?this._map.setView(_unproject(a),this._map.getZoom()):this._map.setView(_unproject([a,c]),this._map.getZoom())},getCenter:function(){var a=this._map.getCenter();return a=c.CRS.EPSG3857.projection.project(a).multiplyBy(6378137),[a.x,a.y]},setZoom:function(a){this._map.setView(this._map.getCenter(),a)},getZoom:function(){return this._map.getZoom()},getProjection:function(){return"EPSG:3857"},getTarget:function(){return this._map.getTarget()},addLayer:function(a){a._options.visible!==!1&&(this._map.addLayer(a.getLayer()),a.update()),a._addToControl()},removeLayer:function(a){if(a){this._map.removeLayer(a.getLayer());for(var b=0;b<this._layers.length;b++)if(this._layers[b]==a){this._layers.splice(b,1);break}}},setExtent:function(a,b){if(null!==a){var d;d="EPSG:4326"==b?a:"EPSG:3857"==b?_unproject(a):null;var e=new c.LatLng(d[1],d[0]),f=new c.LatLng(d[3],d[2]);this._map.fitBounds(new c.LatLngBounds(e,f))}},_listen:function(){var a=this;this._map.on("moveend",function(){a._setViewBox();var b=a.getLayers();$.each(b,function(a,b){b.update()})})},_setViewBox:function(){var a=_project(this._map.getBounds().getSouthWest()),b=_project(this._map.getBounds().getNorthEast());this._viewbox=a.x+","+a.y+","+b.x+","+b.y},setLayerControl:function(a){return this._control||(this._control=new c.control.layers,this._control.addTo(this._map)),this._control}}),b.locator.register("PublicaMundi.Map",b.Leaflet.Map))}(window,window.PublicaMundi,L),function(a,b,c){"undefined"!=typeof b&&"undefined"!=typeof c&&(b.define("PublicaMundi.Leaflet.Layer"),b.Leaflet.Layer.WMS=b.Class(b.Layer,{_addToControl:function(){var a=this._map,b=this._options.title;a.getLayerControl()&&a.getLayerControl().addOverlay(this._layer,b)},onLayerLoad:function(){},fitToMap:function(){var a=this,c=this._options;this._layer.once("load",function(d){if("undefined"!=typeof c.bbox)a.getMap().setExtent(c.bbox,"EPSG:4326");else{var e=b.parser(),f=c.url+"?service=WMS&request=GetCapabilities";$.ajax({url:f,success:function(b){var d=e.parseWMS(b),f=d.Layer;for(var g in f){var h=f[g];if(h.Name==c.params.layers)return a._extent=h.EX_GeographicBoundingBox,a.getMap().setExtent(a._extent,"EPSG:4326"),!1}}})}})},initialize:function(a){b.Layer.prototype.initialize.call(this,a),this._layer=c.tileLayer.wms(a.url,{layers:a.params.layers,format:"image/png",transparent:!0})}}),b.registry.registerLayerType({layer:b.LayerType.WMS,framework:b.Leaflet.Framework,type:"PublicaMundi.Layer.WMS",factory:b.Leaflet.Layer.WMS}))}(window,window.PublicaMundi,L),function(a,b,c){"undefined"!=typeof b&&"undefined"!=typeof c&&(b.define("PublicaMundi.Leaflet.Layer"),b.Leaflet.Layer.WFS=b.Class(b.Layer,{_addToControl:function(){var a=this._map,b=this._options.title;a.getLayerControl()&&a.getLayerControl().addOverlay(this._layer,b)},fitToMap:function(){var a=this;this._options;this._layer.once("layeradd",function(){this._map.setExtent(a._extent,"EPSG:4326")})},update:function(){"0,0,0,0"==this._map._getViewBox()&&this._map._setViewBox();var a=this._map._getViewBox();$.ajax({type:"GET",url:this._options.url,data:{service:"WFS",request:"GetFeature",typename:this._options.params.layers,srsname:"EPSG:4326",outputFormat:"json",bbox:a+",EPSG:3857"},dataType:"json",context:this,success:function(a){this._layer.clearLayers(),this._layer.addData(a)}})},initialize:function(a){function d(a){var c=a.target,d=e._style.highlight;b.isFunction(d)&&(d=d(c.feature)),c.setStyle(d)}b.Layer.prototype.initialize.call(this,a),a.style=a.style||{normal:{},highlight:{}},this._style=a.style,this._style=a.style||{normal:{},highlight:{}},this._style.normal=a.style.normal||this._style.normal,this._style.highlight=a.style.highlight||this._style.highlight;var e=this,f=null;b.isFunction(a.click)&&(f=function(b){a.click([b.target.feature.properties],[6378137*b.latlng.lat,6378137*b.latlng.lng]),map._highlight?map._highlight!==b.target&&(map._lastClicked.resetStyle(map._highlight),map._lastClicked=e._layer,map._highlight=b.target,d(b)):(map._lastClicked&&map._lastClicked.resetStyle(map._highlight),map._lastClicked=e._layer,map._highlight=b.target,d(b))}),this._layer=c.geoJson(null,{style:this._style.normal,pointToLayer:function(a,b){return c.circleMarker(b,{radius:5,fillColor:"#FFFFFF",fillOpacity:.4,color:"#3399CC",weight:1.25,opacity:1})},onEachFeature:function(a,c){b.isFunction(f)&&c.on({click:f})}})}}),b.registry.registerLayerType({layer:b.LayerType.WFS,framework:b.Leaflet.Framework,type:"PublicaMundi.Layer.WFS",factory:b.Leaflet.Layer.WFS}))}(window,window.PublicaMundi,L),function(a,b,c){"undefined"!=typeof b&&"undefined"!=typeof c&&(b.define("PublicaMundi.Leaflet.Layer"),b.Leaflet.Layer.Tile=b.Class(b.Layer,{initialize:function(a){b.Layer.prototype.initialize.call(this,a),this._layer=c.tileLayer(a.url)},_addToControl:function(){this._map.getLayerControl()&&this._map.getLayerControl().addBaseLayer(this._layer,this._options.title)}}),b.registry.registerLayerType({layer:b.LayerType.TILE,framework:b.Leaflet.Framework,type:"PublicaMundi.Layer.Tile",factory:b.Leaflet.Layer.Tile}))}(window,window.PublicaMundi,L),function(a,b,c,d){"undefined"!=typeof b&&"undefined"!=typeof c&&(b.define("PublicaMundi.Leaflet.Layer"),b.Leaflet.Layer.KML=b.Class(b.Layer,{fitToMap:function(){},_addToControl:function(){this._map.getLayerControl()&&this._map.getLayerControl().addOverlay(this._layer,this._options.title)},initialize:function(a){function e(a){var c=a.target,d=g._style.highlight;b.isFunction(d)&&(d=d(c.feature)),c.setStyle(d)}b.Layer.prototype.initialize.call(this,a),a.style=a.style||{normal:{},highlight:{}},this._style=a.style,this._style.normal=a.style.normal||this._style.normal,this._style.highlight=a.style.highlight||this._style.highlight,!b.isDefined(a.projection);var f=null;if(b.isFunction(a.click)){var g=(this._style.highlight,this);f=function(b){a.click([b.target.feature.properties],[6378137*b.latlng.lat,6378137*b.latlng.lng]),map._highlight?map._highlight!==b.target&&(map._lastClicked.resetStyle(map._highlight),map._lastClicked=g._layer,map._highlight=b.target,e(b)):(map._lastClicked&&map._lastClicked.resetStyle(map._highlight),map._lastClicked=g._layer,map._highlight=b.target,e(b))}}this._layer=c.geoJson(null,{style:this._style.normal,pointToLayer:function(a,b){return c.circleMarker(b,{radius:5,fillColor:"#FFFFFF",fillOpacity:.4,color:"#3399CC",weight:1.25,opacity:1})},onEachFeature:function(a,c){b.isFunction(f)&&c.on({click:f})}}),d.ajax({type:"GET",url:a.url,dataType:"xml",async:!0,context:this,beforeSend:function(){},complete:function(){},success:function(a){var b=toGeoJSON.kml(a);this._layer.addData(b),d.event.trigger({type:"layerLoaded"});var c=this._layer.getBounds(),e=c.getSouthWest(),f=c.getNorthEast();this._extent=[e.lng,e.lat,f.lng,f.lat]},failure:function(a){console.log("failed"),console.log(a)}})}}),b.registry.registerLayerType({layer:b.LayerType.KML,framework:b.Leaflet.Framework,type:"PublicaMundi.Layer.KML",factory:b.Leaflet.Layer.KML}),b.isDefined(b.Map)&&(b.Map.prototype.KML=function(a){return a.type=b.LayerType.KML,this.createLayer(a)}))}(window,window.PublicaMundi,L,jQuery),function(a,b,c,d){if("undefined"!=typeof b&&"undefined"!=typeof c){b.define("PublicaMundi.Leaflet.Layer");var e;b.Leaflet.Layer.GeoJson=b.Class(b.Layer,{_addToControl:function(){this._map.getLayerControl()&&this._map.getLayerControl().addOverlay(this._layer,this._options.title)},onLayerLoad:function(){},fitToMap:function(){},initialize:function(a){b.Layer.prototype.initialize.call(this,a),a.style=a.style||{normal:{},highlight:{}},this._style.normal=a.style.normal||this._style.normal,this._style.highlight=a.style.highlight||this._style.highlight;var f=this;!b.isDefined(a.projection);var g=null;b.isFunction(a.click)&&(g=function(c){function d(a){var c=a.target,d=f._style.highlight;b.isFunction(d)&&(d=d(c.feature)),c.setStyle(d)}a.click([c.target.feature.properties],[6378137*c.latlng.lat,6378137*c.latlng.lng]),map._highlight?map._highlight!==c.target&&(map._lastClicked.resetStyle(map._highlight),map._lastClicked=f._layer,map._highlight=c.target,d(c)):(map._lastClicked&&map._lastClicked.resetStyle(map._highlight),map._lastClicked=f._layer,map._highlight=c.target,d(c))}),this._layer=c.geoJson(null,{style:this._style.normal,pointToLayer:function(a,b){return c.circleMarker(b,{radius:5,fillColor:"#FFFFFF",fillOpacity:.4,color:"#3399CC",weight:1.25,opacity:1})},onEachFeature:function(a,c){b.isFunction(g)&&c.on({click:g})}}),e=d.ajax({type:"GET",url:a.url,dataType:"json",async:!0,context:this,beforeSend:function(){},complete:function(){},success:function(a){this._layer.addData(a)},failure:function(a){}})}}),b.registry.registerLayerType({layer:b.LayerType.GeoJSON,framework:b.Leaflet.Framework,type:"PublicaMundi.Layer.GeoJson",factory:b.Leaflet.Layer.GeoJson}),b.isDefined(b.Map)&&(b.Map.prototype.geoJSON=function(a){return a.type=b.LayerType.GeoJSON,this.createLayer(a)})}}(window,window.PublicaMundi,L,jQuery);
//# sourceMappingURL=publicamundi.leaflet.js.map
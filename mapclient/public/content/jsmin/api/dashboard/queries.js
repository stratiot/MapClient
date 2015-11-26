define(["module","jquery","ol","URIjs/URI","data_api","shared"],function(e,t,n,r,i,s){"use strict";return s.queries=[{description:"Selects all cities with elevation greater than <b>100</b> meters.</br></br>WPS process: <b>Voronoi</b>.",query:{queue:[{resources:[{name:"cities",alias:"table1"}],filters:[{operator:"GREATER",arguments:[{name:"h"},100]}],sort:[{name:"h",desc:!0}],offset:20,limit:50}]},method:function(e,t,n){var r=new i.Data.Query;r.resource("cities","table1").greater({name:"h"},100).orderBy("h",!0).skip(20).take(50),r.execute({success:e,failure:t,complete:n})},process:function(e,t,n){var r=new i.Data.Query;r.resource("cities","table1").greater({name:"h"},100).orderBy("h",!0).skip(20).take(50),r.processVoronoi().wps({success:e,failure:t,complete:n})}},{description:"Selects all city blocks that have area greater or equal to <b>15000</b> square meters.</br></br>WPS process chain: <b>ConvexHull</b>, <b>Buffer(50)</b>.",query:{queue:[{resources:["blocks"],fields:[{resource:"blocks",name:"AROT"},{resource:"blocks",name:"the_geom",alias:"polygon"}],filters:[{operator:"AREA",arguments:[{resource:"blocks",name:"the_geom"},"GREATER_OR_EQUAL",15e3]}]}],format:"GeoJSON"},method:function(e,t,n){var r=new i.Data.Query;r.resource("blocks").field("blocks","AROT").field("blocks","the_geom","polygon").areaGreaterOrEqual({resource:"blocks",name:"the_geom"},15e3).format(i.Data.Format.GeoJSON),r.execute({success:e,failure:t,complete:n})},process:function(e,t,n){var r=new i.Data.Query;r.resource("blocks").field("blocks","AROT").field("blocks","the_geom","polygon").areaGreaterOrEqual({resource:"blocks",name:"the_geom"},15e3).format(i.Data.Format.GeoJSON),r.processConvexHull().processBuffer(50).wps({success:e,failure:t,complete:n})}},{description:"Selects fields from  datasets 'Settlements' and 'Blue flag beaches (2010)'. The elevation of every settlement must be less than <b>1000</b> meters and the distance between a settlement and a beach must be less than <b>5000</b>. Moreover, all results should be inside a specific region.</br></br>WPS process: <b>Voronoi</b>.",query:{queue:[{resources:["cities","flags"],fields:["NAME_NOM","NAME_GDIAM",{name:"NAME_OTA"},{name:"NAME_OIK"},{name:"h"},{resource:"flags",name:"NOMOS"},{resource:"flags",name:"the_geom"}],filters:[{operator:"LESS",arguments:[{name:"h"},1e3]},{operator:"DISTANCE",arguments:[{resource:"cities",name:"the_geom"},{resource:"flags",name:"the_geom"},"LESS",5e3]},{operator:"CONTAINS",arguments:[{type:"Polygon",coordinates:[[[2687295.037100175,4520261.073751386],[2687295.037100175,4368610.009633597],[2914771.6332768593,4368610.009633597],[2914771.6332768593,4520261.073751386],[2687295.037100175,4520261.073751386]]]},{resource:"flags",name:"the_geom"}]}]}],format:"GeoJSON"},method:function(e,t,n){var r=new i.Data.Query,s={type:"Polygon",coordinates:[[[2687295.037100175,4520261.073751386],[2687295.037100175,4368610.009633597],[2914771.6332768593,4368610.009633597],[2914771.6332768593,4520261.073751386],[2687295.037100175,4520261.073751386]]]};r.resource("cities").resource("flags").field("NAME_NOM").field("NAME_GDIAM").field("NAME_OTA").field("NAME_OIK").field("h").field("NOMOS").field("flags","the_geom").less({name:"h"},1e3).distanceLess({resource:"cities",name:"the_geom"},{resource:"flags",name:"the_geom"},5e3).contains(s,{resource:"flags",name:"the_geom"}).format(i.Data.Format.GeoJSON),r.execute({success:e,failure:t,complete:n})},process:function(e,t,n){var r=new i.Data.Query,s={type:"Polygon",coordinates:[[[2687295.037100175,4520261.073751386],[2687295.037100175,4368610.009633597],[2914771.6332768593,4368610.009633597],[2914771.6332768593,4520261.073751386],[2687295.037100175,4520261.073751386]]]};r.resource("cities").resource("flags").field("NAME_NOM").field("NAME_GDIAM").field("NAME_OTA").field("NAME_OIK").field("h").field("NOMOS").field("flags","the_geom").less({name:"h"},1e3).distanceLess({resource:"cities",name:"the_geom"},{resource:"flags",name:"the_geom"},5e3).contains(s,{resource:"flags",name:"the_geom"}).format(i.Data.Format.GeoJSON),r.processVoronoi().wps({success:e,failure:t,complete:n})}},{description:"Select geometries from the road network for Municipality of Kalamaria is provided that is inside a specific polygon.</br></br>WPS process: <b>Buffer(15)</b>.",query:{queue:[{resources:["roads"],fields:["NAME_LABEL","the_geom"],filters:[{operator:"CONTAINS",arguments:[{type:"Polygon",coordinates:[[[2554722.9073085627,4951114.104686448],[2554722.9073085627,4950158.641832884],[2556232.5386171946,4950158.641832884],[2556232.5386171946,4951114.104686448],[2554722.9073085627,4951114.104686448]]]},{name:"the_geom"}]}]}],format:"GeoJSON"},method:function(e,t,n){var r=new i.Data.Query,s={type:"Polygon",coordinates:[[[2554722.9073085627,4951114.104686448],[2554722.9073085627,4950158.641832884],[2556232.5386171946,4950158.641832884],[2556232.5386171946,4951114.104686448],[2554722.9073085627,4951114.104686448]]]};r.resource("roads").field("NAME_LABEL").field("the_geom").contains(s,{resource:"roads",name:"the_geom"}).format(i.Data.Format.GeoJSON),r.execute({success:e,failure:t,complete:n})},process:function(e,t,n){var r=new i.Data.Query,s={type:"Polygon",coordinates:[[[2554722.9073085627,4951114.104686448],[2554722.9073085627,4950158.641832884],[2556232.5386171946,4950158.641832884],[2556232.5386171946,4951114.104686448],[2554722.9073085627,4951114.104686448]]]};r.resource("roads").field("NAME_LABEL").field("the_geom").contains(s,{resource:"roads",name:"the_geom"}).format(i.Data.Format.GeoJSON),r.processBuffer(15).wps({success:e,failure:t,complete:n})}}],s});
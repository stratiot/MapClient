define(['jquery', 'ol', 'URIjs/URI', 'shared'], function ($, ol, URI, PublicaMundi) {

    PublicaMundi.Maps.Resources.Types.KML = PublicaMundi.Maps.Resources.Types.KML || 'KML';
    PublicaMundi.Maps.Resources.Types.GML = PublicaMundi.Maps.Resources.Types.GML || 'GML';
    PublicaMundi.Maps.Resources.Types.GEOJSON = PublicaMundi.Maps.Resources.Types.GEOJSON || 'GEOJSON';
    
    PublicaMundi.Maps.Resources.FileMetadataReader = PublicaMundi.Class(PublicaMundi.Maps.Resources.ResourceMetadataReader, {
        initialize: function (options) {
            if (typeof PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize === 'function') {
                PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize.apply(this, arguments);
            }
            
            this.values.type = options.type;
        },
        getMetadata: function (options) {
			var self = this;

            options = options || { url: null, text: null, filename : null, title: null, projection : null };
			
            options.projection = options.projection || PublicaMundi.Maps.CRS.WGS84;
            
            if(this.values.type == PublicaMundi.Maps.Resources.Types.KML) {
                options.projection = PublicaMundi.Maps.CRS.WGS84;
            }

            if ((!options.url) && (!options.filename)) {
                throw 'One of parameters url or filename is required.';
            }

            return new Promise(function(resolve, reject) {
                var metadata = {
                    type: self.values.type,
                    key: options.url || options.filename, 
                    title: options.title || options.filename || options.url.replace(/^.*[\\\/]/, ''),
                    url: options.url,
                    text: options.text,
                    projection: options.projection,
                    layers: [{
                        key : options.url || options.filename,
                        title: options.title || options.filename || options.url.replace(/^.*[\\\/]/, ''),
                        legend : null
                    }]
                };
                
                resolve(metadata);
            });
        }
    });

    PublicaMundi.Maps.Resources.KmlMetadataReader = PublicaMundi.Class(PublicaMundi.Maps.Resources.FileMetadataReader, {
        initialize: function (options) {
            if (typeof PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize === 'function') {
                PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize.apply(this, arguments);
            }
            
            this.values.type = PublicaMundi.Maps.Resources.Types.KML;
        }
    });

    PublicaMundi.Maps.Resources.GmlMetadataReader = PublicaMundi.Class(PublicaMundi.Maps.Resources.FileMetadataReader, {
        initialize: function (options) {
            if (typeof PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize === 'function') {
                PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize.apply(this, arguments);
            }
            
            this.values.type = PublicaMundi.Maps.Resources.Types.GML;
        }
    });

    PublicaMundi.Maps.Resources.GeoJSONMetadataReader = PublicaMundi.Class(PublicaMundi.Maps.Resources.FileMetadataReader, {
        initialize: function (options) {
            if (typeof PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize === 'function') {
                PublicaMundi.Maps.Resources.ResourceMetadataReader.prototype.initialize.apply(this, arguments);
            }
            
            this.values.type = PublicaMundi.Maps.Resources.Types.GEOJSON;
        }
    });

    PublicaMundi.Maps.Resources.FileCkanResourceMetadataReaderAdapter = PublicaMundi.Class(PublicaMundi.Maps.Resources.CkanResourceMetadataReaderAdapter, {
        initialize: function (options) {
            PublicaMundi.extend(this.values, options);
        },
        setOptions: function (resource) {
            resource.metadata = null;
            
            if (resource.format) {
                resource.metadata = {
                    type: null,
                    parameters : {
                        url: resource.url
                    },
                    extras: {}
                };
                switch(resource.format.toUpperCase()) {
                    case 'KML':
                        resource.metadata.type = PublicaMundi.Maps.Resources.Types.KML;
                        break;
                    case 'GML':
                        resource.metadata.type = PublicaMundi.Maps.Resources.Types.GML;
                        break;
                    case 'GEOJSON':
                        resource.metadata.type = PublicaMundi.Maps.Resources.Types.GEOJSON;
                        break;
                }
            }
            
            return resource;
        }
    });

    PublicaMundi.Maps.Resources.FileLayerFactory = PublicaMundi.Class(PublicaMundi.Maps.Resources.LayerFactory, {
        initialize: function (options) {
            if (typeof PublicaMundi.Maps.Resources.LayerFactory.prototype.initialize === 'function') {
                PublicaMundi.Maps.Resources.LayerFactory.prototype.initialize.apply(this, arguments);
            }
        },
        create: function (map, metadata, layer, title) {
            var __object = null;

            var format = null;
            switch(metadata.type.toUpperCase()){
                case PublicaMundi.Maps.Resources.Types.KML:
                    format = new ol.format.KML();
                    break;
                case PublicaMundi.Maps.Resources.Types.GML:
                    format = new ol.format.GML();
                    break;
                case PublicaMundi.Maps.Resources.Types.GEOJSON:
                    format = new ol.format.GeoJSON();
                    break;
            }
            
            if(metadata.url) {
                __object = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        projection: PublicaMundi.Maps.CRS.Mercator,
                        url: metadata.url,
                        format: format
                    })
                });
            } else if (metadata.text) {
                var source = new ol.source.Vector({
                    projection: PublicaMundi.Maps.CRS.Mercator,
                    format : format
                });
                
                var features = format.readFeatures(metadata.text, {
                    dataProjection: metadata.projection,
                    featureProjection: PublicaMundi.Maps.CRS.Mercator
                });
                
                if((metadata.type.toUpperCase() == PublicaMundi.Maps.Resources.Types.GML) &&
                   (features.length > 0) && 
                   (features[0].getGeometry().getCoordinates().length == 0)) {
                    format = new ol.format.GML2();

                    var features = format.readFeatures(metadata.text, {
                        dataProjection: metadata.projection,
                        featureProjection: PublicaMundi.Maps.CRS.Mercator
                    });
                }
                
                source.addFeatures(features);

                __object = new ol.layer.Vector({
                    source : source
                });
            }
            
            if(__object) {
                map.addLayer(__object);
            }
			
            return __object;
        }
    });


    PublicaMundi.Maps.Resources.registerResourceType(PublicaMundi.Maps.Resources.Types.KML, 
                                                     'KML',
                                                     PublicaMundi.Maps.Resources.KmlMetadataReader,
                                                     PublicaMundi.Maps.Resources.FileLayerFactory);

    PublicaMundi.Maps.Resources.registerResourceType(PublicaMundi.Maps.Resources.Types.GML, 
                                                     'GML',
                                                     PublicaMundi.Maps.Resources.GmlMetadataReader,
                                                     PublicaMundi.Maps.Resources.FileLayerFactory);

    PublicaMundi.Maps.Resources.registerResourceType(PublicaMundi.Maps.Resources.Types.GEOJSON, 
                                                     'GEOJSON',
                                                     PublicaMundi.Maps.Resources.GeoJSONMetadataReader,
                                                     PublicaMundi.Maps.Resources.FileLayerFactory);
                                                                                                          
    PublicaMundi.Maps.Resources.registerResourceTypeAdapter('KML',
                                                            PublicaMundi.Maps.Resources.Types.KML,
                                                            PublicaMundi.Maps.Resources.FileCkanResourceMetadataReaderAdapter);
                                                            
    PublicaMundi.Maps.Resources.registerResourceTypeAdapter('GML',
                                                            PublicaMundi.Maps.Resources.Types.GML,
                                                            PublicaMundi.Maps.Resources.FileCkanResourceMetadataReaderAdapter);
                                                            
    PublicaMundi.Maps.Resources.registerResourceTypeAdapter('GEOJSON',
                                                            PublicaMundi.Maps.Resources.Types.GEOJSON,
                                                            PublicaMundi.Maps.Resources.FileCkanResourceMetadataReaderAdapter);
    return PublicaMundi;

});

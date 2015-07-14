﻿define(['module', 'jquery', 'ol', 'URIjs/URI', 'shared'], function (module, $, ol, URI, PublicaMundi) {
    "use strict";

    var members = {
		ui: {
			section: 'group'
		},
        config: module.config(),
        ckan: null,
        resources: null,
        map: {
            control: null,
            interactions: {
                zoom: {
                    control: null
                },
                bbox: {
                    control: null,
                    feature: null,
                    overlay: null
                }
            }
        },
        tools: {
            length: null,
            area: null,
            export: null
        },
        actions: {
			import: null,
            export: null,
            upload: null
        },
        preview: null,
        i18n: {
            locale : 'el',
            strings : {
            },
            loaded: {
                el : false,
                en : false
            }
        }
    };
    
    members.config.path = members.config.path || '/';

    var initializeParameters = function () {
        // Set default values
        members.config.geolocation = true;
        members.config.map.minZoom = 7;
        members.config.map.maxZoom = 19;

        // Get additional configuration from the query string
        var query = URI.parse(window.location.href).query;
        if (query) {
            // Location parameters (zoom, center, geolocation, bounding box, etc.)
            var params = URI.parseQuery(query);

            if (params.bbox) {
                members.config.map.bbox = params.bbox.split(',').map(Number);
            } else {
                members.config.map.bbox = null;
            }

            if (params.center) {
                members.config.map.center = params.center.split(',').map(Number);
            }

            if (params.zoom) {
                members.config.map.zoom = params.zoom;
            }

            if (params.geolocation === 'off') {
                members.config.geolocation = false;
            }

            // Set locale
            if (params.locale) {
                members.i18n.locale = params.locale;
            }
                        
            // Preview resource
            if((params.package) && (params.resource)) {
				members.preview = {
					package : params.package,
					resource : params.resource
				};
			}
        }
    };

	var createBaseLayer = function(type, set) {
		var layer = null;
		switch(type) {
			case 'bing':
				if(members.config.bing.key) {
					layer = new ol.layer.Tile({
						source: new ol.source.BingMaps({
							key: members.config.bing.key,
							imagerySet: set
						})
					});
				}
				break;
			case 'stamen':
				layer = new ol.layer.Tile({
					source: new ol.source.Stamen({layer: set })
				});
				break;
			case 'mapquest':
				layer = new ol.layer.Tile({
					source: new ol.source.MapQuest({layer: set })
				});
				break;
			case 'ktimatologio':
				/* http://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx?				   
				   SERVICE=WMS&VERSION=1.1.0&
				   REQUEST=GetMap&
				   FORMAT=image%2Fpng&
				   TRANSPARENT=true&
				   LAYERS=KTBASEMAP&
				   WIDTH=256&HEIGHT=256&SRS=EPSG%3A900913&
				   STYLES=&
				   BBOX=2504688.542848654%2C4852834.0517692715%2C2661231.576776695%2C5009377.085697313					    
			   */
				var params = {
					'SERVICE': 'WMS',
					'VERSION': '1.1.0',
					'LAYERS': 'KTBASEMAP'
				};

				var source = new ol.source.TileWMS({
					url: 'http://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx',
					params: params,
					projection: 'EPSG:900913',
					attributions: [
						new ol.Attribution({
							html: '<a href="' + PublicaMundi.getResource('attribution.ktimatologio.url') + '" ' + 
								  'data-i18n-id="attribution.ktimatologio.url" data-i18n-type="attribute" data-i18n-name="href">' + 
								  '<img src="content/images/ktimatologio-logo.png"/></a>'
						})
					]
				});
				
				var fn = source.tileUrlFunction;
				
				source.tileUrlFunction = function(tileCoord, pixelRatio, projection) {
					var url = fn(tileCoord, pixelRatio, projection);
					var parts = URI.parse(url) || {};											
					var params = (parts.query ? URI.parseQuery(parts.query) : {});

					params.SRS = 'EPSG:900913';						

					var fixedUrl = URI.build({
						protocol: (parts.protocol ? parts.protocol : 'http'),
						hostname: parts.hostname,
						port: (parts.port === '80' ? '' : parts.port),
						path: parts.path,
						query: URI.buildQuery(params)
					});
					
					return fixedUrl;
				}
				
				layer = new ol.layer.Tile({
					source: source
				});
				break;
			default:
				console.log('Base layer of type ' + type + ' is not supported.');
		}

		return layer;
	};
  
    var initializeMap = function () {
        var minZoom = members.config.map.minZoom, 
            maxZoom = members.config.map.maxZoom, 
            zoom = members.config.map.zoom || members.config.map.minZoom;

        if ((zoom < minZoom) || (zoom > maxZoom)) {
            zoom = minZoom;
        }

        var view = new ol.View({
            projection: PublicaMundi.Maps.CRS.Mercator,
            center: members.config.map.center || [0, 0],
            zoom: zoom,
            minZoom: minZoom,
            maxZoom: maxZoom,
            extent: members.config.map.extent || [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
        });

        var layers = [];

		var selection = $('#base_layer option:selected')
		var layer = createBaseLayer($(selection).data('type'), $(selection).data('set'));
            
		layers.push(layer);
		layers.push(new ol.layer.Tile({
			source: new ol.source.OSM({
				attributions: [
					new ol.Attribution({
						html: 'Nominatim Search Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
					}),
					ol.source.OSM.ATTRIBUTION
				]
			}),
			opacity: ($('#base-layer-opacity').val() / 100.0)
		}));

        var interactions = ol.interaction.defaults();
        
        interactions.removeAt(interactions.getLength() -1);

        members.map.interactions.zoom.control = new ol.interaction.DragZoom({
            condition: ol.events.condition.shiftKeyOnly,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: [255, 255, 255, 0.4]
                }),
                stroke: new ol.style.Stroke({
                    color: '#3399CC',
                    width: 2
                })
            })
        });

        interactions.push(members.map.interactions.zoom.control);
        
        var controls = []; //ol.control.defaults();
        controls.push(new ol.control.Zoom({
			zoomInTipLabel : '',
			zoomOutTipLabel : ''
		}));
        controls.push(new ol.control.ZoomSlider());
        controls.push(new ol.control.Attribution({
			tipLabel: '',
			collapsible : false
		}));
        
        members.map.control = new ol.Map({
            target: members.config.map.target,
            view: view,
            controls: controls,
            interactions: interactions,
            ol3Logo: false,
            layers: layers
        });

        if (members.config.map.bbox) {
            var size = members.map.control.getSize();
            view.fitExtent(members.config.map.bbox, size);
        }

        if ((!members.preview) && (navigator.geolocation) && (members.config.geolocation)) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var center = ol.proj.transform([position.coords.longitude, position.coords.latitude], PublicaMundi.Maps.CRS.WGS84, PublicaMundi.Maps.CRS.Mercator);
                view.setCenter(center);
                view.setZoom(10);
            });
        }

        //Mouse Position
        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: function (coordinate) {
                return ol.coordinate.format(coordinate, '{x} , {y}', 4);
            },
            projection: $('#pos_epsg option:selected').val(),
            className: 'mouse-pos-text',
            target: $('.mouse-pos')[0]
        });
        members.map.control.addControl(mousePositionControl);

        $('#pos_epsg').selectpicker().change(function () {
            mousePositionControl.setProjection(ol.proj.get($('#pos_epsg option:selected').val()));
            $('[data-id="pos_epsg"]').blur();
        });

		// Scale line control
		var scaleLineControl = new ol.control.ScaleLine({
			target: document.getElementById('scale-line')
		});
		members.map.control.addControl(scaleLineControl);

        // Feature overlays       
        members.map.interactions.bbox.overlay = new ol.FeatureOverlay({
            style: [
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 0.4]
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#27AE60',
                        width: 2
                    })
                })
            ]
        });
        members.map.interactions.bbox.overlay.setMap(members.map.control);
        
        // BBOX draw
        members.map.interactions.bbox.control = new ol.interaction.DragBox({
            condition: ol.events.condition.shiftKeyOnly,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: [255, 255, 255, 0.4]
                }),
                stroke: new ol.style.Stroke({
                    color: '#27AE60',
                    width: 2
                })
            })
        });

        members.map.interactions.bbox.control.on('change:active', function (e) {

        });
        
        members.map.interactions.bbox.control.on('boxstart', function (e) {            
            members.map.interactions.bbox.overlay.getFeatures().clear();
            members.map.interactions.bbox.feature = null;
        });
        
        members.map.interactions.bbox.control.on('boxend', function (e) {            
            var geom = members.map.interactions.bbox.control.getGeometry();
            var feature = new ol.Feature({ name: 'bbox', geometry: geom });

            members.map.interactions.bbox.overlay.getFeatures().clear();
            members.map.interactions.bbox.overlay.addFeature(feature);

            members.map.interactions.bbox.feature = feature;
        });

        members.map.control.addInteraction(members.map.interactions.bbox.control);
        members.map.interactions.bbox.control.setActive(false);
    };

    var resize = function() {
        $('.dialog-container').height($(window).height()-50).width(($(window).width()-20));
        
        var height = $(window).height();

        var headerHeight = $('.header').outerHeight(true);

        var catalogHeight = $('#layer-tree-header').outerHeight(true) + 
                            $('#layer-selection-header').outerHeight(true) + 
                            $('#tools-header').outerHeight(true);

        var selectionHeight = ( $('#layer-selection').is(':visible') ? $('#layer-selection').outerHeight(true) : 0);
        var toolsHeight = ( $('#tools').is(':visible') ? $('#tools').outerHeight(true) : 0);

        var footerHeight = $('.footer').outerHeight(true) + 60;

        $('#layer-tree-group').height(height - catalogHeight - selectionHeight - toolsHeight - footerHeight);
        $('#layer-tree-organization').height(height - catalogHeight - selectionHeight - toolsHeight - footerHeight);
        $('#layer-tree-search').height(height - catalogHeight - selectionHeight - toolsHeight - footerHeight);
        
        $('#map').offset({top : headerHeight , left : 0}).height(height - footerHeight + 10);

        members.map.control.setSize([$('#map').width(), $('#map').height()]);
    };
          
    var initializeUI = function() {
        // Left sliding panel accordion events
        $('#layer-selection-header').click(function() {
            $('#layer-selection').show();
            $('#tools').hide();
            resize();
        });
        
        $('#tools-header').click(function() {
            $('#tools').show();
            $('#layer-selection').hide();
            resize();
        });
                
        // CKAN catalog
		members.ckan = new PublicaMundi.Maps.CKAN.Metadata({
			endpoint: module.config().ckan.endpoint,
            preloading: true
		});

        // Resources
		members.resources = new PublicaMundi.Maps.LayerManager({
            path: members.config.path,
			proxy: PublicaMundi.getProxyUrl(module.config().proxy),
			extent: members.config.map.extent
		});

        // UI components
		members.components = {};

		members.components.textSearch = new PublicaMundi.Maps.TextSearch({
			element: 'location-search',
			map: members.map.control,
			endpoint: members.config.nominatim.endpoint
		});
		
		members.components.layerTreeGroup = new PublicaMundi.Maps.LayerTree({
			element: 'layer-tree-group',
			map: members.map.control,
			ckan: members.ckan,
			resources: members.resources,
			mode: PublicaMundi.Maps.LayerTreeViewMode.ByGroup,
			visible: true
		});
		
		members.components.layerTreeOrganization = new PublicaMundi.Maps.LayerTree({
			element: 'layer-tree-organization',
			map: members.map.control,
			ckan: members.ckan,
			resources: members.resources,
			mode: PublicaMundi.Maps.LayerTreeViewMode.ByOrganization,
			visible: false
		});

        members.components.layerTreeSearch = new PublicaMundi.Maps.LayerTree({
			element: 'layer-tree-search',
			map: members.map.control,
			ckan: members.ckan,
			resources: members.resources,
			mode: PublicaMundi.Maps.LayerTreeViewMode.ByFilter,
			visible: false
        });

		members.components.layerSelection = new PublicaMundi.Maps.LayerSelection({
			element: 'layer-selection',
			map: members.map.control,
			ckan: members.ckan,
			resources: members.resources
		});
        
        // Dialogs
        members.components.catalogInfoDialog = new PublicaMundi.Maps.Dialog({
            title: '',
            element: 'dialog-1',
            visible: false,
            width: 400,
            height: 200,
            buttons: {
                close : {
                    text: 'button.close',
                    style: 'primary'
                }
            }
        });

        members.components.catalogInfoDialog.on('dialog:action', function(args){
                switch(args.action){ 
                    case 'close':
                        this.hide();
                        break;
                }
        });
        
        members.components.tableBrowserDialog = new PublicaMundi.Maps.DialogTableBrowser({
            title: 'Table Data',
            element: 'dialog-2',
            visible: false,
            width: 800,
            height: 400,
            buttons: {
                close : {
                    text: 'button.close',
                    style: 'primary'
                }
            },
            endpoint: members.config.path
        });

        members.components.tableBrowserDialog.on('dialog:action', function(args){
                switch(args.action){ 
                    case 'close':
                        this.hide();
                        break;
                }
        });
        
        // UI actions
        members.actions.export = new PublicaMundi.Maps.Action({
            element: 'action-export',
            name: 'export',
            image: 'content/images/download-w.png',
            title: 'action.export.title',
            visible: false
        });
        
        members.actions.import = new PublicaMundi.Maps.ImportWmsTool({
            element: 'action-wms',
            name: 'wms',
            image: 'content/images/layers-w.png',
            title: 'action.import-wms.title',
            map: members.map.control,
            resources: members.resources
        });

		members.actions.import.on('layer:added', function(args) {
			if(members.components.layerSelection.add(args.id, args.metadata)) {
				members.resources.createLayer(members.map.control, args.metadata, args.id);
			}
		});
        
        members.actions.upload = new PublicaMundi.Maps.UploadFileTool({
            element: 'action-upload',
            name: 'upload',
            image: 'content/images/upload-w.png',
            title: 'action.upload-resource.title',
            map: members.map.control,
            resources: members.resources,
            endpoint: members.config.path
        });
        
        members.actions.upload.on('resource:loaded', function(args) {
            members.resources.getResourceMetadata(args.format.toUpperCase(), {
                url: args.url,
                text: args.text,
                filename: args.name,
                title: args.title,
                projection: args.projection
            }).then(function(metadata) {
                if(members.components.layerSelection.add(args.id, metadata)) {
                    members.resources.createLayer(members.map.control, metadata, args.id);
                }
            });
        });
        
        // UI tools
        members.tools.length = new PublicaMundi.Maps.MeasureTool({
            element: 'tool-length',
            name: 'length',
            images: {
                enabled: 'content/images/ruler-w.png',
                disabled: 'content/images/ruler.png'
            },
            title: 'tool.length.title',
            map: members.map.control,
            type: PublicaMundi.Maps.MeasureToolType.Length
        });
        
        members.tools.area = new PublicaMundi.Maps.MeasureTool({
            element: 'tool-area',
            name: 'area',
            images: {
                enabled: 'content/images/surface-w.png',
                disabled: 'content/images/surface.png'
            },
            title: 'tool.area.title',
            map: members.map.control,
            type: PublicaMundi.Maps.MeasureToolType.Area
        });
        
        members.tools.export = new PublicaMundi.Maps.ExportTool({
            element: 'tool-export',
            name: 'export',
            images: {
                enabled: 'content/images/polygon-w.png',
                disabled: 'content/images/polygon.png'
            },
            title: 'tool.export.title',
            map: members.map.control,
            resources: members.resources,
            action: members.actions.export,
            endpoint: members.config.path
        });

        members.tools.select = new PublicaMundi.Maps.SelectTool({
            element: 'tool-select',
            name: 'select',
            images: {
                enabled: 'content/images/cursor-w.png',
                disabled: 'content/images/cursor.png'
            },
            title: 'tool.select.title',
            map: members.map.control,
            resources: members.resources,
            endpoint: members.config.path
        });

        var handleToolToggle = function(args) {
            var name = args.name;
            for(var item in members.tools) {
                if((args.active) && (args.name != members.tools[item].getName())) {
                    members.tools[item].setActive(false);
                }
            }
            resize();
        };
                
        members.tools.length.on('tool:toggle', handleToolToggle);
        members.tools.area.on('tool:toggle', handleToolToggle);
        members.tools.export.on('tool:toggle', handleToolToggle);
        members.tools.select.on('tool:toggle', handleToolToggle);
        
        // Layer manager
        members.resources.on('layer:add', function(args) {
			members.components.layerSelection.add(args.id);
		});
        
        // Left sliding panel
		$('body').on('click', '.panel-left-hidden', function(e) {
			$('.panel-left-handler').trigger('click');
		});
		
        $('.panel-left-handler').click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if($('.panel-left').hasClass('panel-left-visible')) {
				$('.panel-left').removeClass('panel-left-visible');
				$('.panel-left').addClass('panel-left-hidden');
				$('.panel-left-handler').addClass('panel-left-handler-toggle');
				$('.panel-left').find('.panel-content').addClass('panel-content-hidden');
				switch(members.ui.section) {
					case 'group':
						$('.panel-left-label').css({
							bottom: PublicaMundi.getResource('index.topics.position')[1],
							right: PublicaMundi.getResource('index.topics.position')[0]
						});
						$('.panel-left-label').find('img').attr('src', 'content/images/comments.png');
						$('.panel-left-label').find('span').html(PublicaMundi.getResource('index.topics'));
						break;
					case 'organization':
						$('.panel-left-label').css({
							bottom: PublicaMundi.getResource('index.organizations.position')[1],
							right: PublicaMundi.getResource('index.organizations.position')[0]
						});
						$('.panel-left-label').find('img').attr('src', 'content/images/organization.png');
						$('.panel-left-label').find('span').html(PublicaMundi.getResource('index.organizations'));
						break;
					case 'search':
						$('.panel-left-label').css({
							bottom: PublicaMundi.getResource('index.search.position')[1],
							right: PublicaMundi.getResource('index.search.position')[0]
						});
						$('.panel-left-label').find('img').attr('src', 'content/images/search.png');
						$('.panel-left-label').find('span').html(PublicaMundi.getResource('index.search'));
						break;
				}
				$('.panel-left-label').show();
			} else {
				$('.panel-left').removeClass('panel-left-hidden');
				$('.panel-left').addClass('panel-left-visible');
				$('.panel-left-handler').removeClass('panel-left-handler-toggle');
				$('.panel-left').find('.panel-content').removeClass('panel-content-hidden');
				$('.panel-left-label').hide();
			}
		});
       
        // Tooltips
        $('.selected-layer-opacity-label, .img-text').tooltip();

        // Tab control
		$('#organization, #group, #search').click(function() {
			if($(this).data('selected')) {
				return;
			}
			
			var id = $(this).attr('id');
			
			$(this).data('selected', true).removeClass('active').addClass('inactive');
			$('#' + members.ui.section).data('selected', false).removeClass('inactive').addClass('active');
			$('#' + members.ui.section + '-label').addClass('section-label-hidden');
			$('#' + id + '-label').removeClass('section-label-hidden');
			
			members.ui.section = id;
			
			if(id === 'organization') {
				members.components.layerTreeGroup.hide();
                members.components.layerTreeSearch.hide();
				members.components.layerTreeOrganization.show();
			} else if (id === 'group') {
				members.components.layerTreeOrganization.hide();
                members.components.layerTreeSearch.hide();
				members.components.layerTreeGroup.show();
			} if (id === 'search') {
                members.components.layerTreeGroup.hide();
				members.components.layerTreeOrganization.hide();
                members.components.layerTreeSearch.show();
			}
		});
		
        // Layer handling events
		var layerAdded = function(args) {
			members.components.layerSelection.add(args.id);
		};
		
		var layerRemoved  = function(args) {
			members.components.layerSelection.remove(args.id);
		}
		
        var showCatalogObjectInfo = function(args) {
            if(args.data) {
                switch(args.type) {
                    case 'group':
                        members.components.catalogInfoDialog.setTitle(args.data.caption[PublicaMundi.getLocale()]);
                        members.components.catalogInfoDialog.setContent(args.data.description[PublicaMundi.getLocale()]);
                        members.components.catalogInfoDialog.show();
                        break;
                    case 'organization':
                        members.components.catalogInfoDialog.setTitle(args.data.caption[PublicaMundi.getLocale()]);
                        members.components.catalogInfoDialog.setContent(args.data.description[PublicaMundi.getLocale()]);
                        members.components.catalogInfoDialog.show();
                        break;
                    case 'package':
                        members.components.catalogInfoDialog.setTitle(args.data.title);
                        members.components.catalogInfoDialog.setContent(args.data.notes);
                        members.components.catalogInfoDialog.show();
                        break;
                }
            }
        };
        
		members.components.layerTreeGroup.on('layer:added', layerAdded);
		members.components.layerTreeGroup.on('layer:removed', layerRemoved);
        members.components.layerTreeGroup.on('catalog:info', showCatalogObjectInfo);
        
		members.components.layerTreeOrganization.on('layer:added', layerAdded);
        members.components.layerTreeOrganization.on('layer:removed', layerRemoved);
        members.components.layerTreeOrganization.on('catalog:info', showCatalogObjectInfo);
        
        members.components.layerTreeSearch.on('layer:added', layerAdded);
        members.components.layerTreeSearch.on('layer:removed', layerRemoved);
        members.components.layerTreeSearch.on('catalog:info', showCatalogObjectInfo);

        // Interaction events
        members.components.layerTreeSearch.on('bbox:draw', function(args) {
            disableAllTools();
            disableAllInteractions('bbox');
        });

        members.components.layerTreeSearch.on('bbox:apply', function(args) {
            disableAllInteractions('zoom');
            
            this.setQueryBoundingBox(members.map.interactions.bbox.feature);
            
            enableAllTools();
        });

        members.components.layerTreeSearch.on('bbox:cancel', function(args) {
            disableAllInteractions('zoom');
            
            members.map.interactions.bbox.overlay.getFeatures().clear();
            
            var feature = this.getQueryBoundingBox();
            if(feature) {
                members.map.interactions.bbox.overlay.addFeature(feature);
                members.map.interactions.bbox.feature = feature;
            } else {
                members.map.interactions.bbox.feature = null;
            }
            
            enableAllTools();
        });
        
        members.components.layerTreeSearch.on('bbox:remove', function(args) {
            members.map.interactions.bbox.overlay.getFeatures().clear();
            members.map.interactions.bbox.feature = null;
            
            this.setQueryBoundingBox(null);
        });
        
		var layerSelectionAdded  = function(args) {
            resize();
		}
        
		var layerSelectionRemoved  = function(args) {
			members.components.layerTreeGroup.remove(args.id);
            resize();
		}
		
		members.components.layerSelection.on('layer:added', layerSelectionAdded);
        
        members.components.layerSelection.on('layer:removed', layerSelectionRemoved);
        
        // Enable locale selection
        $("#locale_selection").val(members.i18n.locale);

        $('#locale_selection').selectpicker().change(function () {
            setLocale($('#locale_selection option:selected').val());
            $('[data-id="locale_selection"]').blur();
        });
        
        // Initialize layout
        resize();
        
        $(window).resize(resize);
	};

    var attachEvents = function () {	
        attachBaseLayerSelectionEvents();
	};
    	
    var attachBaseLayerSelectionEvents = function () {	
        $('#base_layer').selectpicker().change(function(e) {	
			var selection = $('#base_layer option:selected')
            var newBaseLayer = createBaseLayer($(selection).data('type'), $(selection).data('set'));
            
			var oldBaseLayer = members.map.control.getLayers().item(0);

            members.map.control.getLayers().insertAt(0, newBaseLayer);
            setTimeout(function () {
                members.map.control.getLayers().remove(oldBaseLayer);
            }, 1000);
            
            $('[data-id="base_layer"]').blur();
        });
        
        $('#base-layer-opacity').change(function() {
			members.map.control.getLayers().item(1).setOpacity($(this).val() / 100.0);
		});
    };

    var disableAllTools = function() {
        for(var item in members.tools) {
            if(members.tools[item]) {
                members.tools[item].setEnabled(false);
            }
        }
    }
    
    var enableAllTools = function() {
        for(var item in members.tools) {
            if(members.tools[item]) {
                members.tools[item].setEnabled(true);
            }
        }
    }
    
    var disableAllInteractions = function(name) {
        for(var item in members.map.interactions) {
            members.map.interactions[item].control.setActive(false);
        }
        
        if(name) {
            enableInteraction(name);
        }
    };

    var enableInteraction = function(name) {
        members.map.interactions[name].control.setActive(true);
    };
    
    var initializeResourcePreview = function () {
        if (!members.preview) {
            return;
        }

        members.ckan.loadPackageById(members.preview.package).then(function(data) {
			var resource = members.ckan.getResourceById(members.preview.resource);
			if(resource) {
				members.resources.addResourceFromCatalog(members.map.control, resource);
			}
		}, function(error) {
			console.log('Failed to load resource ' + members.preview.resource + ' from dataset ' + members.preview.dataset);
		});
    };

    var localizeUI = function() {
        $('[data-i18n-id]').each(function(index, element) {
            var type = $(this).data('i18n-type');
            switch(type) {
                case 'title':
                    $(this).attr('title', PublicaMundi.getResource($(this).data('i18n-id')));
                    break;
                case 'attribute':
                    $(this).attr($(this).data('i18n-name'), PublicaMundi.getResource($(this).data('i18n-id')));
                    break;
                default:
                    var text = PublicaMundi.getResource($(this).data('i18n-id'));
                    if(text) {
                        $(this).html(text);
                    }
                    break;
            }
        });
    };

    var mergeCkanResources = function() {
        if(members.ckan) {
            var organizations = members.ckan.getOrganizations();

            for(var o=0; o < organizations.length; o++) {
                members.i18n.strings[members.i18n.locale]['organization.' + organizations[o].id] = organizations[o].caption[members.i18n.locale];
            }
            var groups = members.ckan.getGroups();
            for(var g=0; g < groups.length; g++) {
                members.i18n.strings[members.i18n.locale]['group.' + groups[g].id] = groups[g].title[members.i18n.locale];
            }
        }
    }
    var loadResources = function() {
        var uri = new URI();
        uri.segment([members.config.path, 'content', 'js', 'i18n', members.i18n.locale, 'strings.js']);
        uri.addQuery({ 'v': (new Date()).getTime() });
        
        return new Promise(function(resolve, reject) {
            if(members.i18n.loaded[members.i18n.locale]) {
                mergeCkanResources();
                
                resolve(members.i18n.strings[members.i18n.locale]);
                return;
            }
            $.ajax({
                url: uri.toString(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                context: self
            }).done(function (data) {
                members.i18n.loaded[members.i18n.locale] = true;

                members.i18n.strings[members.i18n.locale] = data;

                mergeCkanResources();
                
                resolve(members.i18n.strings[members.i18n.locale]);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log('Failed to load resources : ' + uri.toString());

                reject(errorThrown);
            });
        });
    };

    var setLocale = function(locale) {
        if(members.i18n.loaded.hasOwnProperty(locale)) {
            members.i18n.locale = locale;
        } else {
            members.i18n.locale = 'el';
        }

        loadResources().then(function() {
            localizeUI();
        });
    };
    
    PublicaMundi.getLocale = function() {
        return members.i18n.locale;
    };
    
    PublicaMundi.getResource = function(id, text) {
        return members.i18n.strings[members.i18n.locale][id] || text || '';
    };
    
    PublicaMundi.initialize = function () {
        initializeParameters();

        loadResources().then(function(strings) {
            localizeUI();
            
            initializeMap();

            initializeUI();
            
            attachEvents();

            $('#loading-text').html('Initializing Catalog ... 0%');

            var afterPreload = function() {
                // Refresh localization strings (CKAN metadata may have added new resources)
                localizeUI();
                
                members.components.layerTreeGroup.refresh();
                members.components.layerTreeOrganization.refresh();

                $('#loading-text').html('Loading Metadata ... 0%');
                members.resources.updateQueryableResources().then(function(resources) {					
                    $('#loading-text').html('Loading Metadata ... 100%');
                    
                    setTimeout(function () {
                        $('#block-ui').fadeOut(500).hide();
                        $('body').css('overflow-y', 'auto');

                        if ($('#view-layers').hasClass('ui-panel-closed')) {
                            $('#view-layers').panel('toggle');
                        }
                        $('#search').focus();
                        
                        initializeResourcePreview();
                    }, 500);
                });
            }
            if(members.ckan.isPreloadingEnabled()) {
                members.ckan.preload().then(afterPreload);
            } else {
                members.ckan.loadGroups().then(function(groups) {
                    $('#loading-text').html('Initializing Catalog ... 50%');
                    members.ckan.loadOrganizations().then(function(organization) {
                        $('#loading-text').html('Initializing Catalog ... 100%');

                        afterPreload();
                    });
                });
            }
        });
    };
    
    window.members = members;
    
    return PublicaMundi;
});

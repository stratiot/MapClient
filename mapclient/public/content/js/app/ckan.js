﻿define(['jquery', 'URIjs/URI', 'shared'], function ($, URI, PublicaMundi) {
    "use strict";
    PublicaMundi.define('Maps.CKAN');

    PublicaMundi.Maps.CKAN.Metadata = PublicaMundi.Class(PublicaMundi.Maps.Observable, {
		initialize: function (options) {
            this.values.path = null;
			this.values.endpoint = null;

			if (typeof PublicaMundi.Maps.Observable.prototype.initialize === 'function') {
                PublicaMundi.Maps.Observable.prototype.initialize.apply(this, arguments);
            }

			this.values.catalog = {
				groups: [],
				organizations: [],
				packages: [],
                nodes: []
			};
			this.values.search = {
				packages: []
			};
			this.values.xhr = null;
        },
        isPreloadingEnabled: function() {
            return (((this.values.metadata) && ((this.values.metadata.path) || (this.values.metadata.database))) ? true : false);
        },
        preload: function() {
            if(!this.isPreloadingEnabled()) {
                return;
            }

            var self = this, uri;

            if(this.values.metadata.database) {
                uri = new URI();
                if(self.values.path === '/') {
                    uri.segment(['metadata', 'load']);
                } else {
                    uri.segment([self.values.path, 'metadata', 'load']);
                }
            } else {
                uri = new URI(this.values.metadata.path);
                if(this.values.metadata.version) {
                    uri.addQuery({ 'v': this.values.metadata.version });
                }
            }

			return new Promise(function(resolve, reject) {
				$.ajax({
					url: uri.toString().replace(/\/\//g, '/').replace(/:\//g, '://'),
					context: self
				}).done(function (response) {
                    var i;

                    self.values.catalog.nodes = response.nodes || [];
					self.values.catalog.organizations = response.organizations;
                    self.values.catalog.groups = response.groups;
                    self.values.catalog.packages = response.packages;

                    for(i = 0; i < self.values.catalog.organizations.length; i++) {
                        self.values.catalog.organizations[i].loaded = true;
                    }
                    for(i = 0; i < self.values.catalog.groups.length; i++) {
                        self.values.catalog.groups[i].loaded = true;
                    }

					resolve(response);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load CKAN organizations : ' + uri.toString());

					reject(errorThrown);
				});
			});
        },
        getNodeById: function(id) {
            if(this.values.catalog.nodes.hasOwnProperty(id)) {
                return this.values.catalog.nodes[id];
            }
            return null;
        },
        isNodeEmpty: function(id) {
            var node = this.getNodeById(id);

            if (node.hasOwnProperty('isEmpty')) {
                return node.isEmpty;
            }

            if(node.resources.length > 0) {
                node.isEmpty = false;

                return node.isEmpty;
            }
            if(node.children.length === 0) {
                node.isEmpty = true;
                return node.isEmpty;
            }

            node.isEmpty = true;
            for(var i=0; i < node.children.length; i++) {
                var isChildEmpty = this.isNodeEmpty(node.children[i]);
                if(!isChildEmpty) {
                    node.isEmpty = false;
                    return node.isEmpty;
                }
            }

            return node.isEmpty;
        },
        filterNode: function(id, text, locale) {
            var node = this.getNodeById(id);

            if(!node) {
                return true;
            }
            for(var r=0; r < node.resources.length; r++) {
                var resource = this.getResourceById(node.resources[r]);

                if(resource.name[locale].indexOf(text) > -1) {
                    return false;
                }
            }
            if(node.children.length > 0) {
                for(var i=0; i < node.children.length; i++) {
                    var isFiltered = this.filterNode(node.children[i], text, locale);
                    if(!isFiltered) {
                        return false;
                    }
                }
            }

            return true;
        },
        getNodes: function() {
            return this.values.catalog.nodes;
        },
        getNodeCount: function() {
            return Object.keys(this.values.catalog.nodes).length;
        },
        getNodeChidlren: function(nodeId) {
            var nodes = [];

            if((!nodeId) && (nodeId!==0)) {
                for(var id in this.values.catalog.nodes) {
                    if((!this.values.catalog.nodes[id].parent) && (this.values.catalog.nodes[id].parent!==0)) {
                        nodes.push(this.values.catalog.nodes[id]);
                    }
                }
            } else {
                var node = this.getNodeById(nodeId);

                for(var index in node.children) {
                    nodes.push(this.getNodeById(node.children[index]));
                }
            }

            return nodes;
        },
        loadOrganizations: function () {
			// Example : http://labs.geodata.gov.gr/api/3/action/organization_list?all_fields=true
			this.values.catalog.organizations = [];

            var self = this;

			var uri = new URI(this.values.endpoint);
			uri.segment(['api', '3', 'action', 'organization_list']);
			uri.addQuery({ 'all_fields': true });

			return new Promise(function(resolve, reject) {
				$.ajax({
					url: uri.toString(),
					dataType: 'jsonp',
					context: self
				}).done(function (response) {
					var organizations = [];
					if ((response.success) && (response.result)) {
						self.values.catalog.organizations  = response.result.map(function (value, index, array) {
							return {
								id: value.id,
								name: value.name,
								caption: {
                                    el: value.display_name,
                                    en: value.display_name
                                },
								title: {
                                    el: value.title,
                                    en: value.title
                                },
								description: {
                                    el: value.description,
                                    en: value.description
                                },
								image: value.image_display_url,
								loaded: false
							};
						});
					}
					resolve(self.values.catalog.organizations);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load CKAN organizations : ' + uri.toString());

					reject(errorThrown);
				});
			});
        },
        getOrganizations: function() {
			return this.values.catalog.organizations;
		},
        loadGroups: function () {
			// Example : http://labs.geodata.gov.gr/api/3/action/group_list?all_fields=true
			this.values.catalog.groups = [];

            var self = this;

            var uri = new URI(this.values.endpoint);
            uri.segment(['api', '3', 'action', 'group_list']);
            uri.addQuery({ 'all_fields': true });

			return new Promise(function(resolve, reject) {
				$.ajax({
					url: uri.toString(),
					dataType: 'jsonp',
					context: self
				}).done(function (response) {
					var groups = [];
					if ((response.success) && (response.result)) {
						self.values.catalog.groups = response.result.map(function (value, index, array) {
							return {
								id: value.id,
								name: value.name,
								caption: {
                                    el: value.display_name,
                                    en: value.display_name
                                },
								title: {
                                    el: value.title,
                                    en: value.title
                                },
								description: {
                                    el: value.description,
                                    en: value.description
                                },
								image: value.image_display_url,
								loaded: false
							};
						});
					}
					resolve(self.values.catalog.groups);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load CKAN groups : ' + uri.toString());

					reject(errorThrown);
				});
			});
        },
        getGroups: function() {
			return this.values.catalog.groups;
		},
        isGroupEmpty: function(id) {
            var packages = this.getPackages();

            for(var p = 0; p < packages.length; p++) {
                if ($.inArray(id, packages[p].groups) !== -1) {
                    return false;
                }
            }

            return true;
        },
        isOrganizationEmpty: function(id) {
            var packages = this.getPackages();

            for(var p = 0; p < packages.length; p++) {
                if (id === packages[p].organization) {
                    return false;
                }
            }

            return true;
        },
        filterOrganization: function(id, text, locale) {
            var packages = this.getPackages();

            for(var p = 0; p < packages.length; p++) {
                if (id === packages[p].organization) {
                    for(var r = 0; r < packages[p].resources.length; r++) {
                        if(packages[p].resources[r].name[locale].indexOf(text) > -1) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        loadPackages: function() {
            // Example : http://labs.geodata.gov.gr/api/3/action/current_package_list_with_resources
            this.values.catalog.packages = [];

            var self = this;

            var uri = new URI(this.values.endpoint);
            uri.segment(['api', '3', 'action', 'current_package_list_with_resources']);

			if ((this.values.xhr) && (this.values.xhr.readyState !== 4)) {
				this.values.xhr.abort();
				this.values.xhr = null;
			}

            return new Promise(function(resolve, reject) {
				self.values.xhr = $.ajax({
					url: uri.toString(),
					context: self
				}).done(function (response) {
					self.values.xhr = null;

					var _package, p, _resource, r, g, e;

					if ((response.success) && (response.result)) {
						var packages = response.result;
						for (p = 0; p < packages.length; p++) {
							_package = {
								id: packages[p].id,
								name: packages[p].name,
								title: {
                                    el : packages[p].title,
                                    en : packages[p].title
                                },
								notes:  {
                                    el : packages[p].notes,
                                    en : packages[p].notes
                                },
								organization: packages[p].organization.id,
								groups: [],
								resources: [],
								spatial: null
							};

							for (g = 0; g < packages[p].groups.length; g++) {
								_package.groups.push(packages[p].groups[g].id);
							}

							for (e = 0; e < packages[p].extras.length; e++) {
								if(packages[p].extras[e].key === 'spatial') {
									_package.spatial = packages[p].extras[e].value;
									break;
								}
							}

							for (r = 0; r < packages[p].resources.length; r++) {
								_resource = packages[p].resources[r];
								if(_resource.format === 'wms') {
									_resource.package = _package.id;
                                    _resource.name = {
                                        el: _resource.name,
                                        en: _resource.name
                                    };
                                    _resource.description = {
                                        el: _resource.description,
                                        en: _resource.description
                                    };
									_package.resources.push(_resource);
								}
							}

							if( _package.resources.length > 0) {
								self.values.catalog.packages.push(_package);
							}
						}
					}
					resolve(self.values.catalog.packages);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load packages from CKAN catalog : ' + uri.toString());

					reject(errorThrown);
				});
			});
		},
		getPackages: function() {
			return this.values.catalog.packages;
		},
        search: function(text, bbox) {
            // Example : http://labs.geodata.gov.gr/api/3/action/package_search?q=
			this.values.search.packages = [];

            var self = this;

            var uri = new URI(this.values.endpoint);
            uri.segment(['api', '3', 'action', 'package_search']);

            var query = {};

            if(text) {
                query.q = text;
            }
            if(bbox) {
                query.extras = {
                    'ext_bbox': bbox.join(',')
                };
            }

			if ((this.values.xhr) && (this.values.xhr.readyState !== 4)) {
				this.values.xhr.abort();
				this.values.xhr = null;
			}

			return new Promise(function(resolve, reject) {
				self.values.xhr = $.ajax({
					url: uri.toString(),
					context: this,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(query)
				}).done(function (response) {
					self.values.xhr = null;

					var _package, p, _resource, r, g;

					if ((response.success) && (response.result)) {
						var packages = response.result.results;
						for (p = 0; p < packages.length; p++) {
							_package = {
								id: packages[p].id,
								name: packages[p].name,
								title: {
                                    'el': packages[p].title,
                                    'en': packages[p].title
                                },
								notes: {
                                    'el': packages[p].notes,
                                    'en': packages[p].notes
                                },
								organization: packages[p].organization.id,
								groups: [],
								resources: [],
								spatial: packages[p].spatial
							};

                            if((bbox) && (!_package.spatial)) {
                                continue;
                            }

							for (g = 0; g < packages[p].groups.length; g++) {
								_package.groups.push(packages[p].groups[g].id);
							}

							for (r = 0; r < packages[p].resources.length; r++) {
								_resource = packages[p].resources[r];
								if(_resource.format === 'wms') {
									_resource.package = _package.id;
                                    _resource.name = {
                                        el: _resource.name,
                                        en: _resource.name
                                    };
                                    _resource.description = {
                                        el: _resource.description,
                                        en: _resource.description
                                    };
									_package.resources.push(_resource);
								}
							}

							if( _package.resources.length > 0) {
								self.values.search.packages.push(_package);
							}
						}
					}

					resolve({
						text: text,
						packages: self.values.search.packages
					});
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to search CKAN catalog : ' + uri.toString());

					reject(errorThrown);
				});
			});
        },
		getFilteredPackages: function() {
			return this.values.search.packages;
		},
		getIndexOfOrganization: function(id) {
			for(var o = 0, count = this.values.catalog.organizations.length; o < count; o++) {
				if(this.values.catalog.organizations[o].id === id) {
					return o;
				}
			}

			return -1;
		},
		getIndexOfGroup: function(id) {
			for(var g = 0, count = this.values.catalog.groups.length; g < count; g++) {
				if(this.values.catalog.groups[g].id === id) {
					return g;
				}
			}

			return -1;
		},
        getIndexOfPackage: function(id) {
			for(var p = 0, count = this.values.catalog.packages.length; p < count; p++) {
				if(this.values.catalog.packages[p].id === id) {
					return p;
				}
			}

			return -1;
		},
        loadOrganizationById: function (id) {
			// Example : http://labs.geodata.gov.gr/api/3/action/organization_show?id=3f94f428-06ec-4fc4-8838-c753866f9155&include_datasets=true
            var self = this;

            var uri = new URI(this.values.endpoint);
            uri.segment(['api', '3', 'action', 'organization_show']);
            uri.addQuery({ 'id': id, 'include_datasets': true });

			return new Promise(function(resolve, reject) {
				var index = self.getIndexOfOrganization(id);
				if((index >= 0) && (self.values.catalog.organizations[index].loaded === true)) {
					resolve(self.values.catalog.organizations[index]);
					return;
				}

				$.ajax({
					url: uri.toString(),
					dataType: 'jsonp',
					context: self
				}).done(function (response) {
					var organization = null, index;
					if ((response.success) && (response.result)) {
						organization = {
								id: response.result.id,
								name: response.result.name,
								caption: {
                                    el: response.result.display_name,
                                    en: response.result.display_name
                                },
								title: {
                                    el: response.result.title,
                                    en: response.result.title
                                },
								description: {
                                    el: response.result.description,
                                    en: response.result.description
                                },
								image: response.result.image_display_url,
								loaded: true
						};

						var _package, p, _resource, r, g, e;

						var packages = response.result.packages;
						for (p = 0; p < packages.length; p++) {
							_package = {
								id: packages[p].id,
								name: packages[p].name,
								title: {
                                    el: packages[p].title,
                                    en: packages[p].title
                                },
								notes: {
                                    el: packages[p].notes,
                                    en: packages[p].notes
                                },
								organization: packages[p].organization.id,
								groups: [],
								resources: [],
								spatial: packages[p].spatial
							};

							for (g = 0; g < packages[p].groups.length; g++) {
								_package.groups.push(packages[p].groups[g].id);
							}

							for (r = 0; r < packages[p].resources.length; r++) {
								_resource = packages[p].resources[r];
								if(_resource.format === 'wms') {
									_resource.package = _package.id;
                                    _resource.name = {
                                        el: _resource.name,
                                        en: _resource.name
                                    };
                                    _resource.description = {
                                        el: _resource.description,
                                        en: _resource.description
                                    };
									_package.resources.push(_resource);
								}
							}

							if( _package.resources.length > 0) {
								index = self.getIndexOfPackage(_package.id);
								if(index < 0) {
									self.values.catalog.packages.push(_package);
								}
							}
						}

						index = self.getIndexOfOrganization(organization.id);
						if(index < 0) {
							self.values.catalog.organizations.push(organization);
						} else {
							self.values.catalog.organizations[index].loaded = true;
						}
					}
					resolve(organization);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load CKAN organization : ' + uri.toString());

					reject(errorThrown);
				});
			});
        },
        getOrganizationById: function(id) {
            for(var i=0; i < this.values.catalog.organizations.length; i++) {
                if(this.values.catalog.organizations[i].id === id) {
                    return this.values.catalog.organizations[i];
                }
            }
            return null;
        },
        loadGroupById: function(id) {
			// Example : http://labs.geodata.gov.gr/api/3/action/group_show?id=928771cb-4d0f-4ff6-8c50-984c8457eb71
            var self = this;

            var uri = new URI(this.values.endpoint);
            uri.segment(['api', '3', 'action', 'group_show']);
            uri.addQuery({ 'id': id});

			return new Promise(function(resolve, reject) {
				var index = self.getIndexOfGroup(id);
				if((index >= 0) && (self.values.catalog.groups[index].loaded === true)) {
					resolve(self.values.catalog.groups[index]);
					return;
				}

				$.ajax({
					url: uri.toString(),
					dataType: 'jsonp',
					context: self
				}).done(function (response) {
					var group = null, index;
					if ((response.success) && (response.result)) {
						group = {
								id: response.result.id,
								name: response.result.name,
                                caption: {
                                    el: response.result.display_name,
                                    en: response.result.display_name
                                },
								title: {
                                    el: response.result.title,
                                    en: response.result.title
                                },
								description: {
                                    el: response.result.description,
                                    en: response.result.description
                                },
								image: response.result.image_display_url,
								loaded: true
						};

						var _package, p, _resource, r, g, e;

						var packages = response.result.packages;
						for (p = 0; p < packages.length; p++) {
							_package = {
								id: packages[p].id,
								name: packages[p].name,
								title: {
                                    el: packages[p].title,
                                    en: packages[p].title
                                },
								notes: {
                                    el: packages[p].notes,
                                    en: packages[p].notes
                                },
								organization: packages[p].organization.id,
								groups: [],
								resources: [],
								spatial: packages[p].spatial
							};

							for (g = 0; g < packages[p].groups.length; g++) {
								_package.groups.push(packages[p].groups[g].id);
							}

							for (r = 0; r < packages[p].resources.length; r++) {
								_resource = packages[p].resources[r];

								if(_resource.format === 'wms') {
									_resource.package = _package.id;
                                    _resource.name = {
                                        el: _resource.name,
                                        en: _resource.name
                                    };
                                    _resource.description = {
                                        el: _resource.description,
                                        en: _resource.description
                                    };
									_package.resources.push(_resource);
								}
							}

							if( _package.resources.length > 0) {
								index = self.getIndexOfPackage(_package.id);
								if(index < 0) {
									self.values.catalog.packages.push(_package);
								}
							}
						}

						index = self.getIndexOfGroup(group.id);
						if(index < 0) {
							self.values.catalog.groups.push(group);
						} else {
							self.values.catalog.groups[index].loaded = true;
						}
					}
					resolve(group);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load CKAN organization : ' + uri.toString());

					reject(errorThrown);
				});
			});
		},
        getGroupById: function(id) {
            for(var i=0; i < this.values.catalog.groups.length; i++) {
                if(this.values.catalog.groups[i].id === id) {
                    return this.values.catalog.groups[i];
                }
            }
            return null;
        },
        loadPackageById: function (id) {
			// Example : http://labs.geodata.gov.gr/api/3/action/package_show?id=8636eeea-e05f-40b1-824b-253c60a1a2c9
            var self = this;

            var uri = new URI(this.values.endpoint);
            uri.segment(['api', '3', 'action', 'package_show']);
            uri.addQuery({ 'id': id });

			return new Promise(function(resolve, reject) {
				var index = self.getIndexOfPackage(id);
				if(index >= 0) {
					resolve(self.values.catalog.packages[index]);
					return;
				}

				$.ajax({
					url: uri.toString(),
					dataType: 'jsonp',
					context: self
				}).done(function (response) {
					var _package = null, _resource;
					if ((response.success) && (response.result)) {
						_package = {
							id: response.result.id,
							name: response.result.name,
							title: response.result.title,
							notes: response.result.notes,
							organization: response.result.organization.id,
							groups: [],
							resources: [],
							spatial: response.result.spatial
						};

						for (var g = 0; g < response.result.groups.length; g++) {
							_package.groups.push(response.result.groups[g].id);
						}

						for (var r = 0; r < response.result.resources.length; r++) {
							_resource = response.result.resources[r];
							if(_resource.format === 'wms') {
								_resource.package = _package.id;
								_package.resources.push(_resource);
							}
						}

						if( _package.resources.length > 0) {
							self.values.catalog.packages.push(_package);
						}
					}
					resolve(_package);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('Failed to load CKAN package : ' + uri.toString());

					reject(errorThrown);
				});
			});
        },
        getPackageById: function (id) {
            var p;

			if(this.values.catalog.packages) {
				for (p = 0; p < this.values.catalog.packages.length; p++) {
					if (this.values.catalog.packages[p].id === id) {
						return this.values.catalog.packages[p];
					}
				}
			}

			if(this.values.search.packages) {
				for (p = 0; p < this.values.search.packages.length; p++) {
					if (this.values.search.packages[p].id === id) {
						return this.values.search.packages[p];
					}
				}
			}

            return null;
        },
        getResourceById: function (id) {
            var p, r, _package;

            if(this.values.catalog.packages) {
				for (p = 0; p < this.values.catalog.packages.length; p++) {
					_package = this.values.catalog.packages[p];
					if (_package.resources) {
						for (r = 0; r < _package.resources.length; r++) {
							if (_package.resources[r].id === id) {
								return _package.resources[r];
                            }
                        }
                    }
                }
            }

            if(this.values.search.packages) {
				for (p = 0; p < this.values.search.packages.length; p++) {
					_package = this.values.search.packages[p];
					if (_package.resources) {
						for (r = 0; r < _package.resources.length; r++) {
							if (_package.resources[r].id === id) {
								return _package.resources[r];
                            }
                        }
                    }
                }
            }

            return null;
        },
        getObjectTitle: function(type, id) {
                switch(type) {
                    case 'group':
                        return this.getGroupById(id).caption;
                    case 'organization':
                        return this.getOrganizationById(id).caption;
                    case 'package':
                        return this.getPackageById(id).title;
                    default:
                        return '';
                }
        },
        getObjectDescription: function(type, id) {
            var self = this;

            return new Promise(function(resolve, reject) {
                var data = {};

                switch(type) {
                    case 'group':
                        data = {
                            title: self.getGroupById(id).caption,
                            description: self.getGroupById(id).description
                        };
                        break;
                    case 'organization':
                        data = {
                            title: self.getOrganizationById(id).caption,
                            description: self.getOrganizationById(id).description
                        };
                        break;
                    case 'package':
                        data = {
                            title: self.getPackageById(id).title,
                            description: self.getPackageById(id).notes
                        };
                        break;
                    default:
                        resolve({});
                        return;
                }

                if(data.description) {
                    resolve(data);
                } else {
                    var uri = new URI();

                    if(self.values.path === '/') {
                        uri.segment(['metadata', type, id]);
                    } else {
                        uri.segment([self.values.path, 'metadata', type, id]);
                    }

                    $.ajax({
                        url: uri.toString().replace(/\/\//g, '/').replace(/:\//g, '://'),
                        context: self
                    }).done(function (response) {
                        if(response.success) {
                            switch(type) {
                                case 'group':
                                    self.getGroupById(id).description = response.text;
                                    break;
                                case 'organization':
                                    self.getOrganizationById(id).description = response.text;
                                    break;
                                case 'package':
                                    self.getPackageById(id).notes = response.text;
                                    break;
                            }
                            data.description = response.text;

                            resolve(data);
                        } else {
                            reject(null);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('Failed to object description : ' + uri.toString());

                        reject(errorThrown);
                    });
                }
            });
        }
    });
});

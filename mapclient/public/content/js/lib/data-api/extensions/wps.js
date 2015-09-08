(function() {
    var factory = function (PublicaMundi, ZooProcess, wpsPayload) {
        "use strict";

        if(typeof PublicaMundi.Data.WPS === 'undefined') {
                PublicaMundi.Data.WPS = {
                __namespace: 'PublicaMundi.Data.WPS'
            };
        }
        
        var processMappings = { };
        
        var getResultFromWPS = function(data) {
            return (data.ExecuteResponse.ProcessOutputs ? data.ExecuteResponse.ProcessOutputs.Output.Reference._href : null);
        };
        
        var getErrorFromWPS = function(data) {
            if((data.ExecuteResponse) && (data.ExecuteResponse.Status) && (data.ExecuteResponse.Status.ProcessFailed)) {
                return data.ExecuteResponse.Status.ProcessFailed.ExceptionReport.Exception.ExceptionText.__text;
            }
            return null;            
        };
        
        PublicaMundi.Data.WPS.configure = function(options) {
            var mappings = options.mappings || {};

            for(var prop in processMappings) {
                if(PublicaMundi.Data.Query.prototype.hasOwnProperty('process' + prop)) {
                    delete PublicaMundi.Data.Query.prototype['process' + prop];
                }
            }

            processMappings = mappings;
            
            for(var prop in processMappings) {
                (function(op, name, process) {
                    PublicaMundi.Data.Query.prototype[name] = function() {
                        if(this.request.queue.length > 1) {
                            throw new PublicaMundi.Data.SyntaxException('WPS operations can be applied only to requests with a single query.');
                        }
                        
                        if(!this.request.processes) {
                            this.request.processes = [];
                        }
                        if ((process.params) && ((process.params.length-1) != arguments.length)) {
                            throw new PublicaMundi.Data.SyntaxException('Function '  + 
                                                                        name + 
                                                                        ' expects '  + 
                                                                        (process.params.length - 1) + 
                                                                        ' parameter(s). Only ' + 
                                                                        arguments.length + 
                                                                        ' specified.');
                        }
                        
                        this.request.processes.push({
                            name: op,
                            id: process.id,
                            args: arguments
                        });
                        
                        return this;
                    }
                })(prop, 'process' + prop, processMappings[prop]);
            }
        };
       
        var fn_queue = PublicaMundi.Data.Query.prototype.queue;
        
        PublicaMundi.Data.Query.prototype.queue = function () {           
            if((this.request.processes) && (this.request.processes.length > 0) && (this.request.queue.length > 0)) {
                throw new PublicaMundi.Data.SyntaxException('WPS operations can be applied only to requests with a single query.');
            }
            return fn_queue.call(this);
        };
        
        var fn_execute = PublicaMundi.Data.Query.prototype.execute;

        PublicaMundi.Data.Query.prototype.execute = function (options) {
            if((!this.request.processes) || (this.request.processes.length == 0)) {
                return fn_execute.call(this, options);
            }

            var configuration = PublicaMundi.Data.getConfiguration();            
            var debug = configuration.debug;

            options = options || {};

            options.success = options.success || this.callbacks.success;
            options.failure = options.failure || this.callbacks.failure;
            options.complete = options.complete || this.callbacks.complete;

            var execution = {
                size : null,
                start : (new Date()).getTime(),
                end : null
            };

            var processes = [].concat(this.request.processes).reverse();
            var processIndex = 0;
            
            var endpoint = (configuration.wps.corsEnabled ? configuration.wps.endpoint : configuration.proxy + configuration.wps.endpoint);

            var myZooObject = new ZooProcess({
                url: endpoint,
                delay: (configuration.wps.delay ? configuration.wps.delay : 2000),
            });

            var queryCallback = function(data, execution) {
                if(data.success) {
                    var url = this.endpoint + 'api/download?code=' + data.code + '&raw';
                    // When debugging fetch data to the client 
                    if(debug) {
                        $.ajax({
                            method: 'GET',
                            url: url
                        }).done(initProcessingCallback).fail(function() {
                            execution.end = (new Date()).getTime();
                            
                            if (typeof options.failure === 'function') {
                                options.failure.call( options.context || this, 'Failed to download file from [' + url + '].', execution);
                            }

                            if (typeof options.complete === 'function') {
                                options.complete.call( options.context || this);
                            }
                        });
                    } else {
                        // Send the link to the WPS server
                        initProcessingCallback(url);
                    }
                } else {
                    execution.end = (new Date()).getTime();
                    
                    if (typeof options.success === 'function') {
                        options.success.call( options.context || this, data, execution);
                    }
                    
                    if (typeof options.complete === 'function') {
                        options.complete.call( options.context || this);
                    }
                } 
            };
            
            var initProcessingCallback = function(data) {
                var process = processes.pop();
                processIndex++;

                var dataInputs = [];
                var dataOutputs = [];
                
                var metadata = processMappings[process.name];
                
                if((debug) && ($.isXMLDoc(data))) {
                    data = (new XMLSerializer()).serializeToString(data);
                    var doctype = '<?xml version="1.0" encoding="utf-8" ?>';
                    data = data.substr(doctype.length);
                }

                for(var i=0; i < metadata.params.length; i++) {
                    var input = {
                        'identifier': metadata.params[i].name
                    };
                    switch(metadata.params[i].type) {
                        case 'complex':
                            if(debug) {
                                input.value = (i == 0 ? data : process.args[i-1]);
                            } else if(i==0) {
                                input.href = data;
                            } else {
                                input.value = process.args[i-1];
                            }
                            break;
                        case 'literal':
                            input.value = (i == 0 ? data : process.args[i-1]);
                            break;
                        default:
                            throw new PublicaMundi.Data.SyntaxException('Parameter type [' + metadata.params[i].type + '] is not supported.');
                    }
                    if(metadata.params[i].mimeType) {
                        input.mimeType = metadata.params[i].mimeType
                    }

                    dataInputs.push(input);
                }
                
                if(processes.length == 0) {
                    dataOutputs.push({'identifier': metadata.result,'mimeType':'application/json','type':'raw'});
                } else {
                    dataOutputs.push({'identifier': metadata.result,'mimeType':'application/json','asReference':true});
                }

                if(debug) {
                    console.log(dataInputs);
                    console.log(dataOutputs);
                }

                myZooObject.execute({
                    identifier: process.id,
                    dataInputs: dataInputs,
                    dataOutputs: dataOutputs,
                    type: 'POST',
                    success: (processes.length == 0 ? resultCallback : processCallback),
                    error: function(data){
                        var message = getErrorFromWPS(data) || 'Unhandled exception has occured. Execution of process [' + process.id + '] has failed. Process index is [' + processIndex + ']';
                        
                        execution.end = (new Date()).getTime();
                        
                        if (typeof options.failure === 'function') {
                            options.failure.call(
                                options.context || this, 
                                message,
                                execution
                            );
                        } else if(debug) {
                            console.log(message);
                        }
                        
                        if (typeof options.complete === 'function') {
                            options.complete.call( options.context || this);
                        }
                    }
                });
            };
            
            var processCallback = function(data) {
                var process = processes.pop();
                processIndex++;

                var dataInputs = [];
                var dataOutputs = [];
                
                var metadata = processMappings[process.name];

                var href = getResultFromWPS(data);
                if(!href) {
                    var message = getErrorFromWPS(data) || 'Can not execute process [' + process.id + ']. Failed to get response from previous process. Process index is [' + processIndex + ']';
                    
                    execution.end = (new Date()).getTime();
                    
                    if (typeof options.failure === 'function') {
                        options.failure.call(
                            options.context || this, 
                            message,
                            execution
                        );
                    } else if(debug) {
                        console.log(message);
                    }
                    
                    if (typeof options.complete === 'function') {
                        options.complete.call( options.context || this);
                    }

                    return;
                }
                var input = {
                    'identifier': metadata.params[0].name,
                    'href': href,
                    'mimeType': 'application/json'
                };

                if(metadata.params.mimeType) {
                    input.mimeType = metadata.params.mimeType
                }
                    
                dataInputs.push(input);

                for(var i=1; i < metadata.params.length; i++) {
                    var input = {
                        'identifier': metadata.params[i].name
                    };
                    switch(metadata.params[i].type) {
                        case 'complex':
                            input.value = process.args[i-1];
                            break;
                        case 'literal':
                            input.value = process.args[i-1];
                            break;
                        default:
                            throw new PublicaMundi.Data.SyntaxException('Parameter type [' + metadata.params[i].type + '] is not supported.');
                    }
                    if(metadata.params[i].mimeType) {
                        input.mimeType = metadata.params[i].mimeType
                    }
                    
                    dataInputs.push(input);
                }
                
                if(processes.length == 0) {
                    dataOutputs.push({'identifier': metadata.result,'mimeType':'application/json','type':'raw'});
                } else {
                    dataOutputs.push({'identifier': metadata.result,'mimeType':'application/json','asReference':true});
                }

                if(debug) {
                    console.log(dataInputs);
                    console.log(dataOutputs);
                }

                myZooObject.execute({
                    identifier: process.id,
                    dataInputs: dataInputs,
                    dataOutputs: dataOutputs,
                    type: 'POST',
                    success: (processes.length == 0 ? resultCallback : processCallback),
                    error: function(data){
                        var message = getErrorFromWPS(data) || 'Unhandled exception has occured. Execution of process [' + process.id + '] has failed. Process index is [' + processIndex + ']';
                        
                        execution.end = (new Date()).getTime();
                        
                        if (typeof options.failure === 'function') {
                            options.failure.call(
                                options.context || this, 
                                message,
                                execution
                            );
                        } else if(debug) {
                            console.log(message);
                        }
                        
                        if (typeof options.complete === 'function') {
                            options.complete.call( options.context || this);
                        }
                    }
                });
            };
            
            var resultCallback = function(data) {
                execution.end = (new Date()).getTime();
                
                if (typeof options.success === 'function') {
                    options.success.call( options.context || this, {
                        success: true,
                        data: [ data ],
                        message: null
                    }, execution);
                }

                if (typeof options.complete === 'function') {
                    options.complete.call( options.context || this);
                }
            };

            return this.format(PublicaMundi.Data.Format.GML).export.call(this, {
                context: options.context,
                success: queryCallback,
                failure: options.failure
            });
        };
        
        PublicaMundi.Data.Query.prototype.getProcesses = function (options) {
            var configuration = PublicaMundi.Data.getConfiguration();

            var endpoint = (configuration.wps.corsEnabled ? configuration.wps.endpoint : configuration.proxy + configuration.wps.endpoint);

            var myZooObject = new ZooProcess({
                url: endpoint,
                delay: (configuration.wps.delay ? configuration.wps.delay : 2000),
            });
            
            myZooObject.getCapabilities({
               type: 'POST',
                success: function(data){
                    if (typeof options.success === 'function') {
                        options.success.call( options.context || this, data);
                    }
                },
                error: function(data) {
                    if (typeof options.failure === 'function') {
                        options.failure.call( options.context || this, data);
                    }
                }
            });

            return this;
        };

        PublicaMundi.Data.Query.prototype.describeProcess = function (options) {
            var configuration = PublicaMundi.Data.getConfiguration();

            var endpoint = (configuration.wps.corsEnabled ? configuration.wps.endpoint : configuration.proxy + configuration.wps.endpoint);

            var myZooObject = new ZooProcess({
                url: endpoint,
                delay: (configuration.wps.delay ? configuration.wps.delay : 2000),
            });
            
            myZooObject.describeProcess({
                type: 'POST',
                identifier: options.id || 'all',
                success: function(data){
                    if (typeof options.success === 'function') {
                        options.success.call( options.context || this, data);
                    }
                },
                error: function(data){
                    if (typeof options.failure === 'function') {
                        options.failure.call( options.context || this, data);
                    }
                }
            }); 
        };

        return PublicaMundi;
    }



    if((define) && (define.amd)) {
        define(['shared', 'zoo', 'wpsPayload'], factory);
    } else {
        factory(PublicaMundi, ZooProcess, wpsPayload);
    }
})();

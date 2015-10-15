﻿var config = {
    enforceDefine: false,
    waitSeconds: 30,
    // Disable caching
    urlArgs: "v=" + (new Date()).getTime(),
    paths: {
		promise: [
			'lib/promise/promise-6.1.0.min',
			'https://www.promisejs.org/polyfills/promise-6.1.0.min'
		],
        jquery: [
            'lib/jquery/jquery-2.1.3.min'
        ],
        jqueryui: [
            'lib/jquery-ui/jquery-ui.1.11.4.min'
        ],
        jqueryui_touch_punch: [
            'lib/jquery-ui.touch-punch/jquery.ui.touch-punch.min'
        ],
		bootstrap: [
			'lib/bootstrap/current/bootstrap.min'
		],
		bootstrap_select: [
			'lib/bootstrap-select/bootstrap-select.min'
		],
        ol: [
            'lib/ol3/ol.3.5.0'
        ],
        URIjs: 'lib/uri',
        app: 'app/app',
        controls: 'app/controls',
        shared: 'app/shared',
        wms: 'app/wms',
        file: 'app/file',
        proj4: 'lib/proj4js/proj4',
        ckan: 'app/ckan',
        data_api: 'lib/data-api/data',
        data_api_wps: 'lib/data-api/extensions/wps',
        typeahead : 'lib/typeahead/typeahead.jquery.min',
        bloodhound: 'lib/typeahead/bloodhound.min',
        handlebars: 'lib/handlebars/handlebars-v3.0.3',
        fileupload: 'lib/fileupload/jquery.fileupload',
        iframetransport: 'lib/fileupload/jquery.iframe-transport',
        locale_en: 'i18n/en/strings',
        locale_el: 'i18n/el/strings',
        // WPS support
        hogan: 'lib/hogan/hogan-3.0.2.min',
        xml2json: 'lib/x2js/xml2json.min',
        queryString: 'lib/query-string/query-string',
        wpsPayloads: 'lib/zoo-client/payloads',
        wpsPayload: 'lib/zoo-client/wps-payload',
        utils: 'lib/zoo-client/utils',
        zoo: 'lib/zoo-client/zoo'
    },
    shim: {
		jquery: {
			deps : ['promise']
		},
		bootstrap : { 
			deps : ['jquery'] 
		},
		bootstrap_select : { 
			deps : ['bootstrap', 'jquery'] 
		},
        typeahead: {
            deps: [
                'jquery',
                'bloodhound'
            ]
        },
        iframetransport: {
            deps: [
                'jquery'
            ]
        },
        fileupload: {
            deps: [
                'jqueryui',
                'iframetransport'
            ]
        },
        jqueryui: {
            deps: ['jquery']
        },
        jqueryui_touch_punch: {
            deps: ['jqueryui']
        },
        ol: {
            deps: ['proj4']
        },
        ckan: {
            deps: [
                'jquery',
                'URIjs/URI',
                'shared'
            ]
        },
        shared: {
            deps: [
                'jquery',
                'URIjs/URI',
            ]
        },
        controls: {
            deps: [
                'shared',
                'typeahead',
				'handlebars'
            ]
        },
        app: {
            deps: [
                'jquery',
                'bootstrap',
                'bootstrap_select',
                'jqueryui', 
                'jqueryui_touch_punch',               
                'proj4',
                'ol',
                'URIjs/URI',
                'shared',
                'ckan',
                'controls',                
                'wms',
                'file',
                'data_api',
                'data_api_wps',
                'fileupload'
            ]
        },
        wms: {
            deps: [
                'shared',
                'xml2json'
            ]
        },
        file: {
            deps: [
                'shared'
            ]
        },
        data_api_wps: {
            deps: [
                'data_api',
                'zoo',
                'wpsPayload'
            ]
        },
        wpsPayloads: {
            deps: ['hogan'],
        },
        wpsPayload: {
            deps: ['wpsPayloads'],
            exports: 'wpsPayload',
        },
        hogan: {
            exports: 'Hogan',
        },
        xml2json: {
          exports: "X2JS",
        },
        queryString: {
            exports: 'queryString',
        }
	}
};

requirejs.config(config);

var initialization = {
    scriptCounter : 0,
    scriptTotal : 6,
    scripts : []
};

for(var s in config.shim) {
	if(initialization.scripts.indexOf(s) === -1) {
		initialization.scripts.push(s);
		initialization.scriptTotal++;

        if(config.shim[s].deps) {
            for(var i=0, count = config.shim[s].deps.length; i < count; i++) {
                if(initialization.scripts.indexOf(config.shim[s].deps[i]) === -1) {
                    initialization.scripts.push(config.shim[s].deps[i]);
                    initialization.scriptTotal++;
                }
            }
        }
	}
}

requirejs.onResourceLoad = function (context, map, depArray) {
	initialization.scriptCounter++;
	document.getElementById("loading-text").innerHTML = 'Loading Scripts ... ' + (100 * (initialization.scriptCounter) / initialization.scriptTotal).toFixed(0) + '%'
};

define('main-mobile', function () {
    "use strict";

    require(['jquery', 'app'], function ($, PublicaMundi) {
        $(function () {
            // Add code for application initialization here
            PublicaMundi.initialize();

            window.PublicaMundi = PublicaMundi;
        });
    });
});

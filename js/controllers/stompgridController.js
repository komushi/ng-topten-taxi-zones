
var colorPaletteBlue = function (level) {

    var color;

    switch (level) {
        case 0:
            color = "#0d47a1";
            break;
        case 1:
            color = "#1565c0";
            break;
        case 2:
            color = "#1976d2";
            break;
        case 3:
            color = "#1e88e5";
            break;
        case 4:
            color = "#2196f3";
            break;
        case 5:
            color = "#42a5f5";
            break;
        case 6:
            color = "#64b5f6";
            break;
        case 7:
            color = "#90caf9";
            break;
        case 8:
            color = "#bbdefb";
            break;
        case 9:
            color = "#e3f2fd";
            break;
    }
    return {'background-color': color}
};

var colorPaletteSpectrum = function (level) {

    var color;

    switch (level) {
        case 0:
            color = "#f44336";
            break;
        case 1:
            color = "#e91e63";
            break;
        case 2:
            color = "#9c27b0";
            break;
        case 3:
            color = "#673ab7";
            break;
        case 4:
            color = "#3f51b5";
            break;
        case 5:
            color = "#2196f3";
            break;
        case 6:
            color = "#03a9f4";
            break;
        case 7:
            color = "#00bcd4";
            break;
        case 8:
            color = "#009688";
            break;
        case 9:
            color = "#4caf50";
            break;
    }
    return {'background-color': color}
};

var colorPaletteRed = function (level) {

    var color;

    switch (level) {
        case 0:
            color = "#b71c1c";
            break;
        case 1:
            color = "#c62828";
            break;
        case 2:
            color = "#d32f2f";
            break;
        case 3:
            color = "#e53935";
            break;
        case 4:
            color = "#f44336";
            break;
        case 5:
            color = "#ef5350";
            break;
        case 6:
            color = "#e57373";
            break;
        case 7:
            color = "#ef9a9a";
            break;
        case 8:
            color = "#ffcdd2";
            break;
        case 9:
            color = "#ffebee";
            break;
    }
    return {'background-color': color}
};

var getLevel = function (currentPosition, totalLength) {

    return Math.floor((currentPosition)/totalLength*10);
};

var app = angular.module('ngTopTenTaxiZonesApp');

app.controller('stompgridController', ['$scope', '$rootScope', '$stomp', 'growl', '$translate', '$asyncTranslator', '$q', 
    function($scope, $rootScope, $stomp, growl, $translate, $asyncTranslator, $q){

    $scope.connect = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.model.usr;
        connectHeaders.passcode = $scope.model.pwd;

        $stomp.connect($scope.model.url, connectHeaders)
            .then(function (frame) {
                
                growl.success('Connected!');
                console.log('Connected: ' + frame);

                subscribe();
            })
            .catch(function(reason) {

                growl.error('Connection error:' + reason);
                console.error('Connection error:', reason);

            });
    };

    // Disconnect
    $scope.disconnect = function () {
        $stomp.disconnect().then(
            function () {
                console.log('Disconnected');
                growl.warning('Disconnected!');
            });        
    };
    
    $scope.changeLanguage = function(localeCode) {
        $asyncTranslator.setLocaleCode(localeCode);
        $rootScope.$broadcast('rootScope:localeChanged', localeCode);
    };

    // translation when new language is selected
    $scope.$on('rootScope:localeChanged', function(event, localeCode) {
        if (localeCode) {
            // $asyncTranslator.setViewInfos(viewSummary.viewInfos);
            $translate.use(localeCode);
        }
    });


    // Subscribe a queue
    var subscribe = function () {
        
        var headers = {};

        $stomp.subscribe($scope.model.subdest, headers).then(null,null,updateGridMatrix);
    };

    // Unsubscribe a queue
    var unsubscribe = function () {
        $stomp.unsubscribe($scope.model.subdest);
    };

    // notify callback function
    var updateGridMatrix = function (res) {

        var payload = JSON.parse(JSON.parse(res.body).payload);

        console.log(JSON.stringify(payload));

        var msgTimestamp = payload.timestamp;
        var msgDate = new Date(msgTimestamp);
        var from = payload.from;
        var to = payload.to;
        var delay = payload.delay;
        var count = payload.count;
        var incremental = payload.incremental;


        if ($rootScope.localeCode == 'en-US') {

            
            if (incremental) {
                growl.info(from + ' => ' + to
                    + ' Count:' + count
                    + ' Delayed:' + delay + 'ms');                
            }
            else {
                growl.warning(from + ' => ' + to
                    + ' Count:' + count); 
            }



            $scope.model.rowCollection = payload.toptenlist;

            $scope.gridOptions.rowData = $scope.model.rowCollection;
            $scope.gridOptions.api.setRowData($scope.gridOptions.rowData);

            $scope.matrixJson = payload.matrix;
        } 
        else {
            lazyTranslateInit(payload);

            $translate([from, to, 'Count', 'Delayed'])
                .then(function (translations) {
                    // console.log(JSON.stringify(translations));

                    if (incremental) {
                        growl.info(translations[from] + ' => ' + translations[to]
                            + ' ' + translations['Count'] + ':' + count
                            + ' ' + translations['Delayed'] + ':' + delay + 'ms');            
                    }
                    else {
                        growl.warning(translations[from] + ' => ' + translations[to]
                            + ' ' + translations['Count'] + ':' + count); 
                    }
                    
                });

            translatePayload(payload).then(function(){
                // console.log(JSON.stringify(payload));
                
                $scope.model.rowCollection = payload.toptenlist;

                $scope.gridOptions.rowData = $scope.model.rowCollection;
                $scope.gridOptions.api.setRowData($scope.gridOptions.rowData);

                $scope.matrixJson = payload.matrix;
            });
        }        
    };

    var lazyTranslateInit = function (payload) {

        xInfos = [];

        payload.toptenlist.forEach(function(item, i) {

            var fromX = parseInt((item.from.split(".")[0]).split("C")[1]);
            var toX = parseInt((item.to.split(".")[0]).split("C")[1]);

            if (xInfos.indexOf(fromX) == -1) {
                xInfos.push(fromX);
            }

            if (xInfos.indexOf(toX) == -1) {
                xInfos.push(toX);
            }

        });

        $asyncTranslator.setXInfos(xInfos);
        $translate.use($rootScope.localeCode);
    }



    var translateProm = function(code) {
        // if the translate promise fails,
        // it will now be resolved and return 'undefined' instead

        var deferred = $q.defer();

        $translate(code)
            .then(function(data){
                var rtn = {"code":code, "name":data};
                deferred.resolve(rtn);

            })
            .catch(function(){
                var rtn = {"code":code, "name":code};
                deferred.resolve(rtn);
                
            });

        return deferred.promise;

        
    }

    var translatePayload = function (payload) {

        var deferred = $q.defer();
        // var promises = [];



        var codes = [];
        payload.matrix.nodes.forEach(function(item, i) {

            if (codes.indexOf(item.name) == -1) {
                codes.push(item.name);
            }
        });

        $q.all(codes.map(translateProm)).then(
            function(translatedList) {
                var translatedObjs = {};

                translatedList.forEach(function(item) {
                    translatedObjs[item.code] = item.name;
                });

                payload.toptenlist.forEach(function(item) {

                    item.from = translatedObjs[item.from];
                    item.to = translatedObjs[item.to];

                });

                payload.matrix.nodes.forEach(function(node) {

                    node.name = translatedObjs[node.name];
                });

                deferred.resolve(payload);
            });

        return deferred.promise;

    }

    var initialize = function () {
        $scope.model = {}

        // $scope.model.url = 'ws://localhost:61623/';
        $scope.model.url = 'http://127.0.0.1:9040/stomp';
        $scope.model.usr = 'guest';
        // $scope.model.usr = 'admin';
        $scope.model.pwd = 'guest';
        // $scope.model.pwd = 'password';
        $scope.model.subdest = '/topic/topten';
        // $scope.model.pubdest = '/topic/dest';
        // $scope.model.payload = '{"name":"Tom", "type":"Type0", "sales":50}';
        $scope.model.headers = '{}';

        // setup for ag-grid
        $scope.model.rowCollection = [];

        var columnDefs = [
            {headerName: "Rank", field: "rank", width: 60},
            {headerName: "From", field: "from"},
            {headerName: "To", field: "to"},
            {headerName: "Count", field: "count", width: 60}
        ];

        $scope.gridOptions = {
            columnDefs: columnDefs,
            rowData: $scope.model.rowCollection,
            onGridReady: function(event) {
                event.api.sizeColumnsToFit();
            },
            getRowStyle: function(params) {
                var level = getLevel(params.data.rank - 1, $scope.model.rowCollection.length)
                return colorPaletteBlue(level);
            }
        };

        // initial translation
        if ($rootScope.localeCode) {
            $translate.use($rootScope.localeCode);
        }
    };

    initialize();

}]);


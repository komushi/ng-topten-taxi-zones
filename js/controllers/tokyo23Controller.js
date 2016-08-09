
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


var getLevel = function (currentPosition, totalLength) {

    return Math.floor((currentPosition)/totalLength*10);
};

var app = angular.module('ngTopTenTaxiZonesApp');

app.controller('tokyo23Controller', ['$scope', '$stomp', 'growl',
    function($scope, $stomp, growl){

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
           
    };


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

        $scope.colorRange='#227AFF,#FFF500';

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
                // var level = getLevel(params.data.rank - 1, $scope.model.rowCollection.length)
                // return colorPaletteBlue(level);
                var color = d3.scale.linear().domain([1, $scope.model.rowCollection.length])
                            .interpolate(d3.interpolateHcl)
                            .range($scope.colorRange.split(","));
                return {'background-color': color(params.data.rank)};
            }
        };

    };

    initialize();

}]);


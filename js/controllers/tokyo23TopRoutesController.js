var app = angular.module('ngTopTenTaxiZonesApp');

app.controller('tokyo23TopRoutesController', ['$scope', '$stomp', 'growl',
    function($scope, $stomp, growl){

    $scope.connect = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.stomp.usr;
        connectHeaders.passcode = $scope.stomp.pwd;

        $stomp.connect($scope.stomp.name, $scope.stomp.url, connectHeaders)
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
        $stomp.disconnect($scope.stomp.name).then(
            function () {
                console.log('Disconnected');
                growl.warning('Disconnected!');
            });        
    };

    // Subscribe a queue
    var subscribe = function () {
        
        var headers = {};

        $stomp.subscribe($scope.stomp.name, $scope.stomp.destination, headers).then(null,null,updateGridMatrix);
    };

    // Unsubscribe a queue
    var unsubscribe = function () {
        $stomp.unsubscribe($scope.stomp.name, $scope.stomp.destination);
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

        // $scope.model.matrixJson = payload.matrix;

        // color = d3.scale.linear().domain([1, $scope.stomp.rowCollection.length])
        //             .interpolate(d3.interpolateHcl)
        //             .range($scope.colorRange.split(","));
           
    };

    

    var initialize = function () {
        $scope.stomp = {}

        // $scope.stomp.url = 'ws://localhost:61623/';
        // $scope.stomp.usr = 'admin';
        // $scope.stomp.pwd = 'password';
        $scope.stomp.url = 'http://127.0.0.1:9400/stomp';
        $scope.stomp.usr = 'guest';
        $scope.stomp.pwd = 'guest';
        $scope.stomp.destination = '/topic/toproute';
        $scope.stomp.name = 'TopRoute';
        $scope.stomp.headers = '{}';

        // setup for ag-grid
        $scope.model = {}
        $scope.model.rowCollection = [];

        $scope.colorRange='#227AFF,#FFF500';

        $scope.topNumber = 10;

        var color = d3.scale.linear().domain([1, $scope.topNumber])
                        .interpolate(d3.interpolateHcl)
                        .range($scope.colorRange.split(","));


        var columnDefs = [
            {headerName: "Rank", field: "rank", width: 60},
            {headerName: "From", field: "from"},
            {headerName: "To", field: "to"},
            {headerName: "Count", field: "count", width: 60}
        ];


        $scope.gridOptions = {
            columnDefs: columnDefs,
            rowData: $scope.stomp.rowCollection,
            onGridReady: function(event) {
                event.api.sizeColumnsToFit();
            },
            getRowStyle: function(params) {
                return {'background-color': color(params.data.rank)};
            }
        };

    };

    initialize();

}]);


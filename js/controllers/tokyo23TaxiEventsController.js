var app = angular.module('ngTopTenTaxiZonesApp');

app.controller('tokyo23TaxiEventsController', ['$scope', '$stomp', 'growl',
    function($scope, $stomp, growl){

    $scope.connect = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.model.usr;
        connectHeaders.passcode = $scope.model.pwd;

        $stomp.connect($scope.model.url, connectHeaders)
            .then(function (frame) {
                
                growl.success('Connected!');
                console.log('Connected: ' + frame);
// subscribe("/topic/transform_geotuple");

                
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
    var subscribe = function (destination) {
        
        $scope.destination = destination;

        var headers = {};

        $stomp.subscribe(destination, headers).then(null, null, updateScreen);
    };

    // Unsubscribe a queue
    var unsubscribe = function () {
        $stomp.unsubscribe($scope.destination);
        $scope.destination = null;
    };

    $scope.subEventsFrom = function (feature) {
        console.log("subEventsFrom" + feature);
        subscribe("/topic/" + feature);
    };

    $scope.unsubEvents = function () {
        unsubscribe();
    };


    // notify callback function
    var updateScreen = function (res) {

        var payload = JSON.parse(JSON.parse(res.body).payload);
        console.log(JSON.stringify(payload));
        
        $scope.taxiEvents = [[payload.dropoffLongitude, payload.dropoffLatitude]];

        

        // $scope.model.rowCollection = payload.toptenlist;
        // $scope.gridOptions.rowData = $scope.model.rowCollection;
        // $scope.gridOptions.api.setRowData($scope.gridOptions.rowData);


        // var color = d3.scale.linear().domain([1, $scope.model.rowCollection.length])
        //             .interpolate(d3.interpolateHcl)
        //             .range($scope.colorRange.split(","));
           
    };

    

    var initialize = function () {
        $scope.model = {}

        // $scope.model.url = 'ws://localhost:61623/';
        $scope.model.url = 'http://127.0.0.1:9110/stomp';
        $scope.model.usr = 'guest';
        $scope.model.pwd = 'guest';
        $scope.model.subdest = '/topic/topten';


/*
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
                color = d3.scale.linear().domain([1, $scope.model.rowCollection.length])
                            .interpolate(d3.interpolateHcl)
                            .range($scope.colorRange.split(","));

                return {'background-color': color(params.data.rank)};
            }
        };
*/
    };

    initialize();

}]);


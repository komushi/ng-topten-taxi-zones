var app = angular.module('ngTopTenTaxiZonesApp');

app.controller('tokyo23TaxiEventsController', ['$scope', '$stomp', 'growl',
    function($scope, $stomp, growl){

    $scope.connect = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.stomp.taxiEvents.usr;
        connectHeaders.passcode = $scope.stomp.taxiEvents.pwd;

        $stomp.connect($scope.stomp.taxiEvents.name, $scope.stomp.taxiEvents.url, connectHeaders)
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
        $stomp.disconnect($scope.stomp.taxiEvents.name).then(
            function () {
                console.log('Disconnected');
                growl.warning('Disconnected!');
            });        
    };

    // Subscribe a queue
    var subscribe = function (destination) {
        
        $scope.destination = destination;

        var headers = {};

        $stomp.subscribe($scope.stomp.taxiEvents.name, destination, headers).then(null, null, updateScreen);
    };

    // Unsubscribe a queue
    var unsubscribe = function () {
        $stomp.unsubscribe($scope.stomp.taxiEvents.name, $scope.destination);
        $scope.destination = null;
    };

    $scope.subEventsFrom = function (feature) {
        console.log("Subscribe Events From Feature " + feature);
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
        $scope.stomp = {};
        $scope.stomp.taxiEvents = {};

        $scope.stomp.taxiEvents.url = 'http://127.0.0.1:9210/stomp';
        $scope.stomp.taxiEvents.usr = 'guest';
        $scope.stomp.taxiEvents.pwd = 'guest';
        $scope.stomp.taxiEvents.name = 'TaxiEvents';

/*
        var connectHeaders = {};
        connectHeaders.login = $scope.model.usr;
        connectHeaders.passcode = $scope.model.pwd;

        $stomp.connect('http://127.0.0.1:9410/stomp', connectHeaders)
            .then(function (frame) {
                
                growl.success('Connected!');
                console.log('Connected: ' + frame);
                sub("/topic/topdropoff");
                
            })
            .catch(function(reason) {

                growl.error('Connection error:' + reason);
                console.error('Connection error:', reason);

            });

        var sub = function (destination) {
            
            $scope.destination = destination;

            var headers = {};

            $stomp.subscribe(destination, headers).then(null, null, updateMap);
        };

        var updateMap = function (res) {

            var payload = JSON.parse(JSON.parse(res.body).payload);
            console.log(JSON.stringify(payload.toplist));
            
            $scope.districtRank = payload.toplist;

               
        };
*/
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


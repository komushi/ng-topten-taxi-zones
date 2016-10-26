var app = angular.module('ngTopTenTaxiZonesApp');

app.controller('tokyo23TaxiEventsController', ['$scope', '$stomp', 'growl',
    function($scope, $stomp, growl){

    // Connect
    $scope.connect = function () {
        connectTaxiEvents();

        connectDropoffDistricts();
    };

    // Disconnect
    $scope.disconnect = function () {
        disconnectTaxiEvents();

        disconnectDropoffDistricts();
    };

    // Connect to TaxtEvents WebSocket/Stomp Server
    var connectTaxiEvents = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.stomp.taxiEvents.usr;
        connectHeaders.passcode = $scope.stomp.taxiEvents.pwd;

        $stomp.connect($scope.stomp.taxiEvents.name, $scope.stomp.taxiEvents.url, connectHeaders)
            .then(function (frame) {
                growl.success($scope.stomp.taxiEvents.name + ' connected!');
                console.log($scope.stomp.taxiEvents.url + ' connected: ' + frame);
            })
            .catch(function(reason) {
                growl.error($scope.stomp.taxiEvents.name + ' connection error:' + reason);
                console.error($scope.stomp.taxiEvents.url + ' connection error:', reason);
            });
    };

    // Disconnect From TaxtEvents WebSocket/Stomp Server
    var disconnectTaxiEvents = function () {
        $stomp.disconnect($scope.stomp.taxiEvents.name).then(
            function () {
                console.log('Disconnected from ' + $scope.stomp.taxiEvents.url);
                growl.warning($scope.stomp.taxiEvents.name + ' disconnected!');
            }); 
    };

    $scope.subTaxiEventsFrom = function (feature) {
        console.log("Subscribe events from Feature " + feature);

        $scope.stomp.taxiEvents.destination = "/topic/" + feature;

        var headers = {};

        $stomp.subscribe($scope.stomp.taxiEvents.name, $scope.stomp.taxiEvents.destination, headers)
            .then(null, null, sendTaxiEventsToD3);
    };

    $scope.unsubTaxiEvents = function () {
        // unsubscribe();

        $stomp.unsubscribe($scope.stomp.taxiEvents.name, $scope.stomp.taxiEvents.destination);
        $scope.stomp.taxiEvents.destination = null;
    };


    // notify callback function
    var sendTaxiEventsToD3 = function (res) {

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
    
    // Connect to DropoffDistricts WebSocket/Stomp Server
    var connectDropoffDistricts = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.stomp.dropoffDistrict.usr;
        connectHeaders.passcode = $scope.stomp.dropoffDistrict.pwd;

        $stomp.connect($scope.stomp.dropoffDistrict.name, $scope.stomp.dropoffDistrict.url, connectHeaders)
            .then(function (frame) {
                growl.success($scope.stomp.dropoffDistrict.name + ' connected!');
                console.log($scope.stomp.dropoffDistrict.url + ' connected: ' + frame);

                subDropoffDistricts();
            })
            .catch(function(reason) {
                growl.error($scope.stomp.dropoffDistrict.name + ' connection error:' + reason);
                console.error($scope.stomp.dropoffDistrict.url + ' connection error:', reason);
            });
    };

    var subDropoffDistricts = function () {
        console.log("Subscribe events from " + $scope.stomp.dropoffDistrict.destination);

        var headers = {};

        $stomp.subscribe($scope.stomp.dropoffDistrict.name, $scope.stomp.dropoffDistrict.destination, headers)
            .then(null, null, sendDropoffDistrictsToD3);
    };

    // notify callback function
    var sendDropoffDistrictsToD3 = function (res) {

        var payload = JSON.parse(JSON.parse(res.body).payload);
        // console.log(JSON.stringify(payload.toplist));
        
        $scope.districtRank = payload.toplist;
    };

    // Disconnect From DropoffDistricts WebSocket/Stomp Server
    var disconnectDropoffDistricts = function () {
        $stomp.disconnect($scope.stomp.dropoffDistrict.name).then(
            function () {
                console.log('Disconnected from ' + $scope.stomp.dropoffDistrict.url);
                growl.warning($scope.stomp.dropoffDistrict.name + ' disconnected!');
            }); 
    };


    var initialize = function () {
        $scope.stomp = {};
        $scope.stomp.taxiEvents = {};

        $scope.stomp.taxiEvents.url = 'http://127.0.0.1:9210/stomp';
        $scope.stomp.taxiEvents.usr = 'guest';
        $scope.stomp.taxiEvents.pwd = 'guest';
        $scope.stomp.taxiEvents.name = 'TaxiEvents';
        $scope.stomp.taxiEvents.destination = null;

        $scope.stomp.dropoffDistrict = {};
        $scope.stomp.dropoffDistrict.url = 'http://127.0.0.1:9410/stomp';
        $scope.stomp.dropoffDistrict.usr = 'guest';
        $scope.stomp.dropoffDistrict.pwd = 'guest';
        $scope.stomp.dropoffDistrict.name = 'DropoffDistricts';
        $scope.stomp.dropoffDistrict.destination = '/topic/topdropoff';
    };

    initialize();

}]);


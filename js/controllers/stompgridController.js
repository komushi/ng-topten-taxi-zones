var colorPalette2 = function (level) {

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

var colorPalette = function (level) {

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

app.controller('stompgridController', ['$scope', '$stomp', function($scope, $stomp){

    $scope.connect = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.model.usr;
        connectHeaders.passcode = $scope.model.pwd;

        $stomp.connect($scope.model.url, connectHeaders)
            .then(function (frame) {
                console.log('Connected: ' + frame);

                subscribe();
            })
            .catch(function(reason) {
                console.error('Connection error:', reason);

            });
    };

    // Disconnect
    $scope.disconnect = function () {
        $stomp.connect().then(
            function () {
                console.log('Disconnected');
            });        
    };
    

    // Subscribe a queue
    var subscribe = function () {
        
        var headers = {};

        $stomp.subscribe($scope.model.subdest, headers).then(null,null,updateGrid);
    };

    // Unsubscribe a queue
    var unsubscribe = function () {
        $stomp.unsubscribe($scope.model.subdest);
    };

    // notify callback function
    var updateGrid = function (res) {
        // console.log('res');
        // console.log(res.headers);
        
        //$scope.model.rowCollection.push(JSON.parse(res.body));

        console.log(JSON.parse(res.body).payload);
        

        $scope.model.rowCollection = JSON.parse(JSON.parse(res.body).payload).toptenlist;

        $scope.gridOptions.rowData = $scope.model.rowCollection;
        $scope.gridOptions.api.setRowData($scope.gridOptions.rowData);

        
    };

    var initialize = function () {
        $scope.model = {}

        // $scope.model.url = 'ws://localhost:61623/';
        $scope.model.url = 'http://127.0.0.1:8888/stomp';
        $scope.model.usr = 'guest';
        // $scope.model.usr = 'admin';
        $scope.model.pwd = 'guest';
        // $scope.model.pwd = 'password';
        $scope.model.subdest = '/topic/topten';
        $scope.model.pubdest = '/topic/dest';
        $scope.model.payload = '{"name":"Tom", "type":"Type0", "sales":50}';
        $scope.model.headers = '{}';

        // setup for ag-grid
        $scope.model.rowCollection = [];

        var columnDefs = [
            {headerName: "Rank", field: "rank"},
            {headerName: "From", field: "from"},
            {headerName: "To", field: "to"},
            {headerName: "Count", field: "count"}
        ];

        $scope.gridOptions = {
            columnDefs: columnDefs,
            rowData: $scope.model.rowCollection,
            onGridReady: function(event) {
                event.api.sizeColumnsToFit();
            },
            getRowStyle: function(params) {
                // return null;
                // console.log(JSON.stringify(params.data));
                var level = getLevel(params.data.rank - 1, $scope.model.rowCollection.length)
                return colorPalette(level);
            }

        };


    };

    initialize();

}]);


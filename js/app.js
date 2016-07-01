agGrid.initialiseAgGridWithAngular1(angular);

var app =  angular.module('ngTopTenTaxiZonesApp', [
	'ngRoute',
	'agGrid',
	'ngStomp'
]);


app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	// $locationProvider.html5Mode(true);
	// $locationProvider.hashPrefix = '#';



	$routeProvider.
		when("/", {redirectTo: '/stompgrid'}).
		when("/stompgrid", {templateUrl: "views/stompgrid.html", controller: "stompgridController"});

}]);

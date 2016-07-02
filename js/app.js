agGrid.initialiseAgGridWithAngular1(angular);

var app =  angular.module('ngTopTenTaxiZonesApp', [
	'ngRoute',
	'agGrid',
	'ngStomp',
	'angular-growl'
]);


app.config(['$routeProvider', '$locationProvider', 'growlProvider', function($routeProvider, $locationProvider, growlProvider) {

	// $locationProvider.html5Mode(true);
	// $locationProvider.hashPrefix = '#';

	growlProvider.globalTimeToLive(5000);
	growlProvider.onlyUniqueMessages(false);


	$routeProvider.
		when("/", {redirectTo: '/stompgrid'}).
		when("/stompgrid", {templateUrl: "views/stompgrid.html", controller: "stompgridController"});

}]);

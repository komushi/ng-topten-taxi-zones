agGrid.initialiseAgGridWithAngular1(angular);

var app =  angular.module('ngTopTenTaxiZonesApp', [
	'ngCookies',
	'ngRoute',
	'agGrid',
	'ngStomp',
	'angular-growl',
	'ngD3matrix',
    'pascalprecht.translate',
    'language-picker',
    'app.services'
]);


app.config(['$routeProvider', '$locationProvider', 'growlProvider', '$translateProvider', '$asyncTranslatorProvider', 
	function($routeProvider, $locationProvider, growlProvider, $translateProvider, $asyncTranslatorProvider) {

	// $locationProvider.html5Mode(true);
	// $locationProvider.hashPrefix = '#';

	// config growl
	growlProvider.globalTimeToLive(5000);
	growlProvider.onlyUniqueMessages(false);

    // config translator
    $translateProvider.useLoader('$asyncTranslator');
    $translateProvider.forceAsyncReload(true);
	// $translateProvider.translations('ja-JP', {
	// 	TITLE: 'Hello',
	// 	FOO: 'This is a paragraph.'
	// });

	$translateProvider.preferredLanguage('ja-JP');


	$routeProvider.
		when("/", {redirectTo: '/stompgrid'}).
		when("/stompgrid", {templateUrl: "views/stompgrid.html", controller: "stompgridController"});

}]);

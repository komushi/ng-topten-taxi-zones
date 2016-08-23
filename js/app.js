agGrid.initialiseAgGridWithAngular1(angular);

var app = angular.module('ngTopTenTaxiZonesApp', [
    'ngCookies',
    'ngRoute',
    'agGrid',
    'ngStomp',
    'angular-growl',
    'ngD3matrix',
    'pascalprecht.translate',
    'language-picker',
    'app.services',
    'ngD3geo'
]);


app.config(['$routeProvider', '$locationProvider', 'growlProvider', '$translateProvider', '$asyncTranslatorProvider',
    function($routeProvider, $locationProvider, growlProvider, $translateProvider, $asyncTranslatorProvider) {

        // $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix = '#';

        // config growl
        growlProvider.globalTimeToLive(3000);
        growlProvider.onlyUniqueMessages(false);
        growlProvider.globalPosition('bottom-left');

        // config translator
        $translateProvider.useLoader('$asyncTranslator');
        $translateProvider.forceAsyncReload(true);
        $translateProvider.translations('ja-JP', {
            Connect: '接続',
            Disconnect: '切断',
            Language: '言語',
            Count: 'カウント',
            Delayed: '遅延',
            stompgrid_title: 'USトップ１０タクシー・ルート',
            top_ten_list: 'トップ１０リスト',
            top_ten_matrix: 'トップ１０マトリックス',
            taxi_events_title: '東京タクシー降車イベント',
            taxi_routes_title: '東京トップ１０タクシー・ルート'
        });

        $translateProvider.translations('en-US', {
            stompgrid_title: 'Top 10 US Taxi Routes',
            top_ten_list: 'Top Ten List',
            top_ten_matrix: 'Top Ten Matrix',
            taxi_events_title: 'Tokyo Taxi Dropoff Events',
            taxi_routes_title: 'Top 10 Tokyo Taxi Routes'
        });

        $translateProvider.preferredLanguage('ja-JP');


        $routeProvider
            .when("/", {
                redirectTo: '/stompgrid'
            })
            .when("/stompgrid", {
                templateUrl: "views/stompgrid.html",
                controller: "stompgridController"
            })
            .when("/tokyo23TaxiEvents", {
                templateUrl: "views/tokyo23TaxiEvents.html",
                controller: "tokyo23TaxiEventsController"
            })
            .when("/tokyo23TopRoutes", {
                templateUrl: "views/tokyo23TopRoutes.html",
                controller: "tokyo23TopRoutesController"
            });
    }
]);

app.controller('mainCtrl', function($scope, $rootScope, $translate, $asyncTranslator) {

    $scope.changeLanguage = function(localeCode) {
        $asyncTranslator.setLocaleCode(localeCode);
        $rootScope.$broadcast('rootScope:localeChanged', localeCode);
    }

    // translation when new language is selected
    $scope.$on('rootScope:localeChanged', function(event, localeCode) {
        if (localeCode) {
            // $asyncTranslator.setViewInfos(viewSummary.viewInfos);
            $translate.use(localeCode);
        }
    });

    // initial translation
    if ($rootScope.localeCode) {
        $translate.use($rootScope.localeCode);
    }

});
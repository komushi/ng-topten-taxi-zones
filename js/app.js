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
        growlProvider.globalTimeToLive(5000);
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
            stompgrid_title: 'リアルタイム・トップ１０タクシー・ゾーン',
            top_ten_list: 'トップ１０リスト',
            top_ten_matrix: 'トップ１０マトリックス'
        });

        $translateProvider.translations('en-US', {
            stompgrid_title: 'Real-time Top 10 Taxi Zones',
            top_ten_list: 'Top Ten List',
            top_ten_matrix: 'Top Ten Matrix'
        });

        $translateProvider.preferredLanguage('en-US');


        $routeProvider
            .when("/", {
                redirectTo: '/stompgrid'
            })
            .when("/stompgrid", {
                templateUrl: "views/stompgrid.html",
                controller: "stompgridController"
            })
            .when("/tokyo23", {
                templateUrl: "views/tokyo23.html",
                controller: "tokyo23Controller"
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
var asyncTranslatorProvider = function() {

  var persistentXInfos = [];
  var xsWithLang = {};

  var asyncTranslatorService = function($rootScope, $cookieStore, $q, dataService) {

    var activateXInfos = this.activateXInfos;

    var xInfoLoaded = function(localeCode, xInfo) {
      var xInfoList = xsWithLang[localeCode];
      if (xInfoList) {
        if (xInfoList.indexOf(xInfo) > -1) {
          return true;
        }
      }
      return false;

    };

    var queryTranslation = function(localeCode, xInfo) {
      var deferred = $q.defer();

      dataService.getTranslationsData(localeCode, xInfo)
        .then(function(translationsData) {

          if (!xsWithLang[localeCode]) {
            xsWithLang[localeCode] = [];
            xsWithLang[localeCode].push(xInfo);
          } else {
            xsWithLang[localeCode].push(xInfo);
          }

          deferred.resolve(translationsData);

        });

      return deferred.promise;
    };

    var queryTranslations = function(localeCode, xInfos) {

      var deferred = $q.defer();

      var promises = [];
      angular.forEach(xInfos, function(xInfo) {
        if (!xInfoLoaded(localeCode, xInfo)) {
          promises.push(
            queryTranslation(localeCode, xInfo)
          );
        }

      });

      $q.all(promises).then(function(data) {
        var length = data.length,
          mergedData = {};

        for (var i = 0; i < length; i++) {
          for (var key in data[i]) {
            mergedData[key] = data[i][key];
          }
        }

        deferred.resolve(mergedData);
      }, function(data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };

    var API = function(options) {
      return queryTranslations(options.key, persistentXInfos);
    };

    API.queryTranslations = queryTranslations;

    API.setXInfos = function(xInfos) {
      persistentXInfos = [];

      angular.forEach(xInfos, function(xInfo) {
        persistentXInfos.push(xInfo);
      });
    };


    API.activateXInfos = activateXInfos;

    API.keepLocaleCode = function() {
      $rootScope.localeCode = $cookieStore.get('localeCode') || "";
    }

    API.setLocaleCode = function(localeCode) {
      $rootScope.localeCode = localeCode;
      $cookieStore.put('localeCode', localeCode);
    }

    API.clearLocaleCode = function() {
      $rootScope.localeCode = "";
      $cookieStore.remove('localeCode');
    };

    return API;
  };

  return {
    activateXInfos: function() {},
    queryTranslations: asyncTranslatorService.queryTranslations,
    $get: ['$rootScope', '$cookieStore', '$q', 'dataService', asyncTranslatorService]
  };
};

services.provider('$asyncTranslator', asyncTranslatorProvider);
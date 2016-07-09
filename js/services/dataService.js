var dataServiceAPI = function($injectHttp, $q) {

  $http = $injectHttp;

  var API = {};

  API.getTranslationsData = function(localeCode, x) {
    var deferred = $q.defer();

    $http({
        method: 'GET',
        url: 'assets/' + x + '.json'
      })
      .success(function(data, status, headers, config) {
        deferred.resolve(data[localeCode]);
      })
      .error(function(data, status, headers, config) {
        // deferred.reject(status + " " + data);
        deferred.resolve();
      });

    return deferred.promise;

  };

  return API;
};

services.factory('dataService', ['$http', '$q', dataServiceAPI]);
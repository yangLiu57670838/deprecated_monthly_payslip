var app = angular.module('myApp', ['ngRoute', 'ngMaterial', 'angularSpinner', 'mgcrea.ngStrap', 'ajoslin.promise-tracker', 'angularMoment', 'ngFileUpload']);

app.run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
   
}]);

app.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('DD MMMM');
    };
});




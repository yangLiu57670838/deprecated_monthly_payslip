app.controller('indexCtrl', ['$scope', '$http', '$interval', '$routeParams', '$location', '$rootScope', '$timeout', 'promiseTracker','$alert', '$q', 'Upload', '$window', function ($scope, $http, $interval, $routeParams, $location, $rootScope, $timeout, promiseTracker, $alert, $q, Upload, $window) {

$scope.showSpinner = false;
$scope.loadingTracker = promiseTracker();
$scope.finalJsonArray = [];
$scope.disableDownload = true;
    
var errorAlert = $alert({title: 'Error!', content: 'Please Enter all fields. Salary should be positive integer. Super should less than or equal to 50%. Pay period should be one month', placement: 'top', type: 'danger', show: false, duration: 10});
    
$scope.calculate = function() {
    console.log('waiting 2 seconds..');
    errorAlert.hide();
    $scope.showSpinner = true;
    beginCount();
  
};
    
function beginCount() {
    var promise = $timeout(function () {
            $scope.showSpinner = false;
            console.log('validating..');
            if(($scope.fname) && ($scope.lname) && ($scope.annualSalary) && (parseInt($scope.superRate) <= 50) && (parseInt($scope.superRate) >= 0) && ($scope.fname.indexOf('%') == -1) && ($scope.lname.indexOf('%') == -1) && ($scope.fname.indexOf('&') == -1) && ($scope.lname.indexOf('&') == -1))
                {
                    $scope.fullname = $scope.fname + ' ' + $scope.lname;
                    $scope.endDate = moment($scope.startDate).add(30, 'day').format('DD MMMM');//adding four weeks, 30 days
                    $scope.payPeriod = moment($scope.startDate).format('DD MMMM') + ' - ' + $scope.endDate;
                    $scope.grossIncome = Math.round(parseInt($scope.annualSalary) / 12).toLocaleString();//round, add comma
                     countIncomeTax(parseInt($scope.annualSalary)).then(function(d){
                         $scope.incomeTax = Math.round(d).toLocaleString();//counting income tax
                         
                         $scope.netIncome = (Math.round(parseInt($scope.annualSalary) / 12) - Math.round(d)).toLocaleString();//counting net income
                         
                         $scope.super = Math.round(Math.round(parseInt($scope.annualSalary) / 12) * parseInt($scope.superRate) / 100).toLocaleString(); //counting super
                         
                         insertTable();//create json data
                     });
                 } 
            else
                {
                    errorAlert.show();
                }
        
            
            

        }, 2000);
        $scope.loadingTracker.addPromise(promise);
};
    
//counting income tax
function countIncomeTax(annualSa) {
    var defer = $q.defer();
    if (annualSa <= 18200)
        {
            var data = 0;
        }
    else if ((annualSa > 18200) && (annualSa <= 37000))
        {
            var data = ((annualSa - 18200) * 0.19) / 12;
        }
    else if ((annualSa > 37000) && (annualSa <= 80000))
        {
            var data = (3572 + ((annualSa - 37000) * 0.325)) / 12;
        }
    else if ((annualSa > 80000) && (annualSa <= 180000))
        {
             var data = (17547 + ((annualSa - 80000) * 0.37)) / 12;
        }
    else
        {
            var data = (54547 + ((annualSa - 180000) * 0.45)) / 12;
        }
    defer.resolve(data);                
    return defer.promise;
}; 
 
//insert into table, create json data
function insertTable() {
    var oneRow = {
        name: $scope.fullname,
        payPeriod: $scope.payPeriod,
        grossIncome: $scope.grossIncome,
        incomeTax: $scope.incomeTax,
        netIncome:  $scope.netIncome,
        super: $scope.super
    };
    $scope.finalJsonArray.push(oneRow);
    $scope.createCSVfile();//create csv with last data
};
    
//create csv
$scope.createCSVfile = function() {
    $scope.disableDownload = false;
    var finalString = JSON.stringify($scope.finalJsonArray); 
    console.log('json string is ', finalString);
    $http.post('/createCSV?finalJsonArray=' + finalString).success(function (data) 
    {
          console.log(data);                 
          $scope.downloadURL = '/' + data;                                                                                                        
    });
};

}]);

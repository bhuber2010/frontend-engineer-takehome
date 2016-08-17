(function() {
    function directive() {
        return {
            templateUrl: 'visualize.data.tpl.html',
            scope: {
              salesTransactionData: "@"
            },
            restrict: 'E',
            controller: ['$scope', 'transformFactory', function($scope, transformFactory) {
                console.log('directive working')

                transformFactory.aggregateNetTotal(transformFactory.employeeTotalsPromise)
                  .then(data => $scope.aggregateNetTotal = data)

                transformFactory.avgNetTotalPerGuestPerEmployee(transformFactory.employeeTotalsPromise)
                  .then(data => {
                    $scope.avgNetTotalPerGuestPerEmployee = data
                    $scope.avgSum = 0;

                    for (var avg in data) {
                      if (data.hasOwnProperty(avg)) {
                        $scope.avgSum += data[avg].amount
                      }
                    }

                  })
            }]
        }
    }

    angular.module('takeHomeApp').directive('visualizeData', directive)
})();

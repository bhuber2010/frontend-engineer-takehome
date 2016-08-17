(function() {
    function factory($http) {
        console.log('factory working')

        let employeeTotalsPromise
        let employeeTotals

        // I did this instead of using the variable set on the controller scope
        // in order to keep the whole thing promisfied easily
        (function setTotals(){
          employeeTotalsPromise = $http.get('SalesTransactions.json')
            .then(response => {
              return employeeTotals = calcPerEmployeeTotals(response.data)
            })
        })()

        // I would use lodash to merge the returned obj into the current employeeTotals
        // this way this function could be called to update totals with more data
        function calcPerEmployeeTotals(transData) {
          const perEmployeeData = {}
          transData.forEach(sale => {
            if (sale.employee) {
              if (perEmployeeData[sale.employee.id]) {
                perEmployeeData[sale.employee.id].net_total += sale.net_total.value
                perEmployeeData[sale.employee.id].guest_count += sale.guest_count
              } else {
                perEmployeeData[sale.employee.id] = {
                  net_total: sale.net_total.value,
                  guest_count: sale.guest_count
                }
              }
            }
          })
          return perEmployeeData
        }

        // I could refactor and combine the below two functions
        // by adding a param for which calc to do
        function aggregateNetTotal(employeeTotals) {
          return employeeTotals.then((emplyTots) => {
            let netTotal = 0
            for (var emply in emplyTots) {
              if (emplyTots.hasOwnProperty(emply)) {
                netTotal += emplyTots[emply].net_total
              }
            }
            console.log("netTotal:", netTotal);
            return netTotal
          })
        }

        function avgNetTotalPerGuestPerEmployee(employeeTotals) {
          return employeeTotals.then((emplyTots) => {
            const avgs = {}
            for (var emply in emplyTots) {
              if (emplyTots.hasOwnProperty(emply)) {
                avgs[emply] = {
                  employee: emply,
                  amount: emplyTots[emply].net_total / emplyTots[emply].guest_count
                }
              }
            }
            console.log("avgs:", avgs);
            return avgs
          })
        }


        return {
          employeeTotalsPromise: employeeTotalsPromise,
          calcPerEmployeeTotals: calcPerEmployeeTotals,
          aggregateNetTotal: aggregateNetTotal,
          avgNetTotalPerGuestPerEmployee: avgNetTotalPerGuestPerEmployee
        };
    }

    angular.module('takeHomeApp').factory('transformFactory', factory)
})();

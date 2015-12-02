'use strict';

angular.module('myApp.view1', ['ngRoute', 'csvParserModule', 'incomeCalculationsModule', 'angular-momentjs'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/view1', {
		templateUrl: 'view1/view1.html',
		controller: 'PaySlipController'
	});
}])

.controller('PaySlipController', ['$scope', 'CsvParser', 'IncomeCalculationService', 'MomentJS', function($scope, csvParser, incomeCalculationService, moment) {

	// Input CSV (Needs to be parsed)
	$scope.csvInput = ''; 
	$scope.payslips = [];

	$scope.submit = function() {
		try {

			// Clear the output and error on every submit.
			$scope.payslips = [];
			$scope.errors = '';

			// Parse the CSV data, and calculate the payslip data for each CSV row.
			var parsedData = csvParser.parse($scope.csvInput);
			for (var i = 0; i < parsedData.length; i++) {
				$scope.payslips.push(calculatePayslipData(parsedData[i], incomeCalculationService, moment));
			}

		} catch (e) {
			
			// Handle any exceptions.  This can be validation error, or runtime error.
			// Simply display it on the screen.
			$scope.errors = e;
		}
	};
}]);

/**
 * This method will calulate the fields required for a payslip using the incomeCalculationService.
 * 
 * @param  data {[object]} This data should be generated using the csvParserModule's parse method.  It should represent a single 
 * @param  {[type]}
 * @return {[type]}
 */
function calculatePayslipData(data, incomeCalculationService, moment) {

	// +1 because the calculation needs to be inclusive.
	var dateDiff = data.startDate.toDate.diff(data.startDate.fromDate, 'Days') + 1;

	// I am making an assumption of current year.  Since no year information is given.
	var numberOfDaysInMonth = parseInt(moment().endOf('month').format('DD'));
	
	// How many % of the month did this person work?
	var monthPortion = dateDiff / numberOfDaysInMonth;

	// Calculate the fields required for a payslip.
	var monthlyTax = incomeCalculationService.calculateMonthlyTax(data.salary, monthPortion);
	var gross = incomeCalculationService.calculateGrossIncome(data.salary, monthPortion);
	var netIncome = incomeCalculationService.calculateNetIncome(data.salary, monthPortion, monthlyTax);
	var monthlySuper = incomeCalculationService.calculateSuper(data.salary, monthPortion, data.superRate / 100);

	// Return an object representing the payslip.
	return {
		firstName: data.firstName,
		lastName: data.lastName,
		payPeriodFrom: data.startDate.fromDate.format('DD MMMM'),
		payPeriodTo: data.startDate.toDate.format('DD MMMM'),
		salary: data.salary,
		gross: gross,
		tax: monthlyTax,
		net: netIncome,
		super: monthlySuper
	};
}
'use strict';
var incomeCalculationsModule = angular.module('incomeCalculationsModule', []);

incomeCalculationsModule.factory('IncomeCalculationService', function(){
	
	/**
	 * A simple array to represent tax tables.
	 * Each object in the array only has 2 attributes, ceiling value for that bracket and the rate for that bracket.
	 * The final bracket has the ceiling of null.
	 *
	 * NOTE: Order matters!
	 */
	var DEFAULT_TAX_TABLE = [
		{
			ceiling: 18200, 
			rate: 0,
		}, {
			ceiling: 37000,
			rate: 0.19,
		},
		{
			ceiling: 80000,
			rate: 0.325
		},
		{
			ceiling: 180000,
			rate: 0.37
		},
		{
			ceiling: null,
			rate: 0.45
		}
	];

	/**
	 * Recursively calculates that tax amount for the salary for the entire year.
	 */
	var calculateTax = function(salary, bracketIndex, prevBracketIndex, taxTable){
		
		var bracket = taxTable[bracketIndex];
		var prevCeiling = 0;
		if (angular.isDefined(prevBracketIndex) && prevBracketIndex !== null){
			prevCeiling = taxTable[prevBracketIndex].ceiling;
		} 
		
		if (bracket.ceiling){
			if (salary > bracket.ceiling){
				 return (bracket.ceiling - prevCeiling) * bracket.rate + calculateTax(salary, bracketIndex+1, bracketIndex, taxTable);
			} else {
				return (salary - prevCeiling) * bracket.rate;
			} 
		} else {
			return (salary - prevCeiling) * bracket.rate;
		}
	};

	return {

		// Calculates the income tax on the salary with the given tax table.  
		// If no tax table is supplied, default is used.
		calculateMonthlyTax : function(salary, monthPortion, taxTable){
			taxTable = taxTable || DEFAULT_TAX_TABLE;
			var annualTaxAmount = calculateTax(salary, 0, null, taxTable);
			return Math.round((annualTaxAmount/12) * monthPortion);
		},

		calculateGrossIncome : function(salary, monthPortion){
			return Math.round(salary * monthPortion / 12);
		},

		calculateNetIncome : function(salary, monthPortion, monthlyTax) {
			var gross = this.calculateGrossIncome(salary, monthPortion);
			return gross - monthlyTax;
		},

		calculateSuper : function(salary, monthPortion, superRate) {
			var gross = this.calculateGrossIncome(salary, monthPortion);
			return Math.round(gross * superRate);
		}
	};

});
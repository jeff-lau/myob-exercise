'use strict';

describe('incomeCalculationsModule', function() {

	var incomeCalculationService;

 	beforeEach(function(){
 		module('incomeCalculationsModule');
 	});

 	beforeEach(inject(function(_IncomeCalculationService_){
 		incomeCalculationService = _IncomeCalculationService_;
 	}));

  describe('income-calculations-service', function(){

  	describe('calculateGrossIncome', function(){
  		it('Calculates the monthly gross income to be 1000 if the salary is 12000 if the full month is worked', function(){

  			var fullMonthGross = incomeCalculationService.calculateGrossIncome(12000, 1);
  			expect(fullMonthGross).toEqual(1000);

  		});

  		it('Calculate partial month gross in come to be 500 if salary is 12000 and only 50% of month worked', function(){
  			var halfMonthGross = incomeCalculationService.calculateGrossIncome(12000, 0.5);
  			expect(halfMonthGross).toEqual(500);
  		});
  	});

  	describe('calculateNetIncome', function(){
  		it('Monthly net income should be 700 if salary is 12000 and tax for the month is 300 if the full month is worked', function(){	
  			var netMonthlyIncome = incomeCalculationService.calculateNetIncome(12000, 1, 300);
  			expect(netMonthlyIncome).toEqual(700);
  		});

  		it('Monthly net income should be 200 if salary is 12000 and tax for the month is 300 if 50% the month is worked', function(){	
  			var netMonthlyIncome = incomeCalculationService.calculateNetIncome(12000, 0.5, 300);
  			expect(netMonthlyIncome).toEqual(200);
  		});
  	});

  	describe('calculateMonthlyTax', function(){
  		it('It should calculate a full month tax amount of 922 on a salary of 60050 using the default tax table', function(){
  			var taxAmount = incomeCalculationService.calculateMonthlyTax(60050, 1);
  			expect(taxAmount).toEqual(922);
  		});

  		it('It should calculate a full month tax amount of 2696 on a salary of 120000 using the default tax table', function(){
  			var taxAmount = incomeCalculationService.calculateMonthlyTax(120000, 1);
  			expect(taxAmount).toEqual(2696);
  		});


  		it('It should calculate a full month tax amount of 2696 on a salary of 120000 using the default tax table', function(){
  			var taxAmount = incomeCalculationService.calculateMonthlyTax(120000, 0.5);
  			expect(taxAmount).toEqual(1348);
  		});

  		it('It should calculate a full month tax amount of 50000 on a salary of 120000 if provided with a tax table for 50% flat rate', function(){
  			var taxAmount = incomeCalculationService.calculateMonthlyTax(120000, 1, [{
  				ceiling: null,
  				rate: 0.5
  			}]);
  			expect(taxAmount).toEqual(5000);
  		});

  	});

	describe('calculateSuper', function(){
		it('should calulate a monthly super of 450 for a salary of 60050 at a super rate of 9%', function(){
			var superAmount = incomeCalculationService.calculateSuper(60050, 1, 0.09);
			expect(superAmount).toEqual(450);
		});

		it('should calulate a monthly super of 900 for a salary of 120000 at a super rate of 9%', function(){
			var superAmount = incomeCalculationService.calculateSuper(120000, 1, 0.09);
			expect(superAmount).toEqual(900);
		});

	});
	

  });
});
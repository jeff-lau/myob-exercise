'use strict';

describe('myApp.view1 module', function() {

    var payslipController;

    var mockCSVParser;
    var scope;

    var mockIncomeCalculationService = {
        calculateMonthlyTax: function() {
            return 100;
        },

        calculateGrossIncome: function() {
            return 100;
        },

        calculateNetIncome: function() {
            return 100;
        },

        calculateSuper: function() {
            return 100;
        }
    };

    beforeEach(module('myApp.view1'));

    beforeEach(function() {
        inject(function($controller, $window, $rootScope) {
   
            scope = $rootScope.$new();

            mockCSVParser = {
                parse: function() {
                    return [{
                        firstName: 'David',
                        lastName: 'Rudd',
                        salary: 60050,
                        superRate: 9,
                        startDate: {
                            fromDate: $window.moment('01 March', 'DD MMMM'),
                            toDate: $window.moment('31 March', 'DD MMMM')
                        }
                    }, {
                        firstName: 'Ryan',
                        lastName: 'Chen',
                        salary: 120000,
                        superRate: 10,
                        startDate: {
                            fromDate: $window.moment('01 March', 'DD MMMM'),
                            toDate: $window.moment('31 March', 'DD MMMM')
                        }
                    }];
                }
            };

            //$provide.value('Csv')

            payslipController = $controller('PaySlipController', {
                $scope: scope,
                CsvParser: mockCSVParser,
                IncomeCalculationService: mockIncomeCalculationService
            });
        });
    });

    describe('PaySlipController', function() {

        it('The controller should be defined', inject(function($controller) {
            expect(payslipController).toBeDefined();
        }));

        it('should on submit generate the payslip data', function(){

            // Initial state should have an empty array of payslips.
            expect(scope.payslips).toBeDefined();
            expect(scope.payslips.length).toEqual(0); 
            
            // on submit
            scope.submit();
            
            // should create an array of payslips. 
            expect(scope.payslips.length).toEqual(2);

            // mockedCSVData
            var mockCSVData = mockCSVParser.parse();


            // verify the generated payslips against the mock data expected.
            for (var i = 0; i < scope.payslips.length; i++){
                var payslip = scope.payslips[i];

                expect(payslip.firstName).toEqual(mockCSVData[i].firstName);
                expect(payslip.lastName).toEqual(mockCSVData[i].lastName);
                expect(payslip.salary).toEqual(mockCSVData[i].salary);
                expect(payslip.gross).toEqual(mockIncomeCalculationService.calculateGrossIncome());
                expect(payslip.tax).toEqual(mockIncomeCalculationService.calculateMonthlyTax());
                expect(payslip.net).toEqual(mockIncomeCalculationService.calculateNetIncome());
                expect(payslip.super).toEqual(mockIncomeCalculationService.calculateSuper());
            }
        });

    });
});
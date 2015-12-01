'use strict';

describe('csvParserModule', function(){

	var csvParser;
	var $window;

	// Load the csvParserModule
	beforeEach(module('csvParserModule'));

	// Inject the service to be tested.
	beforeEach(inject(function(_CsvParser_, _$window_){
 		csvParser = _CsvParser_;
 		$window = _$window_;
 	}));


	describe('CsvParser', function(){

		it('CSVParser should exist', function(){
			expect(csvParser).toBeDefined();
		});

	
		it('parse method should return an empty array if an empty string is passed', function(){

			var output = csvParser.parse('');
			expect(output).toBeDefined();
			expect(output.length).toEqual(0);

		});

		it('Should get an exception if error number of fields in the CSV does not match the number properties in the validating mapper', function(){

			var input = 'a,b,c,d,e,f,g,h,i';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Unexpected number of fields in row - 0');
			}

		});

		it('should when using the default mapper, the parser should throw an exception if the salary is negative', function(){
				var input = 'David,Rudd,-60050,9%,01 March – 31 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - salary value: -60050 in row 0');
			}
		});

		it('should when using the default mapper, throw an exception if the salary is not a number', function(){
				var input = 'David,Rudd,SOME_SALARY,9%,01 March – 31 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - salary value: SOME_SALARY in row 0');
			}
		});


		it('should when using the default mapper, throw an exception if the super rate greater than 50', function(){
				var input = 'David,Rudd,50000,99%,01 March – 31 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - superRate value: 99% in row 0');
			}
		});

		it('should when using the default mapper, throw an exception if the super rate is not in a valid format', function(){
				var input = 'David,Rudd,50000,%99,01 March – 31 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - superRate value: %99 in row 0');
			}
		});


		it('should when using the default mapper, throw an exception if the start date is not in the correct format', function(){
				var input = 'David,Rudd,50000,9%,01 March 31 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - startDate value: 01 March 31 March in row 0');
			}
		});

		it('should when using the default mapper, throw an exception if the start date is not a valid date', function(){
				var input = 'David,Rudd,50000,9%,01 March - 32 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - startDate value: 01 March - 32 March in row 0');
			}
		});

		it('should when using the default mapper, throw an exception if the start date is not before the to date', function(){
				var input = 'David,Rudd,50000,9%,21 March - 01 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - startDate value: 21 March - 01 March in row 0');
			}
		});

		it('should when using the default mapper, throw an exception if the start date and to date is not in the same month', function(){
				var input = 'David,Rudd,50000,9%,01 March - 31 April';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Validation failed for field - startDate value: 01 March - 31 April in row 0');
			}
		});

		it('should throw an exception when a field is empty', function(){
				var input = 'David,Rudd,,9%,01 March - 31 March';
			try {
				csvParser.parse(input);
			} catch(error){
				expect(error).toMatch('Empty value for field salary in row 0');
			}
		});

		it('Should skip empty lines without erroring', function(){
			var input = "David,Rudd,60050,9%,01 March – 31 March\n\n\nRyan,Chen,120000,10%,01 March – 31 March\n\n";
			var output = csvParser.parse(input);

			expect(output).toBeDefined();
			expect(output.length).toEqual(2);
		})

		it('should produce parsed data mapped to the validing mapper when all fields are correct', function(){

			var input = "David,Rudd,60050,9%,01 March – 31 March\nRyan,Chen,120000,10%,01 March – 31 March";
			var output = csvParser.parse(input);

			expect(output).toBeDefined();
			expect(output.length).toEqual(2);

			var expectedOutput = [{
				firstName: 'David',
				lastName: 'Rudd',
				salary: 60050,
				superRate: 9,
				startDate: {
					fromDate: $window.moment('01 March', 'DD MMMM'),
					toDate: $window.moment('31 March', 'DD MMMM')
				}
			},
			{
				firstName: 'Ryan',
				lastName: 'Chen',
				salary: 120000,
				superRate: 10,
				startDate: {
					fromDate: $window.moment('01 March', 'DD MMMM'),
					toDate: $window.moment('31 March', 'DD MMMM')
				}

			}];


			for (var i = 0; i < output.length; i++){
				var parsedRecord = output[i];
				var expectedParsedRecord = expectedOutput[i];

				expect(parsedRecord.firstName).toEqual(expectedParsedRecord.firstName);
				expect(parsedRecord.lastName).toEqual(expectedParsedRecord.lastName);
				expect(parsedRecord.salary).toEqual(expectedParsedRecord.salary);
				expect(parsedRecord.superRate).toEqual(expectedParsedRecord.superRate);
				expect(parsedRecord.startDate).toEqual(expectedParsedRecord.startDate);
			}

		});

	});

});
"use strict";

var NEW_LINE_DELIMITER = '\n';
var CSV_DELIMITER = ',';
var EXPECTED_DATE_FORMAT = 'DD MMMM';


var csvParserModule = angular.module('csvParserModule', []);

/**
 * Service for parsing a CSV String.
 * The CSV String should be be delimited by ',' and new line by '\n'.
 *
 */
csvParserModule.factory('CsvParser', ['$window', function($window) {

	// There seems to be a bug with angular-moments that causes karma to be unable to resolve it in test. 
	// This is a work around without angular-momentum (this normally would be injected.)
	var moment = $window.moment;


	/**
	 * Default object used by the parse method to validate and map a csv row into an object.
	 * The field names in this object will become the field name in the output object.
	 *
	 * The validateFn will be execute on the field value, and exception will be thrown if it returns false.
	 * The mapFn will be execute if the validation parses and the return value will be come the value for the field. 
	 */
	var DEFAULT_VALIDATING_MAPPER = {
		'firstName': {
			validateFn: function(value) {
				return true;
			},
			mapFn: function(value) {
				return value;
			}
		},
		'lastName': {
			validateFn: function(value) {
				return true;
			},
			mapFn: function(value) {
				return value;
			}
		},
		'salary': {
			validateFn: function(value) {
				return value > 0 && isFinite(value);
			},
			mapFn: function(value) {
				return Math.round(value);
			}
		},
		'superRate': {
			/*
			 * Rate must be between 0 - 50% inclusive and must be in the expected format of 'DD%' 
			 */
			validateFn: function(value) {
				var validFormat = /^(\d+)%$/g.test(value);
				if (validFormat) {
					var rateValue = parseInt(/^(\d+)%$/g.exec(value)[1]);
					return rateValue >= 0 && rateValue <= 50;
				}
				return false;
			},
			mapFn: function(value) {
				return parseInt(/^(\d+)%$/g.exec(value));
			}
		},
		'startDate': {
			validateFn: function(value) {
				// First test the field value to ensure its in the expected format.
				var validFormat = /^(\d+\s\w+)\s+\W\s+(\d+\s\w+)$/.test(value);
				if (validFormat) {
					var dateValues = /^(\d+\s\w+)\s+\W\s+(\d+\s\w+)$/.exec(value);
					var fromDate = moment(dateValues[1], EXPECTED_DATE_FORMAT, true);
					var toDate = moment(dateValues[2], EXPECTED_DATE_FORMAT, true);

					// Use moment to parse the dates to ensure it parses.
					if (fromDate.isValid() && toDate.isValid()) {

						// Start month must be the same as end month.
						if (fromDate.month() === toDate.month()) {

							// From Date should be on or before To Date.
							if (fromDate.isSame(toDate) || fromDate.isBefore(toDate)) {
								return true;
							}
						}
					}
				}
				return false;
			},
			mapFn: function(value) {
				var dateValues = /^(\d+\s\w+)\s+\W\s+(\d+\s\w+)$/.exec(value);
				var fromDate = dateValues[1];
				var toDate = dateValues[2];

				var rval = {
					fromDate: moment(fromDate, EXPECTED_DATE_FORMAT),
					toDate: moment(toDate, EXPECTED_DATE_FORMAT)
				};
				return rval;
			}
		}
	};


	return {
		/**
		 *  Parses the CSV into the format defined by the 'suppliedValidatingMapper' param.
		 *  The suppliedValidatingMapper should be an object literal containing a field for EACH field in the CSV.
		 *
		 *  For example a CSV Input String may look like:  "John,40,Unemployed,Unmarried"
		 *  The suppliedValidatingMapper should look something like belowL
		 *
		 * {
		 * 		name: {			// The field name here will be the field name of the returned object..
		 * 			validateFn: // a Function to validate the value that will be given to it 
		 * 			mapFn:  	// a Function that will be invoked when mapping the given value in the returned object.
		 * 		},
		 *
		 * 		age: {
		 * 			validateFn: ..
		 * 			mapFn: ..
		 * 		}
		 * 		
		 * 		employment: {
		 * 			..
		 * 		},
		 * 		
		 * 		marritalStatus: {
		 * 			..
		 * 		}
		 * }
		 * 
		 * @param csvInput  {[String]}
		 * @param suppliedValidatingMapper {[object]}
		 * @return {[object]}
		 */
		parse: function(csvInput, suppliedValidatingMapper) {

			var output = [];

			// Use the default if no other validating mapper is supplied.
			var validatingMapper = suppliedValidatingMapper || DEFAULT_VALIDATING_MAPPER;

			if (csvInput) {

				// The validating mapper provides a 'schema' as well as the validation methods to run on each field.
				// The number of fields in the validatingMapper SHOULD match the number of fields in each row.
				// Note: Object.keys does not look up the prototypal chain, which is what we want.
				var expectedFields = Object.keys(validatingMapper);
				var expectedNumberOfFields = expectedFields.length;

				var rows = csvInput.split(NEW_LINE_DELIMITER);
				for (var i = 0; i < rows.length; i++) {
					var fields = rows[i].split(CSV_DELIMITER);

					// Skip empty lines.
					if (fields.length === 1 && !fields[0]){
						continue;
					}

					// Make sure we have the right number of fields in each row.
					if (fields.length != expectedNumberOfFields) {
						throw "Unexpected number of fields in row - " + i;
					}

					// Run through the validation provided in the validatingMapper for each field.
					var fieldIndex = 0;
					var parsedObject = {};
					for (var y = 0; y < expectedFields.length; y++) {

						// The actual field value.
						var value = fields[y];

						// This is the field name.
						var field = expectedFields[y];

						// If value is undefined or "" throw an exception.
						if (!value) {
							throw "Empty value for field " + field + " in row " + i;
						}

						// Array of validations functions provided for this field.
						var validateFn = validatingMapper[field].validateFn;

						// Validate the value if the validate function exist.
						if (validateFn && !validateFn(value)) {
							throw "Validation failed for field - " + field + " value: " + value + " in row " + i;
						}

						// Map the value.
						parsedObject[field] = validatingMapper[field].mapFn(value);
					}

					output.push(parsedObject);
				}
			}

			return output;
		}
	};
}]);
## Assumptions:

1. No need to take into account public holidays.
2. No internationalisations required, ignoring any timezone and localization issues.
3. No file based input (i.e. no need to upload a CSV file) 
4. Start date can be partial months (i.e. it can start on any day and end on any day of the month) 
5. Since year information is not provided in the input data, I am assuming is CURRENT year when carrying out partial month calculations
6. I have to assume the person reviewing this exercise have NPM installed, and possibly an internet connection to download any missing dependencies.
7. I have not tested all browsers or mobile. 


## Notes:

The project scaffolding is simply pulled from a public git repo - https://github.com/angular/angular-seed
I am just momentjs (a 3rd part js lib) to handle date calculations.



## Running the application

This is a angular web app.  To start the http-server just run 'NPM start' that will start serving up the Single Page App at port 8000.
You should then be able to access it in your browser (I used chrome/firefox) via this URL:  http://localhost:8000/app/index.html
From there theres a textarea, just copy and paste your CSV data into there and click on the submit button to generate the payslips.


## Tests
I provided 2 levels of automated tests, unit testing and end to end testing

### Unit Testing
Unit tests are provided for 3 javascript files (csvParserModule,js, view1.js, incomeCalculationModule.js), the tests are written using the Jasmine library and run using Karma.  The test file are named <file_name>_test.js, and they just sit in the same directory as the file being tested.

To run the unit test simple type 'NPM Test'
That should download any missing dependencies and run all the unit tests.

### End to End Test
End to End test specs are in e2e-tests/scenarios.js.  Its once again written using the Jasmine library. The end to end test, is run by Protractor which basically uses selenium webdrivers to actually drive a browser to manipulate the DOM.
Various error and valid scenarios are covered.
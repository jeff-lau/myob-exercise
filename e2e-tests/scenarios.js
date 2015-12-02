'use strict';

describe('my app', function() {

  var inputTextArea;
  var errorDiv;
  var submitButton;
  var payslipDiv;

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/view1');
      inputTextArea = by.css('div.input-container textarea');
      errorDiv = by.css('div.errors');
      submitButton = by.css('button.submit-button');
      payslipDiv = by.css('.payslip-container div.payslip');

       // Clearing the text area input.
      element(inputTextArea).clear();

      // Check to ensure the errors are cleared.
      expect(element(errorDiv).getText()).toEqual('');
    });


    it('should render myob exercise app when user navigates to /view1', function() {
      expect(element.all(by.css('div.heading')).first().getText()).
        toMatch(/Payslip Generator/);
    });

    it ('should produce an error when invalid data is supplied', function(){
      // input some invalid csv input.
      element(inputTextArea).sendKeys('invaliddata!!');

      // Submit the invalid input.
      element(submitButton).click();

      // Check the error to see if the valid error message appears.
      expect(element(errorDiv).getText()).toEqual('Unexpected number of fields in row - 0');
      
    });


    it ('should produce an error when start date is invalid', function(){
      element(inputTextArea).sendKeys('David,Rudd,60050,9%,01 March – 32 March');
      element(submitButton).click();
      expect(element(errorDiv).getText()).toEqual('Validation failed for field - startDate value: 01 March – 32 March in row 0');
      
    });


    it ('should produce an error when super rate is invalid', function(){
      element(inputTextArea).sendKeys('David,Rudd,60050,100%,01 March – 31 March');
      element(submitButton).click();
      expect(element(errorDiv).getText()).toEqual('Validation failed for field - superRate value: 100% in row 0');      
    });


    it ('should produce an error when there are empty elements', function(){
      element(inputTextArea).sendKeys('David,Rudd,,100%,01 March – 31 March');
      element(submitButton).click();
      expect(element(errorDiv).getText()).toEqual('Empty value for field salary in row 0');      
    });


    it ('should produce an error when salary value is invalid', function(){
      element(inputTextArea).sendKeys('David,Rudd,asdfkasdfk,100%,01 March – 31 March');
      element(submitButton).click();
      expect(element(errorDiv).getText()).toEqual('Validation failed for field - salary value: asdfkasdfk in row 0');      
    });


    it('should not produce any payslip when the user clicks on the submit button and there are no input data', function(){

      // click submit button.
      element(by.css('button.submit-button')).click();

      // check that no output is produced.
      expect(element(errorDiv).getText()).toEqual('');

      // check that no payslips are producted
      var payslips = element.all(payslipDiv);
      expect(payslips.count()).toEqual(0);
    });


    it('product 2 payslip when 2 rows of valid input data is provided', function(){

      element(inputTextArea).sendKeys("David,Rudd,60050,9%,01 March – 31 March\nRyan,Chen,120000,10%,01 March – 31 March")
      element(by.css('button.submit-button')).click();
      var payslips = element.all(payslipDiv);

      // Check the payslips generated.
      expect(payslips.count()).toEqual(2);
      expect(payslips.get(0).getText()).toEqual('David Rudd,01 March – 31 March,5004,922,4082,450');
      expect(payslips.get(1).getText()).toEqual('Ryan Chen,01 March – 31 March,10000,2696,7304,1000');
    });

  });

});

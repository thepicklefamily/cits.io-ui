
// casper.test.begin('Hello, Test!', 1, function(test) {
//   test.assert(true);
//   test.done();
// });



casper.test.begin('Testing Amazon Search and Results pages', 1, function(test) {
  casper.start('http://amazon.com', function() {
    this.fill('form.nav-searchbar', {
      'field-keywords': 'javascript'
    }, true);
  });

  casper.then(function() {
    test.assertTitle('Amazon.com: javascript', 'Amazon search results page has the correct title');
  });

  casper.run(function() {
    test.done();
  });
});


    // document.querySelector('[name=login]').click();
    // this.clickLabel('Go to Login');

  // casper.then(function () {
  //   casper.evaluate(function(username, password) {
  //     document.querySelector('input[name=username]').value = username;
  //     document.querySelector('input[name=username]').value = password;
  //     this.clickLabel('Submit');
  // }, 'MrTest', 'test');
  // });
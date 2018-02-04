
casper.test.begin('Testing Log-In', 1, function(test) {
  casper.start('http://localhost:3000/', function() {
  });

  casper.then(function() {
    casper.click(document.getElementById("login"));
  });

  casper.then(function() {
    test.assertDoesntExist('.loginn','Login Button Is not on the page anymore because you are logged in');
  });

  casper.run(function() {
    test.done();
  });
});
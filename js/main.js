(function () {
  //console.log("Test");
  var form = document.querySelector('form');
  var date = document.querySelector('#txtDate');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log(date.value);
  });

})();

(function () {
  //console.log("Test");
  let form = document.querySelector('form');
  let jsonTodo ;
  let isDirty = false;

  // first ajax call to the php to get the existing todos from todos.json
  $.ajax({
    url: "todos.php",
    type: 'GET',
    dataType: 'json',
    success: readAndRefreshTodos,
    error: todoError
  });

  function readAndRefreshTodos(todos) {
    jsonTodo = JSON.parse(todos);
    let todosSection = document.querySelector('.panel-body');
    todosSection.innerHTML = "";
    // Mark the document dirty so it can be ready to be written back when its needed
    isDirty = true;
    // loop thru all the todos in the todos list
    jsonTodo.todos.forEach( function (todo, index) {
      let todoTemplate =
      `<div class="media" data-id="${todo.id}">
          <div class="media-left">
            <a href="#">
              <i class="fa fa-3x fa-check" aria-hidden="true"></i>
            </a>
          </div>
          <div class="media-body">
            <h4 class="media-heading">${todo.title}</h4>
            <p>${todo.message}</p>
          </div>
          <div class="media-right">
          <a href="#">
            <i class="fa fa-2x fa-times" aria-hidden="true"></i>
          </a>
          </div>
        </div>`;
        todosSection.innerHTML += todoTemplate;
      console.log(jsonTodo);
    });

  }

  function todoError(err) {
    // keep this just for debug
    // TODO: delete this in the production if this project ever make it to production haha
    console.log(err);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    // check that jsonTodo is finished the ajax call or not
    if(isDirty) {
      // create a new javasciprt object that contains all of the relevent info and push
      // it to the existing json todos array
      let tempJson = {
          id : jsonTodo.todos.length,
          title: document.querySelector('#txtTitle').value,
          message : document.querySelector('#txtMessage').value,
          date : document.querySelector('#txtDate').value,
          isCompleted : false
      };
      jsonTodo.todos.push(tempJson);

      // make a post call to todos.php for saving the new todo just added to the list
      $.ajax({
        url: "todos.php",
        type: "POST",
        dataType : "json",
        data: {
                todos: jsonTodo
            },
        success: readAndRefreshTodos,
        error: todoError
      });
      // reset the form fields to it can be ready for the next todo entry
      form.reset();
      console.log(jsonTodo);
    }

  });

})();

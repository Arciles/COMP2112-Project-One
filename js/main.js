(function () {
  //console.log("Test");
  let form = document.querySelector('form');
  let jsonTodo;
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
    // chek jsonTodo if it's emty or not
    // display nothing to see message if it's emty
    console.log(jsonTodo);
    if (jsonTodo == null) {
      let nothingToSee = `<h3>There is no TO-DO to display</h3>`;
      todosSection.innerHTML = nothingToSee;
      isDirty = true;
    } else {
      // Mark the document dirty so it can be ready to be written back when its needed
      isDirty = true;
      // loop thru all the todos in the todos list
      jsonTodo.todos.forEach( function (todo, index) {
        //console.log(todo);

        // check todo is completed or not based on that add the crossed class
        // TODO: change this if you can find a more elegant way to do it
        let todoTemplate;
        if (todo.isCompleted == "true") {
          todoTemplate =
          `<div class="media" data-id="${todo.id}">
              <div class="media-left">
                <a href="#">
                  <i class="fa fa-3x fa-check" aria-hidden="true"></i>
                </a>
              </div>
              <div class="media-body">
                <h4 class="media-heading crossed">${todo.title}</h4>
                <p class="crossed">${todo.message}</p>
              </div>
              <div class="media-right">
              <a href="#">
                <i class="fa fa-2x fa-times" aria-hidden="true"></i>
              </a>
              </div>
            </div>`;

        } else {
          todoTemplate =
          `<div class="media" data-id="${todo.id}">
              <div class="media-left">
                <a href="#">
                  <i class="fa fa-3x fa-chevron-right" aria-hidden="true"></i>
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
        }
        todosSection.innerHTML += todoTemplate;
      });
        markTodos();
        deleteTodo();
    } // end of else statement
  }

  function markTodos() {
    var completedLinks = document.querySelectorAll('.media-left a');
    //console.log(completedLinks);
    completedLinks.forEach(function (todoMedia) {
      todoMedia.addEventListener('click', function (event) {
          let anchor = event.target;
          //console.log(anchor.parentElement.parentElement.parentElement);

          // TODO: not a good practive find more elegant way to do it
          let todoID = anchor.parentElement.parentElement.parentElement.getAttribute('data-id');
          //console.log(" this is supposed to be the ids" + todoID);
          // loop through the array the find the object contains the id
          // and change to is completed based on the first state of the variable
          jsonTodo.todos.forEach(function (todo) {
            if(todo.id == todoID) {
              todo.isCompleted = todo.isCompleted != "true";
            }
          });
          // make an ajax call to save the data to the json file
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

      }); // end of click listener
    }); // end of forEach
}

function deleteTodo() {
  var deleteLinks = document.querySelectorAll('.media-right a');
  //console.log(completedLinks);
  deleteLinks.forEach(function (todoMedia) {
    todoMedia.addEventListener('click', function (event) {
        let anchor = event.target;
        //console.log(anchor.parentElement.parentElement.parentElement);

        // TODO: not a good practive find more elegant way to do it
        let todoID = anchor.parentElement.parentElement.parentElement.getAttribute('data-id');
        //console.log(" this is supposed to be the ids" + todoID);
        // loop through the array the find the object contains the id
        // and change to is completed based on the first state of the variable
        jsonTodo.todos.forEach(function (todo, index) {
          if(todo.id == todoID) {
            jsonTodo.todos.splice(index, 1);
            console.log(jsonTodo);
          }
        });
        // make an ajax call to save the data to the json file
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

    }); // end of click listener
  }); // end of forEach
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
          id : (jsonTodo == null) ? 0 : jsonTodo.todos.length,
          title: document.querySelector('#txtTitle').value,
          message : document.querySelector('#txtMessage').value,
          date : document.querySelector('#txtDate').value,
          isCompleted : false
      };
      if (jsonTodo == null) {
        jsonTodo = {todos:[]};
      }
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

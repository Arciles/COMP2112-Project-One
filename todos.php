<?php

// get the request method
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
  case "POST":
    $json = json_encode($_POST['todos']);
    file_put_contents('todos.json', $json);
    break;
  case "DELETE":
  // it's redundant now but in the future this part can be customized to DELETE
  // the recors from database or something
    $json = json_encode($_POST['todos']);
    file_put_contents('todos.json', $json);
  break;
}
   // copy file content into a string var.
   $json_file = file_get_contents('todos.json');
   // convert the string to a json object.
   // test the json coming from file
   //var_dump($json);

   echo json_encode($json_file);

?>

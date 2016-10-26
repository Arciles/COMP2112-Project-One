<?php

 if (!empty($_POST['todos'])) {
    $json = json_encode($_POST['todos']);
    file_put_contents('todos.json', $json);
 }
   // copy file content into a string var.
   $json_file = file_get_contents('todos.json');
   // convert the string to a json object.
   // test the json coming from file
   //var_dump($json);

   echo json_encode($json_file);

?>

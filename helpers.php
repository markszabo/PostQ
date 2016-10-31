<?php

function loginhelper($conn, $username, $password) {
  // prepare, bind and execute
  $stmt = $conn->prepare("SELECT password, privatekey FROM users WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  if ($stmt->errno)
    return "Error during the execution of the SQL query";

  //get the result
  $stmt->bind_result($db_password, $privatekey);

  if(!$stmt->fetch())
    return "Incorrect username";

  if(password_verify($password,$db_password)) {
    return "1".$privatekey;
    $stmt->close();
  } else {
    return "Incorrect password";
    $stmt->close();
  }
}

function userExists($conn, $username) {
  // prepare, bind and execute
  $stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  if ($stmt->errno)
    return "Error during the execution of the SQL query";

  //get the result
  $stmt->bind_result($db_username);

  if(!$stmt->fetch())
    return False; //user does not exist
    
  return True; //user exists
}

function getUserId($conn, $username) {
  // prepare, bind and execute
  $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  if ($stmt->errno)
    return "Error during the execution of the SQL query";

  //get the result
  $stmt->bind_result($userid);

  if(!$stmt->fetch())
    return "Error - user does not exist";
    
  return $userid; //user exists
}

?>

<?php
//Usage: getNewRequests.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_GET['username'], $_GET['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");
  
// prepare, bind and execute
$stmt = $conn->prepare("SELECT friendrequests.user1, friendrequests.user2, friendrequests.symkey FROM friendrequests, users WHERE friendrequests.user1 = users.id AND users.username = ?");
$stmt->bind_param("s", $_GET['username']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($user1, $user2, $symkey);

while($stmt->fetch())
  echo $user1 . "," . $user2 . "," . $symkey . "\n";
?>

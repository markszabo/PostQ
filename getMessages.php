<?php
//Usage: getMessages.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&user2Id=5
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'] || !$_GET['user2Id'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_GET['username'], $_GET['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");
  
$userId = getUserId($conn, $_GET['username']);
// prepare, bind and execute
$stmt = $conn->prepare("SELECT messages, user1 FROM messages WHERE (messages.user1 = ? AND  messages.user2 = ?) OR (messages.user2 = ? AND  messages.user1 = ?) ORDER BY time ASC"); 
$stmt->bind_param("iiii", $userId, $_GET['user2Id'], $userId, $_GET['user2Id']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($message, $user1);

while($stmt->fetch()) {
  if($user1 === $userId)
    echo "1" . $message . "\n";
  else
    echo "0" . $message . "\n";
  }
?>

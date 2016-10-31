<?php
//Usage: sendMsg.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&user2Id=5&msg=iExmLmGEgXVDPfGjI%2=
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'] || !$_GET['user2Id'] || !$_GET['msg'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_GET['username'], $_GET['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");

$userId = getUserId($conn, $_GET['username']);
// prepare, bind and execute
$stmt = $conn->prepare("INSERT INTO messages (user1, user2, messages) VALUES (?, ?, ?)"); 
$stmt->bind_param("iis", $userId, $_GET['user2Id'], $_GET['msg']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query");

echo "1";
?>

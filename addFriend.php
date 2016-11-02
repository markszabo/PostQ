<?php
//Usage: addFriend.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&friend=test@test.com&symkeyforme=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&symkeyforfriend=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'] || !$_GET['friend'] || !$_GET['symkeyforme'] || !$_GET['symkeyforfriend'])
  die("Error - one of the parameters is not set.");

if($_GET['username'] === $_GET['friend'])
  die("Error - you can not add yourself as a friend.");
  
//check password
if(!(substr(loginhelper($conn, $_GET['username'], $_GET['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Error - authentication failed");

//check if friend exists
$userexists = userExists($conn, $_GET['friend']);
if($userexists === False)
  die("Error - choosen friend does not exists");
if(substr($userexists,0,5) === "Error") 
  die($userexists);

//get user IDs
$userId = getUserId($conn, $_GET['username']);
$friendId = getUserId($conn, $_GET['friend']);

//check if you are already friends
$stmt = $conn->prepare("SELECT user1 FROM symkeys WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)");
$stmt->bind_param("iiii", $userId, $friendId, $friendId, $userId);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 3");
$stmt->bind_result($db_user1);
if($stmt->fetch())
  die("Error - You are already friends");

//add my new symkey
$stmt = $conn->prepare("INSERT INTO symkeys (user1, user2, symkey) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $userId, $friendId, $_GET['symkeyforme']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 1");

//add friend's new symkey
$stmt = $conn->prepare("INSERT INTO friendrequests (user1, user2, symkey) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $friendId, $userId, $_GET['symkeyforfriend']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 2");

echo "1";

$stmt->close();
$conn->close();
?>

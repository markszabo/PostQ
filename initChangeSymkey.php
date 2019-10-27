<?php

//Usage: initChangeSymkey.php
//   username=email@adfs.hu
//   password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
//   friend=test@test.com
//   symkeyforme=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
//   symkeyforfriend=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D

require_once("helpers.php");
require_once("sqlconnect.php");

if(!$_POST['username'] || !$_POST['password'] || !$_POST['friend'] || !$_POST['symkeyforme'] || !$_POST['symkeyforfriend'])
  die("Error - one of the parameters is not set.");

if($_POST['username'] === $_POST['friend'])
  die("Error - you can not create keys to yourself.");

//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Error - authentication failed");

//check if friend exists
$userexists = userExists($conn, $_POST['friend']);
if($userexists === False)
  die("Error - choosen friend does not exists");
if(substr($userexists,0,5) === "Error") 
  die($userexists);

//get user IDs
$userId = getUserId($conn, $_POST['username']);
$friendId = getUserId($conn, $_POST['friend']);

//check if there is a symkey request from other user OR user already requested simkey but not accepted OR user requested friendship but not yet accepted
//(these conditions could mess the negotiation)
$stmt = $conn->prepare("SELECT (SELECT count(*) FROM symkeyrequests WHERE (useridTO = ? AND useridFROM = ?) OR (useridTO = ? AND useridFROM = ?)) + (SELECT COUNT(*) FROM friendrequests WHERE useridFROM = ? AND useridTO = ?) AS total");
$stmt->bind_param("iiiiii",$userId, $friendId, $friendId, $userId, $userId, $friendId);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query - 5");
$stmt->bind_result($num_requests);
if($stmt->fetch()){ //get results
  if ($num_requests !== 0){
    die("Error - There is a secret code negotiation pending... Waiting acceptance. " );
  }
} else {
  die("Error - during the execution of the SQL query - 4" );
}
$stmt->close();

//delete older messages (they are encrypted with old symkey and could not be decrypted again)
$stmt = $conn->prepare("DELETE FROM messages WHERE user1 = ? AND user2 = ?");
$stmt->bind_param("ii", $userId, $friendId);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query - 3");

//add my new symkey
$stmt = $conn->prepare("UPDATE symkeys SET symkey = ? WHERE user1 = ? AND user2  = ?");
$stmt->bind_param("sii", $_POST['symkeyforme'], $userId, $friendId);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query - 2");

//add friend's new symkey
$stmt = $conn->prepare("INSERT INTO symkeyrequests (useridTO, useridFROM, usernameFROM, symkey) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $friendId, $userId, $_POST['username'], $_POST['symkeyforfriend']);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query - 1");

echo "1";

$stmt->close();
$conn->close();
?>

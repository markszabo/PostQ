<?php

//Usage: acceptRequest.php
//   username=test@test.com
//   password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
//   friendId=5
//   symkeyforme=iExmLmGEgXVDPfGw%3D%3D

require_once("helpers.php");
require_once("sqlconnect.php");

if(!$_POST['username'] || !$_POST['password'] || !$_POST['friendId'] || !$_POST['symkeyforme'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");

$userId = getUserId($conn, $_POST['username']);
//delete request
$stmt = $conn->prepare("DELETE FROM symkeyrequests WHERE useridTO = ? AND useridFROM = ?");
$stmt->bind_param("ii", $userId, $_POST['friendId']);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query - 3");

if($conn->affected_rows !== 1)
  die("Error - not existing symkey request");

//delete older messages
$stmt = $conn->prepare("DELETE FROM messages WHERE user1 = ? AND user2 = ?");
$stmt->bind_param("ii", $userId, $friendId);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query - 2");


//add my new symkey
$stmt = $conn->prepare("UPDATE symkeys SET symkey = ? WHERE  user1 = ? AND user2  = ?");
$stmt->bind_param("sii", $_POST['symkeyforme'], $userId, $_POST['friendId'] );
$stmt->execute();
if($stmt->errno) {
  die("Error during the execution of the SQL query - 1");
}

echo "1";

$stmt->close();
$conn->close();
?>

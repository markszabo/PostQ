<?php
//Usage: acceptRequest.php?username=test@test.com&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&friendId=5&symkeyforme=iExmLmGEgXVDPfGw%3D%3D
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'] || !$_GET['friendId'] || !$_GET['symkeyforme'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_GET['username'], $_GET['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");

$userId = getUserId($conn, $_GET['username']);
//delete request
$stmt = $conn->prepare("DELETE FROM friendrequests WHERE user1 = ? AND user2 = ?");
$stmt->bind_param("ii", $userId, $_GET['friendId']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 3");

if($conn->affected_rows !== 1)
  die("Error - not existing friend requests");

//add my new symkey
$stmt = $conn->prepare("INSERT INTO symkeys (user1, user2, symkey) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $userId, $_GET['friendId'], $_GET['symkeyforme']);
$stmt->execute();
if ($stmt->errno) {
    die("Error during the execution of the SQL query - 4");
}

echo "1";

$stmt->close();
$conn->close();
?>

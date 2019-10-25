<?php
 
//Usage: rejectRequest.php
//    username=test@test.com
//    password=iExmLmGEgXVDPfGjI/k5Iw==
//    friendId=5

require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_POST['username'] || !$_POST['password'] || !$_POST['friendId'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");

$userId = getUserId($conn, $_POST['username']);
//delete request
$stmt = $conn->prepare("DELETE FROM friendrequests WHERE useridTO = ? AND useridFROM = ?");
$stmt->bind_param("ii", $userId, $_POST['friendId']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 3");

if($conn->affected_rows !== 1)
  die("Error - not existing friend requests");

$stmt = $conn->prepare("DELETE FROM symkeys WHERE user1 = ? AND user2 = ?");
$stmt->bind_param("ii", $_POST['friendId'], $userId);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 3");

echo "1";

$stmt->close();
$conn->close();
?>

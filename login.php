<?php
//Usage: login.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
include_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'])
  die("Error - one of the parameters is not set.");

// prepare, bind and execute
$stmt = $conn->prepare("SELECT password, privatekey FROM users WHERE username = ?");
$stmt->bind_param("s", $_GET['username']);
$stmt->execute();
if ($stmt->errno)
    die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($password, $privatekey);

if(!$stmt->fetch())
  die("Incorrect username");

if(password_verify($_GET['password'],$password))
  echo "1".$privatekey;
else
  echo "Incorrect password";

$stmt->close();
$conn->close();
?>

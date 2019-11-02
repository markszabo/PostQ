<?php

//Usage: getSymkeyRequests.php
//    username=email@adfs.hu
//    password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D

require_once("helpers.php");
require_once("sqlconnect.php");

if(!$_POST['username'] || !$_POST['password'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");

// prepare, bind and execute
$stmt = $conn->prepare("SELECT sk.useridTO, sk.useridFROM, sk.usernameFROM, sk.symkey FROM symkeyrequests AS sk, users WHERE sk.useridTO = users.id AND users.username = ? ORDER BY sk.id DESC");
$stmt->bind_param("s", $_POST['username']);
$stmt->execute();
if($stmt->errno)
  die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($useridTO, $useridFROM, $usernameFROM, $symkey);

while($stmt->fetch())
  echo $useridTO . "," . $useridFROM . "," . $usernameFROM . "," . $symkey . "\n"; //Problem if usernames allow comma!!! Add verification!
?>

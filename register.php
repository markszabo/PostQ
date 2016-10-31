<?php
//Usage: register.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&privatekey=privatekey880Ll66NrAEvD4hs85x2qA%3D%3D&publickey=publickey
include_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'] || !$_GET['privatekey'] || !$_GET['publickey'])
  die("Error - one of the parameters is not set.");

// prepare, bind and execute
$stmt = $conn->prepare("INSERT INTO users (username, password, privatekey, publickey) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $_GET['username'], password_hash($_GET['password'], PASSWORD_BCRYPT), $_GET['privatekey'], $_GET['publickey']);
$stmt->execute();
if ($stmt->errno) {
    die("Error during the execution of the SQL query");
}

echo "1";

$stmt->close();
$conn->close();
?>

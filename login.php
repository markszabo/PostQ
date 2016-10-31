<?php
//Usage: login.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
include_once("helpers.php");
require_once("sqlconnect.php");
if(!$_GET['username'] || !$_GET['password'])
  die("Error - one of the parameters is not set.");

echo loginhelper($conn, $_GET['username'], $_GET['password']);
?>

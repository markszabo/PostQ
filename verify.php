<?php

//Usage: verify.php?code=aba1ebd72d7889a6

require_once("sqlconnect.php");
include_once("helpers.php");

if(!$_GET['code']) {
  die("Error - one of the parameters is not set.");
}

echo verifyHelper($conn, $_GET['code']);

?>

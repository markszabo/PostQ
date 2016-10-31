<?php
include_once("sqlconfig.php");
// Create connection
$conn = new mysqli($sqlservername, $sqlusername, $sqlpassword, $sqldbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

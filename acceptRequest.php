<?php
/*
 * Anna Dorottya Simon, Márk Szabó
 * Neptun-ID: R48G73, EMX74N
 * Applied cryptography project - a postquantum messenger application
 * January 2017
 * This solution was submitted and prepared by Anna Dorottya Simon(R48G73), Márk Szabó(EMX74N) for the project assignment of the Applied cryptography project seminar course.
 * We declare that this solution is our own work.
 * We have put the necessary references wherever we have used bigger and/or complicated external codes in our project. For shorter code snippets (usually from Stack Overflow) we have put the reference there in most cases.
 * Given the uniqueness of the project (no other student had, have or will have the same project) we have published our code on GitHub with the permission of our professors.
 * Students’ regulation of Eötvös Loránd University (ELTE Regulations Vol. II. 74/C. § ) states that as long as a student presents another student’s work - or at least the significant part of it - as his/her own performance, it will count as a disciplinary fault. The most serious consequence of a disciplinary fault can be dismissal of the student from the University.
 */
 
//Usage: acceptRequest.php?username=test@test.com&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&friendId=5&symkeyforme=iExmLmGEgXVDPfGw%3D%3D
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_POST['username'] || !$_POST['password'] || !$_POST['friendId'] || !$_POST['symkeyforme'])
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

//add my new symkey
$stmt = $conn->prepare("INSERT INTO symkeys (user1, user2, symkey) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $userId, $_POST['friendId'], $_POST['symkeyforme']);
$stmt->execute();
if ($stmt->errno) {
    die("Error during the execution of the SQL query - 4");
}

echo "1";

$stmt->close();
$conn->close();
?>

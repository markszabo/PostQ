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
 
//Usage: addFriend.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&friend=test@test.com&symkeyforme=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D&symkeyforfriend=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_POST['username'] || !$_POST['password'] || !$_POST['friend'] || !$_POST['symkeyforme'] || !$_POST['symkeyforfriend'])
  die("Error - one of the parameters is not set.");

if($_POST['username'] === $_POST['friend'])
  die("Error - you can not add yourself as a friend.");
  
//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Error - authentication failed");

//check if friend exists
$userexists = userExists($conn, $_POST['friend']);
if($userexists === False)
  die("Error - choosen friend does not exists");
if(substr($userexists,0,5) === "Error") 
  die($userexists);

//get user IDs
$userId = getUserId($conn, $_POST['username']);
$friendId = getUserId($conn, $_POST['friend']);

//check if you are already friends
$stmt = $conn->prepare("SELECT user1 FROM symkeys WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)");
$stmt->bind_param("iiii", $userId, $friendId, $friendId, $userId);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 3");
$stmt->bind_result($db_user1);
if($stmt->fetch())
  die("Error - You are already friends");

//add my new symkey
$stmt = $conn->prepare("INSERT INTO symkeys (user1, user2, symkey) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $userId, $friendId, $_POST['symkeyforme']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 1");

//add friend's new symkey
$stmt = $conn->prepare("INSERT INTO friendrequests (useridTO, useridFROM, usernameFROM, symkey) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $friendId, $userId, $_POST['username'], $_POST['symkeyforfriend']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query - 2");

echo "1";

$stmt->close();
$conn->close();
?>

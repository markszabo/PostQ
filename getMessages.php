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
 
//Usage: getMessages.php
//       POST username: email@adfs.hu
//            password: iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
//            user2Id:  5

require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_POST['username'] || !$_POST['password'] || !$_POST['user2Id'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");
  
$userId = getUserId($conn, $_POST['username']);
// prepare, bind and execute
$stmt = $conn->prepare("SELECT messages, user1 FROM messages WHERE (messages.user1 = ? AND  messages.user2 = ?) OR (messages.user2 = ? AND  messages.user1 = ?) ORDER BY time ASC"); 
$stmt->bind_param("iiii", $userId, $_POST['user2Id'], $userId, $_POST['user2Id']);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($message, $user1);

while($stmt->fetch()) {
  if($user1 === $userId)
    echo "1" . $message . "\n";
  else
    echo "0" . $message . "\n";
  }
?>

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

//Usage: register.php
//       POST username:   email@adfs.hu
//            password:   iExmLmGEgXVDPfGjI%2Fk5Iw==
//            privatekey: privatekey880Ll66NrAEvD4hs85x2qA==
//            publickey:  publickey

include_once("sqlconnect.php");
include_once("helpers.php");
include_once("mail_config.php");

if(!$_POST['username'] || !$_POST['password'] || !$_POST['privatekey'] || !$_POST['publickey'])
  die("Error - one of the parameters is not set.");

//check if user already exists
if(userExists($conn, $_POST['username']))
  die("Error - user already exists. Try to login instead.");

if($use_mail_registration) {
  //Check if username is valid email address
  if(!filter_var($_POST['username'], FILTER_VALIDATE_EMAIL)){
    die("Error - Username must be a valid e-mail");
  }

  // Remove previous registration that is unverified
  $stmt = $conn->prepare("DELETE FROM unverified_users WHERE username=?");
  $stmt->bind_param("s", $_POST['username']);
  $stmt->execute();
  if($stmt->errno) {
      die("Error during the execution of the SQL query");
  }
  $stmt->close();

  // Insert new registration in unverified_users table
  $stmt = $conn->prepare("INSERT INTO unverified_users (username, password, privatekey, publickey, registrationcode, expires) VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?))");
  $code=bin2hex(random_bytes(16));
  $expires=time()+$expiration_time;
  $stmt->bind_param("sssssi", $_POST['username'], password_hash($_POST['password'], PASSWORD_BCRYPT), $_POST['privatekey'], base64_decode($_POST['publickey']), $code, $expires);
  $stmt->execute();
  if($stmt->errno) {
      die("Error during the execution of the SQL query");
  }

  //mail( to,  subject,  message,  headers );
  $s = mail($_POST['username'],
       $mail_subject,
       str_replace("<registration_code/>", $code,  $mail_message),
       $mail_headers);
  if($s)
    exit("2"); //registration mail sent sucessfull
  else
    die("Error sending mail");
}

// If not using mail registration, add directly to users table
$stmt = $conn->prepare("INSERT INTO users (username, password, privatekey, publickey) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $_POST['username'], password_hash($_POST['password'], PASSWORD_BCRYPT), $_POST['privatekey'], base64_decode($_POST['publickey']));
$stmt->execute();
if($stmt->errno) {
    die("Error during the execution of the SQL query");
}

echo "1";

$stmt->close();
$conn->close();
?>

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
 
echo "<h1>PostQ Installation script</h1>";
if(!include("sqlconfig.php")) die("sqlconfig.php could not be found. Please create it!");

echo "Creating the database and tables<br><pre>";
$command = "mysql -u{$sqlusername} -p{$sqlpassword} -h {$sqlservername} < database_setup.sql 2>&1";
echo(shell_exec($command)); //Source: http://stackoverflow.com/a/4028289
echo "</pre>If no error can be seen above, the installation was successful. <a href='index.php'>Click here.</a>";
?>

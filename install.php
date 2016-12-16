<?php
echo "<h1>PostQ Installation script</h1>";
if(!include("sqlconfig.php")) die("sqlconfig.php could not be found. Please create it!");

echo "Creating the database and tables<br><pre>";
$command = "mysql -u{$sqlusername} -p{$sqlpassword} -h {$sqlservername} < database_setup.sql 2>&1";
echo(shell_exec($command)); //Source: http://stackoverflow.com/a/4028289
echo "</pre>If no error can be seen above, the installation was successful. <a href='index.php'>Click here.</a>";
?>

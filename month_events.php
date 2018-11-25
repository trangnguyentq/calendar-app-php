<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$month = htmlentities($_GET['month']+1);
$year = htmlentities($_GET['year']);
$first = htmlentities($_GET['first']);
$last = htmlentities($_GET['last']);
$low_bound = $year.'-'.$month.'-'.'01 00:00:00';
$upper_bound = $year.'-'.$month.'-'.$last.' 23:59:59';


$list = array();
$stmt = $mysqli->prepare("select time from events where time >= ? and time <= ? and username = ?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('sss',$low_bound, $upper_bound, $username);
$stmt->execute();
 
$stmt->bind_result($result);

while ($stmt->fetch()){
	$list[] = substr($result, 8,2);

}

echo json_encode(array(
	"success" => true,
	"message" => "Event added!",
	"list" => $list


	));


?>
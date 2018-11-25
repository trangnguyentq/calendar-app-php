<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$month = htmlentities($_GET['month']);
$year = htmlentities($_GET['year']);
$date = htmlentities($_GET['date']);


$low_bound = $year.'-'.$month.'-'.$date.' 00:00:00';
$upper_bound = $year.'-'.$month.'-'.$date.' 23:59:59';


$list = array();
$stmt = $mysqli->prepare("select time, title, tag, shared_by from events where time >= ? and time <= ? and username = ? order by time");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('sss',$low_bound, $upper_bound, $username);
$stmt->execute();
 
$stmt->bind_result($time, $title, $tag, $shared_by);

while ($stmt->fetch()){
	$list[] = array("time" => htmlentities(substr($time, 11, 8)), "title" => htmlentities($title), "tag" => htmlentities($tag), "shared_by" => htmlentities($shared_by));

}

echo json_encode(array(
	"success" => true,

	"list" => $list


	));


?>
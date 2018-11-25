<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$month = htmlentities($_GET['month']);
$year = htmlentities($_GET['year']);
$date = htmlentities($_GET['date']);
$tag = htmlentities($_GET['tag']);


$low_bound = $year.'-'.$month.'-'.$date.' 00:00:00';
$upper_bound = $year.'-'.$month.'-'.$date.' 23:59:59';


$list = array();
$stmt = $mysqli->prepare("select time, title, shared_by from events where time >= ? and time <= ? and username = ? and tag = ? order by time");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('ssss',$low_bound, $upper_bound, $username, $tag);
$stmt->execute();
 
$stmt->bind_result($time, $title, $shared_by);

while ($stmt->fetch()){
	$list[] = array("time" => htmlentities(substr($time, 11, 8)), "title" => htmlentities($title), "tag" => htmlentities($tag), "shared_by" => htmlentities($shared_by));

}

echo json_encode(array(
	"success" => true,

	"list" => $list


	));


?>
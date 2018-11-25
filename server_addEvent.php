<?php 

require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$date = htmlentities($_POST['date']);
$time = htmlentities($_POST['time']);
$tag = rawurldecode($_POST['tag']);
$title = rawurldecode($_POST['title']);


if($_SESSION['token'] !== $_POST['token']){
	die("Request forgery detected");
}

if (!preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $time)){
	echo json_encode(array(
		"success" => false,
		"message" => "Wrong time format."
		));
	exit;
}

if(preg_match("/^[\w\d\s.,-]+$/", $title)===0){
	echo json_encode(array(
		"success" => false,
		"message" => "Title contains invalid characters."
		));
	exit;
} 

$datetime = $date." ".$time.":00";

$stmt = $mysqli->prepare("select id from events where username=? and title =? and time=? and tag=?");

$stmt->bind_param('ssss', $username, $title, $datetime, $tag);
$stmt->execute();
 
$stmt->bind_result($result);

if ($stmt->fetch()){
	echo json_encode(array(
		"success" => false,
		"message" => "Event already existed!"
		));
	exit;
	
}



$stmt = $mysqli->prepare("insert into events (username, title, time, tag) values (?,?,?,?)");


if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('ssss', $username, $title, $datetime, $tag);
$stmt->execute();
echo json_encode(array(
		"success" => true,
		"message" => "Event added!"
		));






?>
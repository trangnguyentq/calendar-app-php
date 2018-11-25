<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$time = htmlentities($_POST['time']);

$title = htmlentities($_POST['title']);
$new_time = htmlentities($_POST['new_time']);
$new_title = rawurldecode($_POST['new_title']);
$new_just_time = htmlentities($_POST['new_just_time']);
$new_tag = htmlentities($_POST['new_tag']);

if($_SESSION['token'] !== $_POST['token']){
	die("Request forgery detected");
}
if (!preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $new_just_time)){
	echo json_encode(array(
		"success" => false,
		"message" => "Wrong time format."
		));
	exit;
}

if(preg_match("/^[\w\d\s.,-]+$/", $new_title)===0){
	echo json_encode(array(
		"success" => false,
		"message" => "Title contains invalid characters."
		));
	exit;
} 

$stmt = $mysqli->prepare("update events set time = ?, title = ?, tag = ? where  username = ? and time = ? and title = ?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('ssssss',$new_time, $new_title, $new_tag, $username, $time, $title);
$stmt->execute();

echo json_encode(array(
	"success" => true
	


	));

?>
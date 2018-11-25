<?php 

require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$time = $_POST['time'];

$title = $_POST['title'];

if($_SESSION['token'] !== $_POST['token']){
	die("Request forgery detected");
}

$stmt = $mysqli->prepare("delete from events where time = ? and title = ? and username = ?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('sss',$time, $title, $username);
$stmt->execute();

echo json_encode(array(
	"success" => true
	


	));

?>
<?php 

require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$shared_by = $_SESSION['username'];
$username = htmlentities($_POST['new_participant']);
$time = htmlentities($_POST['time']);
$tag = rawurldecode($_POST['tag']);
$title = rawurldecode($_POST['title']);


if($_SESSION['token'] !== $_POST['token']){
	die("Request forgery detected");
}

$incorrect_user = true;
$stmt = $mysqli->prepare("select username from users");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}


    
$stmt->execute();
$stmt->bind_result($usern);
	//check id the user exits
while($stmt->fetch()) {
    if ($username == $usern) {
        $incorrect_user = false;
    }   
}




if ($incorrect_user){
	echo json_encode(array(
		"success" => false,
		"message" => "Username not found."
		));
	exit;
	
}

$stmt = $mysqli->prepare("insert into events (username, title, time, tag, shared_by) values (?,?,?,?,?)");


if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('sssss', $username, $title, $time, $tag, $shared_by);
$stmt->execute();
echo json_encode(array(
		"success" => true,
		"message" => "New participant added!"
		));






?>
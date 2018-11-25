<?php 

require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];
$share_to = htmlentities($_POST['share_user']);

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
    if ($share_to == $usern) {
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

$stmt = $mysqli->prepare("insert into share (user, share_to) values (?,?)");


if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('ss', $username, $share_to);
$stmt->execute();
echo json_encode(array(
		"success" => true,
		"message" => "Calendar has been shared!"
		));






?>
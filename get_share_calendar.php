<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$user_view = htmlentities($_POST['user_view']);
$username = $_SESSION['username'];

if($_SESSION['token'] !== $_POST['token']){
	die("Request forgery detected");
}

$stmt = $mysqli->prepare("select user from share where share_to=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
 
$stmt->bind_result($result);


while ($stmt->fetch()){
    if ($result == $user_view) {
        echo json_encode(array(
        	"success" => true,
        	"message" => "User found."
        	));
        exit;
    }
	
}

echo json_encode(array(
    "success" => false,
    "message" => "User does not share calendar with you."
));
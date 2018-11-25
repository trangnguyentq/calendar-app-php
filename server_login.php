<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = htmlentities($_POST['username']);
$password = htmlentities($_POST['password']);

if (!isValid($username)){
	echo json_encode(array(
		"success" => false,
		"message" => "Input contains invalid characters."
		));
	exit;
}

$stmt = $mysqli->prepare("select username, password from users where username=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "Query failed."
		));
	exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
 
$stmt->bind_result($r_username, $r_password);

if (!$stmt->fetch()){
	echo json_encode(array(
		"success" => false,
		"message" => "Username not found."
		));
} else {
	if (crypt($password, $r_password)!=$r_password){
	echo json_encode(array(
		"success" => false,
		"message" => "Wrong password."

		));
	} else {
		$_SESSION['username'] = $username;
		$_SESSION['token'] = substr(md5(rand()), 0, 10);
		
		echo json_encode(array(
		"success" => true,
		"username" => htmlentities($username),
		"token" => htmlentities($_SESSION['token'])
			));
	}
}





?>
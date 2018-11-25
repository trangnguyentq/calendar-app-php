<?php 
require 'database.php';
require 'functions.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = htmlentities($_POST['username']);
if (!isValid($username)){
	echo json_encode(array(
		"success" => false,
		"message" => "Input contains invalid characters."
		));
	exit;
}

$stmt = $mysqli->prepare("select username from users where username=?");
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


if ($stmt->fetch()){
	echo json_encode(array(
		"success" => false,
		"message" => "Username not available."
		));
	exit;
	
}






	$password = $_POST['password'];
	$retype_password = $_POST['retype_password'];
	if (!isValid($password)){
		echo json_encode(array(
		"success" => false,
		"message" => "Password contains invalid characters."
		));
		exit;
	}
	else if ($password!= $retype_password){
		echo json_encode(array(
		"success" => false,
		"message" => "Retyped password does not match."
		));
		exit;
	} else {
		$crypted_password = crypt($password);
		$stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
		$stmt->bind_param('ss', $username, $crypted_password);
		$stmt->execute();

		//$stmt->close();
		echo json_encode(array(
		"success" => true,
		"message" => "Signup successful!"
		));
	





	}



?>
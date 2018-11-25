<?php
ini_set("session.cookie_httponly", 1);
session_start();
if (isset($_SESSION['username'])){
	$_SESSION['token'] = substr(md5(rand()), 0, 10);
	echo json_encode(array(
		"logged" => true,
		"username" => htmlentities($_SESSION['username']),
		"token" => htmlentities($_SESSION['token'])
		));
} else {
	echo json_encode(array(
		"logged" => false,
		"username" => ""
		
		));
}


?>
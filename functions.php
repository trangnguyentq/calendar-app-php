<?php 
	function isValid($name){
	if( preg_match('/^[\w_\.\-]+$/', $name) ){
		return true;
	} else {
		return false;
	}

}

?>
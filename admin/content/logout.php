<?php
include "connexion_bd.php";
	session_start();
	session_destroy();
	header("Location:".$baseURL."/login");
?>
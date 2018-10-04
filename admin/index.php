<?php
	
	$baseURL=dirname($_SERVER['SCRIPT_NAME']);
	if (!isset($_GET['p']) || $_GET['p'] =="")
		$page = "home";
	
	else{
		
		if(!file_exists("content/".$_GET['p'].".php"))
			$page = "404";
		else
			$page = $_GET['p'];
	}
		
	

	ob_start(); // Arrete l'affichage
	include "content/{$page}.php";
	$content = ob_get_contents();
	ob_end_clean(); // relance l'affichage
	
	include "layout.php";

?>
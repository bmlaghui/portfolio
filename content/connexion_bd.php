<?php 
	try//connexion à la bdd
	{
		$bdd = new PDO("mysql:host=localhost;dbname=portfolio; charset=utf8","root","");
	}
	catch(Exception $e)
	{
		die("bdd non trouvée");
	}
?>
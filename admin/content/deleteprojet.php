<?php
echo "aa";
require_once 'content/connexion_bd.php';
$id_projet=$_GET['id'];
$reqDelCat=$bdd->query("delete from portfolio_projet where id_projet=".$id_projet);
if($reqDelCat) header('Location: '.$baseURL.'/projets'); 
?>

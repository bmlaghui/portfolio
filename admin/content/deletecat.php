<?php
echo "aa";
require_once 'content/connexion_bd.php';
$id_categorie=$_GET['id'];
$reqDelCat=$bdd->query("delete from portfolio_categorie where id_categorie=".$id_categorie);
if($reqDelCat) header('Location: '.$baseURL.'/categories'); var_dump($reqDelCat);

?>

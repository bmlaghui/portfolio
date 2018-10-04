<?php
require_once 'content/connexion_bd.php';
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <h4 class="page-title">Ajouter une catégorie</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <form method="post">
                            <div class="form-group">
                                <label>Libellé</label>
                                <input class="form-control" type="text" name="lib_categorie">
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                <label>Abbréviation</label>
                                <input class="form-control" type="text" name="abbreviation_categorie">
                            </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                <label>Note</label>
                                <input class="form-control" type="text" name="note_categorie" placeholder="Note sur 1 ">
                            </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea cols="30" rows="6" class="form-control" name="description_categorie"></textarea>
                            </div>
                            
                            
                            <div class="m-t-20 text-center">
                                <input class="btn btn-primary btn-lg" type="submit" name="valider" value="Ajouter" />
                            </div>
                        </form>
                        <?php
						if(isset($_POST['valider']))
						{
							$reqAddCat=$bdd->query("insert into portfolio_categorie(lib_categorie,abbreviation_categorie,note_categorie,description_categorie,etat_categorie) values('".$_POST['lib_categorie']."','".$_POST['abbreviation_categorie']."','".$_POST['note_categorie']."','".$_POST['description_categorie']."',0)");
if($reqAddCat) header('Location: categories');
	}
							
							?>
                    </div>
                </div>
            </div>
            
        </div>
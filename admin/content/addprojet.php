<?php
require_once 'content/connexion_bd.php';
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <h4 class="page-title">Ajouter un projet</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <form method="post">
                            <div class="form-group">
                                <label>Libellé</label>
                                <input class="form-control" type="text" name="lib_projet">
                            </div>
                            
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Client</label>
                                        <select class="select" name="id_client">
                                            <option>-----------</option>
                                            <?php
											$reqClients=$bdd->query("select * from portfolio_client");
											while($Clients=$reqClients->fetch())
											{
												echo "<option value=".$Clients['id_client'].">".$Clients['raison_sociale_client']."</option>";
												}
											?>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Catégorie</label>
                                        <select class="select" name="id_categorie">
                                            <option>-----------</option>
                                            <?php
											$reqCategories=$bdd->query("select * from portfolio_categorie");
											while($Categorie=$reqCategories->fetch())
											{
												echo "<option value=".$Categorie['id_categorie'].">".$Categorie['lib_categorie']."</option>";
												}
											?>                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>URL</label>
                                <div class="input-group">
                                            <span class="input-group-addon">https://</span>
                                            <input type="text" class="form-control" name="url_projet">
                                        </div>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea cols="30" rows="6" class="form-control" name="description_projet"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Date </label>
                                <div class="cal-icon">
                                    <input class="form-control datetimepicker" type="text" name="date_projet">
                                </div>
                            </div>
                            <div class="form-group">
                                    <label class="control-label col-lg-2">Technologies</label>
                                    <div class="col-lg-10">
                                        <div class="checkbox">
                                        <?php
										$reqTechnologies = $bdd->query("select * from portfolio_technologie");
										$Technologies=$reqTechnologies->fetchALL();
										foreach($Technologies as $Technologie)
										{
										?>
                                            <label>
                                                <input type="checkbox" name="id_technologie[]" value="<?= $Technologie['id_technologie']; ?>"><?= $Technologie['lib_technologie']; ?>
                                            </label>
                                            <?php } ?>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            <div class="m-t-20 text-center">
                                <input class="btn btn-primary btn-lg" type="submit" name="valider" value="Ajouter" />
                            </div>
                            
                        </form>
                        <?php
						if(isset($_POST['valider']))
						{
							$reqAddProjet=$bdd->query("insert into portfolio_projet(lib_projet,id_client,id_categorie,url_projet,description_projet,date_projet) values('".$_POST['lib_projet']."',".$_POST['id_client'].",".$_POST['id_categorie'].",'".$_POST['url_projet']."','".$_POST['description_projet']."',".$_POST['date_projet'].")");
							$reqidprojet=$bdd->query("select max(id_projet) as id_projet from portfolio_projet");
							$projet=$reqidprojet->fetch();
							foreach(($_POST['id_technologie']) as $id_technologie)
							{
								$reqAddPrTech=$bdd->query("insert into portfolio_projet_technologie(id_projet,id_technologie) values(".$projet['id_projet'].",".$id_technologie.")");
								}
if($reqAddProjet && $reqAddPrTech) header('Location: projets');

	}
	
							
							?>
                    </div>
                </div>
            </div>
            
        </div>
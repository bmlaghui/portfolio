<?php
require_once 'content/connexion_bd.php';
$id_projet=$_GET['id'];
$reqProjet=$bdd->query("select * from portfolio_projet where id_projet=".$id_projet);
$projet=$reqProjet->fetch();
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <h4 class="page-title">Modifier un projet</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <form method="post">
                            <div class="form-group">
                                <label>Libellé</label>
                                <input class="form-control" type="text" name="lib_projet" value="<?= $projet['lib_projet']; ?>">
                            </div>
                            
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Client</label>
                                        <select class="select" name="id_client">
                                            <?php
											$Reqidclient=$bdd->query("select c.*,p.* from portfolio_client c, portfolio_projet p where p.id_client=c.id_client and p.id_projet=".$id_projet);
											$client=$Reqidclient->fetch(); 
											?>
                                            <option value="<?=$client['id_client']; ?>"><?=$client['raison_sociale_client']; ?>
                                            
                                            </option>
                                            <?php
											$reqClients=$bdd->query("select * from portfolio_client where id_client <>".$client['id_client']);
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
                                             <?php
											$Reqidcategorie=$bdd->query("select c.*,p.* from portfolio_categorie c, portfolio_projet p where p.id_categorie=c.id_categorie and p.id_projet=".$id_projet);
											$categorie=$Reqidcategorie->fetch(); 
											?>
                                            <option value="<?=$categorie['id_categorie']; ?>"><?=$categorie['lib_categorie']; ?>
                                            
                                            </option>
                                            <?php
											
											$reqCategories=$bdd->query("select * from portfolio_categorie where id_categorie <>".$categorie['id_categorie']);
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
                                            <input type="text" class="form-control" name="url_projet" value="<?= $projet['url_projet']; ?>">
                                        </div>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea cols="30" rows="6" class="form-control" name="description_projet" value="<?= $projet['description_projet']; ?>"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Date </label>
                                <div class="cal-icon">
                                    <input class="form-control datetimepicker" type="text" name="date_projet" value="<?= $projet['date_projet']; ?>" placeholder="<?= $projet['date_projet']; ?>" >
                                </div>
                            </div>
                            <div class="form-group">
                                    <label class="control-label col-lg-2">Technologies</label>
                                    <div class="col-lg-10">
                                        <div class="checkbox">
                                        <?php
                                        $ReqTechnos=$bdd->query("select pt.*,p.*,t.* from portfolio_projet_technologie pt, portfolio_technologie t, portfolio_projet p where p.id_projet=pt.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet);
											
											while ($Tech=$ReqTechnos->fetch())
											{
												?>
                                             <label>
                                                <input type="checkbox" name="id_technologie[]" value="<?= $Tech['id_technologie']; ?>" checked="checked"><?= $Tech['lib_technologie']; ?>
                                            </label>
                                            <?php
											}
											?>
                                        <?php
										$reqTechnologies = $bdd->query("select * from portfolio_technologie where id_technologie NOT IN (select id_technologie from portfolio_projet_technologie where id_projet=".$id_projet.")");
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
                                <input class="btn btn-primary btn-lg" type="submit" name="valider" value="Modifier" />
                            </div>
                            
                        </form>
                        <?php
						if(isset($_POST['valider']))
						{
							$reqUpdateProjet=$bdd->query("update portfolio_projet set lib_projet= '".$_POST['lib_projet']."'							,id_client = ".$_POST['id_client'].",id_categorie = ".$_POST['id_categorie'].",url_projet = '".$_POST['url_projet']."',description_projet='".$_POST['description_projet']."',date_projet  = ".$_POST['date_projet']." where id_projet=".$id_projet);
							$reqDeleteTechnoProjet=$bdd->query("delete from portfolio_projet_technologie where id_projet=".$id_projet);
							foreach(($_POST['id_technologie']) as $id_technologie){
								
								
								$reqAddPrTech=$bdd->query("insert into portfolio_projet_technologie(id_projet,id_technologie) values(".$id_projet.",".$id_technologie.")");							}
if(($reqUpdateProjet) && $reqDeleteTechnoProjet && $reqAddPrTech ) header('Location: '.$baseURL.'projets');

	}
	
							
							?>
                    </div>
                </div>
            </div>
            
        </div>
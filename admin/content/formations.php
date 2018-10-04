<?php
require_once 'content/connexion_bd.php';
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                <div class="row">
                    <div class="col-xs-8">
                        <h4 class="page-title">Mes formations</h4>
                    </div>
                    <div class="col-xs-4 text-right m-b-30">
                        <a class="btn btn-primary rounded pull-right" href="addformation"><i class="fa fa-plus"></i> Ajouter formation</a>
                    </div>
                </div>
                <div class="row">
                <?php
			$ReqFormations=$bdd->query("select f.*,i.* from portfolio_formation f, portfolio_institut i where i.id_institut=f.id_institut order by f.annee_debut_formation,f.ordre_formation");
			$Formations=$ReqFormations->fetchALL();
			foreach ($Formations as $Formation)
			{
			
					?>
                    <div class="col-sm-6 col-md-6 col-lg-4">
                        <div class="blog grid-blog">
                            <div class="blog-image">
                                <a href="formation/<?=$Formation['id_formation']; ?>"><img class="img-responsive" src="../<?= $Formation['photo_institut'] ?>" alt=""></a>
                            </div>
                            <div class="blog-content">
                                <h3 class="blog-title"><a href=""><?= $Formation['lib_formation']; ?></a></h3>
                                 <a  class="read-more"><i class="fa fa-info" aria-hidden="true"></i> <?= $Formation['description_formation']; ?></a>
                                <p><?= $Formation['lib_institut']; ?></p>
                               
                                <div class="blog-info clearfix">
                                    <div class="post-left">
                                        <ul>
                                            <li><a href="#."><i class="fa fa-calendar" aria-hidden="true"></i> <span><?= $Formation['annee_debut_formation'];?>  <?php
					 if($Formation['annee_fin_formation']==NULL)
					 echo " - Aujourd'hui";
					 elseif ($Formation['annee_debut_formation'] != $Formation['annee_fin_formation'])
					 echo " - ".$Formation['annee_fin_formation'];?></span></a></li>
                                        </ul>
                                    </div>
                                    <div class="post-right"><a href="updateformation/<?= $Formation['id_formation']; ?>" ><i class="fa fa-pencil" aria-hidden="true"></i>Modifier</a>  <a href="deleteformation/<?= $Formation['id_formation']; ?>"><i class="fa fa-trash" aria-hidden="true"></i>Supprimer</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
			}
			?>                  
                </div>
            </div>
            
        </div>
         <script type="text/javascript" src="assets/js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="assets/js/jquery.slimscroll.js"></script>
    <script type="text/javascript" src="assets/js/app.js"></script>
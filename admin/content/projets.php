<?php
require_once 'content/connexion_bd.php';
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                <div class="row">
                    <div class="col-xs-8">
                        <h4 class="page-title">Mes projets</h4>
                    </div>
                    <div class="col-xs-4 text-right m-b-30">
                        <a class="btn btn-primary rounded pull-right" href="addprojet"><i class="fa fa-plus"></i> Ajouter projet</a>
                    </div>
                </div>
                <div class="row">
                <?php
			$Reqprojets=$bdd->query("select p.*,c.* from portfolio_projet p, portfolio_categorie c where p.id_categorie=c.id_categorie");
			$Projets=$Reqprojets->fetchALL();
			foreach ($Projets as $Projet)
			{
			
					?>
                    <div class="col-sm-6 col-md-6 col-lg-4">
                        <div class="blog grid-blog">
                            <div class="blog-image">
                                <a href="projet/<?=$Projet['id_projet']; ?>"><img class="img-responsive" src="../<?php
								
				  $reqScr=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projet['id_projet']);
				  $Scrn=$reqScr->fetch();
if ($Scrn)			
echo $Scrn['url_screenshoot'];
else echo "images/layouts/samuel/portfolio/4-columns/noimage.jpg"; 
								 ?>" alt=""></a>
                            </div>
                            <div class="blog-content">
                                <h3 class="blog-title"><a href=""><?= $Projet['lib_projet']; ?></a></h3>
                                 <a  class="read-more"><i class="fa fa-info" aria-hidden="true"></i>Catégorie:  <?= $Projet['lib_categorie']; ?></a>
                               
                                <div class="blog-info clearfix">
                                    <div class="post-left">
                                        <ul>
                                            <li><a href="#."><i class="fa fa-calendar" aria-hidden="true"></i> <span><?= $Projet['date_projet'];?>  </span></a></li>
                                        </ul>
                                    </div>
                                    <div class="post-right"><a href="updateprojet/<?= $Projet['id_projet']; ?>" ><i class="fa fa-pencil" aria-hidden="true"></i>Modifier</a>  <a href="deleteprojet/<?= $Projet['id_projet']; ?>"><i class="fa fa-trash" aria-hidden="true"></i>Supprimer</a></div>
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
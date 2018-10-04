<?php
require_once 'content/connexion_bd.php';
$id_projet=$_GET['id'];
$ReqProjet=$bdd->query("select p.*,c.*,cl.* from portfolio_projet p, portfolio_categorie c, portfolio_client cl where p.id_categorie=c.id_categorie and p.id_client=cl.id_client and p.id_projet=".$id_projet);
$Projet=$ReqProjet->fetch();
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="blog-view">
                            <article class="blog blog-single-post">
                                <h3 class="blog-title"><?= $Projet['lib_projet'];?></h3>
                                <div class="blog-info clearfix">
                                    <div class="post-left">
                                        <ul>
                                            <li><a href="#."><i class="fa fa-calendar" aria-hidden="true"></i> <span><?= $Projet['date_projet'];?> </span></a></li>
                                        </ul>
                                    </div>
                                    
                                </div>
                                <?php
				  $reqSc=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$id_projet);
				  $Scr=$reqSc->fetch();
				  ?>
                                
                                <div class="blog-content">
                                    
                                     <p><?= $Projet['description_projet'];?></p>
                                    <blockquote>
                                        <div class="portfolio-item-details table">
                  <div class="row table-row">
                     <div class="table-cell">Date:</div>
                     <div class="table-cell"><span> <a href=""><?= $Projet['date_projet']; ?></a></span></div>
                  </div>
                  <div class="row table-row">
                     <div class="table-cell">Catégorie:</div>
                     <div class="table-cell"><span> <a href="#" rel="tag"><?= $Projet['lib_categorie']; ?></a></span></div>
                  </div>
                  <div class="row table-row">
                     <div class="table-cell">Tags:</div>
                     <div class="table-cell"><span> <a href="#" rel="tag"><?= $Projet['abbreviation_categorie']; ?></a></span></div>
                  </div>
                  <div class="row table-row">
                     <div class="table-cell">Technologies/Logiciels utilisés:</div>
                     <div class="table-cell"><span> <a href="#" rel="techno"><?php
								  $reqTechno1=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet);
								 $Techno1=$reqTechno1->fetchALL();
				  foreach( $Techno1 as $t1)
				  {
					  echo $t1['lib_technologie'].", ";
								
				  }?></a></span></div>
                  </div>
                  <div class="row table-row">
                     <div class="table-cell">Client:</div>
                     <div class="table-cell"><span> <a href="#"><?= $Projet['raison_sociale_client']; ?></a></span></div>
                  </div>
                  <div class="row table-row">
                     <div class="table-cell">Lien:</div>
                     <div class="table-cell"><span> <a href="<?= $Projet['url_projet']; ?>"><?= $Projet['url_projet']; ?></a></span></div>
                  </div>
               </div>
                                    </blockquote>
                                    
                                </div>
                                <div class="blog-image">
                                    <a href="#."><img alt="" src="../../<?= $Scr['url_screenshoot']; ?>" class="img-responsive"></a>
                                </div>
                            </article>
                            
                            <div class="widget author-widget clearfix">
                                <h3>Screenshoots</h3>
                                <div class="about-author">
                                <?php
				  $reqScr=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and s.id_projet=".$id_projet);
				  while ($Screen=$reqScr->fetch())
				  {
				  ?> 
                                    <div class="about-author-img">
                                        <div class="author-img-wrap">
                                            <img class="img-responsive img-circle" alt="iajlij" src="../../<?=  $Screen['url_screenshoot']; ?>">
                                        </div>
                                    </div>
                                    <?php } ?>
                                    
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
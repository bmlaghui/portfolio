<?php
require_once 'content/connexion_bd.php';
$id_projet=$_GET['id'];
$ReqProjet=$bdd->query("select p.*,c.*,cl.* from portfolio_projet p, portfolio_categorie c, portfolio_client cl where p.id_categorie=c.id_categorie and p.id_client=cl.id_client and p.id_projet=".$id_projet);
$Projet=$ReqProjet->fetch();
?>
<!-- Container -->
<div class="content-wrap">

   <div id="portfolio-item-page" class="inner-content">
      <section class="inner-section">

         <div class="post-header"
              data-animation-origin="right"
              data-animation-duration="400"
              data-animation-delay="100"
              data-animation-distance="50px">
            <h2 class="font-accident-two-normal">Projet: <?= $Projet['lib_projet']; ?></h2>
            <div class="dividewhite1"></div>
         </div>
         <div class="dividewhite4"></div>
         <div class="row">
            <div class="col-md-5"
                 data-animation-origin="top"
                 data-animation-duration="400"
                 data-animation-delay="400"
                 data-animation-distance="50px">

               <div class="row">
               <?php
				  $reqSc=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$id_projet);
				  $Scr=$reqSc->fetch();
				  ?>
                  <div class="col-md-12 col-sm-6 col-xs-12">
                     <img src="../<?php
					 if($Scr['url_screenshoot'])
					  $Scr['url_screenshoot'];
					  else echo "images/layouts/samuel/portfolio/4-columns/noimage.jpg"; 
  ?>" class="img-responsive" alt="<?= $Projet['lib_projet']; ?>">
                     <div class="dividewhite2"></div>
                  </div>
                  
               </div>

               <div class="dividewhite6"></div>

            </div>
            <div id="portfolio-overview" class="col-md-6 col-md-offset-1"
                 data-animation-origin="top"
                 data-animation-duration="400"
                 data-animation-delay="600"
                 data-animation-distance="50px">

               <div class="dividewhite2"></div>
               <!-- Post Content -->
               <h3 class="font-accident-two-light">Informations du projet</h3>
               <div class="dividewhite4"></div>


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


               <div class="dividewhite4"></div>
            <p><?= $Projet['description_projet']; ?></p>

               <div class="dividewhite4"></div>

               <!-- /Post Content -->
            </div>
         </div>

         <div class="dividewhite8"></div>

         <!-- Portfolio Block -->
         <section id="portfolio" data-section="portfolio"
                  data-animation-origin="right"
                  data-animation-duration="400"
                  data-animation-delay="700"
                  data-animation-distance="50px">

            <div class="dividewhite6"></div>

            <h3 class="font-accident-two-light">Scrennshoots</h3>
            <div class="dividewhite4"></div>

            <div class="row masonry-row">

               <div class="grid container-fluid text-center">
                  <div id="posts" class="row popup-container">
 <?php
				  $reqScr=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and s.id_projet=".$id_projet);
				  while ($Screen=$reqScr->fetch())
				  {
				  ?>       
                  <?php } ?>                        <!-- Slideshow container -->
</div>
               </div>

            </div>

            <div class="dividewhite8"></div>

         </section>
         <!-- /Portfolio Block -->

      </section>
   </div>

</div>

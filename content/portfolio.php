<?php
require_once 'content/connexion_bd.php';
?>
<div class="content-wrap">

   <div id="portfolio" class="inner-content">

      <section id="page-title" class="inner-section ui-menu-color03">
         <div class="container-fluid nopadding">
            <h2 class="font-accident-two-bold color01"
                data-animation-origin="right"
                data-animation-duration="400"
                data-animation-delay="100"
                data-animation-distance="50px">Portfolio</h2>
            <h4 class="font-accident-two-light color01 uppercase subtitle"
                data-animation-origin="right"
                data-animation-duration="400"
                data-animation-delay="200"
                data-animation-distance="50px">Mes créations</h4>
            <p class="small color01"
               data-animation-origin="right"
               data-animation-duration="400"
               data-animation-delay="300"
               data-animation-distance="50px">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id metus purus. Ut vulputate, est vel tincidunt mattis, orci neque iaculis lectus, et interdum quam felis vel tortor. Fusce ultrices dui quis nunc dignissim faucibus. Ut ac odio quis nibh viverra fringilla ac id nisi. Suspendisse tincidunt augue quis ligula cursus, non efficitur ligula faucibus. Mauris id neque maximus, tincidunt metus et, sodales nulla.
            </p>
         </div>
      </section>

      <!-- Counts Block -->
      <section id="counts" class="light inner-section bg-color02" data-section="counter">
         <div class="container-fluid nopadding">
            <div class="count-container row">
               <div class="col-lg-3 col-sm-6 col-xs-12 count">
                  <div
                          data-animation-origin="top"
                          data-animation-duration="300"
                          data-animation-delay="200"
                          data-animation-distance="35px">
                     <div class="count-icon">
                        <i class="flaticon-photo246"></i>
                     </div>
                     <span class=".integers digit font-accident-two-normal" data-counter="120">5</span>

                     <div class="count-text font-accident-two-bold">Sites web</div>
                  </div>
               </div>
               <div class="col-lg-3 col-sm-6 col-xs-12 count">
                  <div
                          data-animation-origin="top"
                          data-animation-duration="300"
                          data-animation-delay="400"
                          data-animation-distance="35px">
                     <div class="count-icon">
                        <i class="flaticon-book-bag2"></i>
                     </div>
                     <span class=".integers digit font-accident-two-normal" data-counter="90">23</span>

                     <div class="count-text font-accident-two-bold">Conceptions graphiques</div>
                  </div>
               </div>
               <div class="col-lg-3 col-sm-6 col-xs-12 count">
                  <div
                          data-animation-origin="top"
                          data-animation-duration="300"
                          data-animation-delay="600"
                          data-animation-distance="35px">
                     <div class="count-icon">
                        <i class="flaticon-stats48"></i>
                     </div>
                     <span class=".integers digit font-accident-two-normal" data-counter="45">10</span>

                     <div class="count-text font-accident-two-bold">Applications desktop</div>
                  </div>
               </div>
               <div class="col-lg-3 col-sm-6 col-xs-12 count">
                  <div
                          data-animation-origin="top"
                          data-animation-duration="300"
                          data-animation-delay="800"
                          data-animation-distance="35px">
                     <div class="count-icon">
                        <i class="flaticon-shopping-carts6"></i>
                     </div>
                     <span class=".integers digit font-accident-two-normal" data-counter="165">0</span>

                     <div class="count-text font-accident-two-bold">Applications mobiles</div>
                  </div>
               </div>
            </div>
            <div class="dividewhite2"></div>
         </div>
      </section>
      <!-- /Counts Block -->

      <!-- Portfolio Block -->
      <section id="portfolio-block" class="inner-section" data-section="portfolio">

         <div class="dividewhite6"></div>

         <div id="isotope-filters" class="port-filter port-filter-light text-center"
              data-animation-origin="top"
              data-animation-duration="500"
              data-animation-delay="200"
              data-animation-distance="25px">
            <ul>
               <li><a href="#cat1" data-filter="*">Tous</a></li>
               <?php
			   $j=2;
			   $reqCategories=$bdd->query("select * from portfolio_categorie");
			   while($Categorie=$reqCategories->fetch())
			   {
			   ?>
               <li><a href="#cat<?= $j; ?>" data-filter=".<?= $Categorie['abbreviation_categorie']; ?>"><?= $Categorie['lib_categorie']; ?></a></li>
              <?php
			  $j++;
			   }
			  ?>
            </ul>
         </div>

         <div class="dividewhite6"></div>

         <div class="row masonry-row">

            <div class="grid container-fluid text-center">

               <div id="posts" class="row popup-container">
               <?php 
$reqProjets=$bdd->query("select p.*,c.* from portfolio_projet p, portfolio_categorie c where p.id_categorie=c.id_categorie order by p.id_projet");
			   $Projets=$reqProjets->fetchALL();
			   ?>
                  <div class="grid-item <?= $Projets[0]['abbreviation_categorie'];?> col-xs-6 col-sm-8 col-md-6">
                  <?php
				  								 $id_projet0=$Projets[0]['id_projet'];

				  $reqScr1=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projets[0]['id_projet']);
				  $Scrn1=$reqScr1->fetch();
				  ?>
                 
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="left"
                                data-animation-duration="600"
                                data-animation-delay="400"
                                data-animation-distance="100px">
                           <div class="popup-call">
                              <a href="<?= $Scrn1['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>
                           </div>
                           <img src="<?= $Scrn1['url_screenshoot'] ; ?>" class="img-responsive'" alt="<?= $Projets[0]['lib_projet']; ?>"/>
                           <figcaption>
                              <div class="fig-description">
                                 <h3><?= $Projets[0]['lib_projet']; ?></h3>
                                 <p><?= $Projets[0]['lib_categorie']; ?>,  #Technologies : 
                                 <?php
								  $reqTechno1=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet0);
								 $Techno1=$reqTechno1->fetchALL();
				  foreach( $Techno1 as $t1)
				  {
					  echo " #".$t1['lib_technologie'];
								
				  }
				  ?></p>
                              </div>
                              
                              <a href="projet/<?= $Projets[0]['id_projet']; ?>"></a>
                           </figcaption>
                        </figure>
                     </div>
                  </div>




                  <div class="grid-item grid-sizer <?= $Projets[1]['abbreviation_categorie'];?> col-xs-6 col-sm-4 col-md-3">
                  <?php
				  $reqScr2=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projets[1]['id_projet']);
				  $Scrn2=$reqScr2->fetch();
				  ?>
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="top"
                                data-animation-duration="400"
                                data-animation-delay="400"
                                data-animation-distance="50px">
                           <div class="popup-call">
                              <a href="<?= $Scrn2['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>
                           </div>
                           <img src="<?= $Scrn2['url_screenshoot'] ; ?>" class="img-responsive'" alt="<?= $Projets[1]['lib_projet']; ?>"/>
                           <figcaption>
                              <div class="fig-description">
                                 <h3><?= $Projets[1]['lib_projet']; ?></h3>
                                 <p><?= $Projets[1]['lib_categorie']; ?>,  #Technologies : 
                                 <?php
								 $id_projet11=$Projets[1]['id_projet'];
								  $reqTechno1=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet0);
								 $Techno1=$reqTechno1->fetchALL();
				  foreach( $Techno1 as $t1)
				  {
					  echo " #".$t1['lib_technologie'];
								
				  }
				  ?></p>
                              </div>
                              
                              <a href="projet/<?= $Projets[1]['id_projet']; ?>"></a>
                           </figcaption>
                        </figure>
                     </div>
                  </div>

                  <div class="grid-item  <?= $Projets[2]['abbreviation_categorie'];?> col-xs-6 col-sm-4 col-md-3">
                    <?php
				  $reqScr22=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projets[2]['id_projet']);
				  $Scrn22=$reqScr22->fetch();
				  ?>
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="right"
                                data-animation-duration="400"
                                data-animation-delay="400"
                                data-animation-distance="50px">
                           <div class="popup-call">
                              <a href="<?= $Scrn22['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>
                           </div>
                                                      <img src="<?= $Scrn22['url_screenshoot'] ; ?>" class="img-responsive'" alt="<?= $Projets[2]['lib_projet']; ?>"/>

                        </figure>
                     </div>
                  </div>

                  <div class="grid-item <?= $Projets[3]['abbreviation_categorie'];?> col-xs-6 col-sm-4 col-md-3">
                  <?php
				  $reqScr3=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projets[3]['id_projet']);
				  $Scrn3=$reqScr3->fetch();
				  ?>
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="left"
                                data-animation-duration="400"
                                data-animation-delay="500"
                                data-animation-distance="50px">
                           <div class="popup-call">
                              <a href="<?= $Scrn3['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>
                           </div>
                           <img src="<?= $Scrn3['url_screenshoot'] ; ?>" class="img-responsive'" alt="<?= $Projets[3]['lib_projet']; ?>"/>
                           <figcaption>
                              <div class="fig-description">
                                 <h3><?= $Projets[3]['lib_projet']; ?></h3>
                                 <p><?= $Projets[3]['lib_categorie']; ?>,  #Technologies : 
                                 <?php
								 $id_projet3=$Projets[3]['id_projet'];
								  $reqTechno3=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet3);
								 $Techno3=$reqTechno3->fetchALL();
				  foreach( $Techno3 as $t3)
				  {
					  echo " #".$t3['lib_technologie'];
								
				  }
				  ?></p>
                              </div>
                              
                              <a href="projet/<?= $Projets[3]['id_projet']; ?>"></a>
                           </figcaption>
                        </figure>
                     </div>
                  </div>

                  <div class="grid-item <?= $Projets[4]['abbreviation_categorie'];?> col-xs-6 col-sm-4 col-md-3">
                    <?php
				  $reqScr4=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projets[4]['id_projet']);
				  $Scrn4=$reqScr4->fetch();
				  ?>
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="left"
                                data-animation-duration="400"
                                data-animation-delay="400"
                                data-animation-distance="50px">
                           <div class="popup-call">
                              <a href="<?= $Scrn4['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>
                           </div>
                           <img src="<?= $Scrn4['url_screenshoot'] ; ?>" class="img-responsive'" alt="<?= $Projets[4]['lib_projet']; ?>"/>
                           <figcaption>
                              <div class="fig-description">
                                 <h3><?= $Projets[4]['lib_projet']; ?></h3>
                                 <p><?= $Projets[4]['lib_categorie']; ?>,  #Technologies : 
                                 <?php
								 $id_projet4=$Projets[4]['id_projet'];
								  $reqTechno4=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet4);
								 $Techno4=$reqTechno4->fetchALL();
				  foreach( $Techno4 as $t4)
				  {
					  echo " #".$t4['lib_technologie'];
								
				  }
				  ?></p>
                              </div>
                              
                              <a href="projet/<?= $Projets[4]['id_projet']; ?>"></a>
                           </figcaption>
                        </figure>
                     </div>
                  </div>

                  <div class="grid-item <?= $Projets[5]['abbreviation_categorie'];?> col-xs-6 col-sm-4 col-md-3">
                  <?php
				  $reqScr5=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Projets[5]['id_projet']);
				  $Scrn5=$reqScr5->fetch();
				  ?>
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="right"
                                data-animation-duration="400"
                                data-animation-delay="500"
                                data-animation-distance="50px">
                           <div class="popup-call">
                                                            <a href="<?= $Scrn5['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>

                           </div>
                           <img src="<?= $Scrn5['url_screenshoot'] ; ?>" class="img-responsive'" alt="<?= $Projets[5]['lib_projet']; ?>"/>
                           <figcaption>
                              <div class="fig-description">
                                 <h3><?= $Projets[5]['lib_projet']; ?></h3>
                                 <p><?= $Projets[5]['lib_categorie']; ?>,  #Technologies : 
                                 <?php
								 $id_projet5=$Projets[5]['id_projet'];
								  $reqTechno5=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_projet5);
								 $Techno5=$reqTechno5->fetchALL();
				  foreach( $Techno5 as $t5)
				  {
					  echo " #".$t5['lib_technologie'];
								
				  }
				  ?></p>
                              </div>
                              
                              <a href="projet/<?= $Projets[5]['id_projet']; ?>"></a>
                           </figcaption>
                        </figure>
                     </div>
                  </div>

                  
<?php
$reqProj=$bdd->query("select p.*,c.* from portfolio_projet p, portfolio_categorie c where p.id_projet>6 and p.id_categorie=c.id_categorie order by p.id_projet");
			   $Projetss=$reqProj->fetchALL();
			   foreach($Projetss as $Proj)
			   {
?>

                  <div class="grid-item <?= $Proj['abbreviation_categorie'];?> col-xs-6 col-sm-4 col-md-3">
                  <?php
				  $reqSc=$bdd->query("select p.*,s.* from portfolio_projet p, portfolio_screenshoot s where s.id_projet=p.id_projet and etat_screenshoot=1 and s.id_projet=".$Proj['id_projet']);
				  $Scr=$reqSc->fetch();
				  ?>
                     <div class="item-wrap">
                        <figure class="effect-goliath ui-menu-color02"
                                data-animation-origin="left"
                                data-animation-duration="400"
                                data-animation-delay="400"
                                data-animation-distance="50px">
                           <div class="popup-call">
                              <a href="<?= $Scr['url_screenshoot'] ; ?>" class=""><i class="flaticon-tool"></i></a>
                           </div>
                           <img src="<?php
						  if($Scr['url_screenshoot'])
						  echo $Scr['url_screenshoot'];
						   else echo "images/layouts/samuel/portfolio/4-columns/noimage.jpg"; 

						    
							
							 ; ?>" class="img-responsive'" alt="<?= $Proj['lib_projet']; ?>"/>
                           <figcaption>
                              <div class="fig-description">
                                 <h3><?= $Proj['lib_projet']; ?></h3>
                                 <p><?= $Proj['lib_categorie']; ?>,  #Technologies : 
                                 <?php
								 $id_pr=$Proj['id_projet'];
								  $reqTech=$bdd->query("select p.*,t.* from portfolio_projet p, portfolio_projet_technologie pt, portfolio_technologie t where pt.id_projet=p.id_projet and pt.id_technologie=t.id_technologie and p.id_projet=".$id_pr);
								 $Tech=$reqTech->fetchALL();
				  foreach( $Tech as $t)
				  {
					  echo " #".$t['lib_technologie'];
								
				  }
				  ?></p>
                              </div>
                              
                              <a href="projet/<?= $id_pr; ?>"></a>
                           </figcaption>
                        </figure>
                     </div>
                  </div>

    <?php
			   }
	?>              

                  

                  

                  

                  

               </div>
            </div>

         </div>




         <div class="dividewhite8"></div>

      </section>
      <!-- /Portfolio Block -->

   </div>

</div>
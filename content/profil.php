<?php
require_once 'content/connexion_bd.php';
$requette=$bdd->query("select * from portfolio_information");
$Info=$requette->fetch();
?>
<div class="content-wrap">

   <div id="resume" class="inner-content">

      <section id="page-title" class="inner-section ui-menu-color02">
         <div class="container-fluid nopadding">
            <h2 class="font-accident-two-bold color01"
                data-animation-origin="right"
                data-animation-duration="400"
                data-animation-delay="100"
                data-animation-distance="50px">Mon profil</h2>
            <h4 class="font-accident-two-light color01 uppercase subtitle"
                data-animation-origin="right"
                data-animation-duration="400"
                data-animation-delay="200"
                data-animation-distance="50px">Pour plus savoir à porpos de moi</h4>
                <br/>
            <p class="small color01"
               data-animation-origin="right"
               data-animation-duration="400"
               data-animation-delay="300"
               data-animation-distance="50px">
               <ul id="nav" class="row nopadding cd-side-navigation ui-menu-color02">
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="100" style="visibility: visible;">
                  <a href="#me" style="color:white;"  <i class="flaticon-profile5"></i><span> Informations générales</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="300" style="visibility: visible;">
                  <a href="#m-details" style="color:white;" <i class="flaticon-odnolassniki2"></i><span> Qualités personelles</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="500" style="visibility: visible;">
                  <a href="#" style="color:white;" <i class="flaticon-graduation61"></i><span> Formations/Education</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="700" style="visibility: visible;">
                  <a href="#" style="color:white;" <i class="flaticon-book-bag2"></i><span> Expériences/Stages</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="900" style="visibility: visible;">
                  <a href="#" style="color:white;"<i class="flaticon-download149"></i><span> Curriculum Vitae</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="900" style="visibility: visible;">
                  <a href="#" style="color:white;"<i class="flaticon-earphones18"></i><span> Me contacter</span></a>
               </li>
               
            </ul> 
            </p>
         </div>
      </section>

      <section id="me" class="inner-section light bg-color01">

         <div class="container-fluid nopadding">

            <div data-animation-origin="top"
                 data-animation-duration="200"
                 data-animation-delay="300"
                 data-animation-distance="20px">
               <h3 class="font-accident-two-normal uppercase text-center">Qui je suis?</h3>
               <div class="dividewhite1"></div>
               <p class="small text-center fontcolor-medium">
					Un résumé sur moi.
               </p>
               <div class="dividewhite4"></div>
            </div>

            <div class="row">
               <div class="col-md-6"
                    data-animation-origin="top"
                    data-animation-duration="400"
                    data-animation-delay="600"
                    data-animation-distance="30px">
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Nom:</span></div>
                     <div class="col-sm-8"><p class=""><?= $Info['nom']; ?></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Prénom:</span></div>
                     <div class="col-sm-8"><p class=""><?= $Info['prenom']; ?></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Adresse:</span></div>
                     <div class="col-sm-8"><p class=""><?= $Info['adresse']; ?></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">E-mail:</span></div>
                     <div class="col-sm-8"><p class=""><?= $Info['email']; ?></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Date de naissance:</span></div>
                     <div class="col-sm-8"><p class=""><?= $Info['date_naissance']; ?></p></div>
                  </div>
               </div>
               <div class="col-md-6"
                    data-animation-origin="top"
                    data-animation-duration="400"
                    data-animation-delay="800"
                    data-animation-distance="30px">
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Occupation:</span></div>
                     <div class="col-sm-8"><p class=""><a href="#!"><?= $Info['occupation']; ?></a></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Spécialité:</span></div>
                     <div class="col-sm-8"><p class=""><a href="#!"><?= $Info['specialite']; ?></a></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Langues:</span></div>
                     <div class="col-sm-8"><p class=""><a href="#!"><?= $Info['langues']; ?></a></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Hobbies:</span></div>
                     <div class="col-sm-8"><p class=""><a href="#!"><?= $Info['hobbies']; ?></a></p></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-4"><span class="font-accident-two-bold uppercase">Autres:</span></div>
                     <div class="col-sm-8"><p class=""><a href="#!"><?= $Info['autres']; ?></a></p></div>
                  </div>
               </div>
            </div>
         </div>

      </section>

      <!-- Details Block -->
      <section id="m-details" class="inner-section light bg-color02">

         <div class="container-fluid nopadding">

            <div data-animation-origin="top"
                 data-animation-duration="400"
                 data-animation-delay="300"
                 data-animation-distance="30px">
               <h3 class="font-accident-two-normal uppercase text-center">Mes qualités</h3>
               <div class="dividewhite1"></div>
               <p class="small text-center fontcolor-medium">
                  Personne n'est parfait !
               </p>
               <div class="dividewhite6"></div>
            </div>

            <div class="row">
            <?php
			$ReqQualities=$bdd->query("select * from portfolio_qualite");
			while($Qualite=$ReqQualities->fetch())
			{
			?>
               <div class="col-md-3 infoblock text-center"
                    data-animation-origin="left"
                    data-animation-duration="400"
                    data-animation-delay="400"
                    data-animation-distance="50px">
                  <div class="row">
                     <div class="col-md-12"><i class="<?= $Qualite['icone_qualite']; ?>"></i></div>
                     <div class="col-md-12">
                        <div class="dividewhite1"></div>
                        <h5 class="font-accident-two-bold uppercase"><?= $Qualite['lib_qualite']; ?></h5>
                        <p class="small">
                          <?= $Qualite['description_qualite']; ?>
                        </p>
                     </div>
                  </div>
                  <div class="divider-dynamic"></div>
               </div>
               <?php
			}
			   ?>
               
            </div>

         </div>

      </section>
      <!-- /§Details Block -->

      <!-- Timeline Block -->
      <section id="timeline" class="light inner-section">

         <div class="container-fluid nopadding">

            <div class="text-center"
                 data-animation-origin="top"
                 data-animation-duration="400"
                 data-animation-delay="400"
                 data-animation-distance="30px">
               <div class="dividewhite4"></div>
               <h3 class="font-accident-two-normal uppercase">Mes formations</h3>
               <h5 class="font-accident-two-normal uppercase subtitle"></h5>
               <div class="dividewhite1"></div>
               <p class="small fontcolor-medium">
                  Au cours de ma formation académique, j'ai suivi un parcourc polyvalent en informatique  </p>
            </div>

            <div class="dividewhite4"></div>

            <ul class="timeline-vert timeline">
            <?php
			$ReqFormations=$bdd->query("select f.*,i.* from portfolio_formation f, portfolio_institut i where i.id_institut=f.id_institut order by f.annee_debut_formation,f.ordre_formation");
			$i=0;
			while($Formation=$ReqFormations->fetch())
			{
				
				
				
			?>
               
               <li <?php if($i%2!=0)
				echo ' class="timeline-inverted"' ?>>
                  <div class="timeline-badge success"><i class="flaticon-graduation61"></i></div>
                  <div class="timeline-panel"
                       data-animation-origin="right"
                       data-animation-duration="400"
                       data-animation-delay="400"
                       data-animation-distance="25px">
                     <p class="timeline-time fontcolor-invert"><?= $Formation['annee_debut_formation'];?>  <?php
					 if($Formation['annee_fin_formation']==NULL)
					 echo " - Aujourd'hui";
					 elseif ($Formation['annee_debut_formation'] != $Formation['annee_fin_formation'])
					 echo " - ".$Formation['annee_fin_formation'];?></p>
                     <div class="timeline-photo timeline-samuel-02" style="background-image:url(<?= $Formation['photo_institut'] ?>)"></div>
                     <div class="timeline-heading">
                        <h4 class="font-accident-two-normal uppercase"><?= $Formation['lib_institut'];?></h4>
                        <h6 class="uppercase"><?= $Formation['abbreviation_formation']." ".$Formation['lib_formation'];?></h6>
                        <p><?= $Formation['description_formation'];?>                        </p>
                     </div>
                  </div>
               </li>
             <?php
			 $i++; 
			}?>  

            </ul>

            

            <div class="dividewhite6"></div>

         </div>

      </section>
      <!-- /Timeline Block -->
      <!-- Timeline Block -->
      
      
      <section id="timeline" class="light inner-section">

         <div class="container-fluid nopadding">

            <div class="text-center"
                 data-animation-origin="top"
                 data-animation-duration="400"
                 data-animation-delay="400"
                 data-animation-distance="30px">
               <div class="dividewhite4"></div>
               <h3 class="font-accident-two-normal uppercase">Mes Expériences/Stages</h3>
               <h5 class="font-accident-two-normal uppercase subtitle"></h5>
               <div class="dividewhite1"></div>
               <p class="small fontcolor-medium">
                  Au cours de ma formation académique, j'ai suivi un parcourc polyvalent en informatique  </p>
            </div>

            <div class="dividewhite4"></div>

            <ul class="timeline-vert timeline">
            <?php
			$ReqExperiences=$bdd->query("select e.*,i.* from portolio_experience e, portfolio_institut i where i.id_institut=e.id_institut order by e.annee_debut_experience,e.ordre_experience");
			$i=0;
			while($Experience=$ReqExperiences->fetch())
			{
				
				
				
			?>
               
               <li <?php if($i%2!=0)
				echo ' class="timeline-inverted"'; ?>>
                  <div class="timeline-badge success"><i class="flaticon-graduation61"></i></div>
                  <div class="timeline-panel"
                       data-animation-origin="right"
                       data-animation-duration="400"
                       data-animation-delay="400"
                       data-animation-distance="25px">
                     <p class="timeline-time fontcolor-invert"><?= $Experience['annee_debut_experience'];?>  <?php
					 if($Experience['annee_fin_experience']==NULL)
					 echo " - Aujourd'hui";
					 elseif ($Experience['annee_debut_experience'] != $Experience['annee_fin_experience'])
					 echo " - ".$Experience['annee_fin_experience'];?></p>
                     <div class="timeline-photo timeline-samuel-02" style="background-image:url(<?= $Experience['photo_institut'] ?>)"></div>
                     <div class="timeline-heading">
                        <h4 class="font-accident-two-normal uppercase"><?= $Experience['lib_institut'];?></h4>
                        <h6 class="uppercase"><?= $Experience['lib_experience'];?></h6>
                     </div>
                  </div>
               </li>
             <?php
			 $i++; 
			}?>  

            </ul>

            

            <div class="dividewhite6"></div>

         </div>

      </section>
      
      <!-- /Timeline Block -->

   </div>

</div>
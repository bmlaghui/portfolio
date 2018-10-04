<?php
include 'connexion_bd.php';
$requette=$bdd->query("select * from portfolio_information");
$Info=$requette->fetch();
?>
<div class="content-wrap">

   <section class="container-fluid" data-section="home">

      <!-- Personal Flexy Section -->
      <div class="row flex-row">
         <!-- Personal Details 01 -->
         <div id="details" class="col-md-8 flex-column bg-color01 light nopadding"
              data-animation-origin="left"
              data-animation-duration="300"
              data-animation-delay="400"
              data-animation-distance="200px">
            <div class="padding-50">
            <div class="row nopadding">
               <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 nopadding">
                  <h3 class="font-accident-two-normal uppercase">A propos de moi</h3>
                  <div class="quote">
                     <h5 class="font-accident-one-bold uppercase subtitle">
                     <?= $Info['description']; ?>
…</h5>
                     <div class="dividewhite3"></div>
                  </div>
               </div>
            </div>

            <div class="divider-dynamic"></div>

            <div class="row nopadding">
               <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12 infoblock nopadding">
                  <div class="row infoblock">
                    <div class="col-sm-1 col-md-3">
                        <i class="flaticon-photo246"></i>
                    </div>
                    <div class="col-sm-11 col-md-9">
                        <h5 class="font-accident-one-bold uppercase">Créatif</h5>

                        <div class="dividewhite1"></div>
                        <p class="small">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet hendrerit dolor, at lacinia mi.
                  </p>
                    </div>
                </div>
               </div>
               <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12 infoblock nopadding">
                  <div class="row infoblock">
                    <div class="col-sm-1 col-md-3">
                        <i class="flaticon-stats47"></i>
                    </div>
                    <div class="col-sm-11 col-md-9">
                        <h5 class="font-accident-one-bold uppercase">Motivé</h5>

                        <div class="dividewhite1"></div>
                        <p class="small">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet hendrerit dolor, at lacinia mi.
                  </p>
                    </div>
                </div>
               </div>
               <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12 infoblock nopadding">
                  <div class="row infoblock">
                    <div class="col-sm-1 col-md-3">
                        <i class="flaticon-clocks18"></i>
                    </div>
                    <div class="col-sm-11 col-md-9">
                        <h5 class="font-accident-one-bold uppercase">Ponctuel</h5>

                        <div class="dividewhite1"></div>
                        <p class="small">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet hendrerit dolor, at lacinia mi.
                  </p>
                    </div>
                </div>
               </div>
            </div>
         </div>
         </div>
         <!-- /Personal Details 01 -->

         <!-- Personal Details 02 -->
         <div id="personal" class="col-md-4 flex-column light ui-block-color01 personal"
              data-animation-origin="right"
              data-animation-duration="500"
              data-animation-delay="600"
              data-animation-distance="100px">
            <div class="padding-50 flex-panel">
               <h3 class="font-accident-two-normal uppercase title">Informations</h3>
               <div class="dividewhite4"></div>
               <div>
                  <div class="fullwidth box">
                     <div class="one"><p class="uppercase">Nom:</p></div>
                     <div class="two"><p class=""> <?= $Info['nom'].' '.$Info['prenom']; ?></p></div>
                  </div>
                  <div class="fullwidth box">
                     <div class="one"><p class="uppercase text-nowrap">Né le:</p></div>
                     <div class="two"><p class=""> <?= $Info['date_naissance']; ?></p></div>
                  </div>
                  <div class="fullwidth box">
                     <div class="one"><p class="uppercase">Addresse:</p></div>
                     <div class="two"><p class=""> <?= $Info['adresse']; ?></p></div>
                  </div>
                  <div class="fullwidth box">
                     <div class="one"><p class="uppercase">Téléphone:</p></div>
                     <div class="two"><p class=""> <?= $Info['telephone']; ?></p></div>
                  </div>
                  <div class="fullwidth box">
                     <div class="one"><p class="uppercase">Email:</p></div>
                     <div class="two"><p class=""> <?= $Info['email']; ?></p></div>
                  </div>
               </div>
               <div class="dividewhite1"></div>
            </div>
         </div>
         <!-- /Personal Details 02 -->
      </div>
      <!-- /Personal Flexy Section -->

   </section>

   <section id="professional" class="container-fluid" data-section="home">

      <div class="row flex-row">

         <div id="pro-experience" class="col-md-4 flex-column dark nopadding ui-block-color02 flex-col"
              data-animation-origin="bottom"
              data-animation-duration="300"
              data-animation-delay="800"
              data-animation-distance="200px">
            <div class="padding-50 flex-panel">
               <h3 class="font-accident-two-normal uppercase title">Mes expériences</h3>
               <div class="dividewhite4"></div>
               <div class="experience">
                  
                  <?php
				  $reqExp=$bdd->query("select e.*,i.* from portolio_experience e, portfolio_institut i where e.id_institut=i.id_institut");
				  while($Experiences=$reqExp->fetch())
				  {
				  ?>
                  <ul class="">
                     <li class="date"><?= $Experiences['annee_debut_experience'];?>  <?php
					 if($Experiences['annee_fin_experience']==NULL)
					 echo " - Aujourd'hui";
					 elseif ($Experiences['annee_debut_experience'] != $Experiences['annee_fin_experience'])
					 echo " - ".$Experiences['annee_fin_experience'];?></li>
                     <li class="company uppercase">
                        <a>
                          -  <?= $Experiences['lib_institut'];?>
                        </a>
                     </li>
                     <li class="position"><?= $Experiences['lib_experience'];?></li>
                  </ul>
                 <?php } ?>
               </div>
               <a href="resume" class="btn btn-wh-trans btn-xs">Plus de détails</a>
               <div class="dividewhite1"></div>
            </div>
         </div>
         <div id="circle-skills" class="col-md-8 flex-column dark nopadding ui-block-color03 flex-col" data-section="progress"
              data-animation-origin="right"
              data-animation-duration="400"
              data-animation-delay="1100"
              data-animation-distance="200px">
            <div class="padding-50 flex-panel">
               <h3 class="font-accident-two-normal uppercase title">Mes compétences</h3>
               <div class="dividewhite1"></div>
               <div class="row">

				<?php
				$reqSkills=$bdd->query("select * from portfolio_categorie where etat_categorie =1");
				while($Skill=$reqSkills->fetch())
				{
				?>
                  <div class="col-md-4 col-sm-4 col-xs-12 nopadding">
                     <div class="progressbar text-center">
                        <div id="circle1"
                             data-progressbar="circle"
                             data-progressbar-color="#fff"
                             data-progressbar-trailcolor="#fff"
                             data-progressbar-to='{"color": "#<?= $Skill['progressbar-to']?>", "width": 4}'
                             data-progressbar-from='{"color": "#<?= $Skill['progressbar-from']?>", "width": 4}'
                             data-progressbar-value="<?= $Skill['note_categorie']?>">
                        </div>
                        <h4 class="font-accident-two-bold uppercase"><?= $Skill['lib_categorie']?></h4>
                        <p class="font-regular-normal">
                        <?= $Skill['description_categorie']?>
                        </p>
                        <a href="#" class="btn btn-wh-trans btn-xs">Plus de détails</a>
                     </div>
                     <div class="dividewhite1"></div>
                  </div>

                  <?php
				  }?>

                  

               </div>
            </div>
         </div>

      </div>

   </section>

</div>
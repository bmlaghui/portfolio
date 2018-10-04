<?php
require_once 'content/connexion_bd.php';
$requette=$bdd->query("select * from portfolio_information");
$Info=$requette->fetch();
?>
<!DOCTYPE html>
<html lang="en">
<!--[if IE 9]>
<html class="ie9" lang="en">    <![endif]-->
<!--[if IE 8]>
<html class="ie8" lang="en">    <![endif]-->

<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name=viewport content="width=device-width, initial-scale=1">

   <title><?= $Info['nom']." ".$Info['prenom'] ; ?> | Portfolio</title>


   <!-- Preloader -->

   <!-- CSS -->
   <link rel="stylesheet" href="<?= $baseURL; ?>/css/bootstrap.css"  media="screen">
   <link href="<?= $baseURL; ?>/css/font-awesome.css" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>
   <link href="<?= $baseURL; ?>/css/flaticon.css?v=29022016" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>
   <link href="<?= $baseURL; ?>/css/hover.css?v=2.0.2" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>
   <link href="<?= $baseURL; ?>/css/popup.css?v=1.1.0" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>
   <link href="<?= $baseURL; ?>/css/owl.carousel.css?v=2.1.0" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>

   <!-- Custom styles -->
   <link href="<?= $baseURL; ?>/css/style.css" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>
   <link href="<?= $baseURL; ?>/css/samuel.css" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>
      <link href="<?= $baseURL; ?>/css/slider.css" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>

   <link href="<?= $baseURL; ?>/css/default.css" id="color-styles" property='stylesheet' rel="stylesheet" type="text/css" media="screen"/>

</head>

<body id="samuel" class="boxed">

<!--Pre-Loader-->


<header>
   <section id="top-navigation" class="container-fluid nopadding">
      <div class="row nopadding ident ui-bg-color01">
         <!-- Photo -->
         <a href="home">
            <div class="col-md-4 vc-photo photo-01">&nbsp;</div>
         </a>
         <!-- /Photo -->
         <div class="col-md-8 vc-name nopadding">
            <!-- Name-Position -->
            <div class="row nopadding name">
               <div class="col-md-10 name-title"><h1 class="font-accident-two-extralight"><?= $Info['nom']." ".$Info['prenom'] ; ?></h1></div>
               <div class="col-md-2 nopadding name-pdf">
                  <a href="#" class="hvr-sweep-to-right"><i class="flaticon-download149" title="Mon CV"></i></a>
               </div>
            </div>
            <div class="row nopadding position">
               <div class="col-md-10 position-title">

                  <section class="cd-intro">
                     <h2 class="cd-headline clip is-full-width font-accident-two-light">
                        <span>Développeur </span>
                        <span class="cd-words-wrapper">
                           <b class="is-visible">Web</b>
                           <b>Desktop</b>
                           <b>mobile (Bientôt)
                           </b>
                        </span>
                     </h2>
                  </section>

               </div>
               <div class="col-md-2 nopadding pdf">
                  <a href="#" class="hvr-sweep-to-right"><i class="flaticon-linkedin22" title="Mon profil LINKED in"></i></a>
               </div>
            </div>
            <!-- /Name-Position -->

            <!-- Main Navigation -->

            <ul id="nav" class="row nopadding cd-side-navigation">
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color01" data-animation-duration="1000" data-animation-delay="100">
                  <a href="<?= $baseURL; ?>/home" class="hvr-sweep-to-bottom"><i class="flaticon-insignia"></i><span>Acceuil</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color02" data-animation-duration="1000" data-animation-delay="300">
                  <a href="<?= $baseURL; ?>/profil" class="hvr-sweep-to-bottom"><i class="flaticon-graduation61"></i><span>Mon profil</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color03" data-animation-duration="1000" data-animation-delay="500">
                  <a href="<?= $baseURL; ?>/portfolio" class="hvr-sweep-to-bottom"><i class="flaticon-book-bag2"></i><span>Portfolio</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color04" data-animation-duration="1000" data-animation-delay="700">
                  <a href="<?= $baseURL; ?>/contact" class="hvr-sweep-to-bottom"><i class="flaticon-placeholders4"></i><span>Contact</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color05" data-animation-duration="1000" data-animation-delay="900">
                  <a href="<?= $baseURL; ?>/mail" class="hvr-sweep-to-bottom"><i class="flaticon-earphones18"></i><span>Me contacter</span></a>
               </li>
               <li class="col-xs-4 col-sm-2 nopadding menuitem ui-menu-color06" data-animation-duration="1000" data-animation-delay="1100">
                  <a href="<?= $baseURL; ?>/blog" class="hvr-sweep-to-bottom"><i class="flaticon-pens15"></i><span>blog</span></a>
               </li>
            </ul>

         </div>
      </div>
   </section>
</header>
	<?= $content; ?>
<!-- Container -->


<footer class="padding-50 dark ui-bg-color01"
        data-animation-origin="top"
        data-animation-duration="500"
        data-animation-delay="800"
        data-animation-distance="50px">
   <div class="container-fluid nopadding">
      <div class="row">
         <div class="col-sm-3">
            <h5 class="font-accident-two-bold uppercase"><?= $Info['nom']." ".$Info['prenom']; ?> - Portfolio</h5>
            <p class="inline-block">
			<?= $Info['description']; ?>
                        </p>
            <div class="divider-dynamic"></div>
         </div>
         <div class="col-sm-3 cv-link">
            <h5 class="font-accident-two-bold uppercase">Télécharger mon CV</h5>
            <div class="dividewhite1"></div>
            <a href="#!"><i class="fa fa-long-arrow-down" aria-hidden="true"></i>Français</a>
            <a href="#!"><i class="fa fa-long-arrow-down" aria-hidden="true"></i>Arabe</a>
            <a href="#!"><i class="fa fa-long-arrow-down" aria-hidden="true"></i>Anglais</a>
            <p class="inline-block">
              Ce Cv est de type PDF, Utiliser Adobe Reader pour l'ouvrir.
            </p>
            <div class="divider-dynamic"></div>
         </div>
         <div class="col-sm-3">
            <h5 class="font-accident-two-bold uppercase">Newsletter</h5>
            <div class="dividewhite1"></div>
            <input class="newsletter-email" type="email" required name="ne" placeholder="Votre E-mail">
            <a href="#!" class="btn btn-wh-trans btn-xs">OK</a>
            <div class="divider-dynamic"></div>
         </div>
         <div class="col-sm-3">
            <h5 class="font-accident-two-bold uppercase">Me suivre</h5>
            <div class="follow">
               <ul class="list-inline social">
                  <li><a target="_blank" href="#" class="rst-icon-facebook"><i class="fa fa-facebook"></i></a></li>
                  <li><a target="_blank" href="#" class="rst-icon-twitter"><i class="fa fa-twitter"></i></a></li>
                  <li><a target="_blank" href="#" class="rst-icon-pinterest"><i class="fa fa-pinterest"></i></a></li>
                  <li><a target="_blank" href="#" class="rst-icon-instagram"><i class="fa fa-instagram"></i></a></li>
                  <li><a target="_blank" href="#" class="rst-icon-youtube"><i class="fa fa-youtube"></i></a></li>
               </ul>
            </div>
            <div class="divider-dynamic"></div>
         </div>
      </div>
      <div class="dividewhite1"></div>
      <div class="row">
         <div class="col-md-12 copyrights">
            <p>© <?= date("Y")." ".$Info['nom']." ".$Info['prenom']; ?></p>
         </div>
      </div>
   </div>
</footer>

<!-- Back to Top -->
<div id="back-top"></div>
<!-- /Back to Top -->




<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.js"></script>
<script src="<?= $baseURL; ?>/js/bootstrap.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="<?= $baseURL; ?>/js/slider.js" type="text/javascript"></script>
<script src="<?= $baseURL; ?>/js/imagesloaded.js"></script>
<script src="<?= $baseURL; ?>/js/isotope.js"></script>
<script src="https://unpkg.com/scrollreveal@beta"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.js"></script>

<script src="<?= $baseURL; ?>/js/jquery.magnific-popup.js?v=1.1.0" type="text/javascript"></script>
<script src="<?= $baseURL; ?>/js/progressbar.js?v=1.0.1" type="text/javascript"></script>

<script src="<?= $baseURL; ?>/js/jquery.counterup.minc619.js?v=1.0" type="text/javascript"></script>
<script src="<?= $baseURL; ?>/js/jquery.pjax.js?v=1.9.6" type="text/javascript"></script>
<script src="<?= $baseURL; ?>/js/owl.carousel.js?v=2.1.0" type="text/javascript"></script>
<script src="<?= $baseURL; ?>/js/headlines.js?v=1.0" type="text/javascript"></script>

<!-- Custom scripts -->
<script src="<?= $baseURL; ?>/js/animation.js" type="text/javascript"></script>
<script src="<?= $baseURL; ?>/js/custom.js" type="text/javascript"></script>

</body>
</html>
	
	
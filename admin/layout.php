<?php
$page=$_GET['p'];
require_once 'content/connexion_bd.php';

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    <link rel="shortcut icon" type="image/x-icon" href="assets/img/favicon.png">
    <title>Porfolio MLAGHUI BRAHIM - Administration</title>
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
     <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/fullcalendar.min.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/dataTables.bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/select2.min.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/plugins/morris/morris.css">
    <link rel="stylesheet" type="text/css" href="<?= $baseURL; ?>/assets/css/style.css">
  
    <!--[if lt IE 9]>
		<script src="assets/js/html5shiv.min.js"></script>
		<script src="assets/js/respond.min.js"></script>
	<![endif]-->
</head>

<body>
<?php

if( ($page!="login") && (!isset($_SESSION['connecte'])) )
{
	/*if(!isset($_SESSION['connecte']))
{
			header('Location: '.$baseURL.'/login');
			

	}*/
	?>
    <div class="main-wrapper">
        <div class="header">
            <div class="header-left">
                <a href="home" class="logo">
                    <img src="  <?=  $baseURL."/assets/img/logo.png"; ?>" width="40" height="40" alt="">
                </a>
            </div>
            <div class="page-title-box pull-left">
                <h3>Portfolio Administration </h3>
            </div>
            <a id="mobile_btn" class="mobile_btn pull-left" href="#sidebar"><i class="fa fa-bars" aria-hidden="true"></i></a>
            <ul class="nav navbar-nav navbar-right user-menu pull-right">
                <li class="dropdown hidden-xs">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell-o"></i> <span class="badge bg-primary pull-right">3</span></a>
                    <div class="dropdown-menu notifications">
                        <div class="topnav-dropdown-header">
                            <span>Notifications</span>
                        </div>
                        <div class="drop-scroll">
                            <ul class="media-list">
                                <li class="media notification-message">
                                    <a href="activities.html">
                                        <div class="media-left">
                                            <span class="avatar">
												<img alt="John Doe" src="
                                                <?php echo $baseURL."/assets/img/user.jpg"; ?>" class="img-responsive img-circle">
											</span>
                                        </div>
                                        <div class="media-body">
                                            <p class="noti-details"><span class="noti-title">John Doe</span> added new task <span class="noti-title">Patient appointment booking</span></p>
                                            <p class="noti-time"><span class="notification-time">4 mins ago</span></p>
                                        </div>
                                    </a>
                                </li>
                                <li class="media notification-message">
                                    <a href="activities.html">
                                        <div class="media-left">
                                            <span class="avatar">V</span>
                                        </div>
                                        <div class="media-body">
                                            <p class="noti-details"><span class="noti-title">Tarah Shropshire</span> changed the task name <span class="noti-title">Appointment booking with payment gateway</span></p>
                                            <p class="noti-time"><span class="notification-time">6 mins ago</span></p>
                                        </div>
                                    </a>
                                </li>
                                <li class="media notification-message">
                                    <a href="activities.html">
                                        <div class="media-left">
                                            <span class="avatar">L</span>
                                        </div>
                                        <div class="media-body">
                                            <p class="noti-details"><span class="noti-title">Misty Tison</span> added <span class="noti-title">Domenic Houston</span> and <span class="noti-title">Claire Mapes</span> to project <span class="noti-title">Doctor available module</span></p>
                                            <p class="noti-time"><span class="notification-time">8 mins ago</span></p>
                                        </div>
                                    </a>
                                </li>
                                <li class="media notification-message">
                                    <a href="activities.html">
                                        <div class="media-left">
                                            <span class="avatar">G</span>
                                        </div>
                                        <div class="media-body">
                                            <p class="noti-details"><span class="noti-title">Rolland Webber</span> completed task <span class="noti-title">Patient and Doctor video conferencing</span></p>
                                            <p class="noti-time"><span class="notification-time">12 mins ago</span></p>
                                        </div>
                                    </a>
                                </li>
                                <li class="media notification-message">
                                    <a href="activities.html">
                                        <div class="media-left">
                                            <span class="avatar">V</span>
                                        </div>
                                        <div class="media-body">
                                            <p class="noti-details"><span class="noti-title">Bernardo Galaviz</span> added new task <span class="noti-title">Private chat module</span></p>
                                            <p class="noti-time"><span class="notification-time">2 days ago</span></p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="topnav-dropdown-footer">
                            <a href="activities.html">View all Notifications</a>
                        </div>
                    </div>
                </li>
                <li class="dropdown hidden-xs">
                    <a href="javascript:;" id="open_msg_box" class="hasnotifications"><i class="fa fa-comment-o"></i> <span class="badge bg-primary pull-right">8</span></a>
                </li>
                <li class="dropdown">
                    <a href="profile.html" class="dropdown-toggle user-link" data-toggle="dropdown" title="Admin">
                        <span class="user-img"><img class="img-circle" src="  <?=$baseURL; ?>/assets/img/user.jpg" width="40" alt="Admin">
							<span class="status online"></span></span>
                        <span>Admin</span>
                        <i class="caret"></i>
                    </a>
                    <ul class="dropdown-menu">
                     
                        <li><a href="<?= $baseURL; ?>/logout">Logout</a></li>
                    </ul>
                </li>
            </ul>
            <div class="dropdown mobile-user-menu pull-right">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                <ul class="dropdown-menu pull-right">
                    <li><a href="profile.html">My Profile</a></li>
                    <li><a href="edit-profile.html">Edit Profile</a></li>
                    <li><a href="settings.html">Settings</a></li>
                    <li><a href="login.html">Logout</a></li>
                </ul>
            </div>
        </div>
        <div class="sidebar" id="sidebar">
            <div class="sidebar-inner slimscroll">
                <div id="sidebar-menu" class="sidebar-menu">
    
                    <ul>
                                            <li class="menu-title">Généralités</li>

                        <li class="active">
                            <a href="<?= $baseURL; ?>/home"><i class="fa fa-dashboard"></i> Dashboard</a>
                        </li>
                        <li>
                            <a href="<?= $baseURL; ?>/informations"><i class="fa fa-cog" aria-hidden="true"></i> Mes informations </a>
                        </li>
                        
                        
                        <li>
                            <a href="<?= $baseURL; ?>/formations"><i class="fa fa-graduation-cap" aria-hidden="true"></i> Mes Formations <span class="badge bg-primary pull-right">5</span></a>
                        </li>
                        <li>
                            <a href="<?= $baseURL; ?>/experiences"><i class="fa fa-shopping-bag" aria-hidden="true"></i> Mes expériences <span class="badge bg-primary pull-right">5</span></a>
                        </li>
                        
                        <li>
                            <a href="<?= $baseURL; ?>/projets"><i class="fa fa-ticket" aria-hidden="true"></i> Mes projets <span class="badge bg-primary pull-right">5</span></a>
                        </li>
                        <li>
                            <a href="<?= $baseURL; ?>/articles"><i class="fa fa-tasks" aria-hidden="true"></i> Mes articles <span class="badge bg-primary pull-right">5</span></a>
                        </li>
                        <li class="menu-title">Autres</li>
                        
                        <li>
                            <a href="<?= $baseURL; ?>/categories"><i class="fa fa-th" aria-hidden="true"></i> Catégories <span class="badge bg-success pull-right">5</span></a>
                        </li>
                        
                        
                        <li>
                            <a href="<?= $baseURL; ?>/instituts"><i class="fa fa-home" aria-hidden="true"></i> Instituts <span class="badge bg-success pull-right">5</span></a>
                        </li>
                        <li>
                            <a href="<?= $baseURL; ?>/technologies"><i class="fa fa-lightbulb-o" aria-hidden="true"></i> Technologies <span class="badge bg-success pull-right">5</span></a>
                        </li>
                        <li>
                            <a href="<?= $baseURL; ?>/qualites"><i class="fa fa-child" aria-hidden="true"></i> Qualités</a>
                        </li>
                        
                    </ul>
                    
                </div>
            </div>
        </div><?php
}
	?>
        <?= $content;?>
    </div>
    <div class="sidebar-overlay" data-reff=""></div>
    
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/jquery.slimscroll.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/select2.min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/moment.min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/bootstrap-datetimepicker.min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/plugins/morris/morris.min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/plugins/raphael/raphael-min.js"></script>
    <script type="text/javascript" src="<?= $baseURL; ?>/assets/js/app.js"></script>
    

</body>
</html>
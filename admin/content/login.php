<?php
require_once 'content/connexion_bd.php';
?>
<div class="main-wrapper">
        <div class="account-page">
            <div class="container">
                <h3 class="account-title">Se connecter</h3>
                <div class="account-box">
                    <div class="account-wrapper">
                        <div class="account-logo">
                            <a href="<?= $baseURL; ?>/home"><img src="<?= $baseURL; ?>/assets/img/logo2.png" alt="Porfolio Admin MLAGHUI BRAHIM"/></a>
                        </div>
                        <form method="post">
                            <div class="form-group form-focus">
                                <label class="control-label">Login</label>
                                <input class="form-control floating" type="text" name="login">
                            </div>
                            <div class="form-group form-focus">
                                <label class="control-label">Mot de passe</label>
                                <input class="form-control floating" type="password" name="pwd">
                            </div>
                            <div class="form-group text-center">
                                <input class="btn btn-primary btn-block account-btn" type="submit" name="log" value="Se connecter"/>
                            </div>
                            <div class="text-center">
                                <a href="forgot-password.html">Mot de passe oublié?</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
	if(isset($_POST['log']))
	{
		
		$mdp = sha1($_POST['pwd']);
		$login = $_POST['login'];
		
		$requete = $bdd->query("SELECT * FROM portfolio_user WHERE login_user = '".$login."' AND mdp_user = '".$mdp."'");//J'interroge la bdd
		
		if($reponse = $requete->fetch())//recupere le resultat de la requete
		{
            
			$_SESSION['connecte'] = true;
			$_SESSION['id_u'] = $reponse['id_user'];
			$_SESSION['login'] = $_POST['login_user'];
			$_SESSION['nom'] = $_POST['nom_prenom_user'];
		header('Location: '.$baseURL.'/home');
           
		}
		else
		{
		header('Location: '.$baseURL.'/login');
		}
		}
	?>
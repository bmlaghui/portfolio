<?php
require_once 'content/connexion_bd.php';
$id_formation=$_GET['id'];
$ReqFormation=$bdd->query("select f.*,i.* from portfolio_formation f, portfolio_institut i where f.id_institut=i.id_institut and f.id_formation=".$id_formation);
$Formation=$ReqFormation->fetch();
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="blog-view">
                            <article class="blog blog-single-post">
                                <h3 class="blog-title"><?= $Formation['lib_formation'];?></h3>
                                <div class="blog-info clearfix">
                                    <div class="post-left">
                                        <ul>
                                            <li><a href="#."><i class="fa fa-calendar" aria-hidden="true"></i> <span><?= $Formation['annee_debut_formation'];?>  <?php
					 if($Formation['annee_fin_formation']==NULL)
					 echo " - Aujourd'hui";
					 elseif ($Formation['annee_debut_formation'] != $Formation['annee_fin_formation'])
					 echo " - ".$Formation['annee_fin_formation'];?></span></a></li>
                                            <li><a href="#."><i class="fa fa-graduation-cap" aria-hidden="true"></i> <span><?= $Formation['lib_institut']; ?></span></a></li>
                                        </ul>
                                    </div>
                                    
                                </div>
                                <div class="blog-image">
                                    <a href="#."><img alt="" src="assets/img/blog/blog-01.jpg" class="img-responsive"></a>
                                </div>
                                <div class="blog-content">
                                    
                                    
                                    <blockquote>
                                        <p><?= $Formation['description_formation'];?></p>
                                    </blockquote>
                                    
                                </div>
                            </article>
                            
                            <div class="widget author-widget clearfix">
                                <h3>Screenshoots</h3>
                                <div class="about-author">
                                    <div class="about-author-img">
                                        <div class="author-img-wrap">
                                            <img class="img-responsive img-circle" alt="" src="assets/img/user.jpg">
                                        </div>
                                    </div>
                                    <div class="author-details">
                                        <span class="blog-author-name">Linda Barrett</span>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="widget blog-comments clearfix">
                                <h3>Comments (3)</h3>
                                <ul class="comments-list">
                                    <li>
                                        <div class="comment">
                                            <div class="comment-author">
                                                <img class="avatar" alt="" src="assets/img/user.jpg">
                                            </div>
                                            <div class="comment-block">
                                                <span class="comment-by">
													<span class="blog-author-name">Diana Bailey</span>
                                                <span class="pull-right">
														<span class="blog-reply"><a href="#."><i class="fa fa-reply"></i> Reply</a></span>
                                                </span>
                                                </span>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae, gravida pellentesque urna varius vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae. Sed dui lorem, adipiscing in adipiscing et, interdum nec metus. Mauris ultricies, justo eu convallis placerat, felis enim ornare nisi, vitae mattis nulla ante id dui.</p>
                                                <span class="blog-date">December 6, 2017</span>
                                            </div>
                                        </div>
                                        <ul class="comments-list reply">
                                            <li>
                                                <div class="comment">
                                                    <div class="comment-author">
                                                        <img class="avatar" alt="" src="assets/img/user.jpg">
                                                    </div>
                                                    <div class="comment-block">
                                                        <span class="comment-by">
															<span class="blog-author-name">Henry Daniels</span>
                                                        <span class="pull-right">
																<span class="blog-reply"><a href="#."><i class="fa fa-reply"></i> Reply</a></span>
                                                        </span>
                                                        </span>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae, gravida pellentesque urna varius vitae.</p>
                                                        <span class="blog-date">December 6, 2017</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="comment">
                                                    <div class="comment-author">
                                                        <img class="avatar" alt="" src="assets/img/user.jpg">
                                                    </div>
                                                    <div class="comment-block">
                                                        <span class="comment-by">
															<span class="blog-author-name">Diana Bailey</span>
                                                        <span class="pull-right">
														<span class="blog-reply"> <a href="#."><i class="fa fa-reply"></i> Reply</a></span>
                                                        </span>
                                                        </span>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae, gravida pellentesque urna varius vitae.</p>
                                                        <span class="blog-date">December 7, 2017</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="comment">
                                            <div class="comment-author">
                                                <img class="avatar" alt="" src="assets/img/user.jpg">
                                            </div>
                                            <div class="comment-block">
                                                <span class="comment-by">
													<span class="blog-author-name">Marie Wells</span>
                                                <span class="pull-right">
														<span class="blog-reply"><a href="#."><i class="fa fa-reply"></i> Reply</a></span>
                                                </span>
                                                </span>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                <span class="blog-date">December 11, 2017</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="comment">
                                            <div class="comment-author">
                                                <img class="avatar" alt="" src="assets/img/user.jpg">
                                            </div>
                                            <div class="comment-block">
                                                <span class="comment-by">
													<span class="blog-author-name">Pamela Curtis</span>
                                                <span class="pull-right">
														<span class="blog-reply"><a href="#."><i class="fa fa-reply"></i> Reply</a></span>
                                                </span>
                                                </span>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                <span class="blog-date">December 13, 2017</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="widget new-comment clearfix">
                                <h3>Leave Comment</h3>
                                <form>
                                    <div class="row">
                                        <div class="col-sm-8">
                                            <div class="form-group">
                                                <label>Name <span class="text-red">*</span></label>
                                                <input type="text" class="form-control">
                                            </div>
                                            <div class="form-group">
                                                <label>Your email address <span class="text-red">*</span></label>
                                                <input type="email" class="form-control">
                                            </div>
                                            <div class="form-group">
                                                <label>Comments</label>
                                                <textarea rows="4" class="form-control"></textarea>
                                            </div>
                                            <div class="comment-submit">
                                                <input type="submit" value="Submit" class="btn">
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
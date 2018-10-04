<?php
include 'connexion_bd.php';
?>
<div class="page-wrapper">
            <div class="content container-fluid">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-lg-3">
                        <div class="dash-widget dash-widget5">
                            <span class="dash-widget-icon bg-success"><i class="fa fa-money" aria-hidden="true"></i></span>
                            <div class="dash-widget-info">
                                <h3>$998</h3>
                                <span>Revenue</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-6 col-lg-3">
                        <div class="dash-widget dash-widget5">
                            <span class="dash-widget-icon bg-info"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                            <div class="dash-widget-info">
                                <h3>1072</h3>
                                <span>Users</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-6 col-lg-3">
                        <div class="dash-widget dash-widget5">
                            <span class="dash-widget-icon bg-warning"><i class="fa fa-files-o"></i></span>
                            <div class="dash-widget-info">
                                <h3>72</h3>
                                <span>Projects</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-6 col-lg-3">
                        <div class="dash-widget dash-widget5">
                            <span class="dash-widget-icon bg-danger"><i class="fa fa-tasks" aria-hidden="true"></i></span>
                            <div class="dash-widget-info">
                                <h3>618</h3>
                                <span>Tasks</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="card-box">
                            <div id="bar-example"></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-6 col-xs-12">
                        <div class="panel">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Project Status</h3>
                            </div>
                            <div class="panel-body">
                                <div id="donutChart" class="rad-chart"></div>
                            </div>

                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-xs-12">
                        <div class="panel">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Product Status</h3>
                            </div>
                            <div class="panel-body">
                                <div id="areaChart" class="rad-chart"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-12 col-xs-12">
                        <div class="panel">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Task Status</h3>
                            </div>
                            <div class="panel-body">
                                <div id="area-chart" class="rad-chart"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="panel activity-panel">
                            <div class="panel-heading">
                                <h6 class="panel-title">Activities</h6>
                            </div>
                            <div class="panel-body">
                                <div class="activity-box">
                                    <ul class="activity-list">
                                        <li>
                                            <div class="activity-user">
                                                <a href="profile.html" title="Lesley Grauer" data-toggle="tooltip" class="avatar">
                                                    <img alt="Lesley Grauer" src="assets/img/user.jpg" class="img-responsive img-circle">
                                                </a>
                                            </div>
                                            <div class="activity-content">
                                                <div class="timeline-content">
                                                    <a href="profile.html" class="name">Lesley Grauer</a> added new task <a href="#">Hospital Administration</a>
                                                    <span class="time">4 mins ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="activity-user">
                                                <a href="profile.html" class="avatar" title="Jeffery Lalor" data-toggle="tooltip">L</a>
                                            </div>
                                            <div class="activity-content">
                                                <div class="timeline-content">
                                                    <a href="profile.html" class="name">Jeffery Lalor</a> added <a href="profile.html" class="name">Loren Gatlin</a> and <a href="profile.html" class="name">Tarah Shropshire</a> to project <a href="#">Patient appointment booking</a>
                                                    <span class="time">6 mins ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="activity-user">
                                                <a href="profile.html" title="Catherine Manseau" data-toggle="tooltip" class="avatar">
                                                    <img alt="Catherine Manseau" src="assets/img/user.jpg" class="img-responsive img-circle">
                                                </a>
                                            </div>
                                            <div class="activity-content">
                                                <div class="timeline-content">
                                                    <a href="profile.html" class="name">Catherine Manseau</a> completed task <a href="#">Appointment booking with payment gateway</a>
                                                    <span class="time">12 mins ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="activity-user">
                                                <a href="#" title="Bernardo Galaviz" data-toggle="tooltip" class="avatar">
                                                    <img alt="Bernardo Galaviz" src="assets/img/user.jpg" class="img-responsive img-circle">
                                                </a>
                                            </div>
                                            <div class="activity-content">
                                                <div class="timeline-content">
                                                    <a href="profile.html" class="name">Bernardo Galaviz</a> changed the task name <a href="#">Doctor available module</a>
                                                    <span class="time">1 day ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="activity-user">
                                                <a href="profile.html" title="Mike Litorus" data-toggle="tooltip" class="avatar">
                                                    <img alt="Mike Litorus" src="assets/img/user.jpg" class="img-responsive img-circle">
                                                </a>
                                            </div>
                                            <div class="activity-content">
                                                <div class="timeline-content">
                                                    <a href="profile.html" class="name">Mike Litorus</a> added new task <a href="#">Patient and Doctor video conferencing</a>
                                                    <span class="time">2 days ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="activity-user">
                                                <a href="profile.html" title="Jeffery Lalor" data-toggle="tooltip" class="avatar">
                                                    <img alt="Jeffery Lalor" src="assets/img/user.jpg" class="img-responsive img-circle">
                                                </a>
                                            </div>
                                            <div class="activity-content">
                                                <div class="timeline-content">
                                                    <a href="profile.html" class="name">Jeffery Lalor</a> added <a href="profile.html" class="name">Jeffrey Warden</a> and <a href="profile.html" class="name">Bernardo Galaviz</a> to the task of <a href="#">Private chat module</a>
                                                    <span class="time">7 days ago</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="panel-footer text-center bg-white">
                                <a href="activities.html" class="text-primary">View all activities</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="panel chat-panel">
                            <div class="panel-heading">
                                <div class="navbar">
                                    <div class="user-details">
                                        <div class="pull-left user-img m-r-10">
                                            <a href="profile.html" title="Mike Litorus"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status online"></span></a>
                                        </div>
                                        <div class="user-info pull-left">
                                            <a href="profile.html" title="Mike Litorus"><span class="font-bold">Mike Litorus</span> <i class="typing-text">Typing...</i></a>
                                            <span class="last-seen">Last seen today at 7:50 AM</span>
                                        </div>
                                    </div>
                                    <ul class="nav navbar-nav pull-right custom-menu">
                                        <li>
                                            <a href="voice-call.html"><i class="fa fa-phone" aria-hidden="true"></i></a>
                                        </li>
                                        <li>
                                            <a href="video-call.html"><i class="fa fa-video-camera" aria-hidden="true"></i></a>
                                        </li>
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog"></i></a>
                                            <ul class="dropdown-menu">
                                                <li><a href="javascript:void(0)">Delete Conversations</a></li>
                                                <li><a href="javascript:void(0)">Settings</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="panel-body">
                                <div class="chats">
                                    <div class="chat chat-right">
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>Hello. What can I do for you?</p>
                                                    <span class="chat-time">8:30 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat-line">
                                        <span class="chat-date">October 8th, 2015</span>
                                    </div>
                                    <div class="chat chat-left">
                                        <div class="chat-avatar">
                                            <a href="profile.html" class="avatar">
                                                <img alt="John Doe" src="assets/img/user.jpg" class="img-responsive img-circle">
                                            </a>
                                        </div>
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>I'm just looking around.</p>
                                                    <p>Will you tell me something about yourself? </p>
                                                    <span class="chat-time">8:35 am</span>
                                                </div>
                                            </div>
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>Are you there? That time!</p>
                                                    <span class="chat-time">8:40 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat chat-right">
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>Where?</p>
                                                    <span class="chat-time">8:35 am</span>
                                                </div>
                                            </div>
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>OK, my name is Limingqiang. I like singing, playing basketballand so on.</p>
                                                    <span class="chat-time">8:42 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat chat-right">
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>OK!</p>
                                                    <span class="chat-time">9:00 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat chat-left">
                                        <div class="chat-avatar">
                                            <a href="profile.html" class="avatar">
                                                <img alt="John Doe" src="assets/img/user.jpg" class="img-responsive img-circle">
                                            </a>
                                        </div>
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>Uploaded 3 files</p>
                                                    <ul class="attach-list">
                                                        <li><i class="fa fa-file"></i> <a href="#">example.avi</a></li>
                                                        <li><i class="fa fa-file"></i> <a href="#">activity.psd</a></li>
                                                        <li><i class="fa fa-file"></i> <a href="#">example.psd</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>Consectetuorem ipsum dolor sit?</p>
                                                    <span class="chat-time">8:50 am</span>
                                                </div>
                                            </div>
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>OK?</p>
                                                    <span class="chat-time">8:55 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat chat-left">
                                        <div class="chat-avatar">
                                            <a href="profile.html" class="avatar">
                                                <img alt="John Doe" src="assets/img/user.jpg" class="img-responsive img-circle">
                                            </a>
                                        </div>
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <ul class="attach-list">
                                                        <li class="pdf-file"><i class="fa fa-file-pdf-o"></i> <a href="#">Document_2016.pdf</a></li>
                                                    </ul>
                                                    <span class="chat-time">9:00 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat chat-right">
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <ul class="attach-list">
                                                        <li class="pdf-file"><i class="fa fa-file-pdf-o"></i> <a href="#">Document_2016.pdf</a></li>
                                                    </ul>
                                                    <span class="chat-time">9:00 am</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat chat-left">
                                        <div class="chat-avatar">
                                            <a href="profile.html" class="avatar">
                                                <img alt="John Doe" src="assets/img/user.jpg" class="img-responsive img-circle">
                                            </a>
                                        </div>
                                        <div class="chat-body">
                                            <div class="chat-bubble">
                                                <div class="chat-content">
                                                    <p>Typing ...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <div class="message-bar">
                                    <div class="message-inner">
                                        <a class="link attach-icon" href="#" data-toggle="modal" data-target="#drag_files"><img src="assets/img/attachment.png" alt=""></a>
                                        <div class="message-area">
                                            <div class="input-group">
                                                <textarea class="form-control" placeholder="Type message..."></textarea>
                                                <span class="input-group-btn">
													<button class="btn btn-primary" type="button"><i class="fa fa-send"></i></button>
												</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="panel task-panel">
                            <div class="panel-heading">
                                <div class="navbar">
                                    <div class="pull-left">
                                        <div class="add-task-btn-wrapper">
                                            <span class="add-task-btn btn btn-default btn-xs">
													Add Task
												</span>
                                        </div>
                                    </div>
                                    <ul class="nav navbar-nav pull-right custom-menu">
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog"></i></a>
                                            <ul class="dropdown-menu">
                                                <li><a href="javascript:void(0)">Pending Tasks</a></li>
                                                <li><a href="javascript:void(0)">Completed Tasks</a></li>
                                                <li><a href="javascript:void(0)">All Tasks</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="panel-body">
                                <div class="task-wrapper">
                                    <div class="task-list-container">
                                        <div class="task-list-body">
                                            <ul id="task-list">
                                                <li class="task">
                                                    <div class="task-container">
                                                        <span class="task-action-btn task-check">
																<span class="action-circle large complete-btn" title="Mark Complete">
																	<i class="material-icons">check</i>
																</span>
                                                        </span>
                                                        <span class="task-label" contenteditable="true">Patient appointment booking</span>
                                                        <span class="task-action-btn task-btn-right">
																<span class="action-circle large" title="Assign">
																	<i class="material-icons">person_add</i>
																</span>
                                                        <span class="action-circle large delete-btn" title="Delete Task">
																	<i class="material-icons">delete</i>
																</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li class="task">
                                                    <div class="task-container">
                                                        <span class="task-action-btn task-check">
																<span class="action-circle large complete-btn" title="Mark Complete">
																	<i class="material-icons">check</i>
																</span>
                                                        </span>
                                                        <span class="task-label" contenteditable="true">Appointment booking with payment gateway</span>
                                                        <span class="task-action-btn task-btn-right">
																<span class="action-circle large" title="Assign">
																	<i class="material-icons">person_add</i>
																</span>
                                                        <span class="action-circle large delete-btn" title="Delete Task">
																	<i class="material-icons">delete</i>
																</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li class="completed task">
                                                    <div class="task-container">
                                                        <span class="task-action-btn task-check">
																<span class="action-circle large complete-btn" title="Mark Complete">
																	<i class="material-icons">check</i>
																</span>
                                                        </span>
                                                        <span class="task-label">Doctor available module</span>
                                                        <span class="task-action-btn task-btn-right">
																<span class="action-circle large" title="Assign">
																	<i class="material-icons">person_add</i>
																</span>
                                                        <span class="action-circle large delete-btn" title="Delete Task">
																	<i class="material-icons">delete</i>
																</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li class="task">
                                                    <div class="task-container">
                                                        <span class="task-action-btn task-check">
																<span class="action-circle large complete-btn" title="Mark Complete">
																	<i class="material-icons">check</i>
																</span>
                                                        </span>
                                                        <span class="task-label" contenteditable="true">Patient and Doctor video conferencing</span>
                                                        <span class="task-action-btn task-btn-right">
																<span class="action-circle large" title="Assign">
																	<i class="material-icons">person_add</i>
																</span>
                                                        <span class="action-circle large delete-btn" title="Delete Task">
																	<i class="material-icons">delete</i>
																</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li class="task">
                                                    <div class="task-container">
                                                        <span class="task-action-btn task-check">
																<span class="action-circle large complete-btn" title="Mark Complete">
																	<i class="material-icons">check</i>
																</span>
                                                        </span>
                                                        <span class="task-label" contenteditable="true">Private chat module</span>
                                                        <span class="task-action-btn task-btn-right">
																<span class="action-circle large" title="Assign">
																	<i class="material-icons">person_add</i>
																</span>
                                                        <span class="action-circle large delete-btn" title="Delete Task">
																	<i class="material-icons">delete</i>
																</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li class="task">
                                                    <div class="task-container">
                                                        <span class="task-action-btn task-check">
																<span class="action-circle large complete-btn" title="Mark Complete">
																	<i class="material-icons">check</i>
																</span>
                                                        </span>
                                                        <span class="task-label" contenteditable="true">Patient Profile add</span>
                                                        <span class="task-action-btn task-btn-right">
																<span class="action-circle large" title="Assign">
																	<i class="material-icons">person_add</i>
																</span>
                                                        <span class="action-circle large delete-btn" title="Delete Task">
																	<i class="material-icons">delete</i>
																</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="task-list-footer">
                                            <div class="new-task-wrapper">
                                                <textarea id="new-task" placeholder="Enter new task here. . ."></textarea>
                                                <span class="error-message hidden">You need to enter a task first</span>
                                                <span class="add-new-task-btn btn" id="add-task">Add Task</span>
                                                <span class="cancel-btn btn" id="close-task-panel">Close</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="panel member-panel">
                            <div class="panel-heading">
                                <h3 class="panel-title">Contacts</h3>
                            </div>
                            <div class="panel-body">
                                <ul class="contact-list">
                                    <li>
                                        <div class="contact-cont">
                                            <div class="pull-left user-img m-r-10">
                                                <a href="profile.html" title="John Doe"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status online"></span></a>
                                            </div>
                                            <div class="contact-info">
                                                <span class="contact-name text-ellipsis">John Doe</span>
                                                <span class="contact-date">Web Developer</span>
                                            </div>
                                            <ul class="contact-action">
                                                <li class="dropdown">
                                                    <a href="#" class="dropdown-toggle action-icon" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)">Edit</a></li>
                                                        <li><a href="javascript:void(0)">Delete</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="contact-cont">
                                            <div class="pull-left user-img m-r-10">
                                                <a href="profile.html" title="Richard Miles"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status offline"></span></a>
                                            </div>
                                            <div class="contact-info">
                                                <span class="contact-name text-ellipsis">Richard Miles</span>
                                                <span class="contact-date">Web Developer</span>
                                            </div>
                                            <ul class="contact-action">
                                                <li class="dropdown">
                                                    <a href="#" class="dropdown-toggle action-icon" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)">Edit</a></li>
                                                        <li><a href="javascript:void(0)">Delete</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="contact-cont">
                                            <div class="pull-left user-img m-r-10">
                                                <a href="profile.html" title="John Doe"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status away"></span></a>
                                            </div>
                                            <div class="contact-info">
                                                <span class="contact-name text-ellipsis">John Doe</span>
                                                <span class="contact-date">Web Developer</span>
                                            </div>
                                            <ul class="contact-action">
                                                <li class="dropdown">
                                                    <a href="#" class="dropdown-toggle action-icon" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)">Edit</a></li>
                                                        <li><a href="javascript:void(0)">Delete</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="contact-cont">
                                            <div class="pull-left user-img m-r-10">
                                                <a href="profile.html" title="Richard Miles"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status online"></span></a>
                                            </div>
                                            <div class="contact-info">
                                                <span class="contact-name text-ellipsis">Richard Miles</span>
                                                <span class="contact-date">Web Developer</span>
                                            </div>
                                            <ul class="contact-action">
                                                <li class="dropdown">
                                                    <a href="#" class="dropdown-toggle action-icon" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)">Edit</a></li>
                                                        <li><a href="javascript:void(0)">Delete</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="contact-cont">
                                            <div class="pull-left user-img m-r-10">
                                                <a href="profile.html" title="John Doe"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status offline"></span></a>
                                            </div>
                                            <div class="contact-info">
                                                <span class="contact-name text-ellipsis">John Doe</span>
                                                <span class="contact-date">Web Developer</span>
                                            </div>
                                            <ul class="contact-action">
                                                <li class="dropdown">
                                                    <a href="#" class="dropdown-toggle action-icon" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)">Edit</a></li>
                                                        <li><a href="javascript:void(0)">Delete</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="contact-cont">
                                            <div class="pull-left user-img m-r-10">
                                                <a href="profile.html" title="Richard Miles"><img src="assets/img/user.jpg" alt="" class="w-40 img-circle"><span class="status away"></span></a>
                                            </div>
                                            <div class="contact-info">
                                                <span class="contact-name text-ellipsis">Richard Miles</span>
                                                <span class="contact-date">Web Developer</span>
                                            </div>
                                            <ul class="contact-action">
                                                <li class="dropdown">
                                                    <a href="#" class="dropdown-toggle action-icon" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a href="javascript:void(0)">Edit</a></li>
                                                        <li><a href="javascript:void(0)">Delete</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="panel-footer text-center bg-white">
                                <a href="users.html" class="text-primary">View all members</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="panel panel-table panel-table-top">
                            <div class="panel-heading">
                                <h3 class="panel-title">Invoices</h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-striped custom-table m-b-0">
                                        <thead>
                                            <tr>
                                                <th>Invoice ID</th>
                                                <th>Client</th>
                                                <th>Due Date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="invoice-view.html">#INV-0001</a></td>
                                                <td>
                                                    <h2><a href="#">Hazel Nutt</a></h2>
                                                </td>
                                                <td>8 Aug 2017</td>
                                                <td>$380</td>
                                                <td>
                                                    <span class="label label-warning-border">Partially Paid</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="invoice-view.html">#INV-0002</a></td>
                                                <td>
                                                    <h2><a href="#">Paige Turner</a></h2>
                                                </td>
                                                <td>17 Sep 2017</td>
                                                <td>$500</td>
                                                <td>
                                                    <span class="label label-success-border">Paid</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="invoice-view.html">#INV-0003</a></td>
                                                <td>
                                                    <h2><a href="#">Ben Dover</a></h2>
                                                </td>
                                                <td>30 Nov 2017</td>
                                                <td>$60</td>
                                                <td>
                                                    <span class="label label-danger-border">Unpaid</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <a href="invoices.html" class="text-primary">View all invoices</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="panel panel-table panel-table-top">
                            <div class="panel-heading">
                                <h3 class="panel-title">Payments</h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-striped custom-table m-b-0">
                                        <thead>
                                            <tr>
                                                <th>Invoice ID</th>
                                                <th>Client</th>
                                                <th>Payment Type</th>
                                                <th>Paid Date</th>
                                                <th>Paid Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="invoice-view.html">#INV-0004</a></td>
                                                <td>
                                                    <h2><a href="#">Barry Cuda</a></h2>
                                                </td>
                                                <td>Paypal</td>
                                                <td>11 Jun 2017</td>
                                                <td>$380</td>
                                            </tr>
                                            <tr>
                                                <td><a href="invoice-view.html">#INV-0005</a></td>
                                                <td>
                                                    <h2><a href="#">Tressa Wexler</a></h2>
                                                </td>
                                                <td>Paypal</td>
                                                <td>21 Jul 2017</td>
                                                <td>$500</td>
                                            </tr>
                                            <tr>
                                                <td><a href="invoice-view.html">#INV-0006</a></td>
                                                <td>
                                                    <h2><a href="#">Ruby Bartlett</a></h2>
                                                </td>
                                                <td>Paypal</td>
                                                <td>28 Aug 2017</td>
                                                <td>$60</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <a href="payments.html" class="text-primary">View all payments</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="panel panel-table">
                            <div class="panel-heading">
                                <h3 class="panel-title">Clients</h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-striped custom-table m-b-0">
                                        <thead>
                                            <tr>
                                                <th style="min-width:200px;">Name</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th class="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style="min-width:200px;">
                                                    <a href="#" class="avatar">B</a>
                                                    <h2><a href="client-profile.html">Barry Cuda <span>CEO</span></a></h2>
                                                </td>
                                                <td>barrycuda@example.com</td>
                                                <td>
                                                    <div class="dropdown action-label">
                                                        <a class="btn btn-white btn-sm rounded dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-dot-circle-o text-success"></i> Active <i class="caret"></i>
															</a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-success"></i> Active</a></li>
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-danger"></i> Inactive</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a class="avatar">T</a>
                                                    <h2><a href="client-profile.html">Tressa Wexler <span>Manager</span></a></h2>
                                                </td>
                                                <td>tressawexler@example.com</td>
                                                <td>
                                                    <div class="dropdown action-label">
                                                        <a class="btn btn-white btn-sm rounded dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-dot-circle-o text-danger"></i> Inactive <i class="caret"></i>
															</a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-success"></i> Active</a></li>
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-danger"></i> Inactive</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="client-profile.html" class="avatar">R</a>
                                                    <h2><a href="client-profile.html">Ruby Bartlett <span>CEO</span></a></h2>
                                                </td>
                                                <td>rubybartlett@example.com</td>
                                                <td>
                                                    <div class="dropdown action-label">
                                                        <a class="btn btn-white btn-sm rounded dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-dot-circle-o text-danger"></i> Inactive <i class="caret"></i>
															</a>

                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-success"></i> Active</a></li>
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-danger"></i> Inactive</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="client-profile.html" class="avatar">M</a>
                                                    <h2><a href="client-profile.html"> Misty Tison <span>CEO</span></a></h2>
                                                </td>
                                                <td>mistytison@example.com</td>
                                                <td>
                                                    <div class="dropdown action-label">
                                                        <a class="btn btn-white btn-sm rounded dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-dot-circle-o text-success"></i> Active <i class="caret"></i>
															</a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-success"></i> Active</a></li>
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-danger"></i> Inactive</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="client-profile.html" class="avatar">D</a>
                                                    <h2><a href="client-profile.html"> Daniel Deacon <span>CEO</span></a></h2>
                                                </td>
                                                <td>danieldeacon@example.com</td>
                                                <td>
                                                    <div class="dropdown action-label">
                                                        <a class="btn btn-white btn-sm rounded dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-dot-circle-o text-danger"></i> Inactive <i class="caret"></i>
															</a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-success"></i> Active</a></li>
                                                            <li><a href="#"><i class="fa fa-dot-circle-o text-danger"></i> Inactive</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <a href="clients.html" class="text-primary">View all clients</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="panel panel-table">
                            <div class="panel-heading">
                                <h3 class="panel-title">Recent Projects</h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-striped custom-table m-b-0">
                                        <thead>
                                            <tr>
                                                <th class="col-md-3">Project Name </th>
                                                <th class="col-md-3">Progress</th>
                                                <th class="text-right col-md-1">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <h2><a href="project-view.html">Office Management</a></h2>
                                                    <small class="block text-ellipsis">
															<span class="text-xs">1</span> <span class="text-muted">open tasks, </span>
															<span class="text-xs">9</span> <span class="text-muted">tasks completed</span>
														</small>
                                                </td>
                                                <td>
                                                    <div class="progress progress-xs progress-striped">
                                                        <div class="progress-bar bg-success" role="progressbar" data-toggle="tooltip" title="65%" style="width: 65%"></div>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="project-view.html">Project Management</a></h2>
                                                    <small class="block text-ellipsis">
															<span class="text-xs">2</span> <span class="text-muted">open tasks, </span>
															<span class="text-xs">5</span> <span class="text-muted">tasks completed</span>
														</small>
                                                </td>
                                                <td>
                                                    <div class="progress progress-xs progress-striped">
                                                        <div class="progress-bar bg-success" role="progressbar" data-toggle="tooltip" title="15%" style="width: 15%"></div>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="project-view.html">Video Calling App</a></h2>
                                                    <small class="block text-ellipsis">
															<span class="text-xs">3</span> <span class="text-muted">open tasks, </span>
															<span class="text-xs">3</span> <span class="text-muted">tasks completed</span>
														</small>
                                                </td>
                                                <td>
                                                    <div class="progress progress-xs progress-striped">
                                                        <div class="progress-bar bg-success" role="progressbar" data-toggle="tooltip" title="49%" style="width: 49%"></div>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="project-view.html">Hospital Administration</a></h2>
                                                    <small class="block text-ellipsis">
															<span class="text-xs">12</span> <span class="text-muted">open tasks, </span>
															<span class="text-xs">4</span> <span class="text-muted">tasks completed</span>
														</small>
                                                </td>
                                                <td>
                                                    <div class="progress progress-xs progress-striped">
                                                        <div class="progress-bar bg-success" role="progressbar" data-toggle="tooltip" title="88%" style="width: 88%"></div>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="project-view.html">Digital Marketplace</a></h2>
                                                    <small class="block text-ellipsis">
															<span class="text-xs">7</span> <span class="text-muted">open tasks, </span>
															<span class="text-xs">14</span> <span class="text-muted">tasks completed</span>
														</small>
                                                </td>
                                                <td>
                                                    <div class="progress progress-xs progress-striped">
                                                        <div class="progress-bar bg-success" role="progressbar" data-toggle="tooltip" title="100%" style="width: 100%"></div>
                                                    </div>
                                                </td>
                                                <td class="text-right">
                                                    <div class="dropdown">
                                                        <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="#" title="Edit"><i class="fa fa-pencil m-r-5"></i> Edit</a></li>
                                                            <li><a href="#" title="Delete"><i class="fa fa-trash-o m-r-5"></i> Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <a href="projects.html" class="text-primary">View all projects</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="themes">
                    <div class="themes-icon"><i class="fa fa-cog"></i></div>
                    <div class="themes-body">
                        <ul id="theme-change" class="theme-colors">
                            <li><a href="https://dreamguys.co.in/preadmin/light/index.html"><span class="theme-light"></span></a></li>
                            <li><a href="https://dreamguys.co.in/preadmin/orange/index.html"><span class="theme-orange"></span></a></li>
                            <li><a href="https://dreamguys.co.in/preadmin/purple/index.html"><span class="theme-purple"></span></a></li>
                            <li><a href="index-2.html"><span class="theme-blue"></span></a></li>
                            <li><a href="https://dreamguys.co.in/preadmin/dark/index.html"><span class="theme-dark"></span></a></li>
                            <li><a href="https://dreamguys.co.in/preadmin/rtl/index.html"><span class="theme-rtl">RTL</span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="notification-box">
                <div class="msg-sidebar notifications msg-noti">
                    <div class="topnav-dropdown-header">
                        <span>Messages</span>
                    </div>
                    <div class="drop-scroll msg-list-scroll">
                        <ul class="list-box">
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">R</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">Richard Miles </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item new-message">
                                        <div class="list-left">
                                            <span class="avatar">J</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">John Doe</span>
                                            <span class="message-time">1 Aug</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">T</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author"> Tarah Shropshire </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">M</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">Mike Litorus</span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">C</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author"> Catherine Manseau </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">D</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author"> Domenic Houston </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">B</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author"> Buster Wigton </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">R</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author"> Rolland Webber </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">C</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author"> Claire Mapes </span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">M</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">Melita Faucher</span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">J</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">Jeffery Lalor</span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">L</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">Loren Gatlin</span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="chat.html">
                                    <div class="list-item">
                                        <div class="list-left">
                                            <span class="avatar">T</span>
                                        </div>
                                        <div class="list-body">
                                            <span class="message-author">Tarah Shropshire</span>
                                            <span class="message-time">12:28 AM</span>
                                            <div class="clearfix"></div>
                                            <span class="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="topnav-dropdown-footer">
                        <a href="chat.html">See all messages</a>
                    </div>
                </div>
            </div>
        </div>
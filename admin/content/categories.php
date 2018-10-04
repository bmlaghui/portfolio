<?php
   require_once 'content/connexion_bd.php';
   ?>
<div class="page-wrapper" style="min-height: 613px;">
   <div class="content container-fluid">
      <div class="row">
         <div class="col-xs-8">
            <h4 class="page-title">Catégories</h4>
         </div>
         <div class="col-xs-4 text-right m-b-30">
            <a href="addcategorie" class="btn btn-primary rounded pull-right" ><i class="fa fa-plus"></i> Ajouter une catégorie</a>
         </div>
      </div>
      <div class="row">
         <div class="col-md-12">
            <div class="table-responsive">
               <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
                  <div class="row">
                     <div class="col-sm-6">
                        <div class="dataTables_length" id="DataTables_Table_0_length">
                           <label>
                              Afficher 
                              <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" class="form-control input-sm">
                                 <option value="10">10</option>
                                 <option value="25">25</option>
                                 <option value="50">50</option>
                                 <option value="100">100</option>
                              </select>
                              enregistrements
                           </label>
                        </div>
                     </div>
                     <div class="col-sm-6"></div>
                  </div>
                  <div class="row">
                     <div class="col-sm-12">
                        <table class="table table-striped custom-table m-b-0 datatable dataTable no-footer" id="DataTables_Table_0" role="grid" aria-describedby="DataTables_Table_0_info">
                           <thead>
                              <tr role="row">
                                 <th class="sorting_asc" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Ticket Id: activate to sort column descending" style="width: 68px;">Catégorie</th>
                                 <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Ticket Subject: activate to sort column ascending" style="width: 109px;">Description</th>
                                 <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Assigned Staff: activate to sort column ascending" style="width: 110px;">Note</th>
                                 <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Created Date: activate to sort column ascending" style="width: 120px;">Abbréviation</th>
                                  <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="2" aria-label="Created Date: activate to sort column ascending" style="width: 120px;">Opérations</th>
                                 
                                 
                                 
                                 
                              </tr>
                           </thead>
                           <tbody>
                           <?php
						   $reqCategories=$bdd->query("select * from portfolio_categorie");
						   $Categories=$reqCategories->fetchALL();
						   foreach($Categories as $Categorie)
						   {
							   ?>
                              <tr role="row" class="odd">
                                 <td class="sorting_1"><a href="ticket-view.html"><?= $Categorie['lib_categorie']; ?></a></td>
                                 <td><?= $Categorie['description_categorie']; ?></td>
                                 <td><?= $Categorie['note_categorie']; ?></td>
                                 <td><?= $Categorie['abbreviation_categorie']; ?></td>
                                 <td>
                                    <div class="dropdown action-label">
                                       <a class="btn btn-info" aria-expanded="false">Modifier</a>
                                       <a href="deletecat/<?= $Categorie['id_categorie'];?>" class="btn btn-danger" aria-expanded="false">Supprimer</a>

                                    </div>
                                 </td>
                                 <?php } ?>
                                 
                                 
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-5">
                     </div>
                     <div class="col-sm-7">
                        <div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                           <ul class="pagination">
                              <li class="paginate_button previous disabled" id="DataTables_Table_0_previous"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="0" tabindex="0">Précedent</a></li>
                              <li class="paginate_button active"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="1" tabindex="0">1</a></li>
                              <li class="paginate_button next disabled" id="DataTables_Table_0_next"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="2" tabindex="0">Suivant</a></li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   
</div>
<script type="text/javascript" src="assets/js/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
<script type="text/javascript" src="assets/js/jquery.slimscroll.js"></script>
<script type="text/javascript" src="assets/js/app.js"></script>
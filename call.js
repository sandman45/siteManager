$(document).ready(function(){
    _self = this;
    var globData = {};
    $('#sm').click(function(){
	window.location.href = "./index.html";
    });
    $('#home').click(function(){
	window.location.href = "./index.html";
    });
    $('#getSites').click(function(){
	testDB('getSites',null);
    });
    $('#getCustomers').click(function(){
	testDB('getCustomers',null);
    });

    $('#showAddSite').click(function(){
       $('#myModalLabel').html('Add Site');
	$('#editSite').hide();
	$('#addSite').show();
	$('#myModal').show();
    });
    
    $('#addCustomer').click(function(){
	var data = {first:$('#firstName').val(),
		    last:$('#lastName').val(),
		    address:$('#address').val(),
		    phone:$('#phone').val(),
		    email:$('#email').val(),
		    siteid:$('#siteID').val(),
		    sourceip:12
		    };
        testDB('addCustomer',data);

    });
    
    
    $('#addSite').click(function(){
	var data = {name:$('#siteName').val(),url:$('#siteUrl').val()};
       testDB('addSite',data);

    });
    $('#delSite').click(function(){
    	var data = {id:$('#delSite').data('val')};
       
	if(delType=='site'){
    		var data = {id:$('#delSite').data('val')};
	        testDB('delSite',data);
    	}else{
		var data = {id:$('#delSite').data('val')};
		testDB('delCustomer',data);
    	}
    });

 //handle edit click
    $("#editSite").click(function(e){
	e.preventDefault();
	var val = $('#formID').val();
	var name = $('#siteName').val();
	var url = $('#siteUrl').val();
	var data = {id:val,url:url,name:name};
	testDB('updateSite',data);

    });
});


function testDB(query,data){

$.ajax({
	url: "dbconn.php",
    	type:"POST",
    	data:{query:query,data:data},
    	dataType:"json",
    	success: function(results){
		handleResults(results);
    	},
	error: function(error){
		console.log('error with server' + error);
	}
	});
}

function handleResults(results){
	switch(results.type){
		case 'getSites' :
			createDataGrid(results.results,"sites");
		break;
		case 'getCustomers' :
			createDataGrid(results.results,"customers");

		break;
		case 'delSite' :
			$('#deleteModal').modal('hide');
			testDB('getSites',null);
		break;
		case 'delCustomer' :
			$('#deleteModal').modal('hide');
			testDB('getCustomers',null);
		break;
		case 'addSite' :
			$('#myModal').modal('hide');
			testDB('getSites',null);
		break;
		case 'addCustomer' :
			$('#custModal').modal('hide');
			testDB('getSites',null);
		break;
		case 'getCustomersBySite' :
			createDataGrid(results,"customers");
		break;
		case 'updateSite':
			$('#myModal').modal('hide');
			testDB('getSites',null);
		break;
	}

}


function createDataGrid(data,type){
	$('#dataGrid').html('');
	//create header for the DataGrid
	
	$('#dataGrid').append("<thead>")
	for(var item in data[0]){
    if((item != "id" & item != "sitesid" & item != "del") || (item != "id" & item != "sitesid" & item != "del")){
      $('#dataGrid').append("<th>"+item.toUpperCase()+"</th>");
    }
	}
	$('#dataGrid').append("<th></th>");

	$('#dataGrid').append("</thead>")
	
	//create rows for DataGrid
	for(var row in data){
		$('#dataGrid').append("<tr id="+row+">");
		for(var item in data[row]){
			if((item != "id" & item != "sitesid" & item != "del") || (item != "id" & item != "sitesid" & item != "del")){
			$('#'+row).append("<td>"+data[row][item]+"</td>");
			}
		}
    if(type=="sites"){
      $('#'+row).append("<a href='#' name='addCust' data-val='"+data[row]['id']+"' title='addCust'><i class='icon-plus icon-gray'></i></a>&nbsp;");

      $('#'+row).append("<a href='#' name='editBtn' data-val='"+data[row]['id']+"' data-name='"+data[row]['name']+"' data-url='"+data[row]['url']+"' title='edit'><i class='icon-edit icon-gray'></i></a>&nbsp;");

      $('#'+row).append("<a href='#' name='deleteBtn' data-val='"+data[row]['id']+"' data-name='"+data[row]['name']+"' title='delete'><i class='icon-remove icon-gray'></i></a>");
    }else{
      $('#'+row).append("<a href='#' name='editCustBtn' data-val='"+data[row]['id']+"' data-name='"+data[row]['first']+" "+ data[row]['last']+ "' title='edit'><i class='icon-edit icon-gray'></i></a>&nbsp;");

      $('#'+row).append("<a href='#' name='deleteCustBtn' data-val='"+data[row]['id']+"' data-name='"+data[row]['first']+" "+ data[row]['last']+ "' title='delete'><i class='icon-remove icon-gray'></i></a>");
    }
	}
  //handle delete click
  $("a[name='deleteCustBtn']").click(function (e) {
    e.preventDefault();
    var val = $(e.currentTarget).data('val');
    var name = $(e.currentTarget).data('name');
    var data = {id: val};
    $('#delSite').data('val', val);
    //show delete modal
    $('#deleteModal').modal('show');
    $('#delLabel').html('Delete "' + name + '" ?');
    delType = 'customers';
  });

  //handle edit click
  $("a[name='editCustBtn']").click(function (e) {
    e.preventDefault();
    var val = $(e.currentTarget).data('val');
    var name = $(e.currentTarget).data('name');
    var url = $(e.currentTarget).data('url');
    data = {id: val, url: url, name: name};
    $('#formID').val(val);
    $('#custModal').modal('show');
    //change label to edit
    $('#custModalLabel').html('Edit "' + name+'"');
    $('#firstName').val(firstName);
    $('#lastName').val(lastName);
    $('#address').val(address);
    $('#phone').val(phone);
    $('#email').val(email);
    $('#editCustomer').show();
    $('#addCustomer').hide();
  });




    //handle delete click
  $("a[name='deleteBtn']").click(function (e) {
    e.preventDefault();
    var val = $(e.currentTarget).data('val');
    var name = $(e.currentTarget).data('name');
    var data = {id: val};
    $('#delSite').data('val', val);
    //show delete modal
    $('#delLabel').html('Delete "' +name+ '" ?');
    $('#deleteModal').modal('show');
    delType = 'sites';
  });
  //handle edit click
  $("a[name='editBtn']").click(function (e) {
    e.preventDefault();
    var val = $(e.currentTarget).data('val');
    var name = $(e.currentTarget).data('name');
    var url = $(e.currentTarget).data('url');
    data = {id: val, url: url, name: name};
    $('#formID').val(val);
    $('#myModal').modal('show');
    //change label to edit
    $('#myModalLabel').html('Edit "' + name+'"');
    $('#siteName').val(name);
    $('#siteUrl').val(url);
    $('#editSite').show();
    $('#addSite').hide();


  });

  //handle edit click
  $("a[name='addCust']").click(function (e) {
    e.preventDefault();
    var siteID = $(e.currentTarget).data('val');
    $('#siteID').val(siteID);
    $('#custModal').modal('show');
    $('#myModalLabel').html('Add Customer');
  });


}

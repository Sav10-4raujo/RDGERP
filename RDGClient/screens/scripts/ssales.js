let pageInfo = { 

  page : 0,
  totalPage: 0,
  payment: 0,
  token: 0,
  user: 0

}

function queryString(parameter) {
  var loc = location.search.substring(1, location.search.length);
  var param_value = false;
  var params = loc.split("&");
  for (i = 0; i < params.length; i++) {
      param_name = params[i].substring(0, params[i].indexOf('='));
      if (param_name == parameter) {
          param_value = params[i].substring(params[i].indexOf('=') + 1)
      }
  }
  if (param_value) {
      return param_value;
  } else {
      return undefined;
  }
}

function getToken() {

  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");
  console.log(pageInfo.token)

}

function goToIndex (){

  window.location = `index.html?token=${pageInfo.token}&user=${pageInfo.user}`
}

function loadItem (_id){

  $.ajax({	
    method: "GET",
    url: `http://localhost:3000/sale/getSales?_id=${_id}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){


      if(data[0]){

        $("#searchinput").val(data[0].items)
        $("#sdateinput").val(data[0].sdate)
        $("#fdateinput").val(data[0].fdate)

      }

    },
    beforeSend: function(){

      $('#registermodal').prepend('<div id="load"><div id="loadgif"></div></div>');

    },
    complete: function(){

      $("#load").remove();
      $('#registermodal').attr("hidden", false);

    }

   })


}

function loadItems (e){
  //$('#productstable .listitem').remove();
  
  if (e.payment == "card"){

    e.payment = "Cartão"

  }
  if (e.payment == "money"){

    e.payment = "Dinheiro"

  }

	$('#productstable').append(

    `<tr class="listitem" >
      <th  scope="row">
      <div class="itemcontrol">${e.total}
      </div>
      </th>
      <td>
      <div class="itemcontrol">${e.payment}
      </div>
      </td>
      <td>
      <div class="itemcontrol">${e.client}
      </td>
      <td>
      <div class="itemcontrol">${new Date(e.date).getDate()}/${new Date(e.date).toISOString().split("-")[1]}/${new Date(e.date).getFullYear()}
      </div>
      </td>
      <td class="itemcontrol">
      <div class="${e._id}" id="saleInfo">
      </div>
      </td>
      </th>
      </th>
      `)
	    $(`.${e._id}`).click(function(){

        goToSaleDetail($(this).attr("class"))
  
      })
	

}


function search(){

  pageInfo.page = 0;

  $("#searchbtn").prop('disabled', true);

  $('#productstable .listitem').remove();

  if ($("#sdateinput").val() == ""  || $("#fdateinput").val() == ""){

    $("#msgModal").modal("show");
    $("#msgAlert").html("Preencha os dois campos de datas.")

  } else{

    pageInfo.payment	= $("#payment").val();
    pageInfo.initialDate	= new Date($("#sdateinput").val()).toISOString().split("T")[0];
    pageInfo.finalDate	 	= new Date($("#fdateinput").val()).toISOString().split("T")[0];
    
  
    let timeDif =  Math.abs(new Date(pageInfo.finalDate).getTime() - new Date(pageInfo.initialDate).getTime());
    let daysDif = Math.ceil(timeDif / (1000 * 3600 * 24));
  
    if(daysDif > 31){
  
      $("#msgModal").modal("show");
      $("#msgAlert").html("A diferença entre as datas deve ser no máximo 31 dias.")
  
    }else if (pageInfo.finalDate < pageInfo.initialDate ){
  
      $("#msgModal").modal("show");
      $("#msgAlert").html("A data final deve ser maior ou igual a inicial.")
  
    }
     else{
  
      $.ajax({
        method: "GET",
        url: `http://localhost:3000/sale/getSales?initialDate=${pageInfo.initialDate}&finalDate=${pageInfo.finalDate}&payment=${pageInfo.payment}&page=${pageInfo.page}`,
        headers: {
          'Authorization': `Bearer ${pageInfo.token}`,
        },
        success: function(data){

          console.log(data)


          if(data.msg){

            $("#msgModal").modal("show");
            $("#msgAlert").html("Não existem vendas no período.")

          }else{
            
          pageInfo.totalPage = Math.ceil(data.amountItems / 10);
          
          data.result.forEach((e)=>{	
            loadItems(e);
          });

          }

        },
        beforeSend: function(){

          $("body").prepend('<div id="loading"></div>');
          $("#all").hide();

        },
        complete: function(){

          $("#loading").remove();
          $("#all").show();

        }
    
      })
  
    }

    
  }

  $("#searchbtn").prop('disabled', false);

}

function right(){


  if(pageInfo.page +1 == pageInfo.totalPage ){


  }else{
	$('#productstable .listitem').remove();
    $('.listitem').remove();
    console.log(pageInfo.totalPage);
    console.log(pageInfo.page);

    pageInfo.page += 1;	

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/sale/getSales?initialDate=${pageInfo.initialDate}&finalDate=${pageInfo.finalDate}&page=${pageInfo.page}&payment=${pageInfo.payment}`,
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data){
        data.result.forEach((e)=>{

          loadItems(e);

        });
      }
    });

  }
  
}

function left(){

  if(pageInfo.page == 0){


  }else{
	$('#productstable .listitem').remove();

    $('.listitem').remove();
    pageInfo.page -= 1;

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/sale/getSales?initialDate=${pageInfo.initialDate}&finalDate=${pageInfo.finalDate}&page=${pageInfo.page}&payment=${pageInfo.payment}`,
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data){
        data.result.forEach((e)=>{
  
          loadItems(e);
  
        })
      }
     })

  }

}

function goToSaleDetail(_id){

  window.location = `saleDetail.html?_id=${_id}&token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToNewSale() {

  window.location = `newSale.html?token=${pageInfo.token}&user=${pageInfo.user}`

}



















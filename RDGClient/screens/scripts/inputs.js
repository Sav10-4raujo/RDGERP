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

let pageInfo = { 

  page : 0,
  totalPage: 0,
  payment: 0,
  initialDate: 0,
  finalDate: 0,
  token: 0,
  user:0

}

function getToken(){

  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");


}


function goToIndex (){

  window.location = `index.html?$token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToNewInput (){

  window.location = `newInput.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function getInputs (){

  const initial = new Date($("#sdateinput").val()),
   final = new Date($("#fdateinput").val()),
   timeDiff = Math.abs(final.getTime() - initial.getTime()),
   diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  
  $('#productstable .listitem').remove();

  if ($("#sdateinput").val() == ""  || $("#fdateinput").val() == ""){

    $("#msgModal").modal("show");
    $("#msgAlert").html("Preencha os dois campos de datas.")

  }else if(diffDays > 31){

    $("#msgModal").modal("show");
    $("#msgAlert").html("O período deve ter no máximo 30 dias.")

  }else{

    pageInfo.initialDate = new Date($("#sdateinput").val()).toISOString().split("T")[0];
    pageInfo.finalDate = new Date($("#fdateinput").val()).toISOString().split("T")[0];
  
    $.ajax({
      method: "GET",
      url: `http://localhost:3000/input/getInputs?initialDate=${pageInfo.initialDate}&finalDate=${pageInfo.finalDate}&payment=${pageInfo.payment}&page=${pageInfo.page}`,
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data){
  
        console.log(data)
        $('.listitem').remove();
  

        if(data.msg == "There are no sales in the period"){

          $("#msgModal").modal("show");
          $("#msgAlert").html("Não existem vendas no período.")

        }else{

        console.log(data);


          data.result.forEach((e)=>{
  
            loadItems(e);
    
          });

        }

      } 
    
    })

  }

}

function loadItems(e){


  $('#inputstable').append(

    `<tr class="listitem" >
      <th  scope="row">
      <div class="itemcontrol">${e.name}
      </div>
      </th>
      <td>
      <div class="itemcontrol">${new Date(e.dateInsert).getDate()}/${new Date(e.dateInsert).toISOString().split("T")[0].split("-")[1]}/${new Date(e.dateInsert).getFullYear()}
      </div>
      </td>
      <td>
      <div class="itemcontrol">${e.noteValue}
      </td>
      <td>
      <div class="itemcontrol">${e.price}
      </div>
      </td>
      <td>
      <div class="itemcontrol">${e.productCode}
      </div>
      </td>
      <td>
      <div class="itemcontrol">${e.provider}
      </div>
      </td>
      <td class="itemcontrol">
      <div class="${e._id}" id="saleInfo">
      </div>
      </td>
      </th>
      </th>
      `);

      $(`.${e._id}`).click(function(){

        goToInputDetail($(this).attr("class"))
  
      })

}


function right(){


  if(pageInfo.page  == pageInfo.totalPage ){


  }else{

	$('#inputstable .listitem').remove();
    $('.listitem').remove();
    pageInfo.page += 1;	

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/input/getInputs?initialDate=${pageInfo.initialDate}&finalDate=${pageInfo.finalDate}&page=${pageInfo.page}&payment=${pageInfo.payment}`,
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
	$('#inputstable .listitem').remove();

    $('.listitem').remove();
    pageInfo.page -= 1;

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/input/getInputs?initialDate=${pageInfo.initialDate}&finalDate=${pageInfo.finalDate}&page=${pageInfo.page}&payment=${pageInfo.payment}`,
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

function goToInputDetail (_id){

  window.location =  `inputDetail.html?_id=${_id}&token=${pageInfo.token}&user=${pageInfo.user}`

}

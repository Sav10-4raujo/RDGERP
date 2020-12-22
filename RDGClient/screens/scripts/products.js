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

  page: 0,
  totalPage:0,
  token: queryString("token"),
  user: queryString("user")

}


function closeModal(){

  $("#productinput").val("");
  $("#priceinput").val("");
  $("#stockinput").val("");
  $('#registermodal').modal("hidden");

}

function openRegister(){

  $("#registermodal").modal("show")


}

function loadItem (_id){

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/product/getProducts?_id=${_id}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    beforeSend: function(){

      $('#registermodal').prepend('<div id="load"><div id="loadgif"></div></div>');

    },
    success: function(data){

      if(data[0]){

        $("#productinput").val(data[0].name)
        $("#priceinput").val(data[0].price)
        $("#stockinput").val(data[0].stock)

      }

    },

    complete: function(){

      $("#load").remove();
      $('#registermodal').attr("hidden", false);


    }

   })


}

function loadItems (e){

  if(e.stockType == "kg" ){

    e.stockType = "Kg"

  }

  if(e.stockType == "unity" ){

    e.stockType = "Unidade(s)"

  }

  $('#productstable').append(

    `<tr class="listitem" >
      <th  scope="row">
      <div class="itemcontrol">${e.name}
      </div>
      </th>
      <td>
      <div class="itemcontrol">${e.price} R$
      </div>
      </td>
      <td>
      <div onclick="loaditemcontrol(${typeof(e._id) })" class="itemcontrol">${e.stock} ${e.stockType}
      </td>
      <td>
      <div class="itemcontrol">${new Date(e.shelfLife).getDate()}/${new Date(e.shelfLife).getMonth()}/${new Date(e.shelfLife).getFullYear()}
      </div>
      </td>
      <td class="itemcontrol">
      ${e.productCode}
      </td>
      <td class="itemcontrol">
      <div class="${e._id}" id="update">
      </div>
      </td>
      </th>
      </th>

      `
    );

    $(`.${e._id}`).click(function(){

      openUpdate($(this).attr("class"))

    })


}



function reload() {

  window.location =  `products.html?token=${pageInfo.token}&user=${pageInfo.user}`

}



function getProducts(){

  $('.listitem').remove();

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/product/getProducts?page=${pageInfo.page}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

      pageInfo.totalPage =Math.ceil(data.amountItems / 10) ;

      data.result.forEach((e)=>{

        loadItems(e);

      });
    }
   });

}


function right(){


  if(pageInfo.page + 1 == pageInfo.totalPage ){


  }else{

    $('.listitem').remove();
    pageInfo.page += 1;

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/product/getProducts?page=${pageInfo.page}`,
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

    $('.listitem').remove();
    pageInfo.page -= 1;

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/product/getProducts?page=${pageInfo.page}`,
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

function registerProduct(){

    

  if( $("#productinput").val() && $("#priceinput").val() && $("#stockinput").val() && $("#stocktypeinput").val() && $("#shelflifeinput").val()){


    let name = $("#productinput").val(),
    price = $("#priceinput").val(),
    stock = $("#stockinput").val(),
    stockType = $("#stocktypeinput").val(),
    shelfLife = $("#shelflifeinput").val();

    $.ajax({

      url:"http://localhost:3000/product/insertProduct",
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      method: "POST",
      data:{

        name,
        price,
        stock,
        stockType,
        shelfLife

      },

      success: function(data){

        console.log(data)

      }


    })

  }else{

    $("#registermodal").modal("hide");
    $("#modalalert").modal("show");
    $("#alertbody").html("Confira as informações do produto.");

  }


}

function search(){

  if($("#searchinput").val()){

    pageInfo.query = $("#searchinput").val();

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/product/getProducts?queryName=${pageInfo.query}&page=0`,
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data){
        $(".listitem").remove()

        data.result.forEach((e)=>{
  
          loadItems(e);
  
        })
      }
     });

  }
  
}

function openUpdate(_id){

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/product/getProducts?_id=${_id}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

        console.log(data[0])
        $("#productinput").val(data[0].name)
        $("#priceinput").val(data[0].price)
        $("#stocktypeinput").val(data[0].stockType)
        $("#stockinput").val(data[0].stock)
        $("#shelflifeinput").val(data[0].shelfLife.split("T")[0])

        $("#registermodal").modal("show");
        $("#register").click(
          function(){
          refreshPrice(data[0]._id)
        });
      
    }
   });


}

function refreshPrice (_id){

  $("#registermodal").modal("hide");

  let price = $("#priceinput").val();

  $.ajax({
    method: "PUT",
    url: `http://localhost:3000/product/updateProduct`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    data:{
      _id,
      price

    },
    success: function(data){

      if(data.nModified == 1 ||data.nModified == 0 ){

        $("#modalalert").modal("show");
        $("#alertbody").html("Preço alterado com sucesso");
        $('#modalalert').on('hidden.bs.modal', function () {
          location.reload();
         })

      }
      
    }
   });

}

function goToIndex(){

  window.location = `index.html?token=${pageInfo.token}&user=${pageInfo.user}`

}
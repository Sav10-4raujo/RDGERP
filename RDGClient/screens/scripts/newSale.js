const pageInfo = {

  nameSearch : [],
  productCodeSearch: [],
  items: [],
  stock: 0,
  total: 0,
  token:0,
  user:0

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

$(document).ready(function(){

  $('#cpf').mask('000.000.000-00', {reverse: true})

});

function goToIndex (){

  window.location = `index.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function search(){

  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");

  $("#productCode").keyup(function(){

  let queryCode =  $("#productCode").val();

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/product/getProducts?queryCode=${queryCode}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

      pageInfo.productCodeSearch = [];

      if(data.result.length <= 5){

        data.result.forEach(function(e){

          pageInfo.productCodeSearch.push(e.productCode);
          console.log(e.productCode)
  
        })

      }else{

        for(i=0;i<4;i++){

          pageInfo.productCodeSearch.push(data.result[i].productCode);

        }

      }

    }
    
   })

   $( "#productCode" ).autocomplete({

    source: pageInfo.productCodeSearch,
    select: function(event, ui) {

      queryCode  =  ui.item.value;

      $("#productCode").attr("disabled", true);
      $("#name").attr("disabled", true);
      

      $.ajax({

        method: "GET",
        url: `http://localhost:3000/product/getProducts?queryCode=${queryCode}`,
        headers: {
          'Authorization': `Bearer ${pageInfo.token}`,
        },
        success: function(data){

          let { name, price, productCode, stock, stockType } = data.result[0];

          if(stockType == "kg"){

            stockType = "Quilo(s)";

          }else if(stockType == "unity"){

            stockType = "Unidade(s)"

          }

          $("#name").val(name);
          $("#productCode").val(productCode);
          $("#price").val(price);
          $("#stockAlert").html(`Quantidade em estoque ${stock} ${stockType}`);
          pageInfo.stock = stock;


        }

      })

    }

  });

  });

  $("#name").keyup(function(){

    let queryName = $("#name").val();

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/product/getProducts?queryName=${queryName}`,
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data){

        pageInfo.nameSearch = [];
  
        if(data.result.length <= 5){
  
          data.result.forEach(function(e){
  
            pageInfo.nameSearch.push(e.name);
            console.log(e.name)
    
          })
  
        }else{
  
          for(i=0;i<4;i++){
  
            pageInfo.nameSearch.push(data.result[i].name);
  
          }
  
        }
  
      }
     });

     $( "#name" ).autocomplete({
      source: pageInfo.nameSearch,
      select: function(event, ui) {

        queryName  =  ui.item.value;
  
        $("#productCode").attr("disabled", true);
        $("#name").attr("disabled", true);
  
        $.ajax({
  
          method: "GET",
          url: `http://localhost:3000/product/getProducts?queryName=${queryName}`,
          headers: {
            'Authorization': `Bearer ${pageInfo.token}`,
          },
          success: function(data){
  
            let { name, price, productCode, stock, stockType } = data.result[0];

            if(stockType == "kg"){

              stockType = "Quilo(s)";

            }else if(stockType == "unity"){

              stockType = "Unidade(s)"

            }
  
            $("#name").val(name);
            $("#productCode").val(productCode);
            $("#price").val(price);
            $("#stockAlert").html(`Quantidade em estoque ${stock} ${stockType}`);
            pageInfo.stock = stock;
  
          }
  
        });
  
      }
      
    });

  });

}

function send(){

  if($("#amount").val() <= 0){

    $("#msgAlert").html("A quantidade deve ser no mínimo 1.");
    $("#msgModal").modal("show");

    return

  }
  if($("#amount").val() > pageInfo.stock ){

    $("#msgAlert").html("A quantidade deve estar de acordo com o estoque.");
    $("#msgModal").modal("show");

    return

  }


  let name = $("#name").val(),
  productCode = $("#productCode").val(),
  price = $("#price").val(),
  amount = $("#amount").val();
  
  let queryCode = productCode;

  $.ajax({

    method: "GET",
    url: `http://localhost:3000/product/getProducts?queryCode=${queryCode}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

      const {_id, productCode, price, name} = data.result[0];

      for(i=0; i<pageInfo.items.length; i++){

        if(pageInfo.items[i]._id == _id){

          $("#msgAlert").html("Produto já está na compra.");
          $("#msgModal").modal("show");

          return

        }

      }

      $("#productCode").attr("disabled", false);
      $("#name").attr("disabled", false);
      $("#productCode").val("");
      $("#name").val("");
      $("#amount").val("");
      $("#price").val("");

        const newItem = {
          _id,
          productCode,
          price,
          amount,
          name
        };
  
        pageInfo.items.push(newItem);
        console.log(pageInfo.items);

        $("#productstable").append(    
          `<tr id="${_id}" >
          <th  scope="row">
          <div class="itemcontrol">${productCode}
          </div>
          </th>
          <td>
          <div class="itemcontrol">${name}
          </div>
          </td>
          <td>
          <div class="itemcontrol">${price} R$
          </div>
          </td>
          <td>
          <div class="itemcontrol">${amount}
          </div>
          </td>
          <td class="itemcontrol">
          <div class="${_id}" id="delete">
          </div>
          </td>
          </th>
          </tr>
          `);

          $(`.${_id}`).click(function(){

            deleteItem($(this).attr("class"))
      
          });

          let total = 0;

          for(i=0; i < pageInfo.items.length; i++){
        
            total += pageInfo.items[i].price * pageInfo.items[i].amount;
        
          }

          pageInfo.total = total;

          $("#total").html(`Total: ${pageInfo.total} R$`);
      }

  });
  


}



function deleteItem(cl){

  $(`#${cl}`).remove();
  
  for(i=0; i< pageInfo.items.length; i++){

    if(cl == pageInfo.items[i]._id ){

      pageInfo.items.splice(pageInfo.items.indexOf(pageInfo.items[i]), 1);

    }

  }

  let total = 0;

  for(i=0; i < pageInfo.items.length; i++){

    total += pageInfo.items[i].price * pageInfo.items[i].amount;

  }

  pageInfo.total = total;

  $("#total").html(`Total: ${pageInfo.total} R$`);


}

function exclude(){

  $("#productCode").attr("disabled", false);
  $("#name").attr("disabled", false);
  $("#productCode").val("");
  $("#name").val("");
  $("#amount").val("");
  $("#price").val("");

}

function insertSale(){


  if(pageInfo.items.length <= 0){
    
    $("#msgAlert").html("A compra deve ter ao menos um item.");
    $("#msgModal").modal("show");

    return

  }

  if($("#cpf").val().length != 14 ){
    
    $("#msgAlert").html("Preencha completamente o CPF.");
    $("#msgModal").modal("show");

    return

  }

  $.ajax({

    method: "POST",
    url: "http://localhost:3000/sale/insertSale",
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    data: {

      items: pageInfo.items,
      client: $("#cpf").val(),
      payment: $("#payment").val(),
      user: pageInfo.user


    },
    success: function (data) {

      window.location = `saleDetail.html?token=${pageInfo.token}&_id=${data._id}&user=${pageInfo.user}`

    }

  })

}
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

const pageInfo = {

  token:0,
  user: 0

}

function goToIndex (){

  window.location = `index.html?token=${pageInfo.token}&user=${pageInfo.user}`

}


function getInfos(){

  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");

  const _id = queryString("_id");
  $.ajax({

    method: "GET",
    url: `http://localhost:3000/sale/getSales?_id=${_id}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

      console.log(data)

      $("#total").html(`Total: ${data[0].total} R$`);

      if (data[0].payment == "card"){

        data[0].payment = "Cartão"

      }
      if (data[0].payment == "money"){

        data[0].payment = "Dinheiro"

      }

      $("#payment").val(data[0].payment)
      $("#cpf").val(data[0].client)
      $("#user").val(data[0].user)

  for(i=0; i<data[0].items.length; i++){

	$('#productstable').append(

    `<tr class="listitem" >
      <th  scope="row">
      <div class="itemcontrol">${data[0].items[i].productCode}
      </div>
      </th>
      <td>
      <div class="itemcontrol">${data[0].items[i].name}
      </div>
      </td>
      <td>
      <div class="itemcontrol">${data[0].items[i].price}
      </td>
      <td>
      <div class="itemcontrol">${data[0].items[i].amount}
      </div>
      </td>
      </tr>
      `)
      }

    }
  
  })

}

function goToSales(){

  window.location = `ssales.html?token=${pageInfo.token}&user=${pageInfo.user}`

}
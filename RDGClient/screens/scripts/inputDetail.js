const pageInfo = {

  token : 0,
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

function getInputInfos(){

  const _id = queryString("_id");
  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");

  $.ajax({

    method: "GET",
    url: `http://localhost:3000/input/getInputs?_id=${_id}`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

      let {name, stock, stockType, price, provider, noteValue, productCode, shelfLife, user} = data[0];

      console.log(data)

      if (stockType== "unity"){

        stockType = "Unidade"
    
      }
      if (stockType == "kg"){
    
        stockType = "Quilos"
    
      }

    $("#name").val(name);
    $("#stock").val(stock);
    $("#stockType").val(stockType);
    $("#price").val(price);
    $("#provider").val(provider);
    $("#noteValue").val(noteValue);
    $("#productCode").val(productCode);
    $("#shelfLife").val(new Date(shelfLife).toISOString().split("T")[0]);
    $("#userLabel").html(`Registro feito por: ${user}`)
    }

  })


}
function goToIndex() {

  window.location = `index.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToInputs() {

  window.location = `inputs.html?token=${pageInfo.token}&user=${pageInfo.user}`

}
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

  token:0

}

function getToken(){

  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");

}

function registerInput() {

  if ($("#name").val() == "" || $("#stock").val() == "" || $("#stockType").val() == "" || $("#price").val() == "" || $("#provider").val() == "" || $("#productCode").val() == "" || $("#noteValue").val() == "" || $("#shelfLife").val() == "") {

      $("#msgModal").modal("show");
      $("#msgAlert").html("Verifique se todos os campos foram preenchidos.");

  } else if ($("#name").val().length < 3) {

      $("#msgModal").modal("show");
      $("#msgAlert").html("O campo produto deve ter ao menos 3 caracteres.");

  } else if ($("#stockType").val().length < 2) {

      $("#msgModal").modal("show");
      $("#msgAlert").html("O campo de medida deve ter ao menos 3 caracteres.");

  } else if ($("#provider").val().length < 3) {

      $("#msgModal").modal("show");
      $("#msgAlert").html("O campo de fornecedor deve ter ao menos 3 caracteres.");

  } else if ($("#productCode").val().length != 4) {

      $("#msgModal").modal("show");
      $("#msgAlert").html("O campo de código deve ter 4 caracteres.");

  }else{

    $.ajax({

      method: "POST",
      url: `http://localhost:3000/input/insertInput`,
      data: {

          name: $("#name").val(),
          stock: $("#stock").val(),
          stockType: $("#stockType").val(),
          price: $("#price").val(),
          provider: $("#provider").val(),
          noteValue: $("#noteValue").val(),
          productCode: $("#productCode").val(),
          shelfLife: new Date($("#shelfLife").val()).toISOString().split("T")[0],
          user: pageInfo.user

      },
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data) {

        goToInputDetail(data._id, pageInfo.token)

      }

  });

  }






}

function goToIndex() {

  window.location = `index.html?token=${pageInfo.token}`

}

function goToInputs() {

  window.location = `inputs.html?token=${pageInfo.token}`

}

function goToInputDetail(_id, token) {

  window.location = `inputDetail.html?_id=${_id}&token=${token}`

}
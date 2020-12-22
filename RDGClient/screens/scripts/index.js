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

  token: queryString("token"),
  user: queryString("user")


}

function goToProducts() {

  window.location =  `products.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToInputs() {

  window.location =  `inputs.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToSales() {

  window.location = `ssales.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToUsers() {

  window.location = `users.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function goToClients() {

  window.location = `clients.html?token=${pageInfo.token}&user=${pageInfo.user}`

}
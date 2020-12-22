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

  _idDelete: 0,
  token:0,
  user: 0

}

function getToken(){

  pageInfo.token = queryString("token");
  pageInfo.user = queryString("user");

}


function goToIndex (){

  window.location = `index.html?token=${pageInfo.token}&user=${pageInfo.user}`

}

function getUsers(){

  getToken();

  $.ajax({

    method:"GET",
    url:`http://localhost:3000/user/getUsers`,
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success: function(data){

      for(i=0; i<data.length; i++){

        $('#userstable').append(

          `<tr class="listitem" >
            <th  scope="row">
            <div class="itemcontrol">${data[i].user}
            </div>
            </th>
            <td>
            <div class="itemcontrol">${data[i].name}
            </div>
            </td>
            <td>
            <div class="itemcontrol">${data[i].surname}
            </div>
            </td>
            <td>
            <div class="itemcontrol" >
            <div class=${data[i]._id} id="delete"></div>
            </div>
            </td>
            </tr>
            `)

            $(`.${data[i]._id}`).click(function(){

              openDelete($(this).attr("class"));
        
            })

      }

    }

  })




}

function add(){

  $("#registermodal").modal("show");

}

function registerUser(){

  const user = $("#user").val(),
  password = $("#password").val(),
  name = $("#name").val(),
  surname = $("#surname").val(),
  confirmationPassword = $("#confirmationPassword").val()

  if(confirmationPassword == password){

    $.ajax({

      method:"POST",
      url:`http://localhost:3000/user/signUp`,
      data:{
  
        user,
        password,
        name,
        surname,
  
      },
      headers: {
        'Authorization': `Bearer ${pageInfo.token}`,
      },
      success: function(data){
  
  
        if(data.user){
  
          $("#modalalert").modal("show");
          $("#alertbody").html("Usuário cadastrado com sucesso.");
  
          $('#modalalert').on('hidden.bs.modal', function () {
            window.location.reload()
          })
  
        }else if(data.msg == "Maximum 5 users allowed"){
  
          $("#modalalert").modal("show");
          $("#alertbody").html("É permitido no Máximo 5 usuários.");
  
        }
  
      }
  
    });
  


  }else{

    $("#modalalert").modal("show");
    $("#alertbody").html("A senha e a confirmação devem ser iguais.");

  }

  $("#registermodal").modal("hide");

  $("#user").val("");
  $("#password").val("");
  $("#name").val("");
  $("#surname").val("");
  $("#confirmationPassword").val("");

}

function openDelete(_id){

  $("#deletemodal").modal("show");
  pageInfo._idDelete = _id;

}


function sendDelete() {

  const user = $("#userD").val(),
  password = $("#passwordD").val();

  $.ajax({

    method:"GET",
    url:`http://localhost:3000/user/signIn`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
      console.log("Authorization", "Basic " + btoa(user + ":" + password))
    },
    headers: {
      'Authorization': `Bearer ${pageInfo.token}`,
    },
    success:function (data) {
      
      if(data.token){

        $.ajax({

          method:"DELETE",
          url:`http://localhost:3000/user/deleteUser`,
          headers: {
            'Authorization': `Bearer ${pageInfo.token}`,
          },
          data:{

            _id:pageInfo._idDelete

          },

          success:function (data){

            $("#deletemodal").modal("hide");

            if(data.msg == "User deleted"){

              $("#modalalert").modal("show");
              $("#alertbody").html("Usuário deletado com sucesso.");
      
              $('#modalalert').on('hidden.bs.modal', function () {
                window.location.reload()
              })              

            }

          }

        })
        

      }else{
        
        $("#modalalert").modal("show");
        $("#alertbody").html("Login incorreto.");

      }

    }
  
    }
    
    )

    $("#userD").val("");
    $("#passwordD").val("");

}
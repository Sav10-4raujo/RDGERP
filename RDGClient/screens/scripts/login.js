function login(){
  const user = $("#user").val(),
  password = $("#password").val();


  $.ajax({

    method:"GET",
    url:`http://localhost:3000/user/signIn`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
    },
    success:function (data) {

      if(data.token){

        window.location = `index.html?token=${data.token}&user=${user}`

      }else{

        $("#modalalert").modal("show");
        $("#alertbody").html("Usuário ou/e senha incorreto(s).");

      }

    }
  
  
  })


}
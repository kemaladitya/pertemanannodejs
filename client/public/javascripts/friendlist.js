function find(){
	var key = $('#ipt-src').val();
	var link = 'http://127.0.0.1:3001/find/' + key;
	window.location.replace(link);
}

function logout(){
	window.location.replace("http://127.0.0.1:3001/logout");
}

const getCookie = (name) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};


const parseObjectFromCookie = (cookie) => {
  const decodedCookie = decodeURIComponent(cookie);
  return JSON.parse(decodedCookie);
};

window.onload = () => {
	let dataCookie = getCookie('email_login');
	let data_login = parseObjectFromCookie(dataCookie);
	var userdata = ("email_login=" + data_login.email_login);
	document.getElementById('profile-name').innerHTML =  data_login.email_login;


	if(!data_login.email_login){

		window.location.replace("http://127.0.0.1:3001/login");
	} else {
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/friendList',
			data: userdata,
			success: function(data){
					var i = 0;
					while(i < data.length){
						$("#friendList").append(`<li> ${data[i].profile_name} </li>`);
						i++;
					}	
			},
			error: function(){
				alert('Tidak terhubung dengan server');
			}
		});
	}
 }
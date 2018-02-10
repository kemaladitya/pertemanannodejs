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
	let dataCookie = getCookie('key');
	let temp = parseObjectFromCookie(dataCookie);
	var link = 'http://127.0.0.1:3000/search/' + temp.key;
	var dataFriend = [];
	var buatcheck = ("email_login=" + temp.email_login);
	checkConnect(buatcheck);


	$.ajax({
		type: 'POST',
		url: link,
		async: false,
		success: function(data){

			if(data.length === 0){
				$("#friendList").append(`<p> Teman kamu enggak ketemu. </p>`);
			}
			var i = 0;

			while(i < data.length){
				var status = search(data[i].id, dataFriend);
				if(status === undefined){
					if(String(data[i].id) !== String(temp.email_login)){
						$("#friendList").append(`<li id="${data[i].id}"> ${data[i].profile_name}  <button class="float-right p-1 add" type="submit" id="${data[i].id}" value=${data[i].id} onclick="add(this.value)"> <img src="/images/add.png" width="30px">  </button>  </li>`);
					} 
				} else {
					if(String(data[i].id) !== String(temp.email_login)){
						$("#friendList").append(`<li> ${data[i].profile_name}  <button class="float-right p-1 add" type="submit"> <img src="/images/tick.png" width="30px"></button> </li>`);
					}
				}
				i++;
			}

			function search(nameKey, myArray){
			    for (var x = 0; x < myArray.length; x++) {
			        if (myArray[x].email === nameKey) {
			            return true;
			        }
			    }
			}
		}
	});	


	function checkConnect(userdata){
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/friendList',
			data: userdata,
			async: false,
			success: function(data){
					dataFriend = data;
			},
			error: function(){
				alert('Tidak terhubung dengan server');
			}
		});	
	}
	
}


function find(){
	var key = $('#ipt-src').val();
	var link = 'http://127.0.0.1:3001/find/' + key;
	window.location.replace(link);
}

function logout(){
	window.location.replace("http://127.0.0.1:3001/logout");
}

function add(id){
	const getCookie = (name) => {
		const value = "; " + document.cookie;
		const parts = value.split("; " + name + "=");
		if (parts.length === 2) return parts.pop().split(";").shift();
	};

	const parseObjectFromCookie = (cookie) => {
		const decodedCookie = decodeURIComponent(cookie);
		return JSON.parse(decodedCookie);
	};

	let dataCookie = getCookie('key');
	let data = parseObjectFromCookie(dataCookie);
	var userdata = ("email=" + id + "&email_login=" + data.email_login);	
	var buatcheck = ("email_login=" + data.email_login);
	var status = false;
	checkConnect(buatcheck);

	if(status === true){
		alert('Udah temenan.');
	} else {
		addFriend(userdata, id);
	}


	function checkConnect(userdata, namaId){
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/friendList',
			data: userdata,
			async: false,
			success: function(data){
					var z = 0;
					while(z < data.length){
						if(String(data[z].email) === String(id)){
							status = true;
						} 
						z++;
					};
			},
			error: function(){
				alert('Tidak terhubung dengan server');
			}
		});	
	}
	

	function addFriend(userdata, namaId){
		$.ajax({
			url: 'http://localhost:3000/add',
			type: 'POST',
			async: false,
			data: userdata,
			success: function(data){
				if(data == "OK"){
					var button = "button[id='" + namaId + "']";
					$(button).remove();

					var li = "li[id='" + namaId + "']";
					$(li).append("<button class='float-right p-1 add' type='submit'> <img src='/images/tick.png' width='30px'></button>");

					return $('#berhasiltemenan').modal('show');
				} else {
					alert('Gagal');
				}
			}
		})
	}
	

}

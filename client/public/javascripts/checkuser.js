function checkUser(){
	var email = $('#email').val();
	var password = $('#password').val();
	var userdata = ("email=" + email + "&password=" + password);
	var status = 0;

	if(!email && !password){
		$('#emaildanpasswordkosong').modal('show');
	} else if (!email){
		$('#emailkosong').modal('show');
	} else if(!password){
		$('#passwordkosong').modal('show');
	} else {
		checkData(userdata);

		//direct if available		
		if(Number(status) === 200){
			redirect();
		} else {
			$('#emaildanpasswordsalah').modal('show');
		}

	}

		function checkData(userdata){
			$.ajax({
				async: false,
				type: 'POST',
				url: 'http://127.0.0.1:3000/auth',
				data: userdata,
				success: function(data){
					status = data.status;
				},
				error: function(){
					alert('Server cannot response');
				}
			});
		}


		function redirect(){
			$.ajax({
					type: 'POST',
					async: false,
					url: 'http://127.0.0.1:3001/profile',
					data: ("email=" + email),
					success: function(data){
						window.location.replace("http://127.0.0.1:3001/profile");
					},
					error: function(){
						alert('gagal kedua');
					}
			});
		};
	
}

function signup(){
	var profil = $('#profile-signup').val();
	var email = $('#email-signup').val();
	var password = $('#password-signup').val();
	var konfirmasi = $('#konfirmasi-signup').val();
	var userdata = ("email=" + email + "&password=" + password + "&profile_name=" + profil + "&konfirmasiPassword=" + konfirmasi);
	console.log(userdata);

	if(!profil && !email && !password && !konfirmasi){
		alert('data pada kosong');
	} else if(password != konfirmasi){
		alert('Password tidak sama');
	} else {
		$.ajax({
			type: 'POST',
			async: false,
			url: 'http://127.0.0.1:3000/register',
			data: userdata,
			success: function(data){
				console.log(data);
				alert('Berhasil signup');
			},
			error: function(){
				alert('gagal kedua');
			}
		});
	}
}

window.onload = () => {
	const deleteCookie = (name) => {
		document.cookie = name + '=; max-age=0;';
	};
	localStorage.clear();
	deleteCookie('key');
	deleteCookie('email_login');
}
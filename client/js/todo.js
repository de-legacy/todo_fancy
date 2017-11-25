function signout() {
	if (localStorage.getItem("login_type") === "facebook") {
		FB.logout(function(response) {
			console.log(response)

			clearLocalStorage()
			window.location.href = "index.html";
		});
	} else {
		clearLocalStorage();
		window.location.href = "index.html";
	}
}

function clearLocalStorage() {
	localStorage.removeItem("token_todo");
	localStorage.removeItem("full_name_todo");
	localStorage.removeItem("email_todo");
	localStorage.removeItem("login_type");
}

function isSignin() {
	if (localStorage.getItem('token_todo')) {
		axios({
			url: 'http://localhost:3000/',
			method: 'get',
			headers: {
				'token_todo': localStorage.getItem('token_todo'),
				'Content-Type': 'application/json'
			}
		})
		.then(response => {
			console.log(response)
		})
		.catch(err => {
			console.log(err);
		});


	} else {
		window.location.href = "index.html";
	}
}

isSignin();
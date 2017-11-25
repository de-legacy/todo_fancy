var rootEndpoint = "http://localhost:3000/api";

function signUpFacebook(data) {
  console.log('Welcome!  Fetching your information.... ');

  FB.api('/me',  {fields: 'name, email'}, function(response) {
    console.log('Successful login for: ' + response.email);

    var config = {
      headers: {'facebook_token':  data.authResponse.accessToken}
    };

    axios.post(rootEndpoint+'/signin/facebook', {}, config).then(function (resp) {
      localStorage.setItem("token_todo", resp.data.token);
      localStorage.setItem("full_name_todo", resp.data.full_name);
      localStorage.setItem("email_todo", resp.data.email);
      localStorage.setItem("login_type", "facebook");

      window.location.href = "todo.html";

    }).catch(function (error) {
      alert("Failed to Sign In using Facebook")
      console.error(error);
    });
  });
}

function signIn() {
  var username = document.querySelector('#signin_username').value;
  var password = document.querySelector('#signin_password').value;

  alert("SIGN IN");

  axios.post(rootEndpoint+'/signin', { username: username, password: password }).then(function (resp) {
    localStorage.setItem("token_todo", resp.data.token);
    localStorage.setItem("full_name_todo", resp.data.full_name);
    localStorage.setItem("email_todo", resp.data.email);
    localStorage.setItem("login_type", "regular");

    window.location.href = "todo.html";

  }).catch(function (error) {
    alert("Failed to Sign In")
    console.log(error);
  });
}

function signUp() {
  var full_name = document.querySelector('#full_name').value;
  var email = document.querySelector('#email').value;
  var username = document.querySelector('#username').value;
  var password = document.querySelector('#password').value;

  axios.post(rootEndpoint+'/accounts/create',
    {
      username: username,
      password: password,
      full_name: full_name,
      email: email

    }
  ).then(function (resp) {
    alert("Account created. Please Sign in to Proceed");

  }).catch(function (error) {
    alert("Failed to Sign Up")
    console.log(error);
  });
}
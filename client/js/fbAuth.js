 // This is called with the results from from FB.getLoginStatus().
 function statusChangeCallback(response) {

   if (response.status === 'connected') {
     // Logged into your app and Facebook.
     // console.log("Access Token ", response.authResponse.accessToken);

     createTodoFacebookAcoount(response);
   } else {
     // The person is not logged into your app or we are unable to tell.
     document.getElementById('status').innerHTML = 'Please log ' +
       'into this app.';
   }
 }

 function checkLoginState() {
   FB.getLoginStatus(function(response) {
     statusChangeCallback(response);
   });
 }

 window.fbAsyncInit = function() {
   FB.init({
     appId: '735451779974093',
     cookie: true,
     xfbml: true, // parse social plugins on this page
     version: 'v2.8' // use graph api version 2.8
   });


   FB.getLoginStatus(function(response) {
     statusChangeCallback(response);
   });

 };

 // Load the SDK asynchronously
 (function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) return;
   js = d.createElement(s);
   js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 function setAuthLocalStorage(response) {
  localStorage.setItem("fb_access_token", response.authResponse.accessToken);
  localStorage.setItem("fb_user_id", response.authResponse.userID);
  localStorage.setItem("fb_signed_request", response.authResponse.signedRequest);
}


 function createTodoFacebookAcoount(response) {
   console.log('Welcome!  Fetching your information.... ');

  FB.api('/me',  {fields: 'name, email'}, function(response) {
    console.log('Successful login for: ' + response.email);

    axios.post('http://localhost:3000/api/signin/', {
      email: response.email,
      full_name: response.name,
      facebook_id: response.id
    })
    .then(function (response) {
      console.log(response);
      localStorage.setItem("token_todo", response.data.token);
      localStorage.setItem("full_name_todo", response.data.full_name);
      localStorage.setItem("email_todo", response.data.email);
    })
    .catch(function (error) {
      console.log(error);
    });
  });
 }
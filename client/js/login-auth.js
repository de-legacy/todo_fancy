 var rootEndpoint = 'http://35.186.144.106:3001/api';

 // This is called with the results from from FB.getLoginStatus().
 function statusChangeCallback(response) {

   if (response.status === 'connected') {
     // Logged into your app and Facebook.
     // console.log("Access Token ", response.authResponse.accessToken);

     if (typeof signUpFacebook === "function") {
       signUpFacebook(response);
     }

   } else {
     // The person is not logged into your app or we are unable to tell.

     if (document.getElementById('status') !== null) {
      document.getElementById('status').innerHTML = 'Please log ' +
       'into this app.';
     }
   }
 }

 function checkLoginState() {
   FB.getLoginStatus(function(response) {
     statusChangeCallback(response);
   });
 }

 window.fbAsyncInit = function() {
   FB.init({
     appId: '129807987711215',
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
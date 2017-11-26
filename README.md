# todo_fancy
Fancy todo list app with express and mongoose

## API Documentation
Access API endpoint through endpoint root url `http://localhost:3000/api/`

### Sign In
Sign in to current account

**Method URL**

`/api/signin`

**Parameters**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| username | string | Required | Account Username|
| password | string | Required | Account Password|


**Example Response**

```
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTEwMzE2OTEyNmFjMzU0ZDBmODc1NGQiLCJ1c2VybmFtZSI6InJlbmRzb3ciLCJwYXNzd29yZCI6IiQyYSQxMCRENVowTHFhWGtJQW0vNW9sVDBqZ08uMlRjTDRmdjaerhdnvo9uNmozR1ZjTmxaTXN5TnlVdSIsImZ1bGxfbmFtZSI6IlJlbmRlciBBbGwgU29ycm93IiwiZW1haWwiOiJyZW5kQG1haWwuY29tIiwiZmFjZWJvb2tfaWQiOm51bGwsImlhdCI6MTUxMTE0MTgwMn0.rKeUENni2DcpTWn-0kCHA39MF4VnyteK5APfFVjv7Sk",
	"email": "rend@mail.com",
	"full_name": "Render All Sorrow"
}
```

### Sign In Facebook
Sign in using Facebook Account. If user never login using Facebook before, new Account will be created.

**Method URL**

`/api/signin/facebook`

**headers**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| facebook_token | string | Required | Valid facebook Access token. Generated after successfully login|


**Example Response**

```
{
	"token": "eyJhbGciOiJIUzI123423sdfdsfJ9.eyJlbWFpbCI6InNhaW50XzU0ZkB5YWhvby5jby5pZCIsImZ1bGxfbmFtZSI6IlNlcHRpYW4gQS4gRnVqaWFudG8iLCJmYWNlYm9va19pZCI6IjEwMjEwMDU4NDAwNzIyOTg1IiwiaWF0IjoxNTExMTYyOTg3fQ.R95x6NtjjIwssL82xQFAyRuxOT0IEZU4N8ORnUb1Y90",
	"email": "rend@mail.com",
	"full_name": "Render All Sorrow"
}
```

### Sign Up
Create new Account using native / regular Account.

**Method URL**

`/api/signup`

**Parameters**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| username | string | Required | Account Username|
| password | string | Required | Account Password|
| email | string | Required | Account email, must be valid email address|
| full_name | string | Required | User Full Name|

**Example Response**

```
{
	"message": "Account added",
	"account": {
		"__v": 0,
		"username": "diablos",
		"password": "$2a$10$IWWDBSj/1234567890/BwHBn8rCMDda2KChJZ/tQIp7WxK",
		"full_name": "Black Diablos",
		"email": "diablos@wyvern.com",
		"_id": "5a12327a8cc8af1503832853",
		"createdAt": "2017-11-20T01:40:10.232Z",
		"facebook_id": null
	}
}
```
### Create Account
Create new Account for admin only.

**Method URL**

`/api/accounts/create`

**Parameters**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| username | string | Required | Account Username|
| password | string | Required | Account Password|
| email | string | Required | Account email, must be valid email address|
| full_name | string | Required | User Full Name|

**headers**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| admin_secret | string | Required | Admin secret key|

**Example Response**

```
{
	"message": "Account added",
	"account": {
		"__v": 0,
		"username": "diablos",
		"password": "$2a$10$IWWDBSj/1234567890/BwHBn8rCMDda2KChJZ/tQIp7WxK",
		"full_name": "Black Diablos",
		"email": "diablos@wyvern.com",
		"_id": "5a12327a8cc8af1503832853",
		"createdAt": "2017-11-20T01:40:10.232Z",
		"facebook_id": null
	}
}
```
### Update Account
Update Account info.

**Method URL**

`/api/accounts/update/:accountId`

**Parameters**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| username | string | Required | Account Username|
| password | string | Required | Account Password|
| email | string | Required | Account email, must be valid email address|
| full_name | string | Required | User Full Name|


**headers**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| token_todo | string | Required | Correct user Signin token. Generated after successfully Signin|

**Example Response**

```
{
	"message": "Account added",
	"account": {
		"_id": "5a12327a8cc8af1503832853",
		"username": "rdiablos",
		"password": "$2a$10$vwI83jik.12312321312412/95dkz9Vdv5Ga",
		"full_name": "Scream of Death",
		"email": "diablos@wyvern.com",
		"__v": 0,
		"createdAt": "2017-11-20T01:40:10.232Z",
		"facebook_id": null
	}
}
```
### Delete Account
Delete a single Account.

**Method URL**

`/api/accounts/delete/:accountId`


**headers**

| Parameters | Type | Required | Description |
|:---------:|:----:|:--------:|:-----------:|
| admin_secret | string | Required | Admin secret key|

**Example Response**

```
{
	"message": "Account deleted",
	"account": {
		"_id": "5a12327a8cc8af1503832853",
		"username": "rdiablos",
		"password": "$2a$10$vwI83jik.12312321312412/95dkz9Vdv5Ga",
		"full_name": "Scream of Death",
		"email": "diablos@wyvern.com",
		"__v": 0,
		"createdAt": "2017-11-20T01:40:10.232Z",
		"facebook_id": null
	}
}
```
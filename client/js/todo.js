// const rootEndpoint = 'http://localhost:3000/api/';

function signOut() {
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

var app = new Vue({
	el: '#app',
	data: {
		full_name : '',
		token: '',
		tasks: [],
	},

	methods: {
		getAllTasks() {
			axios.get(rootEndpoint+'/todo', { headers: { token_todo: this.token } })
			.then(({data}) => {
				console.log(data)
				this.tasks = data

			}).catch(err => console.log(err.message));
		},

		showNewTaskModal() {
			var modalNewTask = new tingle.modal({
				footer: true,
				stickyFooter: false,
				closeMethods: ['overlay', 'button', 'escape'],
				closeLabel: "Close",
				cssClass: ['modalNewTask']
		  });

		  // set content
		  let newTaskForm = `
		  	<form action="javascript:void(0)">
		  		<div class="input-group u-full-width">
		  			<label>Title</label>
		  			<input class="form-control" type="text" ref="task_title" id="task_title" name="task_title" />
		  		</div>

		  		<div class="input-group u-full-width">
		  			<label>Category</label>
		  			<input class="form-control" type="text" ref="task_category" id="task_category" name="task_category" />
		  		</div>

		  		<div class="input-group u-full-width">
		  			<span class="radio-item">
		  				<input type="radio" name="task_iscomplete" id="task_unfinished" ref="task_iscomplete" value="false" checked>
		  				<label for="task_unfinished">Incomplete</label>
		  			</span>

		  			<span class="radio-item">
		  				<input type="radio" name="task_iscomplete" id="task_finished" ref="task_iscomplete" value="true">
		  				<label for="task_finished">Complete</label>
		  			</span>
		  		</div>

		  		<div class="input-group u-full-width">
		  			<label>Urgency</label>
		  			<input class="form-control" type="number" step="1" min="0" max="10" ref="task_urgency" id="task_urgency" name="task_urgency" />
		  		</div>

		  		<div class="input-group u-full-width">
		  			<label>Reminder At</label>
		  			<input class="form-control" type="datetime-local" ref="task_urgency" id="task_urgency" name="task_urgency" />
		  		</div>
		  	</form>
		  `;

			modalNewTask.setContent(newTaskForm);

			// add a button
			modalNewTask.addFooterBtn('Add Task', 'tingle-btn tingle-btn--primary', function() {
		    modalNewTask.close();
			});

			// add another button
			modalNewTask.addFooterBtn('Cancel', 'tingle-btn tingle-btn--danger', function() {
				modalNewTask.close();
			});

			modalNewTask.open();
		},

		showProfileModal() {
			var modalProfile = new tingle.modal({
				footer: true,
				stickyFooter: false,
				closeMethods: ['overlay', 'button', 'escape'],
				closeLabel: "Close",
				cssClass: ['modalProfile']
		  });

		  // set content
		  let profileContent = `
			  <form action="javascript:void(0)">
			  	<div class="input-group u-full-width">
			  		<label>Your Name</label>
			  		<input class="form-control" type="full_name" ref="full_name" id="full_name" name="full_name" />
			  	</div><!-- /.input-group u-full-width -->

			  	<div class="input-group u-full-width">
			  		<label>Username</label>
			  		<input class="form-control" type="text" ref="username" id="username" name="username" />
			  	</div><!-- /.input-group u-full-width -->

			  	<div class="input-group u-full-width">
			  		<label>Password</label>
			  		<input class="form-control" type="password" ref="password" id="password" name="password" />
			  	</div><!-- /.input-group u-full-width -->

			  	<div class="input-group u-full-width">
			  		<label>Email</label>
			  		<input class="form-control" type="email" ref="email" id="email" name="email" />
			  	</div><!-- /.input-group u-full-width -->

			  </form>
		  `;

			modalProfile.setContent(profileContent);

			// add a button
			modalProfile.addFooterBtn('Save', 'tingle-btn tingle-btn--primary', function() {
		    modalProfile.close();
			});

			// add another button
			modalProfile.addFooterBtn('Cancel', 'tingle-btn tingle-btn--danger', function() {
				modalProfile.close();
			});

			modalProfile.open();
		},
	},

	created() {
		this.full_name = localStorage.getItem('full_name_todo');
		this.token = localStorage.getItem('token_todo');
		this.getAllTasks();
	}
})
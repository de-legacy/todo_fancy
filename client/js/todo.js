const rootUrl = "http://localhost:3001/";

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
			url: rootUrl,
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
		email: '',
		token: '',
		tasks: [],
		users: [],
		message: '',
		show_snackbar: '',
		initTasks: []
	},

	methods: {
		xdebug(data = null) {
			console.log('~~~~~~~xdebug ', data);
			return data;
		},

		getAllTasks() {
			axios.get(rootEndpoint+'/todo', { headers: { token_todo: this.token } })
			.then(({data}) => {
				this.tasks = data
				this.initTasks = data;
			}).catch(err => console.log(err.message));
		},

		getAllUsers() {
			axios.get(rootEndpoint+'/accounts/user', { headers: { token_todo: this.token } })
			.then(({data}) => {
				this.users = data

			}).catch(err => console.log(err.message));
		},

		filterTasks(payload) {
			console.log(payload);

			if (payload.length <= 1) {
				this.tasks = this.initTasks;
			} else {

				var filtered = this.tasks.filter((task) => {
					var regex = new RegExp(payload, 'i');
					return task.title.match(regex) ;
				} );

				this.tasks = filtered;
			}
		},

		upsertTask(newTodo = null, type = "create", index = null) {
			if (newTodo !== null) {
				if (type === "create") {
					console.log(newTodo.reminderAt);
					axios.post(rootEndpoint+'/todo/add', newTodo, { headers: { token_todo: this.token } })
						.then(({data}) => {
							this.tasks.push(newTodo)

						}).catch(err => console.log(err.message));

				}

				if (type === "checked") {
					axios.put(`${rootEndpoint}/todo/edit/${newTodo._id}`, { isComplete : newTodo.isComplete.toString() }, { headers: { token_todo: this.token } })
						.then(({data}) => {
							console.log('Update checked item: ', data);

						}).catch(err => console.log(err.message));
				}

				if (type === "edit") {
					let editData = {
						title: newTodo.title,
						isComplete : newTodo.isComplete.toString(),
						category: newTodo.category,
						urgency: newTodo.urgency,
						reminderAt: newTodo.reminderAt
					};

					axios.put(`${rootEndpoint}/todo/edit/${newTodo._id}`, editData, { headers: { token_todo: this.token } })
						.then(({data}) => {
							console.log('Update edited item: ', data);
							if (index !== null) {
								this.tasks.splice(index, 1, data.data);
							}
						}).catch(err => console.log(err.message));
				}
			}
		},


		showTaskModal(item = null, payload) {
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
		  			<input class="form-control" type="text" ref="task_title" id="task_title" name="task_title" value="${item !== null && item.title !== null &&  typeof item.title !== 'undefined' ? item.title : ''}"/>
		  		</div>

		  		<div class="input-group u-full-width">
		  			<label>Task Status</label>

		  			<select name="task_status" id="task_status" class="form-control">
		  				<option value="false">Incomplete</option>
		  				<option value="true">Complete</option>
		  			</select>
		  		</div>

	  			<div class="input-group u-full-width">
		  			<label>Category</label>
		  			<input class="form-control" type="text" ref="task_category" id="task_category" name="task_category" value="${item !== null && item.category !== null &&  typeof item.category !== 'undefined' ? item.category : ''}"/>
		  		</div>

		  		<div class="input-group u-full-width">
		  			<label>Urgency</label>
		  			<input class="form-control" type="number" step="1" min="0" max="10" ref="task_urgency" id="task_urgency" name="task_urgency" value="${item !== null && item.urgency !== null &&  typeof item.urgency !== 'undefined' ? item.urgency : ''}"/>
		  		</div>

		  		<div class="input-group u-full-width">
		  			<label>Reminder At</label>
		  			<input class="form-control" type="datetime-local" ref="task_reminderat" id="task_reminderat" name="task_reminderat" value="${item !== null && item.reminderAt !== null &&  typeof item.reminderAt !== 'undefined' ? item.reminderAt : ''}"/>
		  		</div>

	  			<div class="input-group u-full-width">
		  			<label>Editor</label>

		  			<select name="task_editorlist" id="task_editorlist" class="form-control" multiple>
								v-html="${this.getUserList()}"
		  			</select>
		  		</div>
		  	</form>
		  `;

			modalNewTask.setContent(newTaskForm);

			// add a button
			modalNewTask.addFooterBtn('Add Task', 'tingle-btn tingle-btn--primary', () => {
				var reminderTime = document.querySelector("#task_reminderat").value;
				var editorList = this.getSelectValues(document.getElementById("task_editorlist"));

				let data = {
					title: document.querySelector("#task_title").value,
					category: document.querySelector("#task_category").value,
					isComplete: document.querySelector("#task_status").value,
					urgency: document.querySelector("#task_urgency").value,
					reminderAt: reminderTime !== '' ? reminderTime : '',
					editorlist : editorList
				}

				if (payload !== null && typeof payload !== "undefined") {
					if (payload.type === "edit") {
						data._id = item._id;
						data.isComplete = data.isComplete === 'false' ? false : true;

						this.tasks.splice(payload.index, 1, data);
						this.upsertTask(data, 'edit', payload.index);
					}
				} else {

					this.upsertTask(data)
				}

		    modalNewTask.close();
			});

			// add another button
			modalNewTask.addFooterBtn('Cancel', 'tingle-btn tingle-btn--danger', function() {
				modalNewTask.close();
			});

			modalNewTask.open();
		},

		getSelectValues(select) {
			var result = [];
			var options = select && select.options;
			var opt;

			for (var i=0, iLen=options.length; i<iLen; i++) {
				opt = options[i];

				if (opt.selected) {
					result.push(opt.value || opt.text);
				}
			}
			return result;
		},

		getUserList() {
			return this.users.map((user, index) => {
				return `<option value="${user._id}">${user.full_name}</option>`;
			})
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
			  		<input class="form-control" type="full_name" ref="full_name" id="full_name" name="full_name" value="${this.full_name}" disabled/>
			  	</div>

			  	<div class="input-group u-full-width">
			  		<label>Email</label>
			  		<input class="form-control" type="email" ref="email" id="email" name="email" value="${this.email}" disabled/>
			  	</div>

			  </form>
		  `;

			modalProfile.setContent(profileContent);

			// add a button
			// modalProfile.addFooterBtn('Save', 'tingle-btn tingle-btn--primary', function() {
		 //    modalProfile.close();
			// });

			// add another button
			modalProfile.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function() {
				modalProfile.close();
			});

			modalProfile.open();
		},

		modifyTask(payload) {
			let taskIndex = payload.index;
			let taskTarget = payload.task;

			if (payload.type === "delete") {
				this.message = `${payload.task.title} Removed`;
				this.show_snackbar = 'show';

				axios.delete(`${rootEndpoint}/todo/delete/${payload.task._id}`, { headers: { token_todo: this.token } })
				.then(({data}) => {
					console.log(data)
					this.tasks.splice(taskIndex, 1);

				}).catch(err => console.log(err.message));

			} else if (payload.type === "checked") {
				this.tasks[taskIndex].isComplete = this.tasks[taskIndex].isComplete === false ? true : false;

				let data = {
					_id : payload.task._id,
					isComplete: this.tasks[taskIndex].isComplete,
				}

				this.upsertTask(data, 'checked')

			} else if (payload.type === "edit") {
				console.log('~~~EDIT JIG ', payload);
				let data = payload.task;
				data._id = payload.task._id;

				this.showTaskModal(data, payload);
			}
		},

		displaySnackbar(payload) {
			this.show_snackbar = payload;
			this.message = "";
		}
	},

	created() {
		this.full_name = localStorage.getItem('full_name_todo');
		this.email= localStorage.getItem('email_todo');
		this.token = localStorage.getItem('token_todo');
		this.getAllTasks();
		this.getAllUsers();
	}
})
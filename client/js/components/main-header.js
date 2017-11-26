let mainHeader = Vue.component('main-header', {
	template: `
		<header class="header">
			<div class="container">
				<div class="row">
					<div class="col-md-2 col-sm-12">
						<h1 class="site-title"><a href="index.html"><i class="fa fa-magic"></i> CekWiz</a></h1>
					</div>

					<div class="col-md-10 col-sm-12">
						<nav class="todo-menu text-right">
							<ul>
								<li>
									<form action="javascript:void(0)">
										<input type="text" class="form-control" id="search_task" name="search_task" ref="search_task" @keyup="getSearch()" placeholder="Search Task"/>
									</form>
								</li>
								<li>Welcome, <span id="user-name">{{ full_name }}</span></li>
								<li><a id="new-task" @click="showNewTaskModal()" href="javascript:void(0)" title="New Task"><i class="fa fa-plus-circle"></i> New Task</a></li>
								<li><a @click="showProfileModal()" href="javascript:void(0)" title="Profile"><i class="fa fa-user"></i> Profile</a></li>
								<li><a onclick="signOut()" href="javascript:void(0)" title="Sign Out"><i class="fa fa-sign-out"></i> Sign Out</a></li>
							</ul>
						</nav><!-- /.todo-menu -->
					</div><!-- /.col-md-10 col-sm-12 -->
				</div><!-- /.row -->
			</div><!-- /.container -->
		</header>
	`,
	props: ['full_name'],
	methods: {
		getSearch(){
			this.$emit('search-change', this.$refs.search_task.value)
		},

		showNewTaskModal() {
			this.$emit('show-task-modal');
		},

		showProfileModal() {
			this.$emit('show-profile-modal');
		},

		signOut(){
			this.$emit('sign-out');
		},
	}

})
let mainConten = Vue.component('main-content', {
	template: `
		<main class="wrap">
			<div class="todo-list">

				<todo-item :item="task" v-for="(task, index) in tasklist" :key="index" :index="index" @do-item-modify-task="getDeletedTask"></todo-item>

			</div>
			<!-- /.todo-list -->
		</main>
		<!-- /.wrap -->
	`,
	props: ['tasklist'],
	methods: {
		getDeletedTask(payload) {
			this.$emit('do-modify-task', payload);
		},
	}
})
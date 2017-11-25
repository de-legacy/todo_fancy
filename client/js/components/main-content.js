let mainConten = Vue.component('main-content', {
	template: `
		<main class="wrap">
			<div class="todo-list">

				<todo-item :item="task" v-for="(task, index) in tasklist" :key="index"></todo-item>

			</div>
			<!-- /.todo-list -->
		</main>
		<!-- /.wrap -->
	`,
	props: ['tasklist'],
	methods: {

	}
})
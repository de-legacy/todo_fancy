let todoItem = Vue.component('todo-item', {
	template: `
		<option v-bind:value="item._id">
			{{ item.full_name }}
		</option>
	`,
	props: ['item', 'index'],
	data(){
		return {
			task : '',
			checked : false,
		}
	},

	methods: {


	},

	created() {
		// this.task = this.item;
	}
})
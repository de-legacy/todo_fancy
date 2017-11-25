let todoItem = Vue.component('todo-item', {
	template: `
		<div class="todo-item">
			<input class="todo-check" type="checkbox" name="isComplete" v-bind:id="item._id" v-bind:ref="item._id" value="true" v-bind:checked="isCompleteChecked()">
			<label v-bind:for="item._id" v-bind:class="isCompleteClass()">{{ item.title }}</label>
		</div>
	`,
	props: ['item'],
	data(){
		return {
			task : ''
		}
	},

	methods: {
		isCompleteChecked() {
			if (this.task.isComplete === true) {
				return 'checked';
			}	else {
				return '';
			}
		},

		isCompleteClass() {
			if (this.task.isComplete === true) {
				return 'todo-title done-item';
			}	else {
				return 'todo-title';
			}
		}
	},

	created() {
		this.task = this.item;
	}
})
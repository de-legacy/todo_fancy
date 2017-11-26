let todoItem = Vue.component('todo-item', {
	template: `
		<div class="todo-item">
			<input @click="checklistTask()" class="todo-check" type="checkbox" name="isComplete" v-bind:id="item._id" v-bind:ref="item._id" value="true" v-bind:checked="isCompleteChecked()">
			<label v-bind:for="item._id" v-bind:class="isCompleteClass()">{{ item.title }}</label>

			<span class="todo-modify">
				<a href="javascript:void(0)" @click="editTask()" class="modify-menu task-edit"><i class="fa fa-cog"></i></a>
				<a href="javascript:void(0)" @click="deleteTask()" class="modify-menu task-delete"><i class="fa fa-trash"></i></a>
			</span>
		</div>
	`,
	props: ['item', 'index'],
	data(){
		return {
			task : ''
		}
	},

	methods: {
		isCompleteChecked() {
			if (this.task.isComplete === true || this.task.isComplete === "true") {
				return 'checked';
			}	else {
				return '';
			}
		},

		isCompleteClass() {
			if (this.task.isComplete === true || this.task.isComplete === "true") {
				return 'todo-title done-item';
			}	else {
				return 'todo-title';
			}
		},

		deleteTask() {
			this.$emit('do-item-modify-task', {task: this.item, index: this.index, type: 'delete'});
		},

		checklistTask() {
			this.$emit('do-item-modify-task', {task: this.item, index: this.index, type: 'checked'});
		},

		editTask() {
			this.$emit('do-item-modify-task', {task: this.item, index: this.index, type: 'edit'});
		}

	},

	created() {
		this.task = this.item;
	}
})
let todoItem = Vue.component('todo-item', {
	template: `
		<div v-bind:class="getUrgencyClass()"">
			<input @click="checklistTask()" class="todo-check" type="checkbox" name="isComplete" v-bind:id="item._id" v-bind:ref="item._id" value="true" v-model="item.isComplete">
			<label v-bind:for="item._id" v-bind:class="isCompleteClass()">{{ item.title }}</label>

			<span class="todo-modify">
				<a href="javascript:void(0)" @click="editTask()" class="modify-menu task-edit"><i class="fa fa-pencil"></i></a>
				<a href="javascript:void(0)" @click="deleteTask()" class="modify-menu task-delete"><i class="fa fa-trash"></i></a>
			</span>
		</div>
	`,
	props: ['item', 'index'],
	data(){
		return {
			task : '',
			checked : false,
		}
	},

	methods: {
		isCompleteChecked() {
			if (this.item.isComplete === true || this.item.isComplete === "true") {
				this.checked = true;
			}	else {
				this.checked = false;
			}
		},

		isCompleteClass() {
			if (this.item.isComplete === true || this.item.isComplete === "true") {
				return 'todo-title done-item';
			}	else {
				return 'todo-title';
			}
		},

		getUrgencyClass() {
			if (this.item.urgency !== null) {
				if (this.item.urgency > 7) {
					return 'todo-item level-danger'
				}

				if (this.item.urgency >= 4) {
					return 'todo-item level-warning'
				}

				if (this.item.urgency  < 4) {
					return 'todo-item level-ok'
				}
			} else {
				return 'todo-item';
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
		// this.task = this.item;
	}
})
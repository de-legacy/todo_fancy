let snackBar = Vue.component('snack-bar', {
	template: `
		<div id="snackbar" v-bind:class="show_snackbar">{{ this.content }}</div>
	`,
	props: ['content', 'show_snackbar'],
	watch : {
		show_snackbar : function (value) {
			this.show =  value;
			console.log('Show changed to '+value);
			this.hideSnackbar();
		}
	},
	data() {
		return {
			show: ''
		}
	},
	methods: {
		hideSnackbar() {
			self = this;

	    setTimeout(function(){
	    	self.$emit('do-snackbar-display', '')
	    }, 3000);

		}
	},
	created() {

	}
})
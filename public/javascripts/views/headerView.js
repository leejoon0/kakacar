define ([
		'libs/text!tpl/header.html' 
		], function (headerTpl){
 	return Backbone.View.extend({
		el: "#header",
		template: headerTpl,
		pageName: '',
		initialize: function() {
			this.model = new ProfileModel();
			//this.model.bind('login',this.load,this);	
			this.model.bind('member',this.load,this);	
			this.model.bind('change', this.render, this);	
			this.model.fetch({
				xhrFields: {
				withCredentials: true
			},
			error: function (){
				//app.navigate("#login", true);
				app.navigate("#member", true);
			}});
		},
		load: function(){
			this.model.fetch({
				xhrFields: {
					withCredentials: true
				},
				success: function() {
					app.headerView.model.trigger('change');
				},
				error: function (){
					//app.navigate("#login", true);
					app.navigate("#member", true);
				}
			});			
		},
		render: function() {
			this.$el.html(_.template(this.template,{attr:this.model.attributes}));
			this.menu();
		},
		menu: function (){
			if (this.pageName){
				$(".active").removeClass('active');
				var nav = $('.nav');
				nav.find('a[href="#'+this.pageName+'"]').parent().addClass('active');
			}
		}
	});

});
define ([
		'libs/text!tpl/box.html',
	    'javascripts/models/member-model'
		], function (BoxTpl, MemberModel){
 	return Backbone.View.extend({
		template: BoxTpl,
		tagName: "figure",
		initialize: function(options) {
			this.model = new MemberModel (options.model);
			this.model.bind('change',this.render,this);
			this.model.bind('clean',this.clean,this);
		},
		/*
		load: function(){
		},
		*/
		render: function() {
		    
		    this.$el.html(_.template(this.template,{attr:this.model.attributes}));
			
			return this;
		}
	});

});
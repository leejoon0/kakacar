define ([
		'libs/text!tpl/boxdetail.html',
	    'javascripts/models/member-model'
		], function (BoxDetailTpl, MemberModel){
 	return Backbone.View.extend({
		template: BoxDetailTpl,
		tagName: "div",
		el: "#content",
		initialize: function() {
		    
		},
		load: function(id){
		    this.model = new MemberModel(id);
			this.model.bind('all', this.render, this);
			this.model.bind('change',this.render,this);
			this.model.fetch({});
		},
		render: function() {
		    
		    this.$el.html(_.template(this.template,{attr:this.model.attributes}));
			
		}
	});

});
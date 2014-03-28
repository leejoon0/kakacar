define ([
		'libs/text!tpl/main.html',
		'javascripts/views/boxView',
	    'javascripts/collections/membersCollection'
		], function (mainTpl, boxView, MembersCollection){
 	return Backbone.View.extend({
		el: "#content",
		template: mainTpl,
		initialize: function() {
		    
		    this.collection = new MembersCollection;
			this.collection.bind('all',this.render, this);
			this.collection.model.bind('change', function(){console.log('change')}, this);
		},
		load: function(){
			this.collection.url = '/member';
			this.collection.fetch({xhrFeilds:creds, 
				success: function(model) {
					console.log(model.length);
				},
				error: function(response){
					app.alertsView.error(response);
				}
			});	
		},
		render: function() {
			this.$el.html(_.template(this.template));
			
			_.each(this.collection.models,function(model){
				$('#boxy').append(new boxView({model:model}).render().el);
			});
			
			// box들 모두 생성후, 호출, 아마도 이때 박스들 재배치
			$('#boxy').boxify({width: "220px"});
		}
	});

});
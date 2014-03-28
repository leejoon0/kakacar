requirejs.config({
	// urlArgs: "bust=" +  (new Date()).getTime() 
	//REMOVE in PROD	
    //By default load any module IDs from js/lib
    // baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    // paths: {
        // app: '../app'
    // }
 	// creds: {
		// withCredentials: true
	// }
});

Backbone.Model.prototype.idAttribute = '_id';

var creds ={
	withCredentials: true
};

require([
	'libs/text!tpl/home.html',
	'libs/text!tpl/login.html', 
	'libs/text!tpl/profile.html',
	
	'javascripts/views/headerView',
	'javascripts/views/mainView',
	'javascripts/views/boxdetailView'
], 
	function (
		homeTpl,
		loginTpl,
		profileTpl,
		
		HeaderView,
		MainView,
		BoxDetailView
	) {
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			'': 'member',
			'member': 'member',
			'member/:id':'memberinfo',
			'*actions': 'member'
		},
		initialize: function() {
			this.headerView = new HeaderView();		
			this.headerView.render();
			/*this.alertsView = new AlertsView();
            this.footerView = new FooterView();
            this.footerView.render();*/
			this.loginView = new LoginView();
			this.profileView = new ProfileView();
			
			this.mainView = new MainView();
			//this.mainView.render();
			//this.bind('all', this.menu, this);
		},
		home: function() {
			this.homeView = new HomeView();
			this.homeView.render();
		},
		login: function() {
		    
			//this.loginView.render();
		},
		member: function (){
		    this.mainView.load();
		    this.mainView.render();
        },
        memberinfo : function(id){
            this.boxdetailView = new BoxDetailView();
            this.boxdetailView.load(id);
        },
		menu: function() {
			/*
			if (this.headerView.pageName!='' && this.headerView.pageName!=Backbone.history.fragment) { 
				this.headerView.pageName=Backbone.history.fragment;
				this.headerView.menu();

			}
			else { //in case of force refresh
				this.headerView.pageName=Backbone.history.fragment;
			}
            
			app.alertsView.renderState();*/
		}
	});

	HomeView = Backbone.View.extend({
		el: "#content",
		template: homeTpl,
		initialize: function() {
            console.log('home init');
		},
		render: function() {
		    console.log('home render');
			$(this.el).html(_.template(this.template));
		}
	});
	
	LoginView = Backbone.View.extend({
		el: "#content",
		template: loginTpl,
		events: {
			'click #login': 'login'
		},
		login: function() {
		    
			var email = $("input[name=email]").val();
			var password = $("input[name=password]").val();
			
			$.ajax({
				url: "/fitter/login",
				type: "post",
				data: {
					email: email,
					password: password
				},
				success: function (data,status,xhr) {
					
					if (data.msg=="Authorized") {
                        app.headerView.model.trigger('login');
						app.navigate('#posts', {trigger: true});
					}
					else {
					    app.alertsView.error (data.msg);
					}

				},
				error: function (xhr, status, error) {
					console.log(error);
					console.log(xhr);
					app.alertsView.collection.add ({text: JSON.parse(xhr.responseText).error, status: status, error:error});
					
				}
			})
		},
		render: function() {
		    
		    // 로그인 상태
		    if(app.headerView.model.id){
		        console.log(app.headerView.model.id)
		        app.navigate('#posts', {trigger: true});
		    }
		    else {
    			this.$el.html(_.template(this.template));
    			this.$el.find('form input').keydown(function(e) {
    			    if (e.keyCode == 13) {
    		            $(this).blur();
    		            $('#login').focus().click();
    			    }
    			});	
		    }		
		}
	});
	
	ProfileView = Backbone.View.extend({
		el: "#content",
		template: profileTpl,
		events: {
			'click #delete': 'destroy',
			'click .edit-save': 'save'
		},
		initialize: function() {
		    
			this.model = new ProfileModel;
			this.model.bind('change', this.render, this);
		},
		destroy: function() {
			console.log(this.model.url)
			this.model.id = this.model.attributes._id;
			this.model.destroy({
				success: function() {
					// app.profileView.render();
					app.alertsView.success("Deleted!");					
					$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();						
					
					app.navigate("#member",true);
				},
				error: function(response) {
					// console.log('error!');
					// app.navigate('#login',true);
					app.alertsView.error (response);					
				}				
			});			
		},
		load: function(id) {
			this.model.fetch({
				xhrFields: {
			      withCredentials: true
			   },
				success: function() {
					app.profileView.render();
				},
				error: function() {
					console.log('error!');
					app.navigate('#member',true);
					app.alertsView.error (response);					
				}
			// 401: function (){
			// 	app.navigate("#login", true);
			// }		
			});
		},
		save: function() {
		    var editBox = this.$el.find('form').toObject();

			this.model.attributes.boxcode = editBox.boxcode;
			this.model.attributes.username = editBox.username;
			this.model.attributes.pic = editBox.userpic;
			this.model.save({},{
				success: function (model) {
					app.alertsView.success("Saved!");
				},
				error: function(model, response){
					app.alertsView.error (response);
				}
			});
		},
		render: function() {
			console.log('profile render')
			this.$el.html(_.template(this.template, {attr:this.model.attributes, profile:this.model.attributes}));
			if (this.model.attributes.posts){
				this.model.attributes.own = true;
				this.$el.html(_.template(this.template, {attr:this.model.attributes, profile:this.model.attributes}));
			}			
		}
	});

	ProfileModel = Backbone.Model.extend({
		url: "/member/profile"
	});
	
	app = new ApplicationRouter();
	Backbone.history.start();
    //Backbone.history.start({pushState:true});
});



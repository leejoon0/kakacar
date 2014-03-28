define([], function () { 
	return FitterModel = Backbone.Model.extend({	
	urlRoot: '/member'
	,validate:function(attrs, options){
	    if(!attrs.useremail){
	        return '메일정보 입력!';
	    }
	    
	    // 신규생성시에만 체크
	    if(!attrs._id){
    	    if(attrs.pw !== attrs.pwCf){
    	        return '비번확인 다시!';
    	    }
	    }
	}
	,initialize: function (opt) {
		if (opt && !_.isObject(opt)) {
			this.url = "/member/"+opt;
			this.id = opt;
		}
		else {
			if (opt && opt.attributes && opt.attributes._id) {
				this.id = opt.attributes._id;
				this.url = '/member/'+this.id;
			}
		}
	}
    });
});
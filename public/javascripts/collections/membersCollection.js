define([
	'javascripts/models/member-model'
	], function (MemberModel) { 
	return MembersCollection = Backbone.Collection.extend({
	url: "/member",
	model: MemberModel,
	parse:  function(response){
		return response;
	},
    initialize:function(){
       this.sort_key = 'username';
    },
    comparator: function(a, b) {
        a = a.get(this.sort_key);
        b = b.get(this.sort_key);
        return a > b ?  1
             : a < b ? -1
             :          0;
    }
}); });
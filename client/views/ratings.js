Template.ratingsIndex.events({
	'click #add-rating' : function(e, t){
		var name = t.find('#add-rating-name').value;
		Meteor.call("addRating", name, function(error, result){
			console.log(result);
		});
	},
	'click .delete-rating' : function(e, t){
		Meteor.call("deleteRating", this._id, function(error, result){
			console.log(result);
		});
	}
})
Template.ratingsIndex.ratings = function(){
	return Ratings.find().fetch();
}
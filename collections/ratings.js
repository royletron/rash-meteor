Ratings = new Meteor.Collection('ratings');

Meteor.methods({
	addRating: function(name)
	{
		return Ratings.insert({name: name, criteria: [], created_by: Meteor.userId()});
	},
	deleteRating: function(id)
	{
		return Ratings.remove(id);
	}
})
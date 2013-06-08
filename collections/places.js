Places = new Meteor.Collection("places")

Meteor.methods({
	createPlace: function(options)
	{
		return Places.insert({
			name: options.name,
			address: options.address,
			website: options.website,
			establishment: true,
			phone: options.phone,
			types: options.types,
			location: options.location,
			google_id: options.google_id,
			user: Meteor.userId()
		})
	},
	getPlacesRadius: function(location, radius)
	{
		var jb = location.jb;
		var kb = location.kb;
		var minjb = jb - (radius/2);
		var maxjb = jb + (radius/2);
		var minkb = kb - (radius/2);
		var maxkb = kb + (radius/2);
		return Places.find({"location.jb": {$gte: minjb, $lt: maxjb}, "location.kb": {$gte: minkb, $lt: maxkb}}).fetch();
	}
})

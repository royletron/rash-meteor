Places = new Meteor.Collection("places")

Meteor.methods({
	createPlace: function(options)
	{
		var slug = URLify(options.name);
		var counter = 1;
		while(Places.find({slug: slug}).fetch().length > 0)
		{
			slug = URLify(options.name+" "+counter);
			counter++;
		}
		return Places.insert({
			slug: slug,
			name: options.name,
			address: options.address,
			website: options.website,
			establishment: true,
			phone: options.phone,
			types: options.types,
			location: options.location,
			google_id: options.google_id,
			judgements: [],
			user: Meteor.userId()
		})
	},
	getPlaceFromSlug: function(slug)
	{
		return Places.findOne({slug: slug});
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
	},
	addJudgementTypeToPlace: function(place, type)
	{
		Places.update(place._id, { $addToSet: { judgements: type}});
	}
})

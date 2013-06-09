Judgements = new Meteor.Collection("judgements")

Meteor.methods({
	createJudgement: function(options)
	{
		return Judgement.insert({
			user: Meteor.userId(),
			rating: options.rating,
			place: options.place,
			judgementtype: options.judgementtype
		})
	},
	clearJudgement: function(type, place)
	{
		var judgement = Judgements.findOne({user: Meteor.userId(), place: place, judgementtype: type});
		//console.log(judgement);
		Judgements.remove(judgement._id);
	},
	getJudgements: function(options)
	{
		return Judgements.find(options).fetch();
	},
	getCollectionJudgements: function(options)
	{
		var judgements = Judgements.find(options).fetch();
		var rating = 0;
		_.each(judgements, function(addr, idx){
			rating = rating + addr.rating;
		})
		rating = rating/judgements.length;
		rating = Math.round(rating*10)/10;
		return rating;
	},
	setJudgement: function(type, place, value)
	{
		var current = Judgements.findOne({user: Meteor.userId(), place: place, judgementtype: type});
		if(current != undefined)
			return Judgements.update(current._id, { $set: {rating: value}});
		else
			return Judgements.insert({user: Meteor.userId(), rating: value, place: place, judgementtype: type});
	}
})
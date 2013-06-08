Judgements = new Meteor.Collection("judgements")

Meteor.methods({
	createJudgement: function(options)
	{
		return Judgements.insert({
			establishment: options.establishment,
			type: options.type,
			userid: Meteor.userId(),
			value: options.value
		})
	}
})
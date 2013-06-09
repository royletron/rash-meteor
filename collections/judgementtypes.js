JudgementTypes = new Meteor.Collection("judgementtypes")

Meteor.methods({
	createJudgementType: function(options)
	{
		return JudgementTypes.insert({
			name: option.name,
			offimage: option.offimage,
			onimage: option.onimage 
		})
	}
})
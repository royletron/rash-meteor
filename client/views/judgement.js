Template.judgement.place = function()
{
	//console.log(Session.get("judgementPlace"))
	return Session.get("judgementPlace");
}
Template.judgement.allTypes = function()
{
	return JudgementTypes.find().fetch();
}
Template.judgement.types = function()
{
	console.log(JudgementTypes.find({_id: {$in: Session.get("judgementPlace").judgements}}).fetch())
	return JudgementTypes.find({_id: {$in: Session.get("judgementPlace").judgements}}).fetch();
}
Template.judgementtype.rendered = function()
{
}
Template.judgement.events({
	'click #saveButton' : function(e, t){
		var type = t.find('#judgementType').value
		Meteor.call("addJudgementTypeToPlace", Session.get("judgementPlace"), type);
	}
})
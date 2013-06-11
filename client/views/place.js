Template.place.place = function()
{
	//console.log(Session.get("judgementPlace"))
	return Session.get("judgementPlace");
}
Template.place.allTypes = function()
{
	return typesNotIn();
}
Template.place.theseTypes = function()
{
	return Session.get("judgementTypes");
}
Template.place.typesRemain = function()
{
	console.log(typesNotIn());
	return typesNotIn().length > 0
}
function typesNotIn(){
	return JudgementTypes.find({_id: {$not: {$in: Session.get("judgementPlace").judgements}}}).fetch();
}
Template.place.types = function()
{
	console.log(Session.get("judgementPlace"));
	return JudgementTypes.find({_id: {$in: Session.get("judgementPlace").judgements}}).fetch();
}
Template.judgementtype.rendered = function()
{
}
Template.place.events({
	'click #saveButton' : function(e, t){
		var type = t.find('#judgementType').value
		Meteor.call("addJudgementTypeToPlace", Session.get("judgementPlace"), type, function(error, result){
			$('.modal').modal('hide');
		});
	}
})
Template.collectionjudgementrating.rendered = function(e, t)
{
	//console.log(this);
	var _this = this;
	Meteor.call("getCollectionJudgements", {judgementtype: this.data._id, place: Session.get("judgementPlace")._id}, function(error, result){
		Session.set("collectionjudgement_rating_"+_this.data._id, result);
	});
}
Template.collectionjudgementrating.rating = function(value)
{
	var t = Session.get("userjudgement_rating_"+this._id);
	return value <= Session.get("collectionjudgement_rating_"+this._id);
}
Template.collectionjudgementrating.ratingValue = function()
{
	var t = Session.get("userjudgement_rating_"+this._id);
	return Session.get("collectionjudgement_rating_"+this._id);
}
Template.userjudgementrating.rendered = function(e, t)
{
	//console.log(this);
	var _this = this;
	Meteor.call("getJudgements", {judgementtype: this.data._id, place: Session.get("judgementPlace")._id, user: Meteor.userId()}, function(error, result){
		if(result.length == 0)
		{
			Session.set("userjudgement_"+_this.data._id, false)
			Session.set("userjudgement_rating_"+_this.data._id, "")
		}
		else{
			Session.set("userjudgement_"+_this.data._id, true)
			Session.set("userjudgement_rating_"+_this.data._id, result[0])
		}
	});
}
Template.userjudgementrating.rating = function(value)
{
	if(Session.get("userjudgement_"+this._id))
		return value <= Session.get("userjudgement_rating_"+this._id).rating;
	else
		return false
}
Template.userjudgementrating.ratingValue = function()
{
	return Session.get("userjudgement_rating_"+this._id).rating;
}
Template.userjudgementrating.rated = function()
{
	return Session.get("userjudgement_"+this._id);
}
function rate(val, _this)
{
	Meteor.call("setJudgement", _this._id, Session.get("judgementPlace")._id, val, function(error, result){
		Session.set("userjudgement_"+_this._id, true);
		Session.set("userjudgement_rating_"+_this._id, val);
	})
}
Template.userjudgementrating.events({
	'click #clearIt' : function(e, t){
		var _this = this
		Meteor.call("clearJudgement", this._id, Session.get("judgementPlace")._id, function(error, result){
			Session.set("userjudgement_"+_this._id, false);
			Session.set("userjudgement_rating_"+_this._id, "");
		})
	},
	'click #rate1' : function(e, t){
		e.preventDefault();
		rate(1, this);
	},
	'click #rate2' : function(e, t){
		e.preventDefault();
		rate(2, this);
	},
	'click #rate3' : function(e, t){
		e.preventDefault();
		rate(3, this);
	},
	'click #rate4' : function(e, t){
		e.preventDefault();
		rate(4, this);
	},
	'click #rate5' : function(e, t){
		e.preventDefault();
		rate(5, this);
	}
})
Template.test.animals = function() {
	Meteor.call("getAnimals", "#FFC500", function(error, result){
		console.log(result);
	});
}
Template.test.judgement = function() {
	
}
Template.user_profile.rendered = function ( ) {
	var element = document.getElementById('constructed-widget');
	if(filepicker != undefined)
		filepicker.constructWidget(element);
};

Template.user_profile.events({
  'click #saveButton' : function(e, t){
    var name = t.find('#user_profile_name').value;
    var filepath = t.find('#filepath').value;
    var profile = {name: name, picture: filepath};
    Meteor.users.update(Meteor.userId(), { $set: {profile: profile} });
  }
});

avatarUploaded = function(avatar) {
  console.log(avatar);
	$("#user_profile_modal > .row > .avatar").attr("src", avatar+"/convert?w=30&h=30&fit=crop");
	$("#filepath").val(avatar);
}
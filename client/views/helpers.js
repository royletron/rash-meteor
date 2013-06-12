var counter = 0;

Handlebars.registerHelper("resetCounter", function() {
	counter = 0;
});

Handlebars.registerHelper("null", function() {
  return undefined
});

Handlebars.registerHelper("getAvatar", function(small, user){
	if(user.profile == undefined)
		user = Meteor.user();
	if(small == undefined)
		small = false;
	var imgpath = ""
	if(user.profile.picture == undefined)
		imgpath = "/img/default.png";
	else
  {
		imgpath = user.profile.picture;
    if(imgpath.split('filepicker').length > 0)
    {
      if(small)
        imgpath = imgpath + "/convert?w=30&h=30&fit=crop";
    }
  }
	var rtn = "<img src='"+imgpath+"' class='avatar' ";
	if(small)
		rtn = rtn + "width='30px' height='30px' ";
	rtn = rtn + '/>';
	console.log(rtn);
	return rtn;
})

Handlebars.registerHelper("getCounter", function(value){
	console.log(counter+":"+value);
	if(counter < parseInt(value))
	{
		console.log(true);
		counter = counter + 1;
		return true;
	}
	else
	{
		console.log(false);
		counter = 0;
		return false;
	}
})
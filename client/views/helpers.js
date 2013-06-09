var counter = 0;

Handlebars.registerHelper("resetCounter", function() {
	counter = 0;
});

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
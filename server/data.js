/*var animal_images = [{name: "calf"}, {name: "chicken"}, {name: "cow"}, {name: "deer"}, {name: "duck"}, {name: "fish1"}, {name: "fish2"}, {name: "fish3"}, {name: "goat"}, {name: "goose"}, {name: "pidgeon"}, {name: "pig"}, {name: "rabbit"}, {name: "sheep"}];
var animal_path = '/public/img/.animals/';
var __dirname = path.resolve('.');
var fs = Npm.require('fs');
function getWebPath(image, colour)
{
	if(colour == undefined)
		return animal_path+image.name+".png";
	else
		return animal_path+"coloured/"+image.name+"_"+colour+".png";
}
function getLocalPath(image, colour)
{
	return __dirname+getWebPath(image, colour);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function colourizeImage(image, colour)
{
	gm(getLocalPath(image))
		.antialias(false)
		.fuzz('20%')
		.fill('#FFC500')
		.opaque('#000000')
		.write(getLocalPath(image, colour), function (err) {
  		if (err) 
  			console.log(err)
		});
		im.convert([getLocalPath(image), '-fuzz', '10%', '-fill', colour, '+opaque', 'black', '-fill', colour, '-opaque', 'black', getLocalPath(image, colour)]);
}
Meteor.methods({
	getAnimals: function (colour){
		if((colour == undefined) || (colour == '#000000'))
		{
			return animal_images;
		}
		else{
			var rtn = []
			_.each(animal_images, function(image, idx){
				fs.exists(getLocalPath(image, colour), function(exists) {
  				if (!exists) {
    				console.log("Need to create:"+getWebPath(image, colour));
    				colourizeImage(image, colour);
  				}
  				else{
    				console.log(getWebPath(image, colour)+" already exists");
  				}
				});
				rtn.push(image);
			});
			return rtn;
		}
	}
})
Meteor.startup(function () {
  /*GM.test();
  gm(__dirname+'/public/img/animals~/animal_0000_Layer-13.png')
		.resize(240, 240)
		.noProfile()
		.write(__dirname+'/public/img/animals~/animal_0000_Layer-13_sm.png', function (err) {
  		if (!err) 
  			console.log('done')
  		else 
  			console.log(err);
		});
});*/
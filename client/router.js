function logout() {
	this.done();
  Session.set("myPlaces", "");
  Session.set("selectedPlace", "");
	if(Meteor.user() != null)
	{
		var name = Meteor.user().profile.name;
		Meteor.logout();
	  Session.set("displayMessage", "success &amp; Bye "+name+", come back!");
	}
}

function load() {
  if (Meteor.loggingIn()) {
    // dynamically set the template
    this.template("loading");
    // stop downstream callbacks from running
    this.done();
  }
}

function getPlaces() {
  Session.set("myPlaces", Places.find({user: Meteor.userId()}).fetch());
  console.log(Session.get("myPlaces"))
}

function clearSessions() {
  Session.set("myPlaces", "");
  Session.set("selectedPlace", "");
}

function getPlace() {
  var place = Places.findOne({slug: this.params.place});
  Session.set("judgementPlace", place);
}

Meteor.pages({

    // Page values can be an object of options, a function or a template name string

    '/': { to: 'home', as: 'root', nav: 'home' },
    '/test': { to: 'test', as: 'test', nav: 'test' },
    '/places': { to: 'places', as: 'places', nav: 'places', layout: 'inverselayout', before: [clearSessions] },
    '/judgements/:place': { to: 'judgement', as: 'judgement', nav: 'judgement', before: [getPlace] },
    '/myplaces': { to: 'myplaces', as: 'myplaces', nav: 'myplaces', layout: 'inverselayout', before: [getPlaces] },
    '/places/new': { to: 'addplace', as: 'addplace', nav: 'addplace', before: [clearSessions] },
    '/login': { to: 'login', as: 'login', nav: 'login' },
    '/logout': { to: 'logout', as: 'logout', nav: 'logout', before: [logout] },
    '/signup': { to: 'signup', as: 'signup', nav: 'signup' }
  }, {

    // optional options to pass to the PageRouter
    defaults: {
      layout: 'layout',
      before: [load]
    }
  });

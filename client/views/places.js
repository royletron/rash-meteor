var uk;
var marker;
var map;
var markers =[];
var infowindow
function getLatLng(location)
{
    return new google.maps.LatLng(location.jb, location.kb)
}
function clearMarkers()
{
    for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
    }
    markers = [];
}
function getMap(id, controls)
{
    uk = new google.maps.LatLngBounds(new google.maps.LatLng(58.33257, -10.85449), new google.maps.LatLng(50.12058, 2.06543));
    google.maps.visualRefresh = true;
    if(controls == undefined)
        controls = true;
    var mapOptions = {
        center: new google.maps.LatLng(54.810943, -4.617691),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        panControl: controls,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        zoomControl: controls,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: controls
    };
    map = new google.maps.Map(document.getElementById(id), mapOptions);
    if((Session.get("selectedPlace") != undefined) && (Session.get("selectedPlace").location != undefined))
        setMarker(map, getLatLng(Session.get("selectedPlace").location));
    else
        map.fitBounds(uk);
    google.maps.event.addDomListener(window, 'resize', function() {
        if(Session.get("selectedPlace") == undefined)
            map.fitBounds(uk);
        else{
            var centerPoint = new google.maps.LatLng(Session.get('selectedPlace').location.jb, Session.get('selectedPlace').location.kb);
            map.panTo(centerPoint);
        }
    });
    return map
}
function setMarker(map, position)
{
    if(marker != undefined)
        marker.setVisible(false);
    marker = new google.maps.Marker({
        map:map,
        animation: google.maps.Animation.DROP,
        icon: '/img/alizarin_marker.png'
    });
    marker.setPosition(position);
    marker.setVisible(true);
    centerAtPoint(position);
}
function centerAtPoint(position)
{
    map.panTo(position);
    centerPoint = position;
    map.setZoom(15);
}
/*
function setInfo(selectedPlace)
{
    if(selectedPlace.establishment)
    {
        $('#selected-place-name').html(selectedPlace.name);
        $('#selected-place-address-1').html(selectedPlace.address.first_line);
        $('#selected-place-address-2').html("");
        $.each(selectedPlace.address, function(idx, addr){
            if((addr != "") && (idx != "first_line"))
            {
                $('#selected-place-address-2').append("<br>"+addr);
            }
        });
    }
    else{
        $('#selected-place-name').html("New place");
    }
    $('#selected-place').slideDown();
}*/
function setTypeAhead(field, map)
{
    var input = /** @type {HTMLInputElement} */(document.getElementById(field));
    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        Session.set("selectedPlace", undefined)
        clearMarkers();
        if(place.address_components){
            selectPlace(place);
        }
        else{
            var request = {
                location: map.getCenter(),
                radius: 50000,
                keyword: place.name
            };
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, searchResults);
        }
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        autocomplete.setBounds(bounds);
    });
}
function createPlace(place)
{
    var address = {first_line: "", second_line: "", local: "", county: "", postcode: ""};
    var first_line = "";
    _.each(place.address_components, function(addr, idx){
        _.each(addr.types, function(val, idx){
            switch(val)
            {
                case "route":
                    first_line = first_line + addr.long_name;
                    break;
                case "administrative_area_level_1":
                    address.county = addr.long_name;
                    break;
                case "postal_code":
                    address.postcode = addr.long_name;
                    break;
                case "street_number":
                    first_line = addr.long_name + " " + first_line;
                    break;
                case "locality":
                    address.local = addr.long_name;
                    break;
                case "postal_town":
                    address.local = addr.long_name;
                    break;
                case "administrative_area_level_2":
                    address.county = addr.long_name;
                    break;
                case "sublocality":
                    address.second_line = addr.long_name;
                    break;
            }
        });
    });
    var establishment = false;
    if(_.contains(place.types, "establishment"))
        establishment = true;
    address.first_line = first_line;
    return {name: place.name, address: address, website: place.website, phone: place.formatted_phone_number, types: place.types, location: place.geometry.location, establishment: establishment, google_id: place.id}
}
function selectPlace(place)
{
    setMarker(map, place.geometry.location);
    Session.set("selectedPlace", createPlace(place));
}
function searchResults(results, status) {
    if(status == "ZERO_RESULTS")
    {
        Session.set("displayMessage", "error &amp; Couldn't find anywhere, try zooming on area");
    }
    else{
        if(results.length == 1)
        {
            var service = new google.maps.places.PlacesService(map);
            service.getDetails({reference: results[0].reference}, setSingleResult);
            var place = results[0];
        }
        else{
            var bounds = new google.maps.LatLngBounds();
            _.each(results, function(place, idx){  
                var tmarker = new google.maps.Marker({
                    map:map,
                    animation: google.maps.Animation.DROP,
                    title: place.name,
                    icon: '/img/alizarin_marker.png',
                    position: place.geometry.location
                });
                tmarker.place = createPlace(place);
                google.maps.event.addListener(tmarker, 'click', function() {
                    searchClicked(tmarker);
                });
                markers.push(tmarker);
                bounds.extend(place.geometry.location);
            });
            map.fitBounds(bounds);
        }
    }
}
function searchClicked(marker)
{
    Session.set('selectedPlace', marker.place);
    centerAtPoint(marker.position);
}
function setSingleResult(place, status)
{
    selectPlace(place);
}
Template.map.rendered = function() {
    if(!this.rendered){
        var map = getMap("map-canvas-sm", false);
        setTypeAhead("place-search", map);
        this.rendered = true;
    }
}
Template.selectedPlace.events({
    'click #addPlace' : function(e, t){
        e.preventDefault();
        var place = Session.get("selectedPlace");
        var error = false;
        if(!place.establishment)
        {
            var placeName = t.find('#placeName').value;
            if(placeName == "")
            {
                Session.set("displayMessage", "error &amp; This place needs a name!");
                error = true;
            }
            else{
                place.name = placeName;
            }
        }
        if(!error)
        {
            Meteor.call("createPlace", place, function(error, results){
                if(error)
                    Session.set("displayMessage", "error &amp; "+error);
                else{
                    Session.set("displayMessage", "success &amp; "+place.name+" added.")
                }
            })
        }
 //       t.find()
    }
})
Template.selectedPlace.hasItem = function() {
    return Session.get("selectedPlace") != undefined
}
Template.selectedPlace.item = function() {
    return Session.get("selectedPlace");
}
Template.selectedPlace.slug = function() {
    return Places.findOne({google_id: Session.get("selectedPlace").google_id}).slug
}
Template.selectedPlace.isAdded = function() {
    if(Session.get("selectedPlace").google_id == "")
        return false
    else
        return (Places.find({google_id: Session.get("selectedPlace").google_id}).fetch().length > 0)
}
Template.selectedPlace.address = function() {
    return getAddress();
}
function getUserLocation(success, error){
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
        var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        success(me);
    }, function(error) {
        if(error != undefined)
            error(error);
    });
}
function getAddress(){
    var rtn = "";
    _.each(Session.get("selectedPlace").address, function(addr, idx){
        if((addr != "") && (idx != "first_line"))
        {
            rtn = rtn+"<br>"+addr;
        }
    });
    return rtn;
}
Template.places.rendered = function() {
    var map = getMap("map-canvas");
    getUserLocation(gotUser);
}
function gotUser(position)
{
    var tmarker = new google.maps.Marker({
        map:map,
        animation: google.maps.Animation.DROP,
        title: "You!",
        icon: '/img/pale_marker.png',
        position: position
    })
    centerAtPoint(position);
    Meteor.call("getPlacesRadius", position, 1, function(error, results){
        if(error)
            Session.set("displayMessage", "error &amp; "+error);
        else
        {
            if(results.length > 0)
                renderPlaces(results, false);
            else
                Session.set("displayMessage", "info &amp; No places nearby");
        }
    });
}
function colourPin(colour)
{
    var pinColour = colour;
    return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColour,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
}
function renderPlaces(places, boundsOn)
{
    var bounds = new google.maps.LatLngBounds();
    _.each(places, function(place, idx){  
        var tmarker = new google.maps.Marker({
            map:map,
            animation: google.maps.Animation.DROP,
            icon: '/img/alizarin_marker.png',
            title: place.name,
            position: getLatLng(place.location)
        });
        tmarker.place = place;
        google.maps.event.addListener(tmarker, 'click', function() {
            Session.set("selectedPlace", tmarker.place);
            console.log(tmarker.place);
            var info = "<h4>"+tmarker.place.name+"</h4><br /><address><strong>"+tmarker.place.address.first_line+"</strong>"+getAddress()+"</address><a href='./judgements/"+tmarker.place.slug+"' class='btn btn-primary'>Go Judge</a>"
            if(infowindow != undefined) 
                infowindow.close();
            infowindow = new google.maps.InfoWindow({
                content: info
            })
            searchClicked(tmarker);
            infowindow.open(map,tmarker);
        });
        markers.push(tmarker);
        bounds.extend(tmarker.position);
    });
    if(boundsOn || (boundsOn == undefined))
        map.fitBounds(bounds);
}
Template.myplaces.rendered = function() {
    var map = getMap("map-canvas");
    clearMarkers();
    if(Session.get("myPlaces").length > 0)
    {
        renderPlaces(Session.get("myPlaces"))
    }
}

Template.addplace.rendered = function() {
}
var centerPoint;
var uk;
function centerMap(map)
{
    console.log(centerPoint);
    if(centerPoint == undefined)
        map.fitBounds(uk);
    else
        map.panTo(centerPoint);
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
    var map = new google.maps.Map(document.getElementById(id), mapOptions);
    centerMap(map);
    google.maps.event.addDomListener(window, 'resize', function() {
        centerMap(map);
    });
    return map
}
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
}
function setTypeAhead(field, map)
{
    var input = /** @type {HTMLInputElement} */(document.getElementById(field));
    var autocomplete = new google.maps.places.Autocomplete(input);
    var marker = new google.maps.Marker({
        map:map,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if(place.address_components){
            var address = {first_line: "", second_line: "", local: "", county: "", postcode: ""};
            marker.setVisible(false);
            var first_line = "";
            $.each(place.address_components, function(idx, addr){
                $.each(addr.types, function(idx, val){
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
            if($.inArray("establishment", place.types) > 0)
                establishment = true;
            address.first_line = first_line;
            marker.setPosition(place.geometry.location);
            map.panTo(place.geometry.location);
            centerPoint = place.geometry.location;
            map.setZoom(15);
            marker.setVisible(true);
            Session.set("selectedPlace", {name: place.name, address: address, website: place.website, phone: place.formatted_phone_number, types: place.types, location: place.geometry.location, establishment: establishment, types: place.types, google_id: place.id});
            setInfo(Session.get("selectedPlace"));
        }
        else{
            console.log(place);
            var request = {
                bounds: map.getBounds(),
                keyword: place.name
            };
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        }
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        autocomplete.setBounds(bounds);
    });
}
function callback(results, status) {
    console.log(status);
    console.log(results);
}

Template.myplaces.rendered = function() {
    var map = getMap("map-canvas");
}

Template.addplace.rendered = function() {
    var map = getMap("map-canvas-sm", false);
    setTypeAhead("place-search", map);
}
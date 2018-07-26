//MAPA
var map, infoWindow, placeLoc;
var scl = { lat: -33.4190451, lng: -70.6438986 };


// funcion para mostrar mapa
function initMap() {
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: scl,
        zoom: 13
    });

    infoWindow = new google.maps.InfoWindow();
    // para mostrar elementos por keyword
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: scl,
        radius: 1000,
        prominence: 1000,
        keyword: "(restaurante) OR (restaurant) OR (establishments)"
    }, callback);

    //funcionalidad de tarjeta de busqueda
    var card = document.getElementById("pac-card");
    var input = document.getElementById("pac-input");
    var countries = document.getElementById("country-selector");


}


// funcion del callback
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, "click", function() {
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
}

// funcion para la localizacion HTML5
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Estas aquí.");
        infoWindow.open(map);
        map.setCenter(pos);
    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });
} else {
    // Browser doesn"t support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
}

// funcion para la localizacion del usuario
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        "Error: La geolocalización falló." :
        "Error: Tu navegador no soporta la geolocalización.");
    infoWindow.open(map);
}
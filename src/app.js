var map, infoWindow, searchPlace, pos;
var scl = { lat: -33.4190451, lng: -70.6438986 };


// funcion para mostrar mapa
function initMap() {
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: scl,
        zoom: 13,
        mapTypeControl: false,
        scaleControl: true,
        fullscreenControl: false,
        streetViewControl: false,
    });
    if (searchPlace) {
        nearbySearch(map)
    };

    infoWindow = new google.maps.InfoWindow();
    // para mostrar elementos por keyword
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: scl,
        radius: 1000,
        rankby: "distance",
        keyword: "(food) AND (restaurant) AND (cafe)",
        type: ["establishment"],
    }, callback);
}

function nearbySearch(map) {
    infowindow = new google.maps.InfoWindow();
    var request = {
        location: pos,
        radius: 1000,
        types: [JSON.stringify(select.value)],
        key: "AIzaSyCOqZlf8w07M8yEiRjRcELfHrntiu4TdDA"
    };
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
        infoWindow.setContent("<div><strong>" + place.name + "</strong><br>" + place.vicinity + "</div>");
        infoWindow.open(map, this);
    });
}


// funcion para la localizacion HTML5
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
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
    // Browser no soporta geolocalizacion
    handleLocationError(false, infoWindow, map.getCenter());
}

// funcion para el error de la localizacion del usuario
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        "Error: La geolocalización falló." :
        "Error: Tu navegador no soporta la geolocalización.");
    infoWindow.open(map);
}

// funcion del select
var currentValue = 0;

function handleClick(select) {
    searchPlace = select.value;
    //arreglar aca
    initMap();
}
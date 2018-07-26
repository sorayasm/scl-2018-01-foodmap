var map, infoWindow, placeLoc;
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

    //funcionalidad de tarjeta de busqueda
    var card = document.getElementById("pac-card");
    var input = document.getElementById("pac-input");


    var options = {
        type: ["premise"],
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);


    // restricion de busqueda.
    autocomplete.setComponentRestrictions({ "country": "cl" }, { "city": "santiago" });

    // Data que se entrega.
    autocomplete.setFields(
        ["address_components", "geometry", "icon", "name"]);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener("place_changed", function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // errror al ingresar un lugar fuera del rango.
            window.alert("No details available for input: " + place.name + "</br> " +
                place.addressline + ".");
            return;
        }

        // Si el lugar tiene un area se muestra en el mapa.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = "";
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ""),
                (place.address_components[1] && place.address_components[1].short_name || ""),
                (place.address_components[2] && place.address_components[2].short_name || "")
            ].join(" ");
        }

        infowindowContent.children["place-icon"].src = place.icon;
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent = address;
        infowindow.open(map, marker);
    });


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

console.log(typeof(places))

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
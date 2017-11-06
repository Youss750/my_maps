var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var clic = (navigator.geolocation.getCurrentPosition);
var labelIndex = 0;
var apple = [{"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"color": "#f7f1df"} ] }, {"featureType": "landscape.natural", "elementType": "geometry", "stylers": [{"color": "#d0e3b4"} ] }, {"featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi.medical", "elementType": "geometry", "stylers": [{"color": "#fbd3da"} ] }, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#bde6ab"} ] }, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"} ] }, {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"} ] }, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffe15f"} ] }, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#efd151"} ] }, {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"} ] }, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"} ] }, {"featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{"color": "#cfb2db"} ] }, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"} ] } ];
var retro = [{"featureType": "administrative", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "water", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "transit", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "landscape", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "road.highway", "stylers": [{"visibility": "off"} ] }, {"featureType": "road.local", "stylers": [{"visibility": "on"} ] }, {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"visibility": "on"} ] }, {"featureType": "water", "stylers": [{"color": "#84afa3"}, {"lightness": 52 } ] }, {"stylers": [{"saturation": -17 }, {"gamma": 0.36 } ] }, {"featureType": "transit.line", "elementType": "geometry", "stylers": [{"color": "#3f518c"} ] } ];

function initMap() {
 var directionsDisplay = new google.maps.DirectionsRenderer;
 var directionsService = new google.maps.DirectionsService;
 var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat:  48.866667, lng: 2.333333},
  zoom: 6,
});
 var service = new google.maps.places.PlacesService(map);
 service.getDetails({
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
}, function(place, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address + '</div>');
      infowindow.open(map, this);
    });
  }
});
 $('#retro').click(function(e){
   var styledMapType = new google.maps.StyledMapType(retro);
   map.mapTypes.set("retro", styledMapType);
   map.setMapTypeId("retro");
 });
 $('#apple').click(function(e){
   var styledMapType = new google.maps.StyledMapType(apple);
   map.mapTypes.set("apple", styledMapType);
   map.setMapTypeId("apple");
 });
 $('#defaut').click(function(e){
   var styledMapType = new google.maps.StyledMapType();
   map.mapTypes.set("", styledMapType);
   map.setMapTypeId("");
 });

 directionsDisplay.setMap(map);
 directionsDisplay.setPanel(document.getElementById('right-panel'));
 var control = document.getElementById('floating-panel');
 control.style.display = 'block';
 map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
 var infoWindow = new google.maps.InfoWindow({map: map});
 var onChangeHandler = function() {
  calculateAndDisplayRoute(directionsService, directionsDisplay);
};
document.getElementById('go').addEventListener('click', onChangeHandler);

google.maps.event.addListener(map, 'click', function(e) {
  placeMarker(e.latLng, map);
  var coord = e.latLng + "";
  $("#start").val(coord.substr(1, coord.length - 2));
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      title: 'Vous êtes ici !'
    });
    map.setCenter(pos);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  handleLocationError(false, infoWindow, map.getCenter());
}
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var checkbox;
  if($("#auto").is(":checked")){
    checkbox = true;
    console.log(checkbox);
  }
  else{
    checkbox = false;
  }
  var radio;
  if($("#cars").prop("checked")){
    radio = "DRIVING";
  }
  else if($("#bike").prop("checked")){
    radio = "BICYCLING";
  }
  else if($("#bus:checked")){
    radio = "TRANSIT";
  }
  else if($("#foot:checked")){
    radio = "WALKING";
  }
  else{
    radio = "DRIVING";
  }
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: "DRIVING",
    avoidHighways : checkbox
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Adresse non trouvée');
    }
  });
}   
function placeMarker(position, map) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });  
  marker.addListener("dblclick", function() {
    marker.setMap(null);
  });
  map.panTo(position);
}
function swap(){
  var end = $("#end").val();
  var start = $("#start").val();
  $("#start").val(end);
  $("#end").val(start);
}


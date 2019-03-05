//creates the variable mymap and sets it as a generic basemap set over London
var mymap = L.map('mapid').setView([51,.505, -0.09], 13)

//adds leaflet streetmap tiles to the basemap created 

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoibmlja2V4bGV5IiwiYSI6ImNqa2NvNDB3czJ6MWIza25jNTNpZ2hzd3UifQ.SicpdfBh89yX77sNq-Nyhg'
}).addTo(mymap);

//creates and places a generic point marker on the map at the coordinates indicated
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//creates and places a red circle on the map at the coordinates indicated
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//creates and places a polygon on the map with vertices at the coordinates indicated
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

//adds popup messages to the map with the text below bound to the marker, circle, and polygon 
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//creates a popup message that stands alone at the coordinates indicated 
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

//creates the onMapClick function to pop up an alert indicating the coordinates of the point the user clicked on 	
function onMapClick(e) {
	alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);

//creates the popup variable and assigns it to the popup function 
var popup = L.popup();

//adjusts the onMapClick function to add the pop up alert to the specific coordinates on the map that the user clicks on
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

//calls the onMapClick function when the user clicks on the map 
mymap.on('click', onMapClick);
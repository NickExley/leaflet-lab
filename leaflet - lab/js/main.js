/* Map of GeoJSON data from MegaCities.geojson */

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/ElectionTurnout.geojson", {
        dataType: "json",
        success: function(response){  
			//create a Leaflet GeoJSON layer and add it to the map
            geoJsonLayer = L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, {
						radius: 5,
						fillOpacity: 0.85
						});
					},
				style: function(feature) {
					return {
						color: "green"
						};
					},
				onEachFeature: onEachFeature
				}
			).addTo(map)
		}
      }
	)
};


//function to create the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [40, -95],
        zoom: 3
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};



$(document).ready(createMap);
var layerGroup;
var currLayer;
var layerID = [];

function createSequenceControls(map,attributes){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
	
	//set slider attributes
	$('.range-slider').attr({
		max: 9,
		min: 0,
		value: 0,
		step: 1
	})
	
	//add skip buttons
    $('#panel').append('<button class="skip" id="reverse">Previous Election</button>');
    $('#panel').append('<button class="skip" id="forward">Next Election</button>');

	 
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 9 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 9 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
		
		//Step 9: pass new attribute to update symbols
        //updatePropSymbols(map, attributes[index]);
		
		// display certain layer
		
		map.eachLayer(function (layer) {
			map.removeLayer(layer);
		});
		map.addLayer(layerGroup.getLayer(index));
    });
	
	$('.range-slider').on('input', function(){
		var index = $(this).val();
		
		map.removeLayer(currLayer);
		currLayer = layerGroup.getLayer(layerID[index]).addTo(map);
    });
};

//create function to update the proportional symbols to link to each slider bar click
function updatePropSymbols(map, attribute){
	map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            
			//access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>State:</b> " + props.State + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[0];
            popupContent += "<p><b>Voter turnout in " + year + ":</b> " + props[attribute] + " percent</p>";
			popupContent += "<p><b>Winning House party in " + year + ":</b> " + props.House + " party</p>";
			popupContent += "<p><b>Winning Presidential party in " + year + ":</b> " + props.Presidential + " party</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
			
            });
        };
	});
};

//create function to make the proportional symbols of a certain color, fill, opacity, etc
function pointToLayer(feature, latlng, attributes, attribute){
	//var attribute = attributes[0];
		
	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: "#1e90ff",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};
	
	var attValue = Number(feature.properties[attribute]);
	geojsonMarkerOptions.radius = calcPropRadius(attValue);
	
	var layer = L.circleMarker(latlng, geojsonMarkerOptions);
	//console.log(attValue);
	
	//build popup content string starting with city...Example 2.1 line 24
	var popupContent = "<p><b>State:</b> " + feature.properties.State + "</p>";

	//add formatted attribute to popup content string
	var year = attribute.split("_")[0];
	
	popupContent += "<p><b>Voter turnout in " + year + ":</b> " + feature.properties[attribute] + " percent</p>";
	
	popupContent += "<p><b>Winning House party in " + year + ":</b> " + feature.properties.House0 + " party</p>";
	
	popupContent += "<p><b>Winning Presidential party in " + year + ":</b> " + feature.properties.Presidential0 + " party</p>";

	//bind the popup to the circle marker
    layer.bindPopup(popupContent, {
		offset: new L.point(0, -geojsonMarkerOptions.radius)
	});
	return layer
};


function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("2") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};
	
function createPropSymbols(data, map, attributes){
	//adjusts the symbols for each data point to reflect its value using the calcPropRadius function results and filters the map to only show symbols on Republican states
	layerGroup = L.layerGroup();
	currLayer = L.geoJson(data, {
		pointToLayer: function(feature,latlng){
			return pointToLayer(feature,latlng,attributes,attributes[0]);
		},
/* 		filter: function(feature) {
			return feature.properties.House == "Democrat";
		} */
	});
	currLayer.addTo(map);

	// create layer group
	for (id in attributes) {
		var l = L.geoJson(data, {
			pointToLayer: function(feature,latlng){
				return pointToLayer(feature,latlng,attributes,attributes[id]);
			},
/* 			filter: function(feature) {
				var s = "House" + id.toString();
				return feature.properties.s == "Democrat";
			} */
		});

		layerGroup.addLayer(l);
		layerID.push(layerGroup.getLayerId(l));
	};
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/ElectionTurnoutParty.geojson", {
        dataType: "json",
        success: function(response){  
			//create an attributes array
            var attributes = processData(response);
			createPropSymbols(response, map, attributes);
			createSequenceControls(map,attributes);
		}
    });
};


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 15;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//function to create the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [40, -95],
        zoom: 4
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//creates the entire map once the page is loaded
$(document).ready(createMap);
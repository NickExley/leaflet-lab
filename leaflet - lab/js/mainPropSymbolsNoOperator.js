function createSequenceControls(map,attributes){
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
        },
		
		onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
			
			//create range input element (slider)
			$(container).append('<input class="range-slider" type="range">');
			

			
			//add skip buttons
			$(container).append('<button class="skip" id="reverse">Previous Election</button>');
			$(container).append('<button class="skip" id="forward">Next Election</button>');


			L.DomEvent.disableClickPropagation(container);
			
			return container;
		},
    });
	map.addControl(new SequenceControl());
	
	//set slider attributes
	$('.range-slider').attr({
		max: 9,
		min: 0,
		value: 0,
		step: 1
	})
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
		
		$('.range-slider').val(index);
		
		updatePropSymbols(map, attributes[index]);
		updateLegend(map, attributes[index]);
		
	});

	//Step 8: update slider
    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
		//Step 9: pass new attribute to update symbols
		updatePropSymbols(map, attributes[index]);
		updateLegend(map, attributes[index]);

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
            var year = attribute.split('_')[0];
            popupContent += "<p><b>Voter turnout in " + year + ":</b> " + props[attribute] + " percent</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
	});
};


//create function to make the proportional symbols of a certain color, fill, opacity, etc
function pointToLayer(feature, latlng, attributes){
	
	var attribute = attributes[0];
		
	var geojsonMarkerOptions = {
		radius: 5,
		fillColor: "#1e90ff",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};
	
	var attValue = Number(feature.properties[attribute]);
	geojsonMarkerOptions.radius = calcPropRadius(attValue);
	
	var layer = L.circleMarker(latlng, geojsonMarkerOptions);
	
	//build popup content string starting with city...Example 2.1 line 24
	var popupContent = "<p><b>State:</b> " + feature.properties.State + "</p>";

	//add formatted attribute to popup content string
	var year = attribute.split('_')[0];
	
	popupContent += "<p><b>Voter turnout in " + year + ":</b> " + feature.properties[attribute] + " percent</p>";
		
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

var featLayer;


function createPropSymbols(data, map, attributes){
	//adjusts the symbols for each data point to reflect its value using the calcPropRadius function results and filters the map to only show symbols on Republican states
	featLayer = L.geoJson(data, {
		pointToLayer: function(feature,latlng){
			return pointToLayer(feature,latlng,attributes);
		},
	}).addTo(map);
	console.log(featLayer);
};

function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
		
        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="500px" height="500px">';

			//array of circle names to base loop on
			var circles = {
				max: 20,
				mean: 40,
				min: 60
			};

			//Step 2: loop to add each circle and text to svg string
			for (var circle in circles){
				//circle string
				svg += '<circle class="legend-circle" id="' + circle + '" fill="#1e90ff" fill-opacity="0.8" stroke="#000000" cx="20"/>';

				//text string
				svg += '<text id="' + circle + '-text" x="50" y="' + circles[circle] + '"></text>';
			};

			//close svg string
			svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);
			
			
            return container;
        }
    });

    map.addControl(new LegendControl());
		
	updateLegend(map, attributes[0]);

};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

function updateLegend(map, attributes){
   //create content for legend
    var year = attributes.split("_")[0];
    var content = "Voter Turnout in " + year;

    //replace legend content
    $('#temporal-legend').html(content);
	
	//get the max, mean, and min values as an object
	var circleValues = getCircleValues(map, attributes);

    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 59 - radius,
            r: radius
        });
		//Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " percent");
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/ElectionTurnout.geojson", {
        dataType: "json",
        success: function(response){  
			//create an attributes array
            var attributes = processData(response);
			createPropSymbols(response,map,attributes);
			createSequenceControls(map,attributes);
			createLegend(map,attributes);
			getCircleValues(map,attributes);
			layerControl(map);
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

var  basemap;
var satellite;
//function to create the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [40, -95], 
        zoom: 4
    });

    //add OSM base tilelayer
   basemap =  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(map);
    

	satellite =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}).addTo(map);
	
   
   //call getData function
    getData(map);

};

function layerControl(map) {
	var baseMaps = {
		"Basemap": basemap,
		"Satellite": satellite
	};
	
	var overlayMap = {
		"Features": featLayer
	};
	L.control.layers(baseMaps, overlayMap).addTo(map);
};

//creates the entire map once the page is loaded
$(document).ready(createMap);
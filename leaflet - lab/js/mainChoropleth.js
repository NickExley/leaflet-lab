function createSequenceControls(map,attributes){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
	
	//set slider attributes
	$('.range-slider').attr({
		max: 8,
		min: 0,
		value: 0,
		step: 1
	})
	
	//add skip buttons
    $('#panel').append('<button class="skip" id="reverse">Previous</button>');
    $('#panel').append('<button class="skip" id="forward">Next</button>');

    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 8 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 8 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
		
		//Step 9: pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
};

function getColor(attribute) {
    return attribute > 80 ? '#800026' :
           attribute > 70 ? '#BD0026' :
           attribute > 60 ? '#E31A1C' :
           attribute > 50 ? '#FC4E2A' :
           attribute > 40 ? '#FD8D3C' :
           attribute > 30 ? '#FEB24C' :
							'#FED976';
};

/* function style(feature){
    return {
        fillColor: getColor(feature.properties.attribute),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}; */

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

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/ElectionTurnout.geojson", {
        dataType: "json",
        success: function(response){  
			//create an attributes array
            var attributes = processData(response);
			getColor(attributes);
			createSequenceControls(map,attributes);
		}
    });
};

function createMap(){
	var mapboxAccessToken = {pk.eyJ1Ijoibmlja2V4bGV5IiwiYSI6ImNqc3Z5bzc3YTBjN3c0OXByYzI3ZHdnMHcifQ.E0Xpee7Lx94mmallxWDZAQ};
	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
		id: 'mapbox.light',
		attribution: ...
	}).addTo(map);

	L.geoJson(statesData).addTo(map);
};


//creates the entire map once the page is loaded
$(document).ready(createMap);
//creates a geojsonFeature variable and assigns properties & geometry to it 
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//adds the geoJSON feature to the map 
L.geoJSON(geojsonFeature).addTo(map);

//creates the myLines variable and assigns points to it to give it geometry 
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

//creates the myLayer variable to hold the function for adding the geoJSON file to the map 
var myLayer = L.geoJSON().addTo(map);

//uses the addData function along with the myLayer variable to add the geoJSON data to the map 
myLayer.addData(geojsonFeature);

//creates a myStyle variable to hold the stylistic details to go with the created line 
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//assigns the style details to the created line and adds it to the map 
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

//creates states polygons at the coordinates listed and assigns properties to each 
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

//adds the states to the map but switches the color values of each 
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

//creates the geojsonMarkerOptions variable to hold the properties and details of the point markers on the map 
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//adds the geojsonMarkerOptions to the map 
L.geoJSON(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

//creates a function to add any feature properties that exist as popups on the map 
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

//creates a geojsonFeature with certain coordinates and specific attributes/properties 
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//adds the geojsonFeature and its to each feature on the map 
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

//creates some more features with coordinate locations and attributes
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

//adds whatever features in someFeatures that are within the map area to the map  
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

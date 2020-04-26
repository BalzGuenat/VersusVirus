window.latCenter = 48.2106549;
window.longCenter = 16.3703555;
window.nrRectsPerRow = 20;
window.nrRectRows = 20;
window.rectOpacity = 0.3;
var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11', 
	<!-- id: 'mapbox/satellite-v9', -->
	tileSize: 512,
	zoomOffset: -1
}); 

var mymap = L.map('mapid', {
	center: [48.2106549,16.3703555],
	zoom: 14,
	layers: baseLayer
});


var marker = L.marker([48.2063848,16.3591713]).addTo(mymap);
marker.bindPopup("Your home");

var rectangles = [];

var rectCoordDiff = 0.002;
var firstRectLat1 = latCenter + 0.0155;
var firstRectLong1 = longCenter - 0.018;
var firstRectLat2 = firstRectLat1 + 0.002;
var firstRectLong2 = firstRectLong1 + 0.002;
var currRectLat = firstRectLat1;
var currRectLong = firstRectLong1;
for(var i = 0; i < window.nrRectRows; i++) {
	for(var j = 0; j < window.nrRectsPerRow; j++) {
			bounds = [[currRectLat,currRectLong], [currRectLat+rectCoordDiff,currRectLong+rectCoordDiff]];
			currRectLong += 0.002;
			rect = L.rectangle(bounds, {color: "#ff7300", weight: 1});
			rect.setStyle({color: '#ff7300', fillColor: '#ff7300', opacity: window.rectOpacity-0.2, fillOpacity: window.rectOpacity});
			rectangles.push(rect);
	}
	currRectLat -= 0.002;
	currRectLong = firstRectLong1;
}

var rectLayerGroup = L.layerGroup(rectangles);
var baseMaps = {
	"baseLayer" : baseLayer
}
var rectLayer = {
	"rectLayer" : rectLayerGroup
};

//L.control.layers(baseMaps, rectLayer).addTo(mymap);
layerControl = L.control.layers().addTo(mymap);
//layerControl.addOverlay(rectLayerGroup).addTo(mymap);

 setInterval( function addRects(){
	mymap.removeLayer(rectLayerGroup);
	for(var i = 0; i < rectangles.length; i++){
		var col = Math.floor(Math.random() * 100);
		// var createAreaProb = Math.floor(Math.random() * rectangles.length);
		// var createArea = false;
		// if (createAreaProb < rectangles.length * 10/100){
				// createArea = true;
		// }
		color = "";
		if (col < 20){
		  color = "#ff0000";
		  console.log("col1");
		} else if (col < 70) {
		  color = "#007300";
		  console.log("col3");
		} else if (col < 100) {
		  color = "#ff7300";
		  console.log("col2");
		}
		rectangles[i].setStyle({color: color, fillColor: color});
	}
	
	mymap.addLayer(rectLayerGroup);


	mymap.addLayer(rectLayerGroup);
	} , 100);



var app = new Vue({ 
    el: '#app',
    data: {
        message: 'Hello Vue!',
        loc: 'bar',
        loc_data: null
    },
    methods: {
      fetchData: function() {
        console.log(this.loc);
        axios
          .get('http://pi.balzguenat.ch:2020/api/cached/AnRYn1F8NfSGLexf7')
          .then(rsp => (this.loc_data = rsp))
      }
    }
});

var mymap = L.map('mapid').setView([47.3753731,8.5357199], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11', 
	<!-- id: 'mapbox/satellite-v9', -->
	tileSize: 512,
	zoomOffset: -1
}).addTo(mymap); 


var circle = L.circle([47.3753682,8.5392164], {
<!-- var circle = L.circle([47.3768401,8.5406645], { -->
color: 'red',
fillColor: '#f03',
fillOpacity: 0.5,
radius: 20
}).addTo(mymap);

circle.bindPopup("230 people");
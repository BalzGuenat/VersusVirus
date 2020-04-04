var app = new Vue({ 
    el: '#app',
    data: {
        message: 'Hello! Where do you want to go?',
        loc: 'Search',
        loc_data: null,
        rec_time: null,
        best_time: null
    },
    methods: {
      fetchData: function() {
        console.log(this.loc);
        axios
          .get('http://pi.balzguenat.ch:2020/api/cached/AnRYn1F8NfSGLexf7')
          .then(rsp => (this.loc_data = rsp))
        axios
          .get('http://pi.balzguenat.ch:2020/api/recommend/AnRYn1F8NfSGLexf7')
          .then(rsp => {
            this.rec_time = rsp.data.rec_time[3];
            this.best_time = rsp.data.best_time[3];
          });
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


var circle = L.circle([47.3764528,8.542366699999999], {
<!-- var circle = L.circle([47.3768401,8.5406645], { -->
color: 'red',
fillColor: '#f03',
fillOpacity: 0.5,
radius: 20
}).addTo(mymap);

circle.bindPopup("Too many people at Coop Zurich Bahnhofsbruecke!");

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
          .get('http://pi.balzguenat.ch:2020/api/cached/ChIJBUuIDAgKkEcR6dqDd_VHtbA')
          .then(rsp => {this.loc_data = rsp;
		  this.drawCircles();})
        axios
          .get('http://pi.balzguenat.ch:2020/api/recommend/ChIJBUuIDAgKkEcR6dqDd_VHtbA')
          .then(rsp => {
            this.rec_time = rsp.data.rec_time[3];
            this.best_time = rsp.data.best_time[3];
          });    
      },
	  drawCircles: function() {
			var tod = new Date();
			var tod_h = tod.getHours();
			var tod_wd = tod.getDay();
			
			//console.log(this.loc_data.data["Friday"][tod_h].popularity_normal);

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

			tet = [[47.3847681,8.527167, 6, "Coop Josefstraße"], [47.3764528,8.542366699999999, 55, "Coop Bahnhofsbruecke"], 
			[47.3713627,8.5250062, 80, "Coop Wiedlikon"], [47.3825639,8.5480396, 8, "Coop Universitaetsstrasse"], [47.37787890000001,8.538247700000001, 88, "Coop Shopville"]]
			
			for(var i = 0; i < tet.length; i++) {
				var coordA = tet[i];
				var color;
				var fillColor;
				if (coordA[2] <= 33) {
					color = 'green';
					fillColor = '#00cc00';
					popText = "Not many people at " + coordA[3] + "! " + coordA[2] + "% utilization!" 
				} else if (coordA[2] <= 66) {
					color = 'orange';
					fillColor = '#ff9f33';
					popText = "Soon too many people at " + coordA[3] + "! " + coordA[2] + "% utilization!" 
				} else {
					color = 'red';
					fillColor = '#ff3f33';
					popText = "Too many people at " + coordA[3] + "! " + coordA[2] + "% utilization!" 
				}
				var c = L.circle([coordA[0],coordA[1]], {
				color: color,
				fillColor: fillColor,
				fillOpacity: 0.5,
				radius: 50
				}).addTo(mymap);
				c.bindPopup(popText);
			}

	  }
    }
});



var mymap = L.map('mapid').setView([47.3753731,8.5357199], 15);



var app = new Vue({ 
    el: '#app',
    data: {
        message: 'Hello! Where do you want to go?',
        loc: 'Search',
        loc_data: null,
        rec_time: null,
        best_time: null,
		loc_arr: null,
		now_time: null,
		now_day: null
    },
    methods: {
      fetchData: function() {
        console.log(this.loc);
		axios
          .get('http://pi.balzguenat.ch:2020/api/place')
          .then(rsp => {this.loc_arr = rsp;
		  this.reqAll();})
        axios
          .get('http://pi.balzguenat.ch:2020/api/recommend/ChIJTwg-2gUKkEcRGt4wjZvo6lg') //coop bahnhof zurich shopville
          .then(rsp => {
            this.rec_time = rsp.data.rec_time[3];
			this.rec_time = "08"
            this.best_time = rsp.data.best_time[3];
          });  
      },
	  reqAll: function() {
		  console.log(this.loc_arr);
			for(var i = 0; i < this.loc_arr.data.length; i++) {
				axios
				  .get('http://pi.balzguenat.ch:2020/api/cached/'+this.loc_arr.data[i])
				  .then(rsp => {
					 this.loc_data = rsp;
					 this.drawCircle();})
			}
	  },
	  drawCircle: function() {
			var tod = new Date();
			var tod_h = tod.getHours();
			var tod_wd = tod.getDay(); //0 sunday, 1 mon
			var wd_txt = "Monday"; //default
			
			tod_wd = 1; //lets go to monday
			
			var sT = document.getElementById("searchTime").value;
			
			tod_h = parseInt(sT.split(":")[0]);

			if (tod_wd == 0) {
				wd_txt = "Sunday";
			} else if (tod_wd == 1) {
				wd_txt = "Monday";
			} else if (tod_wd == 2) {
				wd_txt = "Tuesday";
			} else if (tod_wd == 3) {
				wd_txt = "Wednesday";
			}else if (tod_wd == 4) {
				wd_txt = "Thursday";
			}else if (tod_wd == 5) {
				wd_txt = "Friday";
			}else if (tod_wd == 6) {
				wd_txt = "Saturday";
			}
			
			this.now_day = wd_txt;
			this.now_time = tod_h + ":" + sT.split(":")[1]
			
			//console.log(this.loc_data.data["Friday"][tod_h].popularity_normal);
			if (this.loc_data.data[wd_txt] != null) {
				//search the hour
				var ourHour = null;
				for(var i = 0; i < this.loc_data.data[wd_txt].length; i++) {
					if (this.loc_data.data[wd_txt][i].hour_of_day == tod_h){
							ourHour = i;
					}
				}

				var lat = this.loc_data.data[wd_txt][ourHour].lat;
				var lng = this.loc_data.data[wd_txt][ourHour].lng;
				var pop = this.loc_data.data[wd_txt][ourHour].popularity_normal;
				var locName = ""; 
				var color;
				var fillColor;
				if (pop <= 33) {
					color = 'green';
					fillColor = '#00cc00';
					popText = "Not many people at " + locName + "! " + pop + "% utilization!" 
				} else if (pop <= 66) {
					color = 'orange';
					fillColor = '#ff9f33';
					popText = "Soon too many people at " + locName + "! " + pop + "% utilization!" 
				} else {
					color = 'red';
					fillColor = '#ff3f33';
					popText = "Too many people at " + locName + "! " + pop + "% utilization!" 
				}
				var c = L.circle([lat,lng], {
				color: color,
				fillColor: fillColor,
				fillOpacity: 0.5,
				radius: 50
				}).addTo(mymap);
				c.bindPopup(popText);
				}else{
					console.log("no data");
				}
			
			


	  },
	  drawCirclesStatic: function() {
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

var marker = L.marker([47.3753977,8.5363126]).addTo(mymap);
marker.bindPopup("Your home");

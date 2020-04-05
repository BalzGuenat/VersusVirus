<template>
  <div>
    <base-header type="gradient-dark" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <!--
      <div class="row">
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Total traffic"
            type="gradient-red"
            sub-title="350,897"
            icon="ni ni-active-40"
            class="mb-4 mb-xl-0"
          >
            <template slot="footer">
              <span class="text-success mr-2">
                <i class="fa fa-arrow-up"></i> 3.48%
              </span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Total traffic"
            type="gradient-orange"
            sub-title="2,356"
            icon="ni ni-chart-pie-35"
            class="mb-4 mb-xl-0"
          >
            <template slot="footer">
              <span class="text-success mr-2">
                <i class="fa fa-arrow-up"></i> 12.18%
              </span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Sales"
            type="gradient-green"
            sub-title="924"
            icon="ni ni-money-coins"
            class="mb-4 mb-xl-0"
          >
            <template slot="footer">
              <span class="text-danger mr-2">
                <i class="fa fa-arrow-down"></i> 5.72%
              </span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Performance"
            type="gradient-info"
            sub-title="49,65%"
            icon="ni ni-chart-bar-32"
            class="mb-4 mb-xl-0"
          >
            <template slot="footer">
              <span class="text-success mr-2">
                <i class="fa fa-arrow-up"></i> 54.8%
              </span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
      </div>
      -->
      <base-input
        label="Where do you want to go?"
        labelClasses="text-white"
        v-on:input="listenToInput"
    ></base-input>
    </base-header>

    
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow border-0">
            <div
              id="map-canvas"
              class="map-canvas"
              data-lat="40.748817"
              data-lng="-73.985428"
              style="height: 600px;"
            ></div>
            <div id="mapp"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var mymap;
export default {
  mounted() {
    /*
      var mymap = L.map('map-canvas').setView([47.37887, 8.54], 13);

        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                attribution: 'Attribution',
                maxZoom: 17,
                minZoom: 9
            }
        ).addTo(mymap);

        mymap.setZoom(18);
        var locations = [
            [47.36667, 8.55, 1],
            [47.377560, 8.5393, 0.7],
            [47.377836, 8.5402, 0.5],
            [47.378389, 8.539804, 1],
            [47.378258, 8.540040, 1],
            [47.376699200000004, 8.5328768, 0.2]
        ];

        var heat = L.heatLayer(locations, { radius: 15 });
        heat.addTo(mymap);
        */
    
    mymap = L.map('map-canvas').setView([47.3753731,8.5357199], 15);
    var tod = new Date();
    var tod_h = tod.getHours();
    var tod_wd = tod.getDay();

    //console.log(this.loc_data.data["Friday"][tod_h].popularity_normal);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      {
        maxZoom: 18,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1
      }
    ).addTo(mymap);

    
  },
  methods: {
      drawCircles() {
        var tet = [
        [47.3847681, 8.527167, 6, "Coop Josefstraße"],
        [47.3764528, 8.542366699999999, 55, "Coop Bahnhofsbruecke"],
        [47.3713627, 8.5250062, 80, "Coop Wiedlikon"],
        [47.3825639, 8.5480396, 8, "Coop Universitaetsstrasse"],
        [47.37787890000001, 8.538247700000001, 88, "Coop Shopville"]
        ];

        for (var i = 0; i < tet.length; i++) {
        var coordA = tet[i];
        var color;
        var fillColor;
        var popText;
        if (coordA[2] <= 33) {
            color = "green";
            fillColor = "#00cc00";
            popText =
            "Not many people at " +
            coordA[3] +
            "! " +
            coordA[2] +
            "% utilization!";
        } else if (coordA[2] <= 66) {
            color = "orange";
            fillColor = "#ff9f33";
            popText =
            "Soon too many people at " +
            coordA[3] +
            "! " +
            coordA[2] +
            "% utilization!";
        } else {
            color = "red";
            fillColor = "#ff3f33";
            popText =
            "Too many people at " +
            coordA[3] +
            "! " +
            coordA[2] +
            "% utilization!";
        }
        var c = L.circle([coordA[0], coordA[1]], {
            color: color,
            fillColor: fillColor,
            fillOpacity: 0.5,
            radius: 50
        }).addTo(mymap);
        c.bindPopup(popText);
       }
      },
      listenToInput(val) {
        if (val == 'Zurich Coop') {
            this.drawCircles();
        };
      }
  }
};
</script>
<style>
</style>

function createChart(pop) {
  var elem = document.createElement('div');
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var dataArr = [['Hour', 'Popularity']]
    for (var i = 0; i < pop.length; i++) {
      dataArr.push([i, pop[i]]);
    }
    var data = google.visualization.arrayToDataTable(dataArr);

    var options = {
      title: 'Lengths of dinosaurs, in meters',
      legend: { position: 'none' },
    };

    // var chart = new google.visualization.Histogram(elem);
    var chart = new google.visualization.Histogram(document.getElementById('histo'));
    chart.draw(data, options);
  }
  return elem;
}

function createGridClickHandler(rect, i) {
  return (event) => {
    // pop = []
    // for (var h = 0; h < cells.length; h++) {
    //   var c = cells[h].grid[i];
    //   pop.push(c.pop);
    // }
    // var chart = createChart(pop);
    var templ = document.getElementById("histo_templ");
    var histo = templ.content.querySelector(".histo");
    var chart = document.importNode(histo, true)
    var info = new google.maps.InfoWindow({
      position: rect.cell,
      content: chart
    });
    info.open(rect.map);
  }
}

var map;
function initMap() {
  const hour = 10;
  var center = cells[hour].grid[Math.floor(cells[hour].grid.length/2)]
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15,
    controlSize: 20
  });

  var rectangles = []

  const setGridHour = function(h) {
    for (var i = 0; i < rectangles.length; i++) {
      var r = rectangles[i];
      c = cells[h].grid[i];
      var color;
      if (c.pop == 0) {
        color = 'red';
      } else if (c.pop == 0.5) {
        color = 'orange';
      } else {
        color = 'green';
      }
      // var opts = r.getOptions();
      // opts.fillColor = color;
      r.setOptions({
        fillColor: color
      });
    }
    window.setTimeout(() => setGridHour((h + 1)%cells.length), 1000);
  };

  for (var i = 0; i < cells[hour].grid.length-1; i++) {
    var c = cells[hour].grid[i];
    var color;
    if (c.pop == 0) {
      color = 'red';
    } else if (c.pop == 0.5) {
      color = 'orange';
    } else {
      color = 'green';
    }
    var rectangle = new google.maps.Rectangle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: color,
      fillOpacity: 0.3,
      map: map,
      cell: c,
      bounds: {
        north: c.lat + 0.0008,
        south: c.lat,
        east: c.lng + 0.0011,
        west: c.lng
      }
    });

    google.maps.event.addListener(rectangle, 'click', createGridClickHandler(rectangle, i));

    rectangles.push(rectangle);
  }

  window.setTimeout(() => setGridHour((hour + 1)%cells.length), 1000);

  // var flightPath = new google.maps.Polyline({
  //   path: path,
  //   geodesic: true,
  //   strokeColor: 'blue',
  //   strokeOpacity: 1.0,
  //   strokeWeight: 4
  // });

  // flightPath.setMap(map);

}


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
      bounds: {
        north: c.lat + 0.0008,
        south: c.lat,
        east: c.lng + 0.0011,
        west: c.lng
      }
    });
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

  flightPath.setMap(map);

}

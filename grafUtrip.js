function InitChart(rowData) {

  var lineData = [{
    'x': 1,
    'y': 20
  }, {
    'x': 2,
    'y': 20
  }, {
    'x': 3,
    'y': 10
  }, {
    'x': 6,
    'y': 40
  }, {
    'x': 7,
    'y': 5
  }, {
    'x': 4,
    'y': 60
  }];
  lineData = [];
  for(var i=0; i<rowData.length; i++){
    lineData.push({'x':i, 'y':rowData[i].Rate_magnitude});
  }
  var vis = d3.select("#visualisation"),
    WIDTH = 400,
    HEIGHT = 200,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
        return d.x;
      }),
      d3.max(lineData, function (d) {
        return d.x;
      })
    ]),

    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([45,
      d3.max(lineData, function (d) {
        return d.y;
      })
    ]),

    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),

    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);

  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  var lineFunc = d3.svg.line()
  .x(function (d) {
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  })
  .interpolate('basis');

vis.append("svg:path")
  .attr("d", lineFunc(lineData))
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none");

}
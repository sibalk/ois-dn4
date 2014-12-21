//var lineDataITM
//var lineFunctionITM
var itm
function grafITM(itm) {
/*
  lineDataITM = [];
  for(var i=0; i<rowData.length; i++){
    lineDataITM.push({'x':i, 'y':rowData[i].weight});
  }*/
  if(itm >= 40)
    itm = 40;
  var vis = d3.select("#narisiGrafITM"),
    WIDTH = $("#graf-ITM").width()-40,
    HEIGHT = 200,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 1]),

    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 40]),


    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  lineFunctionITM = d3.svg.line()
  .x(function (d) {
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  })
  .interpolate('cardinal');

    
  vis.append("rect")
    .attr("width", WIDTH)
    .attr("height", yRange(25)-yRange(40))
    .attr("y", yRange(40))
    .attr("x", xRange(0))
    .attr("fill", "#f8695e")
  vis.append("rect")
    .attr("width", WIDTH)
    .attr("height", yRange(18.5)-yRange(25))
    .attr("y", yRange(25))
    .attr("x", xRange(0))
    .attr("fill", "#A9DA48")
  vis.append("rect")
    .attr("width", WIDTH)
    .attr("height", yRange(0)-yRange(18.5))
    .attr("y", yRange(18.5))
    .attr("x", xRange(0))
    .attr("fill", "#3EACFF")
  vis.append("rect")
    .attr("width", WIDTH)
    .attr("height", 2)
    .attr("y", yRange(0))
    .attr("x", xRange(0))
    .attr("fill","black")
    .transition()
    .duration(2000)
    .attr("y", yRange(itm))
  var text = vis.append("text")
    .attr("opacity", 0)
  vis.append("rect")
    .attr("width", 2*WIDTH)
    .attr("height", HEIGHT)
    .attr("x", 0)
    .attr("y", 0)
    .attr("opacity", 0)
    .on("mouseenter", function(){
      var offset = 0;
      if(itm>25)offset = 25;
      text.text(itm)
      .attr("font-family", "'Oswald', sans-serif")
      .attr("font-weight", 700)
      .attr("font-size", 20)
      .attr("x", xRange(0)+20)
      .attr("y", yRange(itm)-2+offset)
      .transition()
      .duration(250)
      .attr("opacity", 1)
    })
    .on("mouseleave", function(){
      text.text(itm)
      .attr("x", 0)
      .attr("y", 0)
      .transition()
      .duration(250)
      .attr("opacity", 0)
    })
}

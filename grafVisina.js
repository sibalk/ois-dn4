var lineDataVisina
var lineFunctionVisina
function grafVisina(rowData) {

  lineDataVisina = [];
  for(var i=0; i<rowData.length; i++){
    lineDataVisina.push({'x':i, 'y':rowData[i].height});
  }
  var vis = d3.select("#narisiGrafVisina"),
    WIDTH = $("#graf-visina").width()-40,
    HEIGHT = 200,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineDataVisina, function (d) {
        return d.x;
      }),
      d3.max(lineDataVisina, function (d) {
        return d.x;
      })
    ]),

    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 220]),


    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  lineFunctionVisina = d3.svg.line()
  .x(function (d) {
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  })
  .interpolate('cardinal');

vis.append("svg:path")
  .attr("stroke", "#FD9720")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .transition()
  .duration(1000)
  .attrTween("d", getInterpolationVisina);

  for(var i=0; i<lineDataVisina.length; i++){
    vis.append("rect")
      .attr("width", 1)
      .attr("height", HEIGHT-20)
      .attr("y", 0)
      .attr("x", xRange(lineDataVisina[i].x))
      .attr("fill","grey")
      .attr("opacity", 0.5)
    vis.append("circle")
      .attr("cx",xRange(lineDataVisina[i].x))
      .attr("cy",yRange(lineDataVisina[i].y))
      .attr("r",0)
      .attr("value", lineDataVisina[i].y)
      .attr("opacity", 1)
      .attr("fill", "#9dcfa1")
      .attr("stroke", "#FD9720")
      .attr("stroke-width", 2)
      .on("mouseenter", function(){
        d3.select(this)
          .attr("r", 7)

        var x = Number(d3.select(this).attr("cx"))
        var y = Number(d3.select(this).attr("cy"))
        if(x<WIDTH/2){
          x+=20  
        }
        else 
          x-=20
        tekst.text(Number(d3.select(this).attr("value")))
          .attr("font-family", "'Oswald', sans-serif")
          .attr("font-weight", 700)
          .style("text-anchor", "middle")
          .attr("x",x)
          .attr("y",y-15)
          .attr("opacity",1)
      })
      .on("mouseleave", function(){
        d3.select(this)
          .attr("r", 5)
          tekst.attr("opacity",0)
      })
      .transition()
      .delay(100*i)
      .duration(1000).attr("r", 5)
  }
  var tekst = vis.append("text")
  vis.append("rect")
    .attr("width",WIDTH-50)
    .attr("height", 1)
    .attr("x", 50)
    .attr("y",HEIGHT-20)

}
function getInterpolationVisina() {

  var interpolateVisina = d3.scale.quantile()
  .domain([0,1])
  .range(d3.range(1, lineDataVisina.length + 1));

  return function(t) {
    var interpolatedLine = lineDataVisina.slice(0, interpolateVisina(t));
    return lineFunctionVisina(interpolatedLine);
  }
}